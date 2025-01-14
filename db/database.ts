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
      orderId TEXT NOT NULL PRIMARY KEY,
      createdAt INTEGER NOT NULL,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS items (
      itemId TEXT NOT NULL PRIMARY KEY,
      orderId TEXT NOT NULL,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      quantityPackaged INTEGER NOT NULL,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS boxes (
      boxId TEXT NOT NULL PRIMARY KEY,
      name TEXT NOT NULL
    );

     CREATE TABLE IF NOT EXISTS packages (
      packageId TEXT NOT NULL PRIMARY KEY,
      orderId TEXT NOT NULL,
      boxId TEXT NOT NULL,
      name TEXT NOT NULL,
      items INTEGER NOT NULL,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS packageditems (
        packageItemId TEXT NOT NULL PRIMARY KEY,
        packageId TEXT NOT NULL,
        itemId TEXT NOT NULL,
        orderId TEXT NOT NULL,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS shipments (
        shipmentId TEXT NOT NULL PRIMARY KEY,
        status TEXT NOT NULL,
        shippedAt INTEGER,
        orderId TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS shipmentPackages (
        shipmentPackageId TEXT NOT NULL PRIMARY KEY,
        shipmentId TEXT NOT NULL,
        packageId TEXT NOT NULL,
        orderId TEXT NOT NULL
    );


    
    `
		)
		.catch((err) => console.log(err));

	// INSERT INTO boxes (boxId, name) VALUES ('b2cbd40b-bc13-46e1-bfdd-92e6a5e53d8a','Small Box');
	// INSERT INTO boxes (boxId, name) VALUES ('8130aa1f-d37d-4428-acfa-01175b75702d','Medium Box');
	// INSERT INTO boxes (boxId, name) VALUES ('a26c19d8-3a6d-4d8a-8195-264bbb0c2348', 'Large Box');

	// INSERT INTO orders (orderId, createdAt, status) VALUES ('4f442674-b846-489c-8efa-32932d8a283f','123456789','Pending');
	// INSERT INTO items (itemId, name, quantity, orderId, quantityPackaged, status) VALUES ('c396d3e9-ba1e-45b6-94fe-a217fd6b2c99', 'Graphics Card', 5, '4f442674-b846-489c-8efa-32932d8a283f', 0, 'Pending');

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
    DROP TABLE IF EXISTS shipments;
    DROP TABLE IF EXISTS shipmentPackages;
    `);

	console.log('Tables deleted');
};

export const getBoxes = async () => {
	const db = await openDatabase();
	const boxes: BoxType[] = await db.getAllAsync('SELECT * FROM boxes;');

	console.log('Boxes loaded');

	return boxes;
};
