import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AccentButton } from '@/components/ui/accent-button';
import { GlassCard } from '@/components/ui/glass-card';
import { FloatingOrb } from '@/components/ui/floating-orb';
import { Colors } from '@/constants/theme';
import { Spacing } from '@/constants/ui';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ModalScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <ThemedView style={styles.container} variant="background">
      {/* 背景氛围 */}
      <View style={styles.ambientLayer} pointerEvents="none">
        <FloatingOrb
          size={180}
          color={palette.decorPurple}
          opacity={0.4}
          style={{ top: 40, right: -40 }}
        />
        <FloatingOrb
          size={120}
          color={palette.decorBlue}
          opacity={0.3}
          style={{ bottom: 100, left: -30 }}
          delay={500}
        />
      </View>

      <Animated.View
        entering={SlideInDown.duration(600).springify().damping(18)}
        style={styles.cardWrapper}>
        <GlassCard style={styles.card}>
          <View style={styles.cardContent}>
            <Animated.View
              entering={FadeIn.delay(200).duration(400)}
              style={styles.iconCircle}>
              <ThemedText style={styles.emoji}>✨</ThemedText>
            </Animated.View>

            <Animated.View entering={FadeIn.delay(300).duration(400)}>
              <ThemedText type="title" style={styles.title}>
                弹出视图
              </ThemedText>
              <ThemedText
                type="default"
                style={[styles.description, { color: palette.muted }]}>
                这是一个模态页面。你可以在这里添加任何交互内容。
              </ThemedText>
            </Animated.View>

            <Animated.View entering={FadeIn.delay(400).duration(400)} style={styles.actions}>
              <Link href="/" dismissTo asChild>
                <AccentButton variant="primary">
                  返回首页
                </AccentButton>
              </Link>
            </Animated.View>
          </View>
        </GlassCard>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  ambientLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 360,
  },
  card: {
    padding: Spacing.xl,
  },
  cardContent: {
    alignItems: 'center',
    gap: Spacing.lg,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(108,92,231,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 28,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginTop: 6,
    fontSize: 14,
    lineHeight: 22,
  },
  actions: {
    marginTop: Spacing.sm,
  },
});
