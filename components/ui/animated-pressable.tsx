/**
 * 可交互按钮 — 带缩放弹性动画
 * 替代原有的 InteractivePressable，增强动画表现力
 */
import { PropsWithChildren } from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Motion } from '@/constants/theme';

type AnimatedPressableProps = PropsWithChildren<
  PressableProps & {
    style?: StyleProp<ViewStyle>;
    scaleTo?: number;
    enableHover?: boolean;
  }
>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function InteractivePressable({
  children,
  style,
  scaleTo = Motion.scale.pressed,
  enableHover = true,
  ...props
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedPressable
      {...props}
      onPressIn={(event) => {
        scale.value = withTiming(scaleTo, { duration: Motion.duration.instant });
        opacity.value = withTiming(0.85, { duration: Motion.duration.instant });
        props.onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.value = withSpring(1, Motion.spring.bouncy);
        opacity.value = withSpring(1, Motion.spring.gentle);
        props.onPressOut?.(event);
      }}
      style={[style, animatedStyle]}>
      {children}
    </AnimatedPressable>
  );
}
