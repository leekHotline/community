/**
 * 社区筛选条 — 横向可滚动的Chip列表
 */
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInRight, Layout } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { InteractivePressable } from './animated-pressable';
import { IconSymbol } from './icon-symbol';
import { Colors, Motion } from '@/constants/theme';
import { Radii, Shadows, Spacing } from '@/constants/ui';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Community } from '@/lib/types';

type CommunityChipsProps = {
  communities: Community[];
  selected: string | null;
  onSelect: (id: string | null) => void;
};

export function CommunityChips({ communities, selected, onSelect }: CommunityChipsProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.scroll}>
      <Animated.View entering={FadeInRight.delay(200).duration(400)} layout={Layout.springify()}>
        <InteractivePressable
          onPress={() => onSelect(null)}
          style={[
            styles.chip,
            {
              backgroundColor: !selected ? palette.accent : palette.surface,
              borderColor: !selected ? palette.accent : palette.border,
            },
            !selected ? Shadows.glow : Shadows.subtle,
          ]}>
          <IconSymbol
            name="sparkles"
            size={14}
            color={!selected ? '#FFF' : palette.muted}
          />
          <ThemedText
            type="defaultSemiBold"
            style={{
              fontSize: 13,
              color: !selected ? '#FFF' : palette.text,
            }}>
            全部
          </ThemedText>
        </InteractivePressable>
      </Animated.View>

      {communities.map((c, i) => {
        const isActive = selected === c.id;
        return (
          <Animated.View
            key={c.id}
            entering={FadeInRight.delay(260 + i * 50).duration(400)}
            layout={Layout.springify()}>
            <InteractivePressable
              onPress={() => onSelect(c.id)}
              style={[
                styles.chip,
                {
                  backgroundColor: isActive ? c.themeColor : palette.surface,
                  borderColor: isActive ? c.themeColor : palette.border,
                },
                isActive ? Shadows.soft : Shadows.subtle,
              ]}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: isActive ? '#FFF' : c.themeColor },
                ]}
              />
              <ThemedText
                type="defaultSemiBold"
                style={{
                  fontSize: 13,
                  color: isActive ? '#FFF' : palette.text,
                }}>
                {c.name}
              </ThemedText>
            </InteractivePressable>
          </Animated.View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Radii.pill,
    borderWidth: 1,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
});
