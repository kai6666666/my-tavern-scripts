// @ts-nocheck
/**
 * save-current-dice-profile.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { ACU_DICE_PROFILE_FORMAT } from '../../features/profiles/profile-packages';
export function createSaveCurrentDiceProfile(deps: any) {
  const saveCurrentDiceProfile = async (
    options: DiceProfileSaveCurrentOptions = {},
  ): Promise<DiceProfileRecord> => {
    const moduleIds = deps.normalizeDiceProfileModuleIds(options.moduleIds, undefined);
    const backup = await deps.buildDiceConfigBackup(moduleIds);
    const now = new Date().toISOString();
    const record = deps.normalizeDiceProfileRecord(
      {
        format: ACU_DICE_PROFILE_FORMAT,
        id: deps.createDiceProfileRuntimeId(options.source?.type === 'snapshot' ? 'snapshot' : 'profile'),
        name: options.name || `骰子系统配置方案 ${now.slice(0, 10)}`,
        source: options.source || { type: 'user' },
        createdAt: now,
        updatedAt: now,
        moduleIds,
        backup,
      },
      { now, source: options.source || { type: 'user' } },
    );
    return await deps.upsertDiceProfileRecord(record);
  };
  return saveCurrentDiceProfile;
}
