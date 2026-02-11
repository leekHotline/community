/**
 * 品牌按钮 — 带渐变底色和按压弹性
 */
import { PropsWithChildren } from 'react';
import { PressableProps, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { InteractivePressable } from './animated-pressable';
import { Colors, Fonts } from '@/constants/theme';
import { Radii, Shadows } from '@/constants/ui';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol, type IconSymbolName } from './icon-symbol';

type AccentButtonProps = PropsWithChildren<
  PressableProps & {
    style?: StyleProp<ViewStyle>;
    icon?: IconSymbolName;
    variant?: 'primary' | 'secondary' | 'ghost';
  }
>;

export function AccentButton({
  children,
  style,
  icon,
  variant = 'primary',
  ...props
}: AccentButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  if (variant === 'secondary') {
    return (
      <InteractivePressable
        style={[
          styles.base,
          {
            backgroundColor: palette.accentSoft,
            borderColor: palette.border,
            borderWidth: 1,
          },
          style,
        ]}
        {...props}>
        {icon ? <IconSymbol name={icon} size={16} color={palette.accent} /> : null}
        <ThemedText
          type="defaultSemiBold"
          style={[styles.text, { color: palette.accent, fontSize: 14 }]}>
          {children}
        </ThemedText>
      </InteractivePressable>
    );
  }

  if (variant === 'ghost') {
    return (
      <InteractivePressable
        style={[styles.base, { backgroundColor: 'transparent' }, style]}
        scaleTo={0.97}
        {...props}>
        {icon ? <IconSymbol name={icon} size={16} color={palette.muted} /> : null}
        <ThemedText
          type="defaultSemiBold"
          style={[styles.text, { color: palette.muted, fontSize: 14 }]}>
          {children}
        </ThemedText>
      </InteractivePressable>
    );
  }

  return (
    <InteractivePressable style={[styles.base, Shadows.glow, style]} {...props}>
      <LinearGradient
        colors={[palette.accent, palette.accentLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {icon ? <IconSymbol name={icon} size={16} color="#FFFFFF" /> : null}
      <ThemedText type="defaultSemiBold" style={[styles.text, { color: '#FFFFFF', fontSize: 14 }]}>
        {children}
      </ThemedText>
    </InteractivePressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    paddingHorizontal: 20,
    borderRadius: Radii.pill,
    overflow: 'hidden',
  },
  text: {
    fontFamily: Fonts.bodyBold,
  },
});
