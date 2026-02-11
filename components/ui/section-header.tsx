/**
 * 段落标题 — 带微妙的装饰线
 */
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { Spacing } from '@/constants/ui';
import { useColorScheme } from '@/hooks/use-color-scheme';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  action?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function SectionHeader({ title, subtitle, action, onAction, style }: SectionHeaderProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <View style={[styles.container, style]}>
      <View style={styles.left}>
        <View style={[styles.indicator, { backgroundColor: palette.accent }]} />
        <ThemedText type="headline">{title}</ThemedText>
      </View>
      {subtitle ? (
        <ThemedText type="caption" style={{ color: palette.muted }}>
          {subtitle}
        </ThemedText>
      ) : null}
      {action ? (
        <ThemedText
          type="caption"
          style={{ color: palette.accent }}
          onPress={onAction}>
          {action}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indicator: {
    width: 3,
    height: 16,
    borderRadius: 2,
  },
});
