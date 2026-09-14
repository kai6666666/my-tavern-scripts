// @ts-nocheck
/**
 * custom-roll-mode.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCustomRollMode(deps: any) {
  const CUSTOM_ROLL_MODE = {
    id: '__custom__',
    name: '自定义',
  } as const;
  return CUSTOM_ROLL_MODE;
}
