// @ts-nocheck
/**
 * create-dice-profile-regex-id.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCreateDiceProfileRegexId(deps: any) {
  const createDiceProfileRegexId = (): string => {
    const randomUUID = globalThis.crypto?.randomUUID;
    return typeof randomUUID === 'function'
      ? randomUUID.call(globalThis.crypto)
      : deps.createDiceProfileRuntimeId('character_profile_regex');
  };
  return createDiceProfileRegexId;
}
