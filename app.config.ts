module.exports = {
	name: 'order-fulfillment-app',
	slug: 'order-fulfillment-app',
	version: '1.0.0',
	orientation: 'portrait',
	icon: './assets/images/icon.png',
	scheme: 'myapp',
	userInterfaceStyle: 'automatic',
	newArchEnabled: true,
	jsEngine: 'hermes',
	splash: {
		image: './assets/images/splash-icon.png',
		resizeMode: 'contain',
		backgroundColor: '#ffffff',
	},
	ios: {
		supportsTablet: true,
		jsEngine: 'jsc',
	},
	android: {
		adaptiveIcon: {
			foregroundImage: './assets/images/adaptive-icon.png',
			backgroundColor: '#ffffff',
		},
	},
	web: {
		bundler: 'metro',
		output: 'static',
		favicon: './assets/images/favicon.png',
	},
	plugins: ['expo-router', 'expo-sqlite'],
	experiments: {
		typedRoutes: true,
	},
};
