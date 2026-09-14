// @ts-nocheck
/**
 * upsert-dice-profile-record.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { getAcuDiceProfileSourceKey } from '../../features/profiles/profile-packages';
export function createUpsertDiceProfileRecord(deps: any) {
  const upsertDiceProfileRecord = async (record: DiceProfileRecord): Promise<DiceProfileRecord> => {
    const records = await deps.getDiceProfileRecords();
    const sourceKey = getAcuDiceProfileSourceKey(record.source);
    const shouldUpdateSameSource =
      record.source?.type === 'character' || record.source?.type === 'character_card';
    const existing = shouldUpdateSameSource
      ? records.find(
          item => item.fingerprint === record.fingerprint && getAcuDiceProfileSourceKey(item.source) === sourceKey,
        )
      : null;
    const now = new Date().toISOString();
    const next = existing
      ? {
          ...record,
          id: existing.id,
          createdAt: existing.createdAt,
          lastAppliedAt: existing.lastAppliedAt,
          savedAt: now,
          updatedAt: now,
        }
      : record;
    return await deps.saveDiceProfileRecord(next);
  };
  return upsertDiceProfileRecord;
}
