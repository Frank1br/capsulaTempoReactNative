import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts, useTheme } from '@/lib/theme';
import { PrimaryButton } from './PrimaryButton';

type Props = {
  title: string;
  opens: string;
  onConfirm: () => void;
  onClose: () => void;
};

// Like deleting a GitHub repository: the button only unlocks after typing the exact title.
export function PeekSheet({ title, opens, onConfirm, onClose }: Props) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [typed, setTyped] = useState('');
  const matches = typed.trim() === title;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.fill}>
        <Pressable accessibilityLabel="Fechar" style={[styles.fill, { backgroundColor: t.scrim }]} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: t.bg, paddingBottom: insets.bottom + 20 }]}>
          <Text accessibilityRole="header" style={[styles.heading, { color: t.ink }]}>
            Espiar antes da hora?
          </Text>
          <Text style={[styles.text, { color: t.soft }]}>
            Ela continua trancada até {opens}: você só vai ler a mensagem agora, sem abrir a cápsula. Para confirmar, digite{' '}
            <Text style={[styles.title, { color: t.ink }]}>{title}</Text> abaixo.
          </Text>
          <TextInput
            accessibilityLabel="Título da cápsula"
            value={typed}
            onChangeText={setTyped}
            placeholder={title}
            placeholderTextColor={t.soft}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            onSubmitEditing={() => matches && onConfirm()}
            style={[styles.input, { color: t.ink, backgroundColor: t.card, borderColor: matches ? t.acc : t.line }]}
          />
          <PrimaryButton label="Espiar a mensagem" icon="eye" onPress={onConfirm} disabled={!matches} />
          <Pressable accessibilityRole="button" onPress={onClose} style={styles.cancel}>
            <Text style={[styles.cancelText, { color: t.soft }]}>Cancelar</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  sheet: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingTop: 22,
    paddingHorizontal: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    gap: 14,
  },
  heading: {
    fontFamily: fonts.serif,
    fontSize: 21,
  },
  text: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22.5,
  },
  title: {
    fontFamily: fonts.semibold,
  },
  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  cancel: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontFamily: fonts.semibold,
    fontSize: 15,
  },
});
