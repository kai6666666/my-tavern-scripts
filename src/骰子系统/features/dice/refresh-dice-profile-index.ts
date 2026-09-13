// @ts-nocheck
/**
 * refresh-dice-profile-index.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DiceProfileDB } from '../../shared/storage/dice-profile-db';
export function createRefreshDiceProfileIndex(deps: any) {
  const refreshDiceProfileIndex = async (): Promise<DiceProfileSummary[]> => {
    try {
      const records = await DiceProfileDB.getAll();
      const summaries = records.map(deps.toDiceProfileSummary);
      deps.saveDiceProfileIndex(summaries);
      return summaries;
    } catch (error) {
      console.warn('[DICE][PROFILE]Profile 索引刷新失败，使用本地索引兜底:', error);
      return deps.getDiceProfileIndex();
    }
  };
  return refreshDiceProfileIndex;
}
