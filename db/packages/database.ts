import { PackagedItemType, PackageType, ShipmentPackageType } from '@/types';
import { openDatabase } from '../database';
import {
	getItem,
	getItems,
	getPackageItem,
	updateItemQuantityPackaged,
} from '../items/database';
import { v4 as uuidv4 } from 'uuid';

export const getPackages = async (orderId: string) => {
	const db = await openDatabase();

	const packages: PackageType[] = await db.getAllAsync(
		'SELECT * FROM packages WHERE orderId = ?;',
		[orderId]
	);

	const packagedItems: PackagedItemType[] = await db.getAllAsync(
		'SELECT * from packagedItems WHERE orderId = ?;',
		[orderId]
	);

	const shipmentPackages: ShipmentPackageType[] = await db.getAllAsync(
		'SELECT * FROM shipmentPackages WHERE orderId = ?',
		[orderId]
	);

	const payload: PackageType[] = packages.map((_package) => {
		return {
			..._package,
			items: packagedItems
				.map((packagedItem) => {
					if (packagedItem.packageId === _package.packageId) {
						return packagedItem;
					}
				})
				.filter((item) => item !== undefined),
			shipmentPackageId:
				shipmentPackages.find(
					(shipmentPackage) => shipmentPackage.packageId === _package.packageId
				)?.shipmentPackageId || '',
		};
	});

	return payload;
};

export const getPackage = async (packageId: string) => {
	const db = await openDatabase();
	const _package: any = await db.getFirstAsync(
		'SELECT * FROM packages WHERE packageId = ?;',
		[packageId]
	);

	const items: any[] = await db.getAllAsync(
		'SELECT * from packagedItems WHERE packageId = ?;',
		[packageId]
	);

	const payload: PackageType = {
		..._package,
		items: items,
	};

	return payload;
};

export const createPackage = async (
	orderId: string,
	data: { boxId: string; name: string }
) => {
	const { boxId, name } = data;
	const uniqueId = uuidv4();

	const db = await openDatabase();
	await db.runAsync(
		'INSERT INTO packages (packageId, orderId, boxId, name, items, status) VALUES (?, ?, ?, ?, 0, "Open");',
		[uniqueId, orderId, boxId, name]
	);

	console.log('Package created');

	return;
};

export const addLineItemToPackage = async (
	orderId: string,
	packageId: string,
	itemId: string,
	data: {
		quantity: number;
		name: string;
	}
) => {
	const { quantity, name } = data;

	const db = await openDatabase();

	const _package = await getPackage(packageId);
	const uniqueId = uuidv4();

	if (_package.items.some((item) => item.itemId === itemId)) {
		const { packageItemId, quantity: currentQuantity } = _package.items.find(
			(item) => item.itemId === itemId
		);
		// @ts-ignore
		const newQuantity = parseInt(quantity) + parseInt(currentQuantity);

		await db.runAsync(
			'UPDATE packageditems SET quantity = ? WHERE packageItemId = ?;',
			[newQuantity, packageItemId]
		);
	} else {
		await db.runAsync(
			'INSERT INTO packageditems (packageItemId, orderId, packageId, itemId, name, quantity) VALUES (?, ?, ?, ?, ?, ?);',
			[uniqueId, orderId, packageId, itemId, name, quantity]
		);
	}

	await updateItemQuantityPackaged(itemId, quantity);
	console.log('Item added to package');

	return;
};

export const removeLineItemFromPackage = async (packagedItemId: string) => {
	const db = await openDatabase();

	const packagedItem = await getPackageItem(packagedItemId);

	const { quantity } = packagedItem;

	await db.runAsync('DELETE FROM packageditems WHERE packageItemId = ?;', [
		packagedItemId,
	]);

	await updateItemQuantityPackaged(packagedItem.itemId, -quantity);

	console.log('Packaged Item removed');
	return;
};

export const finishPackage = async (packageId: string) => {
	const db = await openDatabase();

	const result = await db.runAsync(
		'UPDATE packages SET status = "Packed" WHERE packageId = ?;',
		[packageId]
	);

	console.log('Package updated', result);
	return result;
};

export const undoFinishPackage = async (packageId: string) => {
	const db = await openDatabase();

	const result = await db.runAsync(
		'UPDATE packages SET status = "Open" WHERE packageId = ?;',
		[packageId]
	);

	console.log('Package updated', result);
	return result;
};

export const deletePackage = async (packageId: string) => {
	const db = await openDatabase();

	const _package = await getPackage(packageId);

	await db.runAsync('DELETE FROM packages WHERE packageId = ?;', [packageId]);

	for (const packageItem of _package.items) {
		const packagedItem = await getPackageItem(packageItem.packageItemId);

		await updateItemQuantityPackaged(
			packageItem.itemId,
			-packagedItem.quantity
		);
	}

	await db.runAsync('DELETE FROM packagedItems WHERE packageId = ?');

	console.log('Packaged deleted');
};
