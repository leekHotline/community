import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AccentButton } from '@/components/ui/accent-button';
import { CommunityChips } from '@/components/ui/community-chips';
import { FloatingOrb } from '@/components/ui/floating-orb';
import { PostCard } from '@/components/ui/post-card';
import { SectionHeader } from '@/components/ui/section-header';
import { StatCard } from '@/components/ui/stat-card';
import { Colors, Motion } from '@/constants/theme';
import { Spacing } from '@/constants/ui';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getCommunities, getFeed, likePost, unlikePost } from '@/lib/api';
import type { Community, Post } from '@/lib/types';

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
];

const FALLBACK_POSTS: Post[] = [
  {
    id: 'p-1',
    communityId: 'c-1',
    userId: 'u-1',
    content: 'Golden hour ridge trail this weekend. Anyone in?',
    imageUrls: [],
    createdAt: '2026-02-02T12:00:00.000Z',
    likeCount: 18,
    likedByMe: false,
  },
  {
    id: 'p-2',
    communityId: 'c-2',
    userId: 'u-2',
    content: 'Shot a minimal still life set with a single softbox.',
    imageUrls: [],
    createdAt: '2026-02-02T09:45:00.000Z',
    likeCount: 9,
    likedByMe: false,
  },
  {
    id: 'p-3',
    communityId: 'c-3',
    userId: 'u-3',
    content: 'New coastal route: 42km with easy climbs and coffee stops.',
    imageUrls: [],
    createdAt: '2026-02-01T18:20:00.000Z',
    likeCount: 24,
    likedByMe: true,
  },
];

type FeedState = {
  posts: Post[];
  communities: Community[];
};

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const [feed, setFeed] = useState<FeedState>({ posts: [], communities: [] });
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [communities, posts] = await Promise.all([getCommunities(), getFeed({ limit: 20 })]);
      setFeed({ communities, posts });
    } catch {
      setError('当前无法连接后端接口，已展示示例数据。');
      setFeed({ communities: FALLBACK_COMMUNITIES, posts: FALLBACK_POSTS });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFeed = useCallback(
    async (communityId?: string, isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      try {
        const posts = await getFeed({ limit: 20, communityId });
        setFeed((prev) => ({
          communities: prev.communities.length ? prev.communities : FALLBACK_COMMUNITIES,
          posts,
        }));
      } catch {
        setError('当前无法连接后端接口，已展示示例数据。');
        setFeed((prev) => ({
          communities: prev.communities.length ? prev.communities : FALLBACK_COMMUNITIES,
          posts: FALLBACK_POSTS,
        }));
      } finally {
        setRefreshing(false);
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const displayCommunities = feed.communities.length ? feed.communities : FALLBACK_COMMUNITIES;
  const displayPosts = feed.posts.length ? feed.posts : FALLBACK_POSTS;

  const communityMap = useMemo(
    () => new Map(displayCommunities.map((community) => [community.id, community])),
    [displayCommunities]
  );

  const stats = useMemo(() => {
    const uniqueAuthors = new Set(displayPosts.map((post) => post.userId));
    return [
      { label: '今日新帖', value: displayPosts.length },
      { label: '活跃成员', value: uniqueAuthors.size },
      { label: '社区数', value: displayCommunities.length },
    ];
  }, [displayPosts, displayCommunities.length]);

  const handleSelectCommunity = useCallback(
    (id: string | null) => {
      setSelectedCommunity(id);
      loadFeed(id ?? undefined);
    },
    [loadFeed]
  );

  const handleToggleLike = useCallback(
    async (postId: string) => {
      const post = feed.posts.find((item) => item.id === postId);
      if (!post) return;
      const previousLiked = post.likedByMe;
      const previousCount = post.likeCount;

      setFeed((prev) => ({
        ...prev,
        posts: prev.posts.map((item) => {
          if (item.id !== postId) return item;
          const nextLiked = !item.likedByMe;
          return {
            ...item,
            likedByMe: nextLiked,
            likeCount: Math.max(0, item.likeCount + (nextLiked ? 1 : -1)),
          };
        }),
      }));

      try {
        if (previousLiked) {
          await unlikePost(postId);
        } else {
          await likePost(postId);
        }
      } catch {
        setFeed((prev) => ({
          ...prev,
          posts: prev.posts.map((item) =>
            item.id === postId
              ? { ...item, likedByMe: previousLiked, likeCount: previousCount }
              : item
          ),
        }));
      }
    },
    [feed.posts]
  );

  const renderHeader = useMemo(
    () => (
      <View style={[styles.headerContainer, { paddingTop: Spacing.xl + insets.top }]}>
        {/* ── 背景氛围层 ─────────────────────── */}
        <View style={styles.ambientLayer} pointerEvents="none">
          <FloatingOrb
            size={200}
            color={palette.decorPurple}
            opacity={0.5}
            style={{ top: -60, right: -50 }}
          />
          <FloatingOrb
            size={160}
            color={palette.decorBlue}
            opacity={0.4}
            style={{ top: 140, left: -40 }}
            delay={400}
          />
          <FloatingOrb
            size={120}
            color={palette.decorPink}
            opacity={0.3}
            style={{ top: 280, right: -30 }}
            delay={800}
          />
        </View>

        {/* ── Hero 区域 ──────────────────────── */}
        <Animated.View entering={FadeInUp.duration(600).springify().damping(20)}>
          <ThemedText type="caption" style={[styles.heroLabel, { color: palette.accent }]}>
            ✦ Hobby Community Kit
          </ThemedText>
          <ThemedText type="display" style={styles.heroTitle}>
            把热爱{'\n'}变成社区
          </ThemedText>
          <ThemedText type="default" style={[styles.heroSubtitle, { color: palette.muted }]}>
            轻量模板 + 社区动态，快速启动你的兴趣空间。
          </ThemedText>
        </Animated.View>

        {/* ── 操作按钮 ──────────────────────── */}
        <Animated.View
          entering={FadeInUp.delay(120).duration(500).springify().damping(18)}
          style={styles.heroActions}>
          <AccentButton icon="plus" variant="primary">
            发布动态
          </AccentButton>
          <AccentButton icon="magnifyingglass" variant="secondary">
            搜索
          </AccentButton>
        </Animated.View>

        {/* ── 统计卡片 ──────────────────────── */}
        <View style={styles.statsRow}>
          {stats.map((stat, i) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              delay={200 + i * 80}
            />
          ))}
        </View>

        {/* ── 社区筛选 ──────────────────────── */}
        <SectionHeader title="社区" action="查看全部" />
      </View>
    ),
    [palette, stats, insets.top]
  );

  const renderChips = useMemo(
    () => (
      <CommunityChips
        communities={displayCommunities}
        selected={selectedCommunity}
        onSelect={handleSelectCommunity}
      />
    ),
    [displayCommunities, selectedCommunity, handleSelectCommunity]
  );

  const renderFeedHeader = useMemo(
    () => (
      <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.md }}>
        <SectionHeader title="最新动态" subtitle="即刻看到灵感" />
      </View>
    ),
    []
  );

  const renderPost = useCallback(
    ({ item, index }: { item: Post; index: number }) => (
      <PostCard
        post={item}
        community={communityMap.get(item.communityId)}
        index={index}
        onLike={handleToggleLike}
      />
    ),
    [communityMap, handleToggleLike]
  );

  return (
    <ThemedView style={styles.page} variant="background">
      <FlatList
        data={displayPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        ListHeaderComponent={
          <>
            {renderHeader}
            {renderChips}
            {renderFeedHeader}
          </>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadFeed(selectedCommunity ?? undefined, true)}
            tintColor={palette.accent}
            colors={[palette.accent]}
          />
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator color={palette.accent} size="small" />
              <ThemedText type="caption" style={{ color: palette.muted }}>
                正在加载社区动态…
              </ThemedText>
            </View>
          ) : null
        }
      />

      {/* ── Toast 提示 ──────────────────────── */}
      {error ? (
        <Animated.View
          entering={FadeIn.duration(300)}
          style={[
            styles.toast,
            { backgroundColor: palette.surface, borderColor: palette.border },
          ]}>
          <ThemedText type="caption" style={{ color: palette.muted }}>
            ⚡ {error}
          </ThemedText>
        </Animated.View>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  listContent: {
    paddingBottom: Spacing.xxxl,
  },
  headerContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
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
  heroTitle: {
    marginTop: 4,
    lineHeight: 44,
  },
  heroSubtitle: {
    marginTop: 10,
    maxWidth: 280,
    lineHeight: 22,
    fontSize: 15,
  },
  heroActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  emptyState: {
    paddingTop: Spacing.xxl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  toast: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    bottom: Spacing.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
});
