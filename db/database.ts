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


  `);
	console.log('Table created successfully');
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
	const order = await db.getFirstAsync(
		'SELECT * FROM orders WHERE orderId = ?;',
		[id]
	);
	return order;
};
