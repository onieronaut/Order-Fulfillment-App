import { LineItemType, PackagedItemType } from '@/types';
import { openDatabase } from '../database';
import { v4 as uuidv4 } from 'uuid';

export const getItems = async (orderId: string) => {
	const db = await openDatabase();

	const items: LineItemType[] = await db.getAllAsync(
		'SELECT * from items WHERE orderId = ?;',
		[orderId]
	);

	console.log('Items loaded', items);

	return items;
};

export const getItem = async (itemId: string) => {
	const db = await openDatabase();
	const item: any = await db.getFirstAsync(
		'SELECT * FROM items WHERE itemId = ?;',
		[itemId]
	);

	const payload: LineItemType = item;

	return payload;
};

export const updateItemQuantityPackaged = async (
	itemId: string,
	quantityPackaged: number
) => {
	const db = await openDatabase();

	const item = await getItem(itemId);
	const newQuantityPackaged =
		//@ts-ignore
		parseInt(item.quantityPackaged) + parseInt(quantityPackaged);

	await db.runAsync('UPDATE items SET quantityPackaged = ? WHERE itemId = ?;', [
		newQuantityPackaged,
		itemId,
	]);

	//@ts-ignore
	if (parseInt(newQuantityPackaged) === parseInt(item.quantity)) {
		await db.runAsync('UPDATE items SET status = "Packed" WHERE itemId = ?;', [
			itemId,
		]);
	}

	//@ts-ignore
	if (parseInt(newQuantityPackaged) !== parseInt(item.quantity)) {
		await db.runAsync('UPDATE items SET status = "Pending" WHERE itemId = ?;', [
			itemId,
		]);
	}

	console.log('Item updated');
	return;
};

export const getPackageItem = async (packageItemId: string) => {
	const db = await openDatabase();

	const packageItem: PackagedItemType = await db.getFirstAsync(
		'SELECT * FROM packagedItems WHERE packageItemId = ?;',
		[packageItemId]
	);

	return packageItem;
};
