import { Directory, File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

const FOLDER = 'fotos';

/**
 * Copies a picked photo out of the picker's cache, which the OS may clear,
 * into the app's documents. Returns a path relative to the documents folder,
 * because the absolute path changes between app updates on iOS.
 */
export async function savePhoto(pickedUri: string): Promise<string> {
  // The web build has no file system: keep the picker's uri as is.
  if (Platform.OS === 'web') return pickedUri;

  const dir = new Directory(Paths.document, FOLDER);
  dir.create({ idempotent: true, intermediates: true });
  const source = new File(pickedUri);
  const extension = source.extension || '.jpg';
  const name = `${Date.now().toString(36)}${extension}`;
  await source.copy(new File(dir, name));
  return `${FOLDER}/${name}`;
}

/** Turns what savePhoto stored back into a uri the Image component can load. */
export function photoUri(stored: string): string {
  if (Platform.OS === 'web' || stored.includes(':')) return stored;
  return new File(Paths.document, stored).uri;
}
