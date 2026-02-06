import { useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type FloatingOrbProps = {
  size: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  duration?: number;
  amplitude?: number;
  delay?: number;
};

export function FloatingOrb({
  size,
  color,
  style,
  duration = 6000,
  amplitude = 12,
  delay = 0,
}: FloatingOrbProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration, easing: Easing.inOut(Easing.ease), delay }),
      -1,
      true
    );
  }, [progress, duration, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [-amplitude, amplitude]) },
      { translateX: interpolate(progress.value, [0, 1], [amplitude, -amplitude]) },
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
          opacity: 0.35,
          position: 'absolute',
        },
        animatedStyle,
        style,
      ]}
    />
  );
}
