const MAX_SIDE = 1200;

/**
 * On the web the picker returns a blob: URL that stops working after a reload,
 * so the photo is stored as a data URL. It is scaled down first, because the
 * browser storage behind AsyncStorage only holds a few megabytes.
 */
export async function savePhoto(pickedUri: string): Promise<string> {
  const img = new Image();
  img.src = pickedUri;
  await img.decode();

  const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.8);
}

// The data URL lives inside the capsule itself, so there is no file to delete.
export function deletePhoto(_stored: string) {}

export function photoUri(stored: string): string {
  return stored;
}
