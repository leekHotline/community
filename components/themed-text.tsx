import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Fonts } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | 'default'
    | 'title'
    | 'defaultSemiBold'
    | 'subtitle'
    | 'link'
    | 'display'
    | 'headline'
    | 'label'
    | 'caption';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const baseColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const linkColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tint');
  const color = type === 'link' ? linkColor : baseColor;

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'display' ? styles.display : undefined,
        type === 'headline' ? styles.headline : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'label' ? styles.label : undefined,
        type === 'caption' ? styles.caption : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Fonts.body,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Fonts.bodyMedium,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontFamily: Fonts.title,
  },
  display: {
    fontSize: 34,
    lineHeight: 40,
    fontFamily: Fonts.display,
  },
  headline: {
    fontSize: 20,
    lineHeight: 26,
    fontFamily: Fonts.title,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: Fonts.bodyBold,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontFamily: Fonts.bodyMedium,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: Fonts.body,
  },
  link: {
    lineHeight: 22,
    fontSize: 15,
    fontFamily: Fonts.bodyMedium,
  },
});
