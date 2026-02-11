/**
 * 帖子卡片 — 毛玻璃卡片 + 动画
 */
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { InteractivePressable } from './animated-pressable';
import { GlassCard } from './glass-card';
import { IconSymbol } from './icon-symbol';
import { Colors, Motion } from '@/constants/theme';
import { Radii, Spacing } from '@/constants/ui';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Community, Post } from '@/lib/types';

type PostCardProps = {
  post: Post;
  community?: Community;
  index: number;
  onLike: (id: string) => void;
};

export function PostCard({ post, community, index, onLike }: PostCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const delay = 100 + index * Motion.duration.stagger;

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(500).springify().damping(18)}
      layout={Layout.springify()}>
      <GlassCard
        style={styles.card}
        animate={false}
        radius={Radii.xl}>
        {/* 帖子头部 */}
        <View style={styles.header}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: community?.themeColor ?? palette.accentSoft },
            ]}>
            <ThemedText type="defaultSemiBold" style={styles.avatarText}>
              {(community?.name ?? '社')[0]}
            </ThemedText>
          </View>
          <View style={styles.meta}>
            <ThemedText type="defaultSemiBold" style={{ fontSize: 14 }}>
              {community?.name ?? '社区'}
            </ThemedText>
            <ThemedText type="caption" style={{ color: palette.muted, fontSize: 12 }}>
              {formatRelative(post.createdAt)}
            </ThemedText>
          </View>
          <InteractivePressable scaleTo={0.9}>
            <IconSymbol name="ellipsis" size={16} color={palette.muted} />
          </InteractivePressable>
        </View>

        {/* 帖子内容 */}
        <ThemedText type="default" style={styles.content}>
          {post.content}
        </ThemedText>

        {/* 操作栏 */}
        <View style={styles.actions}>
          <InteractivePressable
            style={[
              styles.likeBtn,
              {
                backgroundColor: post.likedByMe ? palette.accentSoft : 'transparent',
                borderColor: post.likedByMe ? palette.accent : palette.border,
              },
            ]}
            onPress={() => onLike(post.id)}
            scaleTo={0.9}>
            <IconSymbol
              name={post.likedByMe ? 'heart.fill' : 'heart'}
              size={16}
              color={post.likedByMe ? palette.accent : palette.muted}
            />
            <ThemedText
              type="caption"
              style={{
                color: post.likedByMe ? palette.accent : palette.muted,
                fontWeight: '600',
              }}>
              {post.likeCount}
            </ThemedText>
          </InteractivePressable>

          <View style={styles.actionRight}>
            <IconSymbol name="bubble.left" size={14} color={palette.muted} />
            <ThemedText type="caption" style={{ color: palette.muted }}>
              讨论
            </ThemedText>
          </View>
        </View>
      </GlassCard>
    </Animated.View>
  );
}

function formatRelative(dateString: string) {
  const date = new Date(dateString);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}天前`;
  return date.toLocaleDateString();
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 13,
  },
  meta: {
    flex: 1,
    gap: 1,
  },
  content: {
    fontSize: 15,
    lineHeight: 23,
    marginBottom: Spacing.md,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    borderWidth: 1,
  },
  actionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});
