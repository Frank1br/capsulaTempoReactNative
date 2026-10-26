import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts, useTheme } from '@/lib/theme';
import { Icon, type IconName } from './Icon';

const TABS: Record<string, { label: string; icon: IconName }> = {
  index: { label: 'Cápsulas', icon: 'box' },
  estatisticas: { label: 'Estatísticas', icon: 'chart' },
};

export function TabBar({ state, navigateToTab, insets }: BottomTabBarProps) {
  const t = useTheme();
  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel="Navegação principal"
      style={[styles.bar, { backgroundColor: t.card, borderTopColor: t.line, paddingBottom: Math.max(insets.bottom, 12) }]}
    >
      {state.routes.map((route, i) => {
        const tab = TABS[route.name];
        if (!tab) return null;
        const active = i === state.index;
        const color = active ? t.accText : t.soft;
        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => navigateToTab(route.key)}
            style={styles.tab}
          >
            <View style={[styles.indicator, active && { backgroundColor: t.accSoft }]}>
              <Icon name={tab.icon} color={color} size={22} strokeWidth={2} />
            </View>
            <Text style={[styles.label, { color, fontFamily: active ? fonts.semibold : fonts.medium }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 8,
    paddingHorizontal: 32,
    borderTopWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    minHeight: 50,
  },
  indicator: {
    width: 60,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
  },
});
