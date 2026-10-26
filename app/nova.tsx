import { CapsuleForm } from '@/components/CapsuleForm';
import { useCapsules } from '@/lib/capsules';
import { savePhoto } from '@/lib/photos';

export default function NovaCapsula() {
  const { addCapsule } = useCapsules();

  return (
    <CapsuleForm
      heading="Nova cápsula"
      submitLabel="Selar cápsula"
      savingLabel="Selando…"
      footnote="Depois de selada, ela só abre na data escolhida."
      onSubmit={async (values) => {
        await addCapsule({
          title: values.title,
          message: values.message,
          photo: await savePhoto(values.photo),
          mood: values.mood,
          opensAt: values.date.toISOString(),
        });
      }}
    />
  );
}
