// @ts-nocheck
/**
 * create-dice-profile-pre-apply-snapshot.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCreateDiceProfilePreApplySnapshot(deps: any) {
  const createDiceProfilePreApplySnapshot = async (sourceProfile?: DiceProfileRecord | null): Promise<DiceProfileRecord> => {
    const now = new Date().toISOString();
    const snapshot = await deps.saveCurrentDiceProfile({
      name: `快照 ${now.replace('T', ' ').slice(0, 16)}`,
      moduleIds: deps.getAllDiceConfigBackupModuleIds(),
      source: {
        type: 'snapshot',
        profileId: sourceProfile?.id,
        label: sourceProfile?.name || '手动应用',
      },
    });
    const records = await deps.getDiceProfileRecords();
    const snapshots = records
      .filter(record => record.source?.type === 'snapshot')
      .sort((left, right) => String(right.updatedAt || '').localeCompare(String(left.updatedAt || '')));
    await Promise.all(snapshots.slice(deps.DICE_PROFILE_PRE_APPLY_SNAPSHOT_LIMIT).map(record => deps.deleteDiceProfileRecord(record.id)));
    return snapshot;
  };
  return createDiceProfilePreApplySnapshot;
}
