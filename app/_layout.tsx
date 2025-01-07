import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Link, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createOrder, createTable } from '@/db/database';

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from 'expo-router';

// export const unstable_settings = {
// 	// Ensure that reloading on `/modal` keeps a back button present.
// 	initialRouteName: '(tabs)',
// };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
		...FontAwesome.font,
	});

	useEffect(() => {
		const prepare = async () => {
			try {
				createTable();
			} catch (err) {
				console.warn(err);
			}
		};
		prepare();
	}, []);

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	const colorScheme = useColorScheme();

	async function handleCreateOrder() {
		try {
			const result = await createOrder();
			console.log(result);
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<Stack>
				<Stack.Screen
					name='index'
					options={{
						title: 'Orders',
						headerRight: ({ tintColor }) => (
							<Pressable onPress={handleCreateOrder}>
								<Ionicons
									name='add-circle-outline'
									size={24}
									color={tintColor}
								/>
							</Pressable>
						),
					}}
				/>
				<Stack.Screen
					name='(tabs)'
					options={{
						title: 'Order #1',
					}}
				/>
				<Stack.Screen
					name='createpackage'
					options={{
						title: 'Create Package',
						presentation: 'modal',
					}}
				/>
			</Stack>
		</ThemeProvider>
	);
}
