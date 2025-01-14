import { ShipmentPackageType, ShipmentType } from '@/types';
import { openDatabase } from '../database';
import { getPackages } from '../packages/database';
import dayjs from 'dayjs';
import { getOrder } from '../orders/database';
import { v4 as uuidv4 } from 'uuid';
import { getItems } from '../items/database';

export const getShipments = async (orderId: string) => {
	const db = await openDatabase();
	const shipments: ShipmentType[] = await db.getAllAsync(
		'SELECT * FROM shipments WHERE orderId = ?;',
		[orderId]
	);

	const shipmentPackages: ShipmentPackageType[] = await db.getAllAsync(
		'SELECT * FROM shipmentPackages WHERE orderId = ?',
		[orderId]
	);

	const packages = await getPackages(orderId);

	const payload: ShipmentType[] = shipments.map((shipment) => {
		return {
			...shipment,
			packages: shipmentPackages
				.map((shipmentPackage) => {
					if (shipmentPackage.shipmentId === shipment.shipmentId) {
						const _package = packages.find(
							(_package) => _package.packageId === shipmentPackage.packageId
						);

						return {
							shipmentPackageId: shipmentPackage.shipmentPackageId,
							..._package,
						};
					}
				})
				.filter((item) => item !== undefined),
		};
	});

	return payload;
};

export const createShipment = async (orderId: string) => {
	const uniqueId = uuidv4();

	const db = await openDatabase();
	await db.runAsync(
		'INSERT INTO shipments (shipmentId, orderId, status) VALUES (?, ?, "Pending");',
		[uniqueId, orderId]
	);

	console.log('Shipment created');
	return;
};

export const addPackagesToShipment = async (
	shipmentId: string,
	orderId: string,
	data: { packageIds: string[] }
) => {
	const { packageIds } = data;

	const db = await openDatabase();

	for (const packageId of packageIds) {
		const uniqueId = uuidv4();

		const result = await db.runAsync(
			'INSERT INTO shipmentPackages (shipmentPackageId, shipmentId, orderId, packageId) VALUES (?, ?, ?, ?);',
			[uniqueId, shipmentId, orderId, packageId]
		);
	}

	console.log('Packages added to shipment');
	return;
};

export const deleteShipment = async (shipmentId: string) => {
	const db = await openDatabase();
	await db.runAsync('DELETE FROM shipments WHERE shipmentId = ?;', [
		shipmentId,
	]);

	await db.runAsync('DELETE FROM shipmentPackages WHERE shipmentId = ?', [
		shipmentId,
	]);

	console.log('Shipment deleted');
};

export const shipShipment = async (data: { shipment: ShipmentType }) => {
	const { shipment } = data;
	const date = dayjs().unix() * 1000;

	const db = await openDatabase();

	const items = await getItems(shipment.orderId);
	const shipments = await getShipments(shipment.orderId);

	await db.runAsync(
		'UPDATE shipments SET status = "Shipped", shippedAt = ? WHERE shipmentId = ?;',
		[date, shipment.shipmentId]
	);

	for (const _package of shipment.packages) {
		await db.runAsync(
			'UPDATE packages SET status = "Shipped" WHERE packageId = ?;',
			[_package.packageId]
		);

		for (const item of _package.items) {
			const lineItem = items.find(
				(lineItem) => lineItem.itemId === item.itemId
			);

			const itemQuantityInShipment = shipment.packages.reduce(
				(acc, _package) =>
					_package.items.find(
						(packageItem) => packageItem.itemId === item.itemId
					).quantity + acc,
				0
			);

			const itemQuantityAlreadyShipped = shipments
				.filter((shipment) => shipment.status === 'Shipped')
				.reduce(
					(acc, shipment) =>
						acc +
						shipment.packages.reduce(
							(acc, _package) =>
								acc +
								_package.items.reduce((acc, item) => acc + item.quantity, 0),
							0
						),
					0
				);

			const totalItemsShipped =
				itemQuantityAlreadyShipped + itemQuantityInShipment;

			if (lineItem.quantity === totalItemsShipped) {
				await db.runAsync(
					'UPDATE items SET status = "Shipped" WHERE itemId = ?;',
					[item.itemId]
				);
			}
		}
	}

	const order = await getOrder(shipment.orderId);

	if (order.items.every((item) => item.status === 'Shipped')) {
		await db.runAsync(
			'UPDATE orders SET status = "Shipped" WHERE orderId = ?',
			[shipment.orderId]
		);
	}

	console.log('Shipment shipped');
};

export const removePackageFromShipment = async (packageId: string) => {
	const db = await openDatabase();
	await db.runAsync('DELETE FROM shipmentPackages WHERE packageId = ?;', [
		packageId,
	]);

	console.log('Packaged removed from shipment');
};
