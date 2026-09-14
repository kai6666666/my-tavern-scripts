// @ts-nocheck
/**
 * download-dice-profile-tavern-regex.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createDownloadDiceProfileTavernRegex(deps: any) {
  const downloadDiceProfileTavernRegex = (profile: DiceProfileRecord): void => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const safeName = String(profile.name || 'acu_dice_profile').replace(/[\\/:*?"<>|]+/g, '_').slice(0, 60);
    deps.downloadJsonFile(
      JSON.stringify(deps.createDiceProfileTavernRegex(profile), null, 2),
      `${safeName}_角色卡内置方案正则_${timestamp}.json`,
    );
  };
  return downloadDiceProfileTavernRegex;
}
