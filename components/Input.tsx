import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { fonts, useTheme } from '@/lib/theme';
import { Icon } from './Icon';

type BaseProps = {
  label: string;
  placeholder?: string;
  error?: string;
  helper?: string;
};

type TextProps = BaseProps & {
  kind?: 'text' | 'multiline';
  value: string;
  onChangeText: (value: string) => void;
};

type DateProps = BaseProps & {
  kind: 'date';
  /** Already formatted date, or empty when nothing was picked. */
  value: string;
  onPress: () => void;
};

export function Input(props: TextProps | DateProps) {
  const t = useTheme();
  const [focused, setFocused] = useState(false);
  const { label, placeholder, error, helper, value } = props;
  // Like the design: the error disappears as soon as the field has a value.
  const hasError = !!error && !value;
  const fieldStyle = [
    styles.field,
    {
      borderColor: hasError ? t.err : t.line,
      backgroundColor: t.card,
      boxShadow: focused ? `0px 0px 0px 3px ${t.accSoft}` : undefined,
    },
  ];

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: t.ink }]}>{label}</Text>
      {props.kind === 'date' ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${label}: ${value || placeholder || 'Escolha uma data'}`}
          onPress={props.onPress}
          style={[fieldStyle, styles.date]}
        >
          <Text style={[styles.text, { color: value ? t.ink : t.soft }]}>{value || placeholder || 'Escolha uma data'}</Text>
          <Icon name="calendar" color={t.accText} size={22} strokeWidth={2} />
        </Pressable>
      ) : (
        <TextInput
          accessibilityLabel={label}
          value={value}
          onChangeText={props.onChangeText}
          placeholder={placeholder}
          placeholderTextColor={t.soft}
          multiline={props.kind === 'multiline'}
          textAlignVertical={props.kind === 'multiline' ? 'top' : 'center'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[fieldStyle, styles.text, { color: t.ink }, props.kind === 'multiline' && styles.multiline]}
        />
      )}
      {hasError ? (
        <View accessibilityRole="alert" style={styles.row}>
          <Icon name="alert" color={t.err} size={16} />
          <Text style={[styles.message, { color: t.err, fontFamily: fonts.medium }]}>{error}</Text>
        </View>
      ) : (
        !!helper && <Text style={[styles.message, { color: t.soft }]}>{helper}</Text>
      )}
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
  field: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 16,
  },
  text: {
    fontFamily: fonts.body,
    fontSize: 16,
  },
  multiline: {
    height: 132,
    paddingTop: 14,
    paddingBottom: 14,
    lineHeight: 24.8,
  },
  date: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  message: {
    fontFamily: fonts.body,
    fontSize: 13,
  },
});
