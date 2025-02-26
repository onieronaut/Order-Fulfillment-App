import { LineItemType, OrderType } from '@/types';
import { openDatabase } from '../database';
import { GetOrderType } from '@/types/api';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { getItems } from '../items/database';
import { getRandomInt } from '@/utils/getRandomtInt';
import { ITEMS } from '@/constants/items';

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

	const itemCount = getRandomInt(1, 5);

	const db = await openDatabase();
	await db.runAsync(
		'INSERT INTO orders (orderId, createdAt, status) VALUES (?, ?, "Pending");',
		[uniqueId, date]
	);

	for (let i = 0; i < itemCount; i++) {
		const itemId = uuidv4();
		const itemQuantity = getRandomInt(1, 10);

		await db.runAsync(
			`
		INSERT INTO items (itemId, name, quantity, orderId, quantityPackaged, status) VALUES (?, ?, ?, ?, 0, 'Pending');
		`,
			[itemId, ITEMS[i], itemQuantity, uniqueId]
		);
	}

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
