// @ts-nocheck
/**
 * clone-acu-dice-api-value.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCloneAcuDiceApiValue(deps: any) {
  const cloneAcuDiceApiValue = value => {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  };
  return cloneAcuDiceApiValue;
}
