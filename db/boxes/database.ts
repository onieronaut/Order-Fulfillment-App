import { BoxType } from '@/types';
import { openDatabase } from '../database';
import { v4 as uuidv4 } from 'uuid';

export const getBoxes = async () => {
	const db = await openDatabase();
	const boxes: BoxType[] = await db.getAllAsync('SELECT * FROM boxes;');

	console.log('Boxes loaded');

	return boxes;
};

export const createBox = async (name: string) => {
	const db = await openDatabase();

	const uniqueId = uuidv4();

	await db.runAsync(`INSERT INTO boxes (boxId, name) VALUES (?, ?);`, [
		uniqueId,
		name,
	]);

	console.log('Box created');

	return;
};
