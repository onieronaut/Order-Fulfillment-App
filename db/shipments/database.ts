import { ShipmentPackageType, ShipmentType } from '@/types';
import { openDatabase } from '../database';
import { getPackages } from '../packages/database';
import dayjs from 'dayjs';

export const getShipments = async (orderId: number) => {
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

	const newShipmentPackages = packages
		.map((_package) => {
			const matchedShipmentPackage = shipmentPackages.find(
				(shipmentPackage) => shipmentPackage.packageId === _package.packageId
			);

			if (matchedShipmentPackage) {
				return {
					..._package,
					shipmentId: matchedShipmentPackage.shipmentId,
				};
			}

			return null;
		})
		.filter((item) => item !== null);

	const payload = shipments.map((shipment) => {
		return {
			...shipment,
			packages: newShipmentPackages
				.map((shipmentPackage) => {
					if (shipmentPackage.shipmentId === shipment.shipmentId) {
						return shipmentPackage;
					}
				})
				.filter((item) => item !== undefined),
		};
	});

	return payload;
};

export const createShipment = async (orderId: number) => {
	const db = await openDatabase();
	const result = await db.runAsync(
		'INSERT INTO shipments (orderId, status) VALUES (?, "Pending");',
		[orderId]
	);

	console.log('Shipment created');
	return result;
};

export const addPackagesToShipment = async (shipmentId, orderId, data) => {
	const { packageIds } = data;

	const db = await openDatabase();
	for (const packageId of packageIds) {
		await db.runAsync(
			'INSERT INTO shipmentPackages (shipmentId, orderId, packageId) VALUES (?, ?, ?);',
			[shipmentId, orderId, packageId]
		);
	}
	console.log('Packages added to shipment');
	return;
};

export const deleteShipment = async (shipmentId: number) => {
	const db = await openDatabase();
	await db.runAsync('DELETE FROM shipments WHERE shipmentId = ?;', [
		shipmentId,
	]);

	await db.runAsync('DELETE FROM shipmentPackages WHERE shipmentId = ?', [
		shipmentId,
	]);

	console.log('Shipment deleted');
};

export const shipShipment = async (shipmentId: number) => {
	const date = dayjs().unix() * 1000;

	const db = await openDatabase();
	await db.runAsync(
		'UPDATE shipments SET status = "Shipped", shippedAt = ? WHERE shipmentId = ?;',
		[date, shipmentId]
	);

	console.log('Shipment shipped');
};
