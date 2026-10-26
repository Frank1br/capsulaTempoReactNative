import { Directory, File, Paths } from 'expo-file-system';

const FOLDER = 'fotos';

/**
 * Copies a picked photo out of the picker's cache, which the OS may clear,
 * into the app's documents. Returns a path relative to the documents folder,
 * because the absolute path changes between app updates on iOS.
 * The web version lives in photos.web.ts.
 */
export async function savePhoto(pickedUri: string): Promise<string> {
  const dir = new Directory(Paths.document, FOLDER);
  dir.create({ idempotent: true, intermediates: true });
  const source = new File(pickedUri);
  const extension = source.extension || '.jpg';
  const name = `${Date.now().toString(36)}${extension}`;
  await source.copy(new File(dir, name));
  return `${FOLDER}/${name}`;
}

/** Deletes the file savePhoto created. A missing file is not an error. */
export function deletePhoto(stored: string) {
  if (stored.includes(':')) return;
  try {
    const file = new File(Paths.document, stored);
    if (file.exists) file.delete();
  } catch {
    // Keeping an orphan photo is better than failing the removal.
  }
}

/** Turns what savePhoto stored back into a uri the Image component can load. */
export function photoUri(stored: string): string {
  if (stored.includes(':')) return stored;
  return new File(Paths.document, stored).uri;
}
