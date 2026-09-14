// @ts-nocheck
/**
 * create-dice-profile-tavern-regex-replace-string.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { createAcuDiceProfileMarker } from '../profiles/profile-packages';
export function createCreateDiceProfileTavernRegexReplaceString(deps: any) {
  const createDiceProfileTavernRegexReplaceString = (profile: DiceProfileRecord): string =>
    [
      `<!-- 骰子系统配置注入：此角色卡正则只用于携带「${profile.name || '配置方案'}」，请勿删除下一行 ACUDICE_PROFILE_V1 标记。 -->`,
      createAcuDiceProfileMarker(profile),
    ].join('\n');
  return createDiceProfileTavernRegexReplaceString;
}
