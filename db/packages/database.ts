import { PackageType } from '@/types';
import { openDatabase } from '../database';

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

	const payload = packages.map((_package) => {
		const arr: any = [];
		packagedItems.map((item) => {
			if (item.packageId === _package.packageId) {
				arr.push(item);
			}
		});
		return {
			..._package,
			items: arr,
		};
	});

	console.log('Packages loaded', packages);

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
		console.log('item already here');
	} else {
		const result = await db.runAsync(
			'INSERT INTO packageditems (orderId, packageId, itemId, name, quantity) VALUES (?, ?, ?, ?, ?);',
			[orderId, packageId, itemId, name, quantity]
		);
		console.log('Item added', result);

		// const updateItem = updateItemQuantityPackaged(itemId, quantity);
		// console.log('Line Item added');
		return;
	}
};

export const removeLineItemFromPackage = async (packagedItemId: number) => {
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
