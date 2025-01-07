import { Pressable, StyleSheet } from 'react-native';
import { Text, View } from './Themed';
import { Link } from 'expo-router';

interface PackageItemPropsType {
	_package: any;
}

export const PackageItem = ({ _package }: PackageItemPropsType) => {
	return (
		<View style={styles.container}>
			<View style={styles.infoContainer}>
				<View style={styles.nameContainer}>
					<Text style={styles.name}>{_package.name}</Text>
				</View>
				<View style={styles.statusContainer}>
					<Text style={styles.status}>Status: {_package.status}</Text>
				</View>
				<Link href='/addlineitem' asChild>
					<Pressable style={styles.buttonContainer}>
						<Text>Add Item</Text>
					</Pressable>
				</Link>
			</View>
			<View style={styles.lineItemContainer}>
				{_package.items.map((item) => (
					<Text>{item.name}</Text>
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
