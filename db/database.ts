import { OrderType } from '@/types';
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
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      orderId INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS boxes (
      boxId INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
    );

    `);
	// INSERT INTO items (name, quantity, orderId) VALUES ('Graphics Card', 5, 2)
	console.log('Orders table created');

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
	const boxes = await db.getAllAsync('SELECT * FROM boxes;');
	console.log('Boxes loaded', boxes);

	return boxes;
};
