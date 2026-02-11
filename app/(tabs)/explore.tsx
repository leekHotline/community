import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AccentButton } from '@/components/ui/accent-button';
import { FloatingOrb } from '@/components/ui/floating-orb';
import { GlassCard } from '@/components/ui/glass-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { InteractivePressable } from '@/components/ui/animated-pressable';
import { SectionHeader } from '@/components/ui/section-header';
import { StaggerList } from '@/components/ui/stagger-list';
import { Colors, Motion } from '@/constants/theme';
import { Radii, Shadows, Spacing } from '@/constants/ui';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getCommunities } from '@/lib/api';
import type { Community } from '@/lib/types';

const TEMPLATE_CARDS = [
  {
    id: 't-1',
    emoji: '🏔️',
    title: '周末徒步社群',
    description: '路线 + 装备清单 + 聚会节奏',
  },
  {
    id: 't-2',
    emoji: '📸',
    title: '摄影作品集',
    description: '主题挑战 + 作品墙 + 展览活动',
  },
  {
    id: 't-3',
    emoji: '🏃',
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
        {/* ── 背景氛围层 ─────────────────────── */}
        <View style={styles.ambientLayer} pointerEvents="none">
          <FloatingOrb
            size={220}
            color={palette.decorPurple}
            opacity={0.5}
            style={{ top: -30, left: -50 }}
          />
          <FloatingOrb
            size={160}
            color={palette.decorBlue}
            opacity={0.4}
            style={{ top: 160, right: -40 }}
            delay={600}
          />
        </View>

        {/* ── Hero 区域 ──────────────────────── */}
        <Animated.View entering={FadeInUp.duration(600).springify().damping(20)}>
          <ThemedText type="caption" style={[styles.heroLabel, { color: palette.accent }]}>
            ✦ Community Studio
          </ThemedText>
          <ThemedText type="display" style={styles.title}>
            把模板{'\n'}变成品牌
          </ThemedText>
          <ThemedText type="default" style={[styles.subtitle, { color: palette.muted }]}>
            快速配置主题、内容流和互动节奏，让社区自带增长力。
          </ThemedText>
        </Animated.View>

        {/* ── 操作按钮 ──────────────────────── */}
        <Animated.View
          entering={FadeInUp.delay(120).duration(500).springify().damping(18)}
          style={styles.ctaRow}>
          <AccentButton icon="sparkles" variant="primary">
            创建社区
          </AccentButton>
          <AccentButton icon="square.and.arrow.up" variant="secondary">
            分享模板
          </AccentButton>
        </Animated.View>

        {/* ── 模板推荐 ──────────────────────── */}
        <SectionHeader title="模板推荐" subtitle="三步即可发布" />
        <StaggerList stagger={80} initialDelay={200} style={styles.templateGrid}>
          {TEMPLATE_CARDS.map((card) => (
            <GlassCard key={card.id} style={styles.templateCard} animate={false}>
              <View style={styles.templateContent}>
                <View
                  style={[
                    styles.templateIcon,
                    { backgroundColor: palette.accentSoft },
                  ]}>
                  <ThemedText style={{ fontSize: 20 }}>{card.emoji}</ThemedText>
                </View>
                <View style={styles.templateMeta}>
                  <ThemedText type="defaultSemiBold" style={{ fontSize: 15 }}>
                    {card.title}
                  </ThemedText>
                  <ThemedText type="caption" style={{ color: palette.muted }}>
                    {card.description}
                  </ThemedText>
                </View>
                <IconSymbol name="chevron.right" size={14} color={palette.muted} />
              </View>
            </GlassCard>
          ))}
        </StaggerList>

        {/* ── 热门社区 ──────────────────────── */}
        <SectionHeader title="热门社区" subtitle="当前活跃" style={{ marginTop: Spacing.md }} />
        <StaggerList stagger={70} initialDelay={400} style={styles.communityGrid}>
          {displayCommunities.map((community) => (
            <InteractivePressable key={community.id} scaleTo={0.97}>
              <GlassCard style={styles.communityCard} animate={false}>
                <View style={styles.communityCardInner}>
                  <View
                    style={[
                      styles.communityIcon,
                      { backgroundColor: community.themeColor },
                    ]}>
                    <ThemedText style={styles.communityEmoji}>
                      {community.name[0]}
                    </ThemedText>
                  </View>
                  <View style={styles.communityMeta}>
                    <ThemedText type="defaultSemiBold" style={{ fontSize: 15 }}>
                      {community.name}
                    </ThemedText>
                    <ThemedText type="caption" style={{ color: palette.muted }}>
                      {community.description}
                    </ThemedText>
                  </View>
                  <View style={[styles.joinBtn, { backgroundColor: palette.accentSoft }]}>
                    <ThemedText type="caption" style={{ color: palette.accent, fontWeight: '600' }}>
                      加入
                    </ThemedText>
                  </View>
                </View>
              </GlassCard>
            </InteractivePressable>
          ))}
        </StaggerList>

        {/* ── 错误提示 ──────────────────────── */}
        {error ? (
          <View
            style={[
              styles.toast,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            <ThemedText type="caption" style={{ color: palette.muted }}>
              ⚡ {error}
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
    paddingBottom: Spacing.xxxl,
    gap: Spacing.lg,
  },
  ambientLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    marginTop: 4,
    lineHeight: 44,
  },
  subtitle: {
    marginTop: 10,
    maxWidth: 300,
    lineHeight: 22,
    fontSize: 15,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  templateGrid: {
    gap: Spacing.sm,
  },
  templateCard: {
    padding: Spacing.md,
  },
  templateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  templateIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateMeta: {
    flex: 1,
    gap: 2,
  },
  communityGrid: {
    gap: Spacing.sm,
  },
  communityCard: {
    padding: Spacing.md,
  },
  communityCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  communityIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  communityEmoji: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  communityMeta: {
    flex: 1,
    gap: 2,
  },
  joinBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radii.pill,
  },
  toast: {
    marginTop: Spacing.md,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: Radii.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
