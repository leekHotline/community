import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { InteractivePressable } from '@/components/ui/animated-pressable';
import { FloatingOrb } from '@/components/ui/floating-orb';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { Radii, Shadows, Spacing } from '@/constants/ui';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getCommunities } from '@/lib/api';
import type { Community } from '@/lib/types';

const TEMPLATE_CARDS = [
  {
    id: 't-1',
    title: '周末徒步社群',
    description: '路线 + 装备清单 + 聚会节奏',
  },
  {
    id: 't-2',
    title: '摄影作品集',
    description: '主题挑战 + 作品墙 + 展览活动',
  },
  {
    id: 't-3',
    title: '运动打卡营',
    description: '训练计划 + 每日打卡 + 成员排行',
  },
];

const FALLBACK_COMMUNITIES: Community[] = [
  {
    id: 'c-1',
    name: 'Hiking',
    description: 'Trail stories and weekend routes',
    icon: null,
    themeColor: '#22C55E',
    createdBy: 'system',
    createdAt: '2026-02-02T12:00:00.000Z',
  },
  {
    id: 'c-2',
    name: 'Photography',
    description: 'Light, shadow, and frame',
    icon: null,
    themeColor: '#3B82F6',
    createdBy: 'system',
    createdAt: '2026-02-02T12:00:00.000Z',
  },
  {
    id: 'c-3',
    name: 'Cycling',
    description: 'Routes, gear, and cadence',
    icon: null,
    themeColor: '#F97316',
    createdBy: 'system',
    createdAt: '2026-02-02T12:00:00.000Z',
  },
  {
    id: 'c-4',
    name: '陶艺',
    description: '手作与灵感练习',
    icon: null,
    themeColor: '#A855F7',
    createdBy: 'system',
    createdAt: '2026-02-02T12:00:00.000Z',
  },
];

export default function ExploreScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadCommunities = useCallback(async () => {
    setError(null);
    try {
      const response = await getCommunities();
      setCommunities(response);
    } catch {
      setError('后端接口暂时不可用，已展示示例社区。');
      setCommunities(FALLBACK_COMMUNITIES);
    }
  }, []);

  useEffect(() => {
    loadCommunities();
  }, [loadCommunities]);

  const displayCommunities = useMemo(
    () => (communities.length ? communities : FALLBACK_COMMUNITIES),
    [communities]
  );

  return (
    <ThemedView style={styles.page} variant="background">
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: Spacing.xl + insets.top }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.ambientLayer} pointerEvents="none">
          <FloatingOrb size={180} color={palette.accentSoft} style={{ top: -20, left: -40 }} />
          <FloatingOrb size={140} color={palette.accent} style={{ top: 120, right: -30 }} delay={600} />
        </View>

        <Animated.View entering={FadeInUp.duration(500)}>
          <ThemedText type="label" style={{ color: palette.muted }}>
            Community Studio
          </ThemedText>
          <ThemedText type="display" style={styles.title}>
            把模板变成品牌
          </ThemedText>
          <ThemedText type="default" style={{ color: palette.muted }}>
            快速配置主题、内容流和互动节奏，让社区自带增长力。
          </ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(120).duration(500)} style={styles.ctaRow}>
          <InteractivePressable style={[styles.primaryCta, { backgroundColor: palette.accent }]}>
            <IconSymbol name="sparkles" size={18} color={palette.background} />
            <ThemedText type="defaultSemiBold" style={{ color: palette.background }}>
              创建社区
            </ThemedText>
          </InteractivePressable>
          <InteractivePressable
            style={[styles.secondaryCta, { borderColor: palette.border }]}
            scaleTo={0.96}>
            <IconSymbol name="square.and.arrow.up" size={18} color={palette.text} />
            <ThemedText type="defaultSemiBold">分享模板</ThemedText>
          </InteractivePressable>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.sectionHeader}>
          <ThemedText type="headline">模板推荐</ThemedText>
          <ThemedText type="caption" style={{ color: palette.muted }}>
            三步即可发布
          </ThemedText>
        </Animated.View>
        <View style={styles.templateGrid}>
          {TEMPLATE_CARDS.map((card) => (
            <InteractivePressable
              key={card.id}
              style={[
                styles.templateCard,
                { backgroundColor: palette.surface, borderColor: palette.border },
              ]}>
              <ThemedText type="defaultSemiBold">{card.title}</ThemedText>
              <ThemedText type="caption" style={{ color: palette.muted }}>
                {card.description}
              </ThemedText>
            </InteractivePressable>
          ))}
        </View>

        <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.sectionHeader}>
          <ThemedText type="headline">热门社区</ThemedText>
          <ThemedText type="caption" style={{ color: palette.muted }}>
            当前活跃
          </ThemedText>
        </Animated.View>
        <View style={styles.communityGrid}>
          {displayCommunities.map((community) => (
            <InteractivePressable
              key={community.id}
              style={[
                styles.communityCard,
                { backgroundColor: palette.surface, borderColor: palette.border },
              ]}>
              <View style={[styles.communityIcon, { backgroundColor: community.themeColor }]} />
              <View style={styles.communityMeta}>
                <ThemedText type="defaultSemiBold">{community.name}</ThemedText>
                <ThemedText type="caption" style={{ color: palette.muted }}>
                  {community.description}
                </ThemedText>
              </View>
              <IconSymbol name="chevron.right" size={18} color={palette.muted} />
            </InteractivePressable>
          ))}
        </View>

        {error ? (
          <View style={[styles.toast, { backgroundColor: palette.surface, borderColor: palette.border }]}>
            <IconSymbol name="bolt.fill" size={14} color={palette.accent} />
            <ThemedText type="caption" style={{ color: palette.muted }}>
              {error}
            </ThemedText>
          </View>
        ) : null}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.lg,
  },
  ambientLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    marginTop: 6,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  primaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: Radii.pill,
    ...Shadows.soft,
  },
  secondaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: Radii.pill,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  templateGrid: {
    gap: Spacing.sm,
  },
  templateCard: {
    padding: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 1,
    gap: 6,
    ...Shadows.soft,
  },
  communityGrid: {
    gap: Spacing.sm,
  },
  communityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 1,
    ...Shadows.soft,
  },
  communityIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  communityMeta: {
    flex: 1,
    gap: 2,
  },
  toast: {
    marginTop: Spacing.md,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: Radii.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
