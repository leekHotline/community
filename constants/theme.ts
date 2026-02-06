/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#E4574E';
const tintColorDark = '#FF7A6A';

export const Colors = {
  light: {
    text: '#1A1A1A',
    background: '#F7F4EF',
    surface: '#FFFFFF',
    card: '#FDFBF8',
    tint: tintColorLight,
    icon: '#5C6168',
    muted: '#6B6F76',
    border: '#E7DED5',
    accent: tintColorLight,
    accentSoft: '#FDE8E1',
    tabIconDefault: '#8B8F96',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#F5F5F7',
    background: '#0F0F12',
    surface: '#15161A',
    card: '#1B1C21',
    tint: tintColorDark,
    icon: '#A1A4AB',
    muted: '#A1A4AB',
    border: '#26282E',
    accent: tintColorDark,
    accentSoft: '#2A1F1E',
    tabIconDefault: '#6E7178',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = {
  display: 'SpaceGrotesk_700Bold',
  title: 'SpaceGrotesk_600SemiBold',
  body: 'Sora_400Regular',
  bodyMedium: 'Sora_500Medium',
  bodyBold: 'Sora_600SemiBold',
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
};
