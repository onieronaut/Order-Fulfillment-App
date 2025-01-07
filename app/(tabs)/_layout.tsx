import { Text, View } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Pressable } from 'react-native';

export default function TabLayout() {
	return (
		<Tabs>
			<Tabs.Screen name='details' options={{ headerShown: false }} />
			<Tabs.Screen
				name='packages'
				options={{
					headerShown: false,
					title: 'Packages',
				}}
			/>
			<Tabs.Screen name='ship' options={{ headerShown: false }} />
		</Tabs>
	);
}
