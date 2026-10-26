import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import Svg, { Path, Rect } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';

import { fonts, useTheme } from '@/lib/theme';

const ICON = 132;

type Props = {
  /** Starts the animation once the app underneath is ready to be revealed. */
  ready: boolean;
  onFinish: () => void;
};

/**
 * Same composition as the native splash (assets/splash-icon.png), so hiding the
 * native one is seamless. Then the lock opens, the letter rises and the
 * terracotta background fades to reveal the Home. With reduced motion, only the fade.
 */
export function AnimatedSplash({ ready, onFinish }: Props) {
  const t = useTheme();
  const reduceMotion = useReducedMotion();
  const shackle = useSharedValue(0);
  const letter = useSharedValue(0);
  const cover = useSharedValue(1);

  useEffect(() => {
    if (!ready) return;
    const done = (finished?: boolean) => {
      'worklet';
      if (finished) scheduleOnRN(onFinish);
    };
    if (reduceMotion) {
      cover.value = withDelay(300, withTiming(0, { duration: 500 }, done));
      return;
    }
    shackle.value = withDelay(450, withTiming(1, { duration: 450, easing: Easing.bezier(0.3, 1.4, 0.5, 1) }));
    letter.value = withDelay(900, withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) }));
    cover.value = withDelay(1300, withTiming(0, { duration: 500, easing: Easing.inOut(Easing.ease) }, done));
  }, [ready, reduceMotion, shackle, letter, cover, onFinish]);

  const shackleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -4 * shackle.value * (ICON / 120) }, { rotate: `${-28 * shackle.value}deg` }],
  }));
  const letterStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -6 * letter.value * (ICON / 120) }],
  }));
  const coverStyle = useAnimatedStyle(() => ({ opacity: cover.value }));

  const stroke = { stroke: t.splashIcon, strokeWidth: 4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.cover, { backgroundColor: t.splashBg }, coverStyle]}>
      <View style={styles.icon} accessibilityLabel="Cápsula do Tempo">
        {/* Letter sits behind the box, so it can rise out of it. */}
        <Animated.View style={[StyleSheet.absoluteFill, letterStyle]}>
          <Svg width={ICON} height={ICON} viewBox="0 0 120 120">
            <Path d="M34 50V30a4 4 0 0 1 4-4h44a4 4 0 0 1 4 4v20" {...stroke} />
            <Path d="M46 36h28M46 43h18" {...stroke} />
          </Svg>
        </Animated.View>
        <Svg width={ICON} height={ICON} viewBox="0 0 120 120" style={StyleSheet.absoluteFill}>
          <Rect x={20} y={50} width={80} height={50} rx={10} {...stroke} fill={t.splashBg} />
          <Path d="M20 62h80" {...stroke} />
          <Rect x={50} y={74} width={20} height={16} rx={3} {...stroke} />
        </Svg>
        {/* Rotates around the shackle's right foot (66, 74), like the design. */}
        <Animated.View style={[StyleSheet.absoluteFill, styles.shackle, shackleStyle]}>
          <Svg width={ICON} height={ICON} viewBox="0 0 120 120">
            <Path d="M54 74v-4a6 6 0 0 1 12 0v4" {...stroke} />
          </Svg>
        </Animated.View>
      </View>
      <Text style={[styles.title, { color: t.splashFg }]}>Cápsula do Tempo</Text>
      <Text style={[styles.tagline, { color: t.splashFg }]}>Escreva hoje. Leia depois.</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cover: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  // Sizes match scripts/generate-assets.py so the native and animated splashes line up.
  icon: {
    width: ICON,
    height: ICON,
    marginBottom: 22,
  },
  shackle: {
    transformOrigin: `${(66 / 120) * 100}% ${(74 / 120) * 100}%`,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 34,
    lineHeight: 42.5,
    letterSpacing: -0.34,
    marginBottom: 8,
  },
  tagline: {
    fontFamily: fonts.medium,
    fontSize: 15,
    lineHeight: 21,
    letterSpacing: 0.3,
  },
});
