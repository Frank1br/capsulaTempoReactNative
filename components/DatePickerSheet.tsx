import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts, useTheme } from '@/lib/theme';
import { PrimaryButton } from './PrimaryButton';

type Props = {
  value: Date;
  minimumDate: Date;
  onConfirm: (date: Date) => void;
  onClose: () => void;
};

// iOS (DatePickerSheet.web.tsx is the web version); Android opens its own dialog through DateTimePickerAndroid.
// Mount it only while open, so the draft starts from the current value.
export function DatePickerSheet({ value, minimumDate, onConfirm, onClose }: Props) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState(value);

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable accessibilityLabel="Fechar" style={[styles.backdrop, { backgroundColor: t.scrim }]} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: t.bg, paddingBottom: insets.bottom + 16 }]}>
        <Text style={[styles.title, { color: t.ink }]}>Data de abertura</Text>
        <DateTimePicker
          value={draft}
          mode="date"
          display="inline"
          locale="pt-BR"
          minimumDate={minimumDate}
          accentColor={t.acc}
          themeVariant={t.dark ? 'dark' : 'light'}
          onValueChange={(_, date) => setDraft(date)}
        />
        <PrimaryButton label="Confirmar" onPress={() => onConfirm(draft)} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  sheet: {
    paddingTop: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    gap: 12,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 21,
    textAlign: 'center',
  },
});
