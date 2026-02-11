/**
 * 毛玻璃卡片 — 核心 UI 组件
 * 用于社区卡片、帖子卡片等
 */
import { PropsWithChildren } from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { Radii, Shadows } from '@/constants/ui';
import { useColorScheme } from '@/hooks/use-color-scheme';

type GlassCardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  radius?: number;
  animate?: boolean;
  delay?: number;
}>;

export function GlassCard({
  children,
  style,
  intensity = 60,
  radius = Radii.xl,
  animate = true,
  delay = 0,
}: GlassCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  const content = (
    <View
      style={[
        styles.container,
        {
          borderRadius: radius,
          borderColor: palette.glassBorder,
          backgroundColor: palette.glass,
        },
        Shadows.soft,
        style,
      ]}>
      {Platform.OS === 'ios' ? (
        <BlurView
          intensity={intensity}
          tint={colorScheme === 'dark' ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <View style={styles.inner}>{children}</View>
    </View>
  );

  if (!animate) return content;

  return (
    <Animated.View entering={FadeIn.delay(delay).duration(400)}>
      {content}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  inner: {
    flex: 1,
  },
});
