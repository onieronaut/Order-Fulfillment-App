import { Pressable, StyleSheet } from 'react-native';
import { Text, View } from './Themed';
import { Link } from 'expo-router';
import { PackageType } from '@/types';
import {
	finishPackage,
	removeLineItemFromPackage,
	undoFinishPackage,
} from '@/db/packages/database';
import Button from './Button';

interface PackageItemPropsType {
	_package: PackageType;
}

export const PackageItem = ({ _package }: PackageItemPropsType) => {
	async function handleRemoveLineItemFromPackage(packageItemId: number) {
		console.log(packageItemId);

		try {
			await removeLineItemFromPackage(packageItemId);
		} catch (err) {
			console.log(err);
		}
	}

	async function handleFinishPackage(packageId: number) {
		try {
			await finishPackage(packageId);
		} catch (err) {
			console.log(err);
		}
	}
	async function handleUndoFinishPackage(packageId: number) {
		try {
			await undoFinishPackage(packageId);
		} catch (err) {
			console.log(err);
		}
	}

	if (_package.status === 'Packed') {
		return (
			<View style={styles.container}>
				<View style={styles.infoContainer}>
					<View style={styles.nameContainer}>
						<Text style={styles.name}>{_package.name}</Text>
					</View>
					<View style={styles.statusContainer}>
						<Text style={styles.status}>Status: {_package.status}</Text>
					</View>
					<Button onPress={() => handleUndoFinishPackage(_package.packageId)}>
						Undo Finish
					</Button>
				</View>
				<View style={styles.lineItemContainer}>
					{_package.items.map((item) => (
						<View key={item.packageItemId}>
							<Text>{item.name}</Text>
							<Text>{item.quantity}</Text>
						</View>
					))}
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.infoContainer}>
				<View style={styles.nameContainer}>
					<Text style={styles.name}>{_package.name}</Text>
				</View>
				<View style={styles.statusContainer}>
					<Text style={styles.status}>Status: {_package.status}</Text>
				</View>
				<Link
					href={{
						pathname: '/addlineitem',
						params: {
							orderId: _package.orderId,
							packageId: _package.packageId,
						},
					}}
					asChild>
					<Pressable style={styles.buttonContainer}>
						<Text>Add Item</Text>
					</Pressable>
				</Link>
				<Button onPress={() => handleFinishPackage(_package.packageId)}>
					Finish
				</Button>
			</View>
			<View style={styles.lineItemContainer}>
				{_package.items.map((item) => (
					<View key={item.packageItemId}>
						<Text>{item.name}</Text>
						<Text>{item.quantity}</Text>
						<Pressable
							onPress={() =>
								handleRemoveLineItemFromPackage(item.packageItemId)
							}>
							<Text>Remove</Text>
						</Pressable>
					</View>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 24,
		backgroundColor: '#0B787E73',
	},
	infoContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	name: {
		fontSize: 16,
		fontWeight: 'bold',
		color: 'white',
	},
	status: {
		fontSize: 12,
		fontWeight: 'bold',
		color: 'white',
	},
	statusContainer: {
		flex: 1,
	},
	nameContainer: {
		flex: 1,
	},
	buttonContainer: {
		flex: 1,
		height: '100%',
		width: '100%',
		backgroundColor: '#EC3F9E',
	},
	lineItemContainer: {
		flex: 1,
	},
});
