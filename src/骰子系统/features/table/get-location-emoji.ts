// @ts-nocheck
/**
 * get-location-emoji.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { LOCATION_EMOJI_MAP } from '../../shared/emoji-maps';
export function createGetLocationEmoji(deps: any) {
  const getLocationEmoji = name => {
    if (!name) return null;
    const lowerName = name.toLowerCase();
    for (const [pattern, emoji] of LOCATION_EMOJI_MAP) {
      if (pattern.test(lowerName)) return emoji;
    }
    return null;
  };
  return getLocationEmoji;
}
