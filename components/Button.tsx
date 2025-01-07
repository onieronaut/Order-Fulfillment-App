import { Pressable, StyleSheet, Text } from 'react-native';

interface ButtonPropsType {
	onPress?: any;
	children: string;
}

const Button = ({ onPress, children }: ButtonPropsType) => {
	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
			<Text style={styles.text}>{children}</Text>
		</Pressable>
	);
};

export default Button;

const styles = StyleSheet.create({
	button: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		margin: 4,
		backgroundColor: 'red',
		elevation: 2,
		shadowColor: 'black',
		shadowOpacity: 0.5,
		shadowOffset: { width: 1, height: 1 },
		shadowRadius: 2,
		borderRadius: 4,
	},
	pressed: { opacity: 0.7 },
	text: { color: 'white', textAlign: 'center', fontSize: 16 },
});
