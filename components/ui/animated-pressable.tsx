import { PropsWithChildren } from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type AnimatedPressableProps = PropsWithChildren<
  PressableProps & {
    style?: StyleProp<ViewStyle>;
    scaleTo?: number;
  }
>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function InteractivePressable({ children, style, scaleTo = 0.98, ...props }: AnimatedPressableProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      {...props}
      onPressIn={(event) => {
        scale.value = withTiming(scaleTo, { duration: 120 });
        props.onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.value = withSpring(1, { damping: 14, stiffness: 180 });
        props.onPressOut?.(event);
      }}
      style={[style, animatedStyle]}>
      {children}
    </AnimatedPressable>
  );
}
