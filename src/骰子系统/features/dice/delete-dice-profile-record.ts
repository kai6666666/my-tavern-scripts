// @ts-nocheck
/**
 * delete-dice-profile-record.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DiceProfileDB } from '../../shared/storage/dice-profile-db';
export function createDeleteDiceProfileRecord(deps: any) {
  const deleteDiceProfileRecord = async (profileId: string): Promise<boolean> => {
    const deleted = await DiceProfileDB.delete(profileId);
    await deps.refreshDiceProfileIndex();
    return deleted;
  };
  return deleteDiceProfileRecord;
}
