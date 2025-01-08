import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
	return (
		<Tabs>
			<Tabs.Screen
				name='[orderId]'
				options={{
					headerShown: false,
					title: 'Line Items',
					tabBarIcon: ({ size, color }) => (
						<FontAwesome name='list-alt' size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='packages'
				options={{
					headerShown: false,
					title: 'Packages',
					tabBarIcon: ({ size, color }) => (
						<Feather name='package' size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='ship'
				options={{
					headerShown: false,
					tabBarIcon: ({ size, color }) => (
						<MaterialIcons name='local-shipping' size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
