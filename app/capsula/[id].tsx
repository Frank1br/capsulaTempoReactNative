import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/Icon';
import { LockBadge } from '@/components/LockBadge';
import { countdown, daysBetween, formatLong, formatShort, isLocked, MOODS, plural, useCapsules, useNow, type Capsule } from '@/lib/capsules';
import { photoUri } from '@/lib/photos';
import { fonts, useTheme } from '@/lib/theme';

export default function DetalheCapsula() {
  const t = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { capsules } = useCapsules();
  const now = useNow();
  const capsule = capsules.find((c) => c.id === id);

  if (!capsule) {
    return (
      <View style={[styles.screen, styles.missing, { backgroundColor: t.bg }]}>
        <Text style={[styles.missingText, { color: t.soft }]}>Esta cápsula não foi encontrada.</Text>
        <BackButton />
      </View>
    );
  }

  return isLocked(capsule, now) ? <Trancada capsule={capsule} now={now} /> : <Aberta capsule={capsule} />;
}

function Trancada({ capsule, now }: { capsule: Capsule; now: number }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { days, hours } = countdown(capsule, now);
  const opens = formatLong(capsule.opensAt);

  return (
    <View style={[styles.screen, { backgroundColor: t.bg }]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 26 }}>
        <View style={styles.lockedHero}>
          <Image source={{ uri: photoUri(capsule.photo) }} blurRadius={14} contentFit="cover" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: t.scrim }]} />
          <View style={[styles.badge, { top: insets.top + 57 }]}>
            <LockBadge size="lg" days={days} hours={hours} />
          </View>
        </View>

        <View style={[styles.panel, styles.lockedPanel, { backgroundColor: t.bg }]}>
          <View style={styles.eyebrow}>
            <Icon name="lock" color={t.accText} size={15} strokeWidth={2.4} />
            <Text style={[styles.eyebrowText, { color: t.accText }]}>Cápsula trancada</Text>
          </View>
          <Text accessibilityRole="header" style={[styles.title, styles.lockedTitle, { color: t.ink }]}>
            {capsule.title}
          </Text>
          <View style={styles.facts}>
            <Fact icon="calendar" label="Abre em" value={opens} />
            <Fact icon="pen" label="Criada em" value={formatShort(capsule.createdAt)} />
          </View>
          <View style={[styles.sealed, { backgroundColor: t.card, borderColor: t.lineStrong }]}>
            <View style={styles.lines}>
              {['100%', '88%', '64%'].map((width) => (
                <View key={width} style={[styles.line, { width: width as `${number}%`, backgroundColor: t.sunk }]} />
              ))}
            </View>
            <Text style={[styles.sealedText, { color: t.soft }]}>A mensagem está selada. Volte no dia {opens} para lê-la.</Text>
          </View>
        </View>
      </ScrollView>

      <BackButton />
    </View>
  );
}

function Aberta({ capsule }: { capsule: Capsule }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const mood = capsule.mood !== null ? MOODS[capsule.mood] : null;
  const keptDays = daysBetween(new Date(capsule.createdAt), new Date(capsule.opensAt));
  const paragraphs = capsule.message.split(/\n+/).filter((p) => p.trim());

  return (
    <View style={[styles.screen, { backgroundColor: t.bg }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
        <Image source={{ uri: photoUri(capsule.photo) }} contentFit="cover" accessibilityLabel="Foto da cápsula" style={styles.openHero} />

        <View style={[styles.panel, { backgroundColor: t.bg }]}>
          <View style={styles.openTop}>
            <View style={[styles.openPill, { backgroundColor: t.accSoft }]}>
              <Icon name="lockOpen" color={t.accText} size={15} strokeWidth={2.4} />
              <Text style={[styles.openText, { color: t.accText }]}>Aberta</Text>
            </View>
            {mood && (
              <View
                accessibilityLabel={`Humor: ${mood.name.toLowerCase()}`}
                style={[styles.moodBubble, { backgroundColor: t.card, boxShadow: t.shadow }]}
              >
                <Text style={styles.mood}>{mood.emoji}</Text>
              </View>
            )}
          </View>

          <Text accessibilityRole="header" style={[styles.title, { color: t.ink }]}>
            {capsule.title}
          </Text>

          <View style={styles.facts}>
            <Fact icon="pen" label="Escrita em" value={formatShort(capsule.createdAt)} />
            <Fact icon="lockOpen" label="Aberta em" value={formatShort(capsule.opensAt)} />
          </View>

          <View style={[styles.letter, { backgroundColor: t.card, boxShadow: t.shadow }]}>
            <Text style={[styles.salutation, { color: t.ink }]}>Querido eu do futuro,</Text>
            {paragraphs.map((p, i) => (
              <Text key={i} style={[styles.paragraph, { color: t.ink }]}>
                {p}
              </Text>
            ))}
            <Text style={[styles.signature, { color: t.soft }]}>— Você, em {formatLong(capsule.createdAt)}</Text>
          </View>

          <View style={styles.kept}>
            <Icon name="clock" color={t.soft} size={16} strokeWidth={2} />
            <Text style={[styles.keptText, { color: t.soft }]}>
              Guardada por {keptDays} {plural(keptDays, 'dia', 'dias')}
            </Text>
          </View>
        </View>
      </ScrollView>

      <BackButton />
    </View>
  );
}

function Fact({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  const t = useTheme();
  return (
    <View style={styles.fact}>
      <View style={[styles.factIcon, { backgroundColor: t.sunk }]}>
        <Icon name={icon} color={t.accText} size={18} strokeWidth={2} />
      </View>
      <View style={styles.factBody}>
        <Text style={[styles.factLabel, { color: t.soft }]}>{label}</Text>
        <Text style={[styles.factValue, { color: t.ink }]}>{value}</Text>
      </View>
    </View>
  );
}

function BackButton() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Voltar"
      onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      style={[styles.back, { top: insets.top + 5, backgroundColor: t.card, boxShadow: t.shadowStrong }]}
    >
      <Icon name="back" color={t.ink} size={22} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  missing: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  missingText: {
    fontFamily: fonts.body,
    fontSize: 16,
  },
  lockedHero: {
    height: 470,
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  panel: {
    marginTop: -28,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 26,
    paddingHorizontal: 24,
    gap: 18,
  },
  lockedPanel: {
    flex: 1,
    marginTop: -30,
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
  title: {
    marginTop: -4,
    fontFamily: fonts.serif,
    fontSize: 30,
    lineHeight: 34.5,
    letterSpacing: -0.3,
  },
  lockedTitle: {
    marginTop: -6,
  },
  facts: {
    flexDirection: 'row',
    gap: 12,
  },
  fact: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  factIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  factBody: {
    flex: 1,
    gap: 2,
  },
  factLabel: {
    fontFamily: fonts.body,
    fontSize: 12.5,
  },
  factValue: {
    fontFamily: fonts.semibold,
    fontSize: 14.5,
  },
  sealed: {
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    padding: 18,
    gap: 14,
  },
  lines: {
    gap: 9,
  },
  line: {
    height: 9,
    borderRadius: 5,
  },
  sealedText: {
    fontFamily: fonts.body,
    fontSize: 14.5,
    lineHeight: 21.75,
  },
  openHero: {
    height: 380,
  },
  openTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  openPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 30,
    paddingLeft: 10,
    paddingRight: 12,
    borderRadius: 999,
  },
  openText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
  },
  moodBubble: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mood: {
    fontSize: 24,
    lineHeight: 30,
  },
  letter: {
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 22,
    gap: 14,
  },
  salutation: {
    fontFamily: fonts.serifItalic,
    fontSize: 20,
  },
  paragraph: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 27.2,
  },
  signature: {
    marginTop: 4,
    fontFamily: fonts.serifItalic,
    fontSize: 16,
    textAlign: 'right',
  },
  kept: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  keptText: {
    fontFamily: fonts.body,
    fontSize: 13.5,
  },
  back: {
    position: 'absolute',
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
