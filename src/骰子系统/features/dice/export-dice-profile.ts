// @ts-nocheck
/**
 * export-dice-profile.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DiceProfileDB } from '../../shared/storage/dice-profile-db';
export function createExportDiceProfile(deps: any) {
  const exportDiceProfile = async (profileId: string): Promise<DiceProfileRecord> => {
    const profile = await DiceProfileDB.get(profileId);
    if (!profile) throw new Error('未找到配置方案');
    return profile;
  };
  return exportDiceProfile;
}
