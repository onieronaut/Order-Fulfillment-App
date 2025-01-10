import { PackageType } from '@/types';
import { openDatabase } from '../database';
import {
	getItem,
	getItems,
	updateItemQuantityPackaged,
} from '../items/database';

export const getPackages = async (orderId: number) => {
	const db = await openDatabase();
	const packages: any[] = await db.getAllAsync(
		'SELECT * FROM packages WHERE orderId = ?;',
		[orderId]
	);

	const packagedItems: any[] = await db.getAllAsync(
		'SELECT * from packagedItems WHERE orderId = ?;',
		[orderId]
	);

	const items = await getItems(orderId);

	const newPackagedItems = items
		.map((item) => {
			const matchedPackagedItem = packagedItems.find(
				(packagedItem) => packagedItem.itemId === item.itemId
			);

			if (matchedPackagedItem) {
				return {
					...item,
					packageId: matchedPackagedItem.packageId,
					packageItemId: matchedPackagedItem.packageItemId,
				};
			}

			return null;
		})
		.filter((item) => item !== null);

	const payload: PackageType[] = packages.map((_package) => {
		return {
			..._package,
			items: newPackagedItems
				.map((packagedItem) => {
					if (packagedItem.packageId === _package.packageId) {
						return packagedItem;
					}
				})
				.filter((item) => item !== undefined),
		};
	});

	return payload;
};

export const getPackage = async (packageId: number) => {
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

export const createPackage = async ({
	orderId,
	boxId,
	name,
}: {
	orderId: number;
	boxId: number;
	name: string;
}) => {
	const db = await openDatabase();
	const result = await db.runAsync(
		'INSERT INTO packages (orderId, boxId, name, items, status) VALUES (?, ?, ?, 0, "Open");',
		[orderId, boxId, name]
	);

	console.log('Package created', result);

	return result.lastInsertRowId;
};

export const addLineItemToPackage = async ({
	orderId,
	packageId,
	itemId,
	name,
	quantity,
}: {
	orderId: number;
	packageId: number;
	itemId: number;
	name: string;
	quantity: number;
}) => {
	const db = await openDatabase();

	const _package = await getPackage(packageId);

	if (_package.items.some((item) => item.itemId === itemId)) {
		// add to quantity
		const item = await getItem(itemId);
		//@ts-ignore
		const newQuantity = parseInt(quantity) + parseInt(item.quantityPackaged);

		await db.runAsync(
			'INSERT INTO packageditems (orderId, packageId, itemId, name, quantity) VALUES (?, ?, ?, ?, ?);',
			[orderId, packageId, itemId, name, newQuantity]
		);

		console.log('item already here');
	} else {
		await db.runAsync(
			'INSERT INTO packageditems (orderId, packageId, itemId, name, quantity) VALUES (?, ?, ?, ?, ?);',
			[orderId, packageId, itemId, name, quantity]
		);
	}

	await updateItemQuantityPackaged(itemId, quantity);
	console.log('Item added to package');

	return;
};

export const removeLineItemFromPackage = async (packagedItemId: number) => {
	console.log(packagedItemId);

	const db = await openDatabase();
	const result = await db.runAsync(
		'DELETE from packageditems WHERE packageItemId = ?;',
		[packagedItemId]
	);

	console.log('Packaged Item removed');
	return result;
};

export const finishPackage = async (packageId: number) => {
	const db = await openDatabase();

	const result = await db.runAsync(
		'UPDATE packages SET status = "Packed" WHERE packageId = ?;',
		[packageId]
	);

	console.log('Package updated', result);
	return result;
};

export const undoFinishPackage = async (packageId: number) => {
	const db = await openDatabase();

	const result = await db.runAsync(
		'UPDATE packages SET status = "Open" WHERE packageId = ?;',
		[packageId]
	);

	console.log('Package updated', result);
	return result;
};
