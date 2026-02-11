/**
 * 渐变装饰球 — 浮动的背景氛围装饰
 * 改进版：更柔和的运动轨迹 + 呼吸缩放
 */
import { useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type FloatingOrbProps = {
  size: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  duration?: number;
  amplitude?: number;
  delay?: number;
  opacity?: number;
};

export function FloatingOrb({
  size,
  color,
  style,
  duration = 8000,
  amplitude = 16,
  delay = 0,
  opacity = 0.25,
}: FloatingOrbProps) {
  const progress = useSharedValue(0);
  const scaleValue = useSharedValue(1);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );

    scaleValue.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: duration * 0.6, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.95, { duration: duration * 0.4, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [progress, scaleValue, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(progress.value, [0, 0.5, 1], [-amplitude, amplitude * 0.5, -amplitude]) },
      { translateX: interpolate(progress.value, [0, 0.3, 0.7, 1], [0, amplitude * 0.7, -amplitude * 0.3, 0]) },
      { scale: scaleValue.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity,
          position: 'absolute',
        },
        animatedStyle,
        style,
      ]}
    />
  );
}
