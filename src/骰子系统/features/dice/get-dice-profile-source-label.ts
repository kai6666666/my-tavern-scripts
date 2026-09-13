// @ts-nocheck
/**
 * get-dice-profile-source-label.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { AcuDiceProfileSource } from '../profiles/profile-packages';
export function createGetDiceProfileSourceLabel(deps: any) {
  const getDiceProfileSourceLabel = (source: AcuDiceProfileSource): string => {
    if (source.type === 'character' || source.type === 'character_card')
      return source.characterName ? `角色卡：${source.characterName}` : '角色卡';
    if (source.type === 'snapshot') return source.label ? `快照：${source.label}` : '快照';
    if (source.type === 'imported') return source.label ? `导入：${source.label}` : '导入';
    return '用户保存';
  };
  return getDiceProfileSourceLabel;
}
