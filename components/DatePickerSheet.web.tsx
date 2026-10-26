import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts, useTheme } from '@/lib/theme';
import { PrimaryButton } from './PrimaryButton';

type Props = {
  value: Date;
  minimumDate: Date;
  onConfirm: (date: Date) => void;
  onClose: () => void;
};

// The native date picker has no web version, so the browser's own date input is used.
export function DatePickerSheet({ value, minimumDate, onConfirm, onClose }: Props) {
  const t = useTheme();
  const [draft, setDraft] = useState(toInputValue(value));

  function confirm() {
    const [year, month, day] = draft.split('-').map(Number);
    if (!year || !month || !day) return;
    const picked = new Date(year, month - 1, day);
    onConfirm(picked < minimumDate ? minimumDate : picked);
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable accessibilityLabel="Fechar" style={[styles.backdrop, { backgroundColor: t.scrim }]} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: t.bg }]}>
        <Text style={[styles.title, { color: t.ink }]}>Data de abertura</Text>
        <input
          type="date"
          aria-label="Data de abertura"
          value={draft}
          min={toInputValue(minimumDate)}
          onChange={(e) => setDraft(e.target.value)}
          style={{
            height: 52,
            boxSizing: 'border-box',
            padding: '0 16px',
            borderRadius: 14,
            border: `1.5px solid ${t.line}`,
            background: t.card,
            color: t.ink,
            colorScheme: t.dark ? 'dark' : 'light',
            fontFamily: fonts.body,
            fontSize: 16,
          }}
        />
        <PrimaryButton label="Confirmar" onPress={confirm} />
      </View>
    </Modal>
  );
}

/** yyyy-mm-dd, the format the date input reads and writes. */
function toInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxWidth: 480,
    marginHorizontal: 'auto',
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    gap: 16,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 21,
    textAlign: 'center',
  },
});
