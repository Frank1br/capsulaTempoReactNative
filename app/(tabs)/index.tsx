import { router } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CapsuleCard } from '@/components/CapsuleCard';
import { EmptyIllustration } from '@/components/EmptyIllustration';
import { Icon } from '@/components/Icon';
import { PrimaryButton } from '@/components/PrimaryButton';
import { isLocked, useCapsules, useNow } from '@/lib/capsules';
import { fonts, useTheme } from '@/lib/theme';

export default function Home() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { capsules } = useCapsules();
  const now = useNow();

  // Locked ones first, soonest to open on top; then the most recently opened.
  const items = useMemo(() => {
    const locked = capsules.filter((c) => isLocked(c, now)).sort((a, b) => a.opensAt.localeCompare(b.opensAt));
    const opened = capsules.filter((c) => !isLocked(c, now)).sort((a, b) => b.opensAt.localeCompare(a.opensAt));
    return { list: [...locked, ...opened], nLocked: locked.length, nOpen: opened.length };
  }, [capsules, now]);

  const empty = items.list.length === 0;
  const openNew = () => router.push('/nova');

  return (
    <View style={[styles.screen, { backgroundColor: t.bg }]}>
      <FlatList
        data={items.list}
        keyExtractor={(c) => c.id}
        contentContainerStyle={[styles.list, { paddingTop: insets.top + 15 }]}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text accessibilityRole="header" style={[styles.title, { color: t.ink }]}>
              Cápsula do Tempo
            </Text>
            <View style={styles.summary}>
              <Icon name="lock" color={t.soft} size={16} />
              <Text style={[styles.summaryText, { color: t.soft }]}>
                {empty ? 'Sua caixa ainda está vazia' : `${items.nLocked} trancadas · ${items.nOpen} abertas`}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <EmptyIllustration />
            <Text style={[styles.emptyTitle, { color: t.ink }]}>Nenhuma cápsula ainda.</Text>
            <Text style={[styles.emptyText, { color: t.soft }]}>Que tal escrever para o seu eu do futuro?</Text>
            <View style={styles.emptyButton}>
              <PrimaryButton label="Escrever a primeira" icon="pen" onPress={openNew} />
            </View>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => <CapsuleCard capsule={item} now={now} onPress={() => router.push(`/capsula/${item.id}`)} />}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Nova cápsula"
        onPress={openNew}
        style={({ pressed }) => [styles.fab, { backgroundColor: t.acc, boxShadow: t.fabShadow, opacity: pressed ? 0.85 : 1 }]}
      >
        <Icon name="plus" color={t.onAcc} size={26} strokeWidth={2.4} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
    // Leaves room so the last card can scroll past the floating button.
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 4,
    paddingBottom: 20,
    gap: 8,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 30,
    letterSpacing: -0.3,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryText: {
    fontFamily: fonts.body,
    fontSize: 14.5,
  },
  separator: {
    height: 12,
  },
  empty: {
    paddingTop: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 14,
  },
  emptyTitle: {
    marginTop: 8,
    fontFamily: fonts.serif,
    fontSize: 24,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24.8,
    textAlign: 'center',
  },
  emptyButton: {
    width: 250,
    marginTop: 10,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
