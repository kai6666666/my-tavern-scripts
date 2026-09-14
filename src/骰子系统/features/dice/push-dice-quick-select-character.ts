// @ts-nocheck
/**
 * push-dice-quick-select-character.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { getDisplayName } from '../../entities/name-alias';
export function createPushDiceQuickSelectCharacter(deps: any) {
  const pushDiceQuickSelectCharacter = (list: string[], name: unknown, preferFront = false): void => {
    const displayName = getDisplayName(String(name ?? '').trim());
    if (!displayName || list.some(existing => deps.characterNamesMatch(existing, displayName))) return;
    if (preferFront) {
      list.unshift(displayName);
    } else {
      list.push(displayName);
    }
  };
  return pushDiceQuickSelectCharacter;
}
