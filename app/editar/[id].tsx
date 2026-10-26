import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CapsuleForm } from '@/components/CapsuleForm';
import { isLocked, useCapsules } from '@/lib/capsules';
import { photoUri, savePhoto } from '@/lib/photos';
import { fonts, useTheme } from '@/lib/theme';

export default function EditarCapsula() {
  const t = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { capsules, updateCapsule } = useCapsules();
  const capsule = capsules.find((c) => c.id === id);
  // Decided once, so the form doesn't change shape if the date passes while editing.
  const [locked] = useState(() => !!capsule && isLocked(capsule, Date.now()));

  if (!capsule) {
    return (
      <View style={[styles.missing, { backgroundColor: t.bg }]}>
        <Text style={[styles.missingText, { color: t.soft }]}>Esta cápsula não foi encontrada.</Text>
      </View>
    );
  }

  const storedPhoto = photoUri(capsule.photo);

  return (
    <CapsuleForm
      heading="Editar cápsula"
      submitLabel="Salvar alterações"
      submitIcon={locked ? 'lock' : 'pen'}
      savingLabel="Salvando…"
      footnote={
        locked
          ? 'A mensagem continua selada e não pode ser alterada até a data de abertura.'
          : 'Ela já foi aberta, então a data de abertura não muda.'
      }
      initial={{
        photo: storedPhoto,
        title: capsule.title,
        message: capsule.message,
        date: new Date(capsule.opensAt),
        mood: capsule.mood,
      }}
      // A sealed message stays hidden; an opened capsule keeps its opening date.
      showMessage={!locked}
      showDate={locked}
      onSubmit={async (values) => {
        await updateCapsule(capsule.id, {
          title: values.title,
          mood: values.mood,
          ...(values.photo !== storedPhoto && { photo: await savePhoto(values.photo) }),
          ...(locked ? { opensAt: values.date.toISOString() } : { message: values.message }),
        });
      }}
    />
  );
}

const styles = StyleSheet.create({
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  missingText: {
    fontFamily: fonts.body,
    fontSize: 16,
  },
});
