import { createTamagui } from 'tamagui';
import * as themes from './theme-output';
import { tokens, animations, config } from '@tamagui/config/v3';

export const tamaguiConfig = createTamagui({ ...config, themes });

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module 'tamagui' {
	interface TamaguiCustomConfig extends Conf {}
}
