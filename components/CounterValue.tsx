import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, type ColorValue } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { fonts } from '@/lib/theme';

/**
 * How the numbers change: 'flip' turns like an airport split-flap board,
 * 'roll' slides the old number up and the new one in from below, like an odometer.
 */
export const COUNTER_ANIMATION: 'flip' | 'roll' = 'flip';

const HEIGHT = 40;
const HALF = HEIGHT / 2;
const DURATION = 600;

type Props = {
  value: string;
  color: ColorValue;
  /** Tile color: each flap is painted with it to hide what is behind. */
  background: ColorValue;
  /** Line across the middle of the tile, where a split-flap card folds. */
  seam: ColorValue;
  fontSize: number;
};

/** A number that animates each time it changes, in the COUNTER_ANIMATION style. */
export function CounterValue({ value, ...style }: Props) {
  // Remember the value being replaced, to animate from it.
  const [pair, setPair] = useState({ from: value, to: value });
  if (pair.to !== value) setPair({ from: pair.to, to: value });
  // A new key per change, so each animation mounts already at its starting position.
  const key = `${pair.from}→${pair.to}`;

  if (COUNTER_ANIMATION === 'roll') {
    return (
      <View style={[styles.box, styles.clip]}>
        <Roll key={key} from={pair.from} to={pair.to} {...style} />
      </View>
    );
  }
  return (
    <View style={styles.box}>
      <Flip key={key} from={pair.from} to={pair.to} {...style} />
      <View style={[styles.seam, { backgroundColor: style.seam }]} />
    </View>
  );
}

type ChangeProps = Omit<Props, 'value' | 'seam'> & { from: string; to: string };

/** Runs 0 → 1 once when the value changed; stays at 1 otherwise or with reduced motion. */
function useChangeProgress(from: string, to: string) {
  const reduceMotion = useReducedMotion();
  const animate = from !== to && !reduceMotion;
  const progress = useSharedValue(animate ? 0 : 1);

  useEffect(() => {
    if (animate) progress.value = withTiming(1, { duration: DURATION, easing: Easing.inOut(Easing.quad) });
  }, [animate, progress]);

  return progress;
}

function Roll({ from, to, color, fontSize }: ChangeProps) {
  const progress = useChangeProgress(from, to);
  const leaving = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [{ translateY: -HEIGHT * progress.value }],
  }));
  const entering = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: HEIGHT * (1 - progress.value) }],
  }));

  return (
    <>
      <Animated.View style={[styles.layer, leaving]}>
        <Text style={[styles.text, { color, fontSize }]}>{from}</Text>
      </Animated.View>
      <Animated.View style={[styles.layer, entering]}>
        <Text style={[styles.text, { color, fontSize }]}>{to}</Text>
      </Animated.View>
    </>
  );
}

function Flip({ from, to, color, background, fontSize }: ChangeProps) {
  // 0 → 0.5: the old top half falls; 0.5 → 1: the new bottom half lands.
  const progress = useChangeProgress(from, to);

  const topFlap = useAnimatedStyle(() => ({
    opacity: progress.value < 0.5 ? 1 : 0,
    transform: [{ perspective: 300 }, { rotateX: `${-180 * Math.min(progress.value, 0.5)}deg` }],
  }));
  const bottomFlap = useAnimatedStyle(() => ({
    opacity: progress.value >= 0.5 ? 1 : 0,
    transform: [{ perspective: 300 }, { rotateX: `${180 * (1 - Math.max(progress.value, 0.5))}deg` }],
  }));

  const half = { color, background, fontSize };
  return (
    <>
      <Half text={to} part="top" {...half} />
      <Half text={from} part="bottom" {...half} />
      <Animated.View style={[styles.flapTop, topFlap]}>
        <Half text={from} part="top" {...half} />
      </Animated.View>
      <Animated.View style={[styles.flapBottom, bottomFlap]}>
        <Half text={to} part="bottom" {...half} />
      </Animated.View>
    </>
  );
}

type HalfProps = { text: string; part: 'top' | 'bottom'; color: ColorValue; background: ColorValue; fontSize: number };

/** Shows one half of the number by clipping a full-height copy. */
function Half({ text, part, color, background, fontSize }: HalfProps) {
  return (
    <View style={[styles.half, part === 'top' ? styles.top : styles.bottom, { backgroundColor: background }]}>
      <View style={[styles.full, part === 'bottom' && styles.shiftUp]}>
        <Text style={[styles.text, { color, fontSize }]}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: '100%',
    height: HEIGHT,
  },
  clip: {
    overflow: 'hidden',
  },
  layer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  half: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: HALF,
    overflow: 'hidden',
  },
  top: {
    top: 0,
  },
  bottom: {
    top: HALF,
  },
  full: {
    height: HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shiftUp: {
    marginTop: -HALF,
  },
  text: {
    fontFamily: fonts.serif,
    lineHeight: HEIGHT,
    fontVariant: ['tabular-nums'],
  },
  // Each flap hinges on the middle line.
  flapTop: {
    ...StyleSheet.absoluteFill,
    transformOrigin: `50% ${HALF}px`,
  },
  flapBottom: {
    ...StyleSheet.absoluteFill,
    transformOrigin: `50% ${HALF}px`,
  },
  seam: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: HALF - 0.5,
    height: 1,
  },
});
