import { LineItemType, OrderType } from '@/types';
import { openDatabase } from '../database';
import { GetOrderType } from '@/types/api';

export const getOrders = async () => {
	const db = await openDatabase();
	const orders: GetOrderType[] = await db.getAllAsync('SELECT * FROM orders;');

	const items: LineItemType[] = await db.getAllAsync('SELECT * from items;');

	const payload: OrderType[] = orders.map((order) => {
		const lineItems: LineItemType[] = [];

		items.map((item) => {
			if (item.orderId === order.orderId) {
				lineItems.push(item);
			}
		});

		return {
			...order,
			items: lineItems,
		};
	});

	console.log('Orders loaded', payload);
	return payload;
};

export const createOrder = async () => {
	const db = await openDatabase();
	const result = await db.runAsync(
		'INSERT INTO orders (createdAt, status) VALUES (1736061294, "Pending");'
	);

	console.log('Order created', result);
	return result;
};

export const getOrder = async (orderId: number) => {
	const db = await openDatabase();

	const order: GetOrderType = await db.getFirstAsync(
		'SELECT * FROM orders WHERE orderId = ?;',
		[orderId]
	);

	const items: LineItemType[] = await db.getAllAsync(
		'SELECT * from items WHERE orderId = ?;',
		[orderId]
	);

	const payload: OrderType = {
		...order,
		items: items,
	};

	console.log('Order loaded', payload);
	return payload;
};
