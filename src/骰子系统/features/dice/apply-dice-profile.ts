// @ts-nocheck
/**
 * apply-dice-profile.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DiceProfileDB } from '../../shared/storage/dice-profile-db';
import { Store } from '../../shared/storage/store';
export function createApplyDiceProfile(deps: any) {
  const applyDiceProfile = async (
    profileId: string,
    options: DiceProfileApplyOptions = {},
  ): Promise<DiceConfigBackupApplyStats> => {
    const profile = await DiceProfileDB.get(profileId);
    if (!profile) throw new Error('未找到配置方案');
    const moduleIds = deps.normalizeDiceProfileModuleIds(options.moduleIds || profile.moduleIds, profile.backup);
    if (options.confirm) {
      const confirmed = await deps.showDiceProfileApplyConfirm(profile, moduleIds);
      if (!confirmed) throw new Error('已取消应用配置方案');
    }
    if (options.createSnapshot !== false) {
      await deps.createDiceProfilePreApplySnapshot(profile);
    }
    const stats = await deps.applyDiceConfigBackup(profile.backup, moduleIds);
    const appliedAt = new Date().toISOString();
    const nextProfile = { ...profile, lastAppliedAt: appliedAt, savedAt: appliedAt, updatedAt: appliedAt };
    await deps.saveDiceProfileRecord(nextProfile);
    Store.set(deps.DICE_PROFILE_LAST_APPLIED_STORAGE_KEY, {
      id: profile.id,
      name: profile.name,
      fingerprint: profile.fingerprint,
      appliedAt,
    });
    return stats;
  };
  return applyDiceProfile;
}
