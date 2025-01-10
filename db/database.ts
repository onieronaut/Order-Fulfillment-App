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
      createdAt INTEGER NOT NULL,
      status TEXT NOT NULL
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

       CREATE TABLE IF NOT EXISTS shipmentPackages (
        shipmentPackageId INTEGER PRIMARY KEY NOT NULL,
        shipmentId INTEGER NOT NULL,
        packageId INTEGER NOT NULL,
        orderId INTEGER NOT NULL
    );


    `
		)
		.catch((err) => console.log(err));

	//    UPDATE items SET quantityPackaged = 0 WHERE itemId = 3;

	// INSERT INTO boxes (name) VALUES ('Small Box');
	// INSERT INTO boxes (name) VALUES ('Medium Box');
	// INSERT INTO boxes (name) VALUES ('Large Box');

	// INSERT INTO orders (createdAt, status) VALUES ('123456789','Pending');
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
