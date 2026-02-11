/**
 * 统计数字卡片 — 带入场计数动画
 */
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  FadeIn,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Colors, Motion } from '@/constants/theme';
import { Radii, Shadows, Spacing } from '@/constants/ui';
import { useColorScheme } from '@/hooks/use-color-scheme';

type StatCardProps = {
  label: string;
  value: number | string;
  delay?: number;
  icon?: string;
};

export function StatCard({ label, value, delay = 0 }: StatCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      scale.value = withSpring(1, Motion.spring.bouncy);
      opacity.value = withTiming(1, { duration: Motion.duration.entrance });
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay, scale, opacity]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: palette.surface,
          borderColor: palette.borderLight,
        },
        Shadows.subtle,
        animStyle,
      ]}>
      <ThemedText type="title" style={[styles.value, { color: palette.accent }]}>
        {value}
      </ThemedText>
      <ThemedText type="caption" style={{ color: palette.muted }}>
        {label}
      </ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radii.lg,
    borderWidth: 1,
    gap: 4,
  },
  value: {
    fontSize: 22,
  },
});
