import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MOODS } from '@/lib/capsules';
import { fonts, useTheme } from '@/lib/theme';

type Props = {
  label?: string;
  value: number | null;
  onChange: (value: number | null) => void;
};

export function MoodPicker({ label = 'Como você está hoje?', value, onChange }: Props) {
  const t = useTheme();
  const pickedName = value !== null ? MOODS[value].name : 'opcional';

  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={styles.wrapper}>
      <Text style={[styles.label, { color: t.ink }]}>
        {label} <Text style={[styles.picked, { color: t.soft }]}>· {pickedName}</Text>
      </Text>
      <View style={styles.row}>
        {MOODS.map((mood, i) => {
          const on = i === value;
          return (
            <Pressable
              key={mood.name}
              accessibilityRole="radio"
              accessibilityLabel={mood.name}
              accessibilityState={{ checked: on }}
              // Tapping the selected mood again clears it: the mood is optional.
              onPress={() => onChange(on ? null : i)}
              style={[
                styles.chip,
                {
                  borderColor: on ? t.acc : t.line,
                  backgroundColor: on ? t.accSoft : t.card,
                  transform: [{ translateY: on ? -2 : 0 }],
                },
              ]}
            >
              <Text style={styles.emoji}>{mood.emoji}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 13.5,
  },
  picked: {
    fontFamily: fonts.body,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flex: 1,
    height: 54,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
    lineHeight: 30,
  },
});
