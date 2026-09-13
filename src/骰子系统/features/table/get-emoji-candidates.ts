// @ts-nocheck
/**
 * get-emoji-candidates.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { LOCATION_EMOJI_MAP } from '../../shared/emoji-maps';
export function createGetEmojiCandidates(deps: any) {
  const getEmojiCandidates = (name: string): string[] => {
    if (!name) return [];
    const lowerName = name.toLowerCase();
    const candidates: string[] = [];
    for (const [pattern, emoji] of LOCATION_EMOJI_MAP) {
      if (pattern.test(lowerName)) {
        candidates.push(emoji);
      }
    }
    return candidates;
  };
  return getEmojiCandidates;
}
