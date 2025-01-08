import { BoxType, LineItemType, OrderType } from '@/types';
import * as SQLite from 'expo-sqlite';
import { getPackage } from './packages/database';

export const openDatabase = async () => {
	return await SQLite.openDatabaseAsync('orders.db');
};

export const createTables = async () => {
	const db = await openDatabase();
	await db
		.execAsync(
			`
    CREATE TABLE IF NOT EXISTS orders (
      orderId INTEGER PRIMARY KEY NOT NULL,
      createdAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS items (
      itemId INTEGER PRIMARY KEY NOT NULL,
      orderId INTEGER NOT NULL,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      quantityPackaged INTEGER NOT NULL,
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
    );

    CREATE TABLE IF NOT EXISTS shipments (
        shipmentId INTEGER PRIMARY KEY NOT NULL,
        status TEXT NOT NULL,
        shippedAt INTEGER,
        orderId INTEGER NOT NULL
    );


    `
		)
		.catch((err) => console.log(err));

	//    	INSERT INTO items (name, quantity, orderId, quantityPackaged, status) VALUES ('Graphics Card', 5, 1, 0, 'Pending');

	console.log('Database Created');
};

export const dropTables = async () => {
	const db = await openDatabase();
	await db.execAsync(`
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS items;
    DROP TABLE IF EXISTS boxes;
    DROP TABLE IF EXISTS packages;
    DROP TABLE IF EXISTS packagedItems;
    DROP TABLE IF EXISTS shipments;`);

	console.log('Tables deleted');
};

export const getBoxes = async () => {
	const db = await openDatabase();
	const boxes: BoxType[] = await db.getAllAsync('SELECT * FROM boxes;');
	console.log('Boxes loaded', boxes);

	return boxes;
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
