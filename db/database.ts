import { BoxType, LineItemType, OrderType } from '@/types';
import * as SQLite from 'expo-sqlite';

const openDatabase = async () => {
	return await SQLite.openDatabaseAsync('orders.db');
};

export const createTable = async () => {
	const db = await openDatabase();
	await db.execAsync(`
    CREATE TABLE IF NOT EXISTS orders (
      orderId INTEGER PRIMARY KEY NOT NULL,
      createdAt INTEGER NOT NULL,
      items INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS items (
      itemId INTEGER PRIMARY KEY NOT NULL,
      orderId INTEGER NOT NULL
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      quantityPackaged INTEGER NOT NULL
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS boxes (
      boxId INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
    );

     CREATE TABLE IF NOT EXISTS packages (
      packageId INTEGER PRIMARY KEY NOT NULL,
      orderId INTEGER NOT NULL,
      boxId INTEGER NOT NULL,
      name TEXT NOT NULL,
      items INTEGER NOT NULL,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS packageditems (
        packageItemId INTEGER PRIMARY KEY NOT NULL,
        packageId INTEGER NOT NULL,
        itemId INTEGER NOT NULL,
        orderId INTEGER NOT NULL,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL
    )

    `);
	// INSERT INTO items (name, quantity, orderId) VALUES ('Graphics Card', 5, 2)
	console.log('Database Created');

	await db.execAsync(``);
};

export const getOrders = async () => {
	const db = await openDatabase();
	const orders = await db.getAllAsync('SELECT * FROM orders;');
	console.log('Orders loaded', orders);

	return orders;
};

export const createOrder = async () => {
	const db = await openDatabase();
	const result = await db.runAsync(
		'INSERT INTO orders (createdAt, items) VALUES (1736061294, 3);'
	);
	console.log('Order created', result);
	return result.lastInsertRowId;
};

export const getOrder = async (id: number) => {
	const db = await openDatabase();
	const order: any = await db.getFirstAsync(
		'SELECT * FROM orders WHERE orderId = ?;',
		[id]
	);

	const items = await db.getAllAsync('SELECT * from items WHERE orderId = ?;', [
		id,
	]);

	const payload: OrderType = {
		...order,
		items: items,
	};

	return payload;
};

export const getBoxes = async () => {
	const db = await openDatabase();
	const boxes: BoxType[] = await db.getAllAsync('SELECT * FROM boxes;');
	console.log('Boxes loaded', boxes);

	return boxes;
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

	console.log('TEST', payload);

	console.log('packageditems', packagedItems);

	console.log('Packages loaded', packages);

	return payload;
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
	const result = await db.runAsync(
		'INSERT INTO packageditems (orderId, packageId, itemId, name, quantity) VALUES (?, ?, ?, ?, ?);',
		[orderId, packageId, itemId, name, quantity]
	);
	console.log('Item added', result);

	// const updateItem = updateItemQuantityPackaged(itemId, quantity);
	// console.log('Line Item added');
	return;
};

export const getItem = async (itemId: number) => {
	const db = await openDatabase();
	const item: any = await db.getFirstAsync(
		'SELECT * FROM items WHERE item = ?;',
		[itemId]
	);

	const payload: LineItemType = item;

	return payload;
};

export const updateItemQuantityPackaged = async (
	itemId: number,
	quantityPackaged: number
) => {
	const db = await openDatabase();

	const item = await getItem(itemId);
	const newQuantityPackaged = item.quantityPackaged + quantityPackaged;

	const result = await db.runAsync(
		'UPDATE items SET quantityPackaged = ? WHERE id = ?;',
		[newQuantityPackaged, itemId]
	);

	if (newQuantityPackaged === item.quantity) {
		await db.runAsync('UPDATE items SET status = "Packed" WHERE id = ?;', [
			itemId,
		]);
	}

	console.log('Item updated');
	return;
};
