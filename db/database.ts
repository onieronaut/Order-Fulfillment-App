import * as SQLite from 'expo-sqlite';

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
