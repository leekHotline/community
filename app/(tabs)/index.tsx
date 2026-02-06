import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { InteractivePressable } from '@/components/ui/animated-pressable';
import { FloatingOrb } from '@/components/ui/floating-orb';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { Radii, Shadows, Spacing } from '@/constants/ui';
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
              ? {
                  ...item,
                  likedByMe: previousLiked,
                  likeCount: previousCount,
                }
              : item
          ),
        }));
        setError('点赞同步失败，稍后会自动重试。');
      }
    },
    [feed.posts]
  );

  const renderHeader = useMemo(
    () => (
      <View style={[styles.headerContainer, { paddingTop: Spacing.xl + insets.top }]}>
        <View style={styles.ambientLayer} pointerEvents="none">
          <FloatingOrb size={140} color={palette.accentSoft} style={{ top: -40, right: -20 }} />
          <FloatingOrb
            size={120}
            color={palette.accent}
            style={{ top: 120, left: -30, opacity: 0.2 }}
            delay={400}
          />
          <FloatingOrb
            size={160}
            color={palette.icon}
            style={{ top: 220, right: -60, opacity: 0.15 }}
            delay={800}
          />
        </View>

        <Animated.View entering={FadeInUp.duration(500)}>
          <ThemedText type="label" style={{ color: palette.muted }}>
            Hobby Community Kit
          </ThemedText>
          <ThemedText type="display" style={styles.heroTitle}>
            把热爱变成社区
          </ThemedText>
          <ThemedText type="default" style={[styles.heroSubtitle, { color: palette.muted }]}>
            轻量模板 + 社区动态，快速启动你的兴趣空间。
          </ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(120).duration(500)} style={styles.heroActions}>
          <InteractivePressable style={[styles.primaryButton, { backgroundColor: palette.accent }]}>
            <IconSymbol name="plus" size={18} color={palette.background} />
            <ThemedText type="defaultSemiBold" style={[styles.primaryButtonText, { color: palette.background }]}>
              发布动态
            </ThemedText>
          </InteractivePressable>
          <InteractivePressable
            style={[styles.secondaryButton, { borderColor: palette.border }]}
            scaleTo={0.96}>
            <IconSymbol name="magnifyingglass" size={18} color={palette.text} />
            <ThemedText type="defaultSemiBold">搜索</ThemedText>
          </InteractivePressable>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(220).duration(500)} style={styles.statsRow}>
          {stats.map((stat) => (
            <View
              key={stat.label}
              style={[
                styles.statCard,
                { borderColor: palette.border, backgroundColor: palette.surface },
              ]}>
              <ThemedText type="headline">{stat.value}</ThemedText>
              <ThemedText type="caption" style={{ color: palette.muted }}>
                {stat.label}
              </ThemedText>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(320).duration(500)} style={styles.sectionHeader}>
          <ThemedText type="headline">社区</ThemedText>
          <ThemedText type="link">查看全部</ThemedText>
        </Animated.View>
        <View style={styles.communityRow}>
          <InteractivePressable
            onPress={() => handleSelectCommunity(null)}
            style={[
              styles.communityChip,
              {
                backgroundColor: selectedCommunity ? palette.card : palette.accentSoft,
                borderColor: palette.border,
              },
            ]}>
            <IconSymbol name="sparkles" size={16} color={palette.text} />
            <ThemedText type="defaultSemiBold">全部</ThemedText>
          </InteractivePressable>
          {displayCommunities.map((community) => {
            const isActive = selectedCommunity === community.id;
            return (
              <InteractivePressable
                key={community.id}
                onPress={() => handleSelectCommunity(community.id)}
                style={[
                  styles.communityChip,
                  {
                    backgroundColor: isActive ? community.themeColor : palette.card,
                    borderColor: palette.border,
                  },
                ]}>
                <View
                  style={[
                    styles.communityDot,
                    { backgroundColor: isActive ? palette.background : community.themeColor },
                  ]}
                />
                <ThemedText
                  type="defaultSemiBold"
                  style={{ color: isActive ? palette.background : palette.text }}>
                  {community.name}
                </ThemedText>
              </InteractivePressable>
            );
          })}
        </View>

        <Animated.View entering={FadeInUp.delay(420).duration(500)} style={styles.sectionHeader}>
          <ThemedText type="headline">最新动态</ThemedText>
          <ThemedText type="caption" style={{ color: palette.muted }}>
            即刻看到灵感
          </ThemedText>
        </Animated.View>
      </View>
    ),
    [
      displayCommunities,
      handleSelectCommunity,
      palette.accent,
      palette.accentSoft,
      palette.background,
      palette.border,
      palette.card,
      palette.icon,
      palette.muted,
      palette.surface,
      palette.text,
      selectedCommunity,
      stats,
      insets.top,
    ]
  );

  const renderPost = useCallback(
    ({ item, index }: { item: Post; index: number }) => (
      <Animated.View
        entering={FadeInDown.delay(120 + index * 60).duration(450)}
        layout={Layout.springify()}
        style={[styles.postCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <View style={styles.postHeader}>
          <View style={[styles.postAvatar, { backgroundColor: palette.accentSoft }]}>
            <IconSymbol name="person.2.fill" size={16} color={palette.accent} />
          </View>
          <View style={styles.postMeta}>
            <ThemedText type="defaultSemiBold">
              {communityMap.get(item.communityId)?.name ?? '社区'}
            </ThemedText>
            <ThemedText type="caption" style={{ color: palette.muted }}>
              {formatRelative(item.createdAt)}
            </ThemedText>
          </View>
          <IconSymbol name="ellipsis" size={18} color={palette.muted} />
        </View>

        <ThemedText type="default" style={styles.postContent}>
          {item.content}
        </ThemedText>

        <View style={styles.postActions}>
          <InteractivePressable
            style={[
              styles.likeButton,
              { backgroundColor: item.likedByMe ? palette.accentSoft : palette.card },
            ]}
            onPress={() => handleToggleLike(item.id)}>
            <IconSymbol
              name={item.likedByMe ? 'heart.fill' : 'heart'}
              size={18}
              color={item.likedByMe ? palette.accent : palette.muted}
            />
            <ThemedText type="defaultSemiBold">{item.likeCount}</ThemedText>
          </InteractivePressable>
          <View style={styles.postActionMeta}>
            <IconSymbol name="bubble.left.and.bubble.right.fill" size={16} color={palette.muted} />
            <ThemedText type="caption" style={{ color: palette.muted }}>
              讨论区开放中
            </ThemedText>
          </View>
        </View>
      </Animated.View>
    ),
    [communityMap, handleToggleLike, palette]
  );

  return (
    <ThemedView style={styles.page} variant="background">
      <FlatList
        data={displayPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadFeed(selectedCommunity ?? undefined, true)}
            tintColor={palette.accent}
          />
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator color={palette.accent} />
              <ThemedText type="caption" style={{ color: palette.muted }}>
                正在加载社区动态
              </ThemedText>
            </View>
          ) : null
        }
      />
      {error ? (
        <View style={[styles.toast, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <IconSymbol name="bolt.fill" size={14} color={palette.accent} />
          <ThemedText type="caption" style={{ color: palette.muted }}>
            {error}
          </ThemedText>
        </View>
      ) : null}
    </ThemedView>
  );
}

function formatRelative(dateString: string) {
  const date = new Date(dateString);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} 天前`;
  return date.toLocaleDateString();
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
  headerContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.lg,
  },
  ambientLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  heroTitle: {
    marginTop: 6,
  },
  heroSubtitle: {
    marginTop: 8,
    maxWidth: 280,
  },
  heroActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: Radii.pill,
    ...Shadows.soft,
  },
  primaryButtonText: {
    fontSize: 15,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: Radii.pill,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    padding: Spacing.sm,
    borderRadius: Radii.md,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  communityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  communityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Radii.pill,
    borderWidth: 1,
  },
  communityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  postCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radii.lg,
    borderWidth: 1,
    ...Shadows.soft,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: Spacing.sm,
  },
  postAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postMeta: {
    flex: 1,
    gap: 2,
  },
  postContent: {
    marginBottom: Spacing.md,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radii.pill,
  },
  postActionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emptyState: {
    paddingTop: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  toast: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    bottom: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: Radii.lg,
    borderWidth: 1,
    ...Shadows.soft,
  },
});
