/**
 * 交错入场动画容器
 * 子元素依次进入，形成节奏感
 */
import { Children, PropsWithChildren, cloneElement, isValidElement, useEffect, useState } from 'react';
import { View, ViewProps } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  Layout,
  SlideInRight,
} from 'react-native-reanimated';

import { Motion } from '@/constants/theme';

type Direction = 'up' | 'down' | 'right';

type StaggerListProps = PropsWithChildren<
  ViewProps & {
    /** 交错间隔 ms */
    stagger?: number;
    /** 入场方向 */
    direction?: Direction;
    /** 初始延迟 ms */
    initialDelay?: number;
    /** 动画持续 ms */
    duration?: number;
    /** 是否启用 */
    enabled?: boolean;
  }
>;

const getEntering = (direction: Direction, delay: number, duration: number) => {
  switch (direction) {
    case 'up':
      return FadeInUp.delay(delay).duration(duration).springify().damping(18).stiffness(120);
    case 'right':
      return SlideInRight.delay(delay).duration(duration).springify().damping(18);
    default:
      return FadeInDown.delay(delay).duration(duration).springify().damping(18).stiffness(120);
  }
};

export function StaggerList({
  children,
  stagger = Motion.duration.stagger,
  direction = 'down',
  initialDelay = 0,
  duration = Motion.duration.entrance,
  enabled = true,
  style,
  ...props
}: StaggerListProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!enabled || !mounted) {
    return (
      <View style={style} {...props}>
        {children}
      </View>
    );
  }

  return (
    <View style={style} {...props}>
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;

        const delay = initialDelay + index * stagger;
        const entering = getEntering(direction, delay, duration);

        return (
          <Animated.View key={index} entering={entering} layout={Layout.springify()}>
            {child}
          </Animated.View>
        );
      })}
    </View>
  );
}
