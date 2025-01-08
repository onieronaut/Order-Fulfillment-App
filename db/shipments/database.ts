import { openDatabase } from '../database';

export const getShipments = async (shipmentId: number) => {
	const db = await openDatabase();
	const shipments: any[] = await db.getAllAsync(
		'SELECT * FROM shipments WHERE shipmentId = ?;',
		[shipmentId]
	);

	// const packagedItems: any[] = await db.getAllAsync(
	//     'SELECT * from packages WHERE shipmentId = ?;',
	//     [shipmentId]
	// );

	// const payload = packages.map((_package) => {
	//     const arr: any = [];
	//     packagedItems.map((item) => {
	//         if (item.packageId === _package.packageId) {
	//             arr.push(item);
	//         }
	//     });
	//     return {
	//         ..._package,
	//         items: arr,
	//     };
	// });

	// console.log('Packages loaded', packages);

	return shipments;
};

export const createShipment = async (orderId: number) => {
	const db = await openDatabase();
	const result = await db.runAsync(
		'INSERT INTO shipments (orderId, status) VALUES (?, "Pending");',
		[orderId]
	);

	console.log('Shipment created');
	return result;
};
