import { LineItemType, OrderType } from '@/types';
import { openDatabase } from '../database';
import { GetOrderType } from '@/types/api';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { getItems } from '../items/database';

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
	const uniqueId = uuidv4();
	const date = dayjs().unix() * 1000;

	const db = await openDatabase();
	await db.runAsync(
		'INSERT INTO orders (orderId, createdAt, status) VALUES (?, ?, "Pending");',
		[uniqueId, date]
	);

	console.log('Order created');
	return;
};

export const getOrder = async (orderId: string) => {
	const db = await openDatabase();

	const order: GetOrderType = await db.getFirstAsync(
		'SELECT * FROM orders WHERE orderId = ?;',
		[orderId]
	);

	const items = await getItems(orderId);

	const payload: OrderType = {
		...order,
		items: items,
	};

	console.log('Order loaded', payload);
	return payload;
};
