import { router } from 'expo-router';
import { Fragment, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { countdown, formatShort, isLocked, plural, useCapsules, useNow } from '@/lib/capsules';
import { fonts, useTheme } from '@/lib/theme';

export default function Estatisticas() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { capsules } = useCapsules();
  const now = useNow();

  const { locked, nOpen } = useMemo(() => {
    const locked = capsules.filter((c) => isLocked(c, now)).sort((a, b) => a.opensAt.localeCompare(b.opensAt));
    return { locked, nOpen: capsules.length - locked.length };
  }, [capsules, now]);

  const total = capsules.length;
  const [next, ...after] = locked;
  const nextCountdown = next ? countdown(next, now) : null;

  return (
    <ScrollView style={{ backgroundColor: t.bg }} contentContainerStyle={[styles.content, { paddingTop: insets.top + 15 }]}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={[styles.title, { color: t.ink }]}>
          Estatísticas
        </Text>
        <Text style={[styles.subtitle, { color: t.soft }]}>Sua caixa de cartas até hoje</Text>
      </View>

      <View style={[styles.card, styles.totalCard, { backgroundColor: t.card, boxShadow: t.shadow }]}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: t.soft }]}>Total de cápsulas</Text>
          <Text style={[styles.totalValue, { color: t.ink }]}>{total}</Text>
        </View>
        <View accessibilityLabel={`${nOpen} abertas e ${locked.length} trancadas`} style={styles.bar}>
          {total === 0 ? (
            <View style={[styles.barPart, { flex: 1, backgroundColor: t.sunk }]} />
          ) : (
            <>
              {nOpen > 0 && <View style={[styles.barPart, { flex: nOpen, backgroundColor: t.acc }]} />}
              {locked.length > 0 && <View style={[styles.barPart, { flex: locked.length, backgroundColor: t.meter }]} />}
            </>
          )}
        </View>
        <View style={styles.legend}>
          <LegendItem color={t.acc} label={`${nOpen} ${plural(nOpen, 'aberta', 'abertas')}`} />
          <LegendItem color={t.meter} label={`${locked.length} ${plural(locked.length, 'trancada', 'trancadas')}`} />
        </View>
      </View>

      <View style={styles.pair}>
        <View style={[styles.card, styles.smallCard, { backgroundColor: t.card, boxShadow: t.shadow }]}>
          <View style={[styles.smallIcon, { backgroundColor: t.accSoft }]}>
            <Icon name="lockOpen" color={t.accText} size={18} />
          </View>
          <View style={styles.smallRow}>
            <Text style={[styles.smallValue, { color: t.ink }]}>{nOpen}</Text>
            <Text style={[styles.smallLabel, { color: t.soft }]}>{plural(nOpen, 'aberta', 'abertas')}</Text>
          </View>
        </View>
        <View style={[styles.card, styles.smallCard, { backgroundColor: t.card, boxShadow: t.shadow }]}>
          <View style={[styles.smallIcon, { backgroundColor: t.badge }]}>
            <Icon name="lock" color={t.lock} size={18} />
          </View>
          <View style={styles.smallRow}>
            <Text style={[styles.smallValue, { color: t.ink }]}>{locked.length}</Text>
            <Text style={[styles.smallLabel, { color: t.soft }]}>{plural(locked.length, 'trancada', 'trancadas')}</Text>
          </View>
        </View>
      </View>

      {next && nextCountdown && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Próxima a abrir: ${next.title}, em ${nextCountdown.days} dias`}
          onPress={() => router.push(`/capsula/${next.id}`)}
          style={({ pressed }) => [styles.card, styles.nextCard, { backgroundColor: t.badge, boxShadow: t.shadow, opacity: pressed ? 0.9 : 1 }]}
        >
          <View style={styles.eyebrow}>
            <Icon name="clock" color={t.lock} size={14} strokeWidth={2.4} />
            <Text style={[styles.eyebrowText, { color: t.lock }]}>Próxima a abrir</Text>
          </View>
          <Text style={[styles.nextTitle, { color: t.onBadge }]}>{next.title}</Text>
          <View style={styles.nextRow}>
            <View style={styles.nextCount}>
              <Text style={[styles.nextDays, { color: t.onBadge }]}>{nextCountdown.days}</Text>
              <Text style={[styles.nextUnit, { color: t.onBadge }]}>{plural(nextCountdown.days, 'dia', 'dias')}</Text>
              <Text style={[styles.nextHours, { color: t.onBadge }]}>{String(nextCountdown.hours).padStart(2, '0')}</Text>
              <Text style={[styles.nextUnit, { color: t.onBadge }]}>h</Text>
            </View>
            <Text style={[styles.nextDate, { color: t.badgeSoft }]}>{formatShort(next.opensAt)}</Text>
          </View>
        </Pressable>
      )}

      {after.length > 0 && (
        <View style={styles.afterSection}>
          <Text style={[styles.afterTitle, { color: t.soft }]}>Depois dela</Text>
          <View style={[styles.afterList, { backgroundColor: t.card, boxShadow: t.shadow }]}>
            {after.slice(0, 5).map((c, i) => {
              const { days } = countdown(c, now);
              return (
                <Fragment key={c.id}>
                  {i > 0 && <View style={[styles.divider, { backgroundColor: t.line }]} />}
                  <Pressable accessibilityRole="button" onPress={() => router.push(`/capsula/${c.id}`)} style={styles.afterRow}>
                    <Text numberOfLines={1} style={[styles.afterName, { color: t.ink }]}>
                      {c.title}
                    </Text>
                    <Text style={[styles.afterDays, { color: t.soft }]}>
                      {days} {plural(days, 'dia', 'dias')}
                    </Text>
                  </Pressable>
                </Fragment>
              );
            })}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  const t = useTheme();
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={[styles.legendText, { color: t.soft }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  header: {
    paddingHorizontal: 4,
    paddingBottom: 6,
    gap: 6,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 30,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14.5,
  },
  card: {
    borderRadius: 20,
  },
  totalCard: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    gap: 12,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontFamily: fonts.semibold,
    fontSize: 14,
  },
  totalValue: {
    fontFamily: fonts.serif,
    fontSize: 44,
    lineHeight: 48,
    fontVariant: ['tabular-nums'],
  },
  bar: {
    flexDirection: 'row',
    gap: 4,
    height: 10,
  },
  barPart: {
    borderRadius: 5,
  },
  legend: {
    flexDirection: 'row',
    gap: 18,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontFamily: fonts.body,
    fontSize: 13,
  },
  pair: {
    flexDirection: 'row',
    gap: 12,
  },
  smallCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 10,
  },
  smallIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  smallValue: {
    fontFamily: fonts.serif,
    fontSize: 34,
    lineHeight: 38,
  },
  smallLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
  },
  nextCard: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    gap: 10,
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  eyebrowText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    letterSpacing: 1.44,
    textTransform: 'uppercase',
  },
  nextTitle: {
    fontFamily: fonts.serif,
    fontSize: 21,
  },
  nextRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  nextCount: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  nextDays: {
    fontFamily: fonts.serif,
    fontSize: 40,
    lineHeight: 44,
    fontVariant: ['tabular-nums'],
  },
  nextHours: {
    marginLeft: 8,
    fontFamily: fonts.serif,
    fontSize: 24,
    lineHeight: 28,
    fontVariant: ['tabular-nums'],
  },
  nextUnit: {
    fontFamily: fonts.body,
    fontSize: 14,
  },
  nextDate: {
    fontFamily: fonts.body,
    fontSize: 13,
  },
  afterSection: {
    marginTop: 2,
    gap: 8,
  },
  afterTitle: {
    marginHorizontal: 4,
    fontFamily: fonts.semibold,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  afterList: {
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  afterRow: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  afterName: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 14.5,
  },
  afterDays: {
    fontFamily: fonts.body,
    fontSize: 13,
  },
  divider: {
    height: 1,
  },
});
