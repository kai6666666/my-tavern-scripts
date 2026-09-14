// @ts-nocheck
/**
 * save-dice-profile-record.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DiceProfileDB } from '../../shared/storage/dice-profile-db';
export function createSaveDiceProfileRecord(deps: any) {
  const saveDiceProfileRecord = async (record: DiceProfileRecord): Promise<DiceProfileRecord> => {
    const saved = await DiceProfileDB.put(record);
    if (!saved) throw new Error('配置方案保存失败，IndexedDB 写入未完成');
    await deps.refreshDiceProfileIndex();
    return record;
  };
  return saveDiceProfileRecord;
}
