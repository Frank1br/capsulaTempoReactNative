import { Pressable, StyleSheet, Text } from 'react-native';

import { fonts, useTheme } from '@/lib/theme';
import { Icon, type IconName } from './Icon';

type Props = {
  label: string;
  icon?: IconName;
  onPress: () => void;
  disabled?: boolean;
};

export function PrimaryButton({ label, icon, onPress, disabled }: Props) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: t.acc, boxShadow: t.buttonShadow, opacity: disabled ? 0.6 : pressed ? 0.85 : 1 },
      ]}
    >
      {icon && <Icon name={icon} color={t.onAcc} size={20} />}
      <Text style={[styles.label, { color: t.onAcc }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    letterSpacing: 0.16,
  },
});
