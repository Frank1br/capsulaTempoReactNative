import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { countdown, formatShort, isLocked, MOODS, type Capsule } from '@/lib/capsules';
import { photoUri } from '@/lib/photos';
import { fonts, useTheme } from '@/lib/theme';
import { Icon } from './Icon';
import { LockBadge } from './LockBadge';

type Props = {
  capsule: Capsule;
  now: number;
  onPress: () => void;
};

export function CapsuleCard({ capsule, now, onPress }: Props) {
  const t = useTheme();
  const locked = isLocked(capsule, now);
  const mood = capsule.mood !== null ? MOODS[capsule.mood] : null;
  const { days, hours } = countdown(capsule, now);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir cápsula: ${capsule.title}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, { backgroundColor: t.card, boxShadow: t.shadow, opacity: pressed ? 0.9 : 1 }]}
    >
      <View style={[styles.thumb, { backgroundColor: t.sunk }]}>
        <Image source={{ uri: photoUri(capsule.photo) }} blurRadius={locked ? 5 : 0} contentFit="cover" style={StyleSheet.absoluteFill} />
        {locked && (
          <View style={[StyleSheet.absoluteFill, styles.scrim, { backgroundColor: t.scrim }]}>
            <View style={[styles.lockDot, { backgroundColor: t.badge }]}>
              <Icon name="lock" color={t.lock} size={18} />
            </View>
          </View>
        )}
      </View>
      <View style={styles.body}>
        <Text numberOfLines={1} style={[styles.title, { color: t.ink }]}>
          {capsule.title}
        </Text>
        {locked ? (
          <>
            <LockBadge size="sm" days={days} hours={hours} />
            <Text style={[styles.meta, { color: t.soft }]}>Criada em {formatShort(capsule.createdAt)}</Text>
          </>
        ) : (
          <>
            <View style={styles.openRow}>
              <View style={[styles.openPill, { backgroundColor: t.accSoft }]}>
                <Icon name="lockOpen" color={t.accText} size={13} strokeWidth={2.4} />
                <Text style={[styles.openText, { color: t.accText }]}>Aberta</Text>
              </View>
              {mood && (
                <Text accessibilityLabel={`Humor: ${mood.name.toLowerCase()}`} style={styles.mood}>
                  {mood.emoji}
                </Text>
              )}
            </View>
            <Text style={[styles.meta, { color: t.soft }]}>Escrita em {formatShort(capsule.createdAt)}</Text>
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 104,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 18,
  },
  thumb: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
  },
  scrim: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 0px 0px 3px rgba(255,248,240,0.35)',
  },
  body: {
    flex: 1,
    minWidth: 0,
    gap: 7,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 17,
    lineHeight: 21,
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: 12.5,
  },
  openRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  openPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 24,
    paddingLeft: 8,
    paddingRight: 10,
    borderRadius: 999,
  },
  openText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
  },
  mood: {
    fontSize: 18,
    lineHeight: 22,
  },
});
