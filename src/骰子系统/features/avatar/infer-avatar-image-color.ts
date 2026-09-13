// @ts-nocheck
/**
 * infer-avatar-image-color.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createInferAvatarImageColor(deps: any) {
  const inferAvatarImageColor = async (
    imageSource: string,
    options: { offsetX?: unknown; offsetY?: unknown; scale?: unknown } = {},
  ): Promise<string | null> => {
    const source = String(imageSource || '').trim();
    if (!source) return null;

    try {
      const image = await deps.loadAvatarImageForColor(source);
      const sampleSize = 96;
      const canvas = document.createElement('canvas');
      canvas.width = sampleSize;
      canvas.height = sampleSize;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return null;

      ctx.clearRect(0, 0, sampleSize, sampleSize);
      const scale = deps.clampAvatarNumber(options.scale, 80, 320, 150);
      const offsetX = deps.clampAvatarNumber(options.offsetX, 0, 100, 50);
      const offsetY = deps.clampAvatarNumber(options.offsetY, 0, 100, 50);
      const naturalWidth = image.naturalWidth || image.width;
      const naturalHeight = image.naturalHeight || image.height;
      if (!naturalWidth || !naturalHeight) return null;

      const drawWidth = sampleSize * (scale / 100);
      const drawHeight = drawWidth * (naturalHeight / naturalWidth);
      const left = (sampleSize - drawWidth) * (offsetX / 100);
      const top = (sampleSize - drawHeight) * (offsetY / 100);
      ctx.drawImage(image, left, top, drawWidth, drawHeight);

      const pixels = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
      const clusters = new Map<
        string,
        { r: number; g: number; b: number; weight: number; score: number; count: number }
      >();

      for (let y = 0; y < sampleSize; y += 2) {
        for (let x = 0; x < sampleSize; x += 2) {
          const idx = (y * sampleSize + x) * 4;
          const alpha = pixels[idx + 3];
          if (alpha < 180) continue;

          const r = pixels[idx];
          const g = pixels[idx + 1];
          const b = pixels[idx + 2];
          const hsl = deps.rgbToAvatarHsl(r, g, b);
          let weight = 1;
          const nx = x / (sampleSize - 1);
          const ny = y / (sampleSize - 1);

          if (ny < 0.48) weight *= 1.45;
          if (nx < 0.28 || nx > 0.72) weight *= 1.25;
          if (nx > 0.34 && nx < 0.66 && ny > 0.3 && ny < 0.78) weight *= 0.56;
          if (hsl.s < 0.16) weight *= 0.28;
          if (hsl.l < 0.12 || hsl.l > 0.92) weight *= 0.18;
          if (deps.isLikelyAvatarSkinTone(hsl.h, hsl.s, hsl.l)) weight *= 0.34;

          const hueBin = Math.floor(hsl.h / 18);
          const saturationBin = Math.floor(hsl.s * 4);
          const lightnessBin = Math.floor(hsl.l * 4);
          const key = `${hueBin}:${saturationBin}:${lightnessBin}`;
          const existing = clusters.get(key) || { r: 0, g: 0, b: 0, weight: 0, score: 0, count: 0 };
          const score = weight * (0.32 + hsl.s * 1.78) * (1 - Math.min(0.55, Math.abs(hsl.l - 0.52)));
          existing.r += r * weight;
          existing.g += g * weight;
          existing.b += b * weight;
          existing.weight += weight;
          existing.score += score;
          existing.count++;
          clusters.set(key, existing);
        }
      }

      let best: { r: number; g: number; b: number; weight: number; score: number; count: number } | null = null;
      for (const cluster of clusters.values()) {
        if (cluster.count < 4 || cluster.weight <= 0) continue;
        if (!best || cluster.score > best.score) {
          best = cluster;
        }
      }

      if (!best || best.score < 4) return null;
      const bestR = best.r / best.weight;
      const bestG = best.g / best.weight;
      const bestB = best.b / best.weight;
      if (deps.rgbToAvatarHsl(bestR, bestG, bestB).s < 0.18) return null;
      return deps.normalizeInferredAvatarColor(bestR, bestG, bestB);
    } catch (error) {
      console.warn('[DICE]头像颜色推断失败，改用角色名 fallback:', error);
      return null;
    }
  };
  return inferAvatarImageColor;
}
