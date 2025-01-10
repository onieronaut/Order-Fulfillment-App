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

import { Pressable, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createTables, dropTables } from '@/db/database';
import { createOrder } from '@/db/orders/database';
// import { createTamagui, createTokens, TamaguiProvider } from 'tamagui';
import {
	TamaguiProvider,
	createTokens,
	createTamagui,
	View,
	Theme,
	PortalProvider,
} from 'tamagui';

import defaultConfig, { tokens } from '@tamagui/config/v3';
import tamaguiConfig from '@/tamagui.config';

// import '@tamagui/core/reset.css';
// import { config } from '@/tamagui.config';

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

// const config = createTamagui(defaultConfig);

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
		...FontAwesome.font,
	});

	useEffect(() => {
		const prepare = async () => {
			try {
				await createTables();
				// await dropTables();
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
		<TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
			<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
				<PortalProvider shouldAddRootHost>
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
							name='(orders)'
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
						<Stack.Screen
							name='addlineitem'
							options={{
								title: 'Add Line Item to Package',
								presentation: 'modal',
							}}
						/>
						<Stack.Screen
							name='createshipment'
							options={{
								title: 'Create Shipment',
								presentation: 'modal',
							}}
						/>
					</Stack>
				</PortalProvider>
			</ThemeProvider>
		</TamaguiProvider>
	);
}
