import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DatePickerSheet } from '@/components/DatePickerSheet';
import { Icon } from '@/components/Icon';
import { Input } from '@/components/Input';
import { MoodPicker } from '@/components/MoodPicker';
import { PrimaryButton } from '@/components/PrimaryButton';
import { daysBetween, formatShort, plural, startOfDay, useCapsules } from '@/lib/capsules';
import { savePhoto } from '@/lib/photos';
import { fonts, useTheme } from '@/lib/theme';

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [4, 3],
  quality: 0.8,
};

export default function NovaCapsula() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { addCapsule } = useCapsules();

  const [photo, setPhoto] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [mood, setMood] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showIosPicker, setShowIosPicker] = useState(false);

  const today = startOfDay(new Date());
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const daysUntil = date ? daysBetween(today, date) : 0;

  async function pickFrom(source: 'library' | 'camera') {
    if (source === 'camera') {
      const { granted } = await ImagePicker.requestCameraPermissionsAsync();
      if (!granted) {
        Alert.alert('Sem acesso à câmera', 'Permita o acesso à câmera nos ajustes para tirar uma foto.');
        return;
      }
    }
    const result =
      source === 'camera' ? await ImagePicker.launchCameraAsync(PICKER_OPTIONS) : await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
    if (!result.canceled) setPhoto(result.assets[0].uri);
  }

  function choosePhoto() {
    if (Platform.OS === 'web') {
      pickFrom('library');
      return;
    }
    Alert.alert('Escolher foto', undefined, [
      { text: 'Galeria', onPress: () => pickFrom('library') },
      { text: 'Câmera', onPress: () => pickFrom('camera') },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }

  function chooseDate() {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date ?? tomorrow,
        mode: 'date',
        minimumDate: tomorrow,
        onValueChange: (_, picked) => setDate(startOfDay(picked)),
      });
    } else {
      setShowIosPicker(true);
    }
  }

  async function seal() {
    setSubmitted(true);
    if (!photo || !title.trim() || !message.trim() || !date) return;
    setSaving(true);
    try {
      await addCapsule({
        title: title.trim(),
        message: message.trim(),
        photo: await savePhoto(photo),
        mood,
        opensAt: date.toISOString(),
      });
      router.back();
    } catch {
      setSaving(false);
      Alert.alert('Não foi possível selar', 'Tente de novo em instantes.');
    }
  }

  const photoError = submitted && !photo;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.screen, { backgroundColor: t.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fechar e voltar"
          onPress={() => router.back()}
          style={[styles.iconButton, { backgroundColor: t.card, boxShadow: t.shadowStrong }]}
        >
          <Icon name="close" color={t.ink} size={20} />
        </Pressable>
        <Text accessibilityRole="header" style={[styles.headerTitle, { color: t.ink }]}>
          Nova cápsula
        </Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView contentContainerStyle={[styles.form, { paddingBottom: insets.bottom + 30 }]} keyboardShouldPersistTaps="handled">
        <View style={styles.photoBlock}>
          {photo ? (
            <View style={styles.photo}>
              <Image source={{ uri: photo }} contentFit="cover" accessibilityLabel="Foto escolhida" style={StyleSheet.absoluteFill} />
              <Pressable
                accessibilityRole="button"
                onPress={choosePhoto}
                style={[styles.swap, { backgroundColor: t.card, boxShadow: t.shadowStrong }]}
              >
                <Icon name="refresh" color={t.ink} size={16} />
                <Text style={[styles.swapText, { color: t.ink }]}>Trocar foto</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Escolher uma foto"
              onPress={choosePhoto}
              style={[styles.picker, { backgroundColor: t.card, borderColor: photoError ? t.err : t.lineStrong }]}
            >
              <View style={[styles.pickerIcon, { backgroundColor: t.sunk }]}>
                <Icon name="image" color={t.accText} size={26} strokeWidth={2} />
              </View>
              <Text style={[styles.pickerTitle, { color: t.ink }]}>Toque para escolher uma foto</Text>
              <Text style={[styles.pickerHint, { color: t.soft }]}>Da galeria ou da câmera</Text>
            </Pressable>
          )}
          {photoError && (
            <View accessibilityRole="alert" style={styles.errorRow}>
              <Icon name="alert" color={t.err} size={16} />
              <Text style={[styles.errorText, { color: t.err }]}>Escolha uma foto para guardar junto.</Text>
            </View>
          )}
        </View>

        <Input
          label="Título"
          value={title}
          onChangeText={setTitle}
          placeholder="Ex.: Para mim daqui a um ano"
          error={submitted ? 'Dê um título à sua cápsula.' : undefined}
        />
        <Input
          kind="multiline"
          label="Mensagem"
          value={message}
          onChangeText={setMessage}
          placeholder="Escreva o que você quer dizer ao seu eu do futuro…"
          error={submitted ? 'Escreva sua mensagem para o futuro.' : undefined}
        />
        <Input
          kind="date"
          label="Data de abertura"
          value={date ? formatShort(date) : ''}
          onPress={chooseDate}
          placeholder="Escolha uma data"
          helper={date ? `Abre em ${daysUntil} ${plural(daysUntil, 'dia', 'dias')}` : undefined}
          error={submitted ? 'Escolha quando ela poderá ser aberta.' : undefined}
        />
        <MoodPicker value={mood} onChange={setMood} />

        <View style={styles.footer}>
          <PrimaryButton label={saving ? 'Selando…' : 'Selar cápsula'} icon="lock" onPress={seal} disabled={saving} />
          <Text style={[styles.footerText, { color: t.soft }]}>Depois de selada, ela só abre na data escolhida.</Text>
        </View>
      </ScrollView>

      {Platform.OS === 'ios' && showIosPicker && (
        <DatePickerSheet
          value={date ?? tomorrow}
          minimumDate={tomorrow}
          onClose={() => setShowIosPicker(false)}
          onConfirm={(picked) => {
            setDate(startOfDay(picked));
            setShowIosPicker(false);
          }}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: fonts.serif,
    fontSize: 21,
  },
  form: {
    paddingTop: 10,
    paddingHorizontal: 20,
    gap: 18,
  },
  photoBlock: {
    gap: 8,
  },
  photo: {
    height: 176,
    borderRadius: 18,
    overflow: 'hidden',
  },
  swap: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    height: 38,
    paddingLeft: 12,
    paddingRight: 14,
    borderRadius: 19,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  swapText: {
    fontFamily: fonts.semibold,
    fontSize: 13.5,
  },
  picker: {
    height: 176,
    borderRadius: 18,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  pickerIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerTitle: {
    fontFamily: fonts.semibold,
    fontSize: 15,
  },
  pickerHint: {
    fontFamily: fonts.body,
    fontSize: 13,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  errorText: {
    fontFamily: fonts.medium,
    fontSize: 13,
  },
  footer: {
    marginTop: 6,
    gap: 12,
  },
  footerText: {
    fontFamily: fonts.body,
    fontSize: 13,
    textAlign: 'center',
  },
});
