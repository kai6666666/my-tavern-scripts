// @ts-nocheck
/**
 * is-dice-profile-character-source.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { AcuDiceProfileSource } from '../profiles/profile-packages';
export function createIsDiceProfileCharacterSource(deps: any) {
  const isDiceProfileCharacterSource = (source: AcuDiceProfileSource | undefined): boolean =>
    source?.type === 'character' || source?.type === 'character_card';
  return isDiceProfileCharacterSource;
}
