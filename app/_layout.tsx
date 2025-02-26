import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { createTables, dropTables } from '@/db/database';
import { useColorScheme } from 'react-native';
// import { createTamagui, createTokens, TamaguiProvider } from 'tamagui';
import { PortalProvider, TamaguiProvider } from 'tamagui';
import 'react-native-get-random-values';

import tamaguiConfig from '@/tamagui.config';
import { createBox, getBoxes } from '@/db/boxes/database';

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

	async function handleInitializeBoxes() {
		const boxes = await getBoxes();

		if (boxes.length > 0) return;
		else {
			await createBox('Small Box');
			await createBox('Medium Box');
			await createBox('Large Box');
			console.log('Boxes initialized');
		}
	}

	useEffect(() => {
		const prepare = async () => {
			try {
				// await dropTables();
				await createTables();
				await handleInitializeBoxes();
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

	return (
		<TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
			<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
				<PortalProvider shouldAddRootHost>
					<Stack>
						<Stack.Screen
							name='index'
							options={{
								title: 'Orders',
							}}
						/>
						<Stack.Screen
							name='(orders)'
							options={{
								title: 'Order #1',
							}}
						/>
					</Stack>
				</PortalProvider>
			</ThemeProvider>
		</TamaguiProvider>
	);
}
