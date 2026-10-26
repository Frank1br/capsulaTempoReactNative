import { StyleSheet, Text, View } from 'react-native';

import { plural } from '@/lib/capsules';
import { fonts, useTheme } from '@/lib/theme';
import { Icon } from './Icon';

type Props = {
  size?: 'sm' | 'lg';
  days: number;
  hours: number;
};

export function LockBadge({ size = 'lg', days, hours }: Props) {
  const t = useTheme();
  const dayWord = plural(days, 'dia', 'dias');

  if (size === 'sm') {
    // On the last day, count hours instead of showing "abre em 0 dias".
    const amount = days > 0 ? days : hours;
    const unit = days > 0 ? dayWord : 'h';
    return (
      <View
        accessibilityLabel={`Abre em ${amount} ${days > 0 ? dayWord : plural(hours, 'hora', 'horas')}`}
        style={[styles.pill, { backgroundColor: t.badge }]}
      >
        <Icon name="lock" color={t.lock} size={14} strokeWidth={2.4} />
        <Text style={[styles.pillText, { color: t.onBadge }]}>
          abre em <Text style={styles.pillNumber}>{amount}</Text> {unit}
        </Text>
      </View>
    );
  }

  const hoursPad = String(hours).padStart(2, '0');
  const hourWord = plural(hours, 'hora', 'horas');
  return (
    <View style={styles.large}>
      <View
        style={[
          styles.circle,
          {
            backgroundColor: t.badge,
            boxShadow: `0px 0px 0px 7px rgba(255,248,240,0.28), 0px 0px 0px 9px ${t.acc}, 0px 14px 30px rgba(20,12,8,0.35)`,
          },
        ]}
      >
        <Icon name="lockKeyhole" color={t.lock} size={50} strokeWidth={1.8} />
      </View>
      <View accessibilityRole="timer" accessibilityLabel={`Abre em ${days} ${dayWord} e ${hoursPad} horas`} style={styles.counters}>
        <Counter value={String(days)} unit={dayWord} />
        <Counter value={hoursPad} unit={hourWord} />
      </View>
    </View>
  );
}

function Counter({ value, unit }: { value: string; unit: string }) {
  const t = useTheme();
  return (
    <View style={[styles.counter, { backgroundColor: t.card, boxShadow: t.shadow }]}>
      <Text style={[styles.counterValue, { color: t.ink }]}>{value}</Text>
      <Text style={[styles.counterUnit, { color: t.soft }]}>{unit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 26,
    paddingLeft: 8,
    paddingRight: 11,
    borderRadius: 999,
  },
  pillText: {
    fontFamily: fonts.medium,
    fontSize: 12.5,
  },
  pillNumber: {
    fontFamily: fonts.serif,
    fontSize: 14,
    fontVariant: ['tabular-nums'],
  },
  large: {
    width: 300,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 24,
  },
  circle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counters: {
    flexDirection: 'row',
    gap: 10,
  },
  counter: {
    width: 116,
    paddingTop: 12,
    paddingBottom: 10,
    borderRadius: 16,
    alignItems: 'center',
    gap: 2,
  },
  counterValue: {
    fontFamily: fonts.serif,
    fontSize: 40,
    lineHeight: 44,
    fontVariant: ['tabular-nums'],
  },
  counterUnit: {
    fontFamily: fonts.semibold,
    fontSize: 11.5,
    letterSpacing: 1.15,
    textTransform: 'uppercase',
  },
});
