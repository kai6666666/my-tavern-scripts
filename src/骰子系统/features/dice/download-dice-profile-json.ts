// @ts-nocheck
/**
 * download-dice-profile-json.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createDownloadDiceProfileJson(deps: any) {
  const downloadDiceProfileJson = (profile: DiceProfileRecord): void => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const safeName = String(profile.name || 'acu_dice_profile').replace(/[\\/:*?"<>|]+/g, '_').slice(0, 60);
    deps.downloadJsonFile(JSON.stringify(profile, null, 2), `${safeName}_${timestamp}.json`);
  };
  return downloadDiceProfileJson;
}
