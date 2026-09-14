// @ts-nocheck
/**
 * get-element-emoji.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { ELEMENT_EMOJI_MAP } from '../../shared/emoji-maps';
export function createGetElementEmoji(deps: any) {
  const getElementEmoji = (name, type) => {
    if (!name && !type) return null;
    const lowerName = name?.toLowerCase();
    const lowerType = type?.toLowerCase();
    for (const [pattern, emoji] of ELEMENT_EMOJI_MAP) {
      if (lowerName && pattern.test(lowerName)) return emoji;
    }
    for (const [pattern, emoji] of ELEMENT_EMOJI_MAP) {
      if (lowerType && pattern.test(lowerType)) return emoji;
    }
    return null;
  };
  return getElementEmoji;
}
