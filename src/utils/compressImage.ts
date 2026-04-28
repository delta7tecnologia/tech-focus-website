/**
 * Comprime uma imagem do lado do cliente antes do upload.
 * - Reduz para no máximo `maxDim` px no maior lado
 * - Recodifica em JPEG com qualidade configurável
 * - Não comprime PDFs/vídeos/anexos não-imagem (passa direto)
 */
export async function compressImageIfNeeded(
  file: File,
  maxDim = 1600,
  quality = 0.85,
): Promise<File> {
  if (!file.type.startsWith('image/')) return file;
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') return file;

  try {
    const dataUrl = await new Promise<string>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result as string);
      r.onerror = rej;
      r.readAsDataURL(file);
    });

    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = dataUrl;
    });

    const ratio = Math.min(1, maxDim / Math.max(img.width, img.height));
    if (ratio === 1 && file.size < 600 * 1024) return file;

    const w = Math.round(img.width * ratio);
    const h = Math.round(img.height * ratio);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, w, h);

    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob(res, 'image/jpeg', quality),
    );
    if (!blob) return file;

    const newName = file.name.replace(/\.\w+$/i, '') + '.jpg';
    return new File([blob], newName, { type: 'image/jpeg', lastModified: Date.now() });
  } catch {
    return file;
  }
}
