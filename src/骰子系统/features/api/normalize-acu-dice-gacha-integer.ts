// @ts-nocheck
/**
 * normalize-acu-dice-gacha-integer.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeAcuDiceGachaInteger(deps: any) {
  const normalizeAcuDiceGachaInteger = (value: unknown, label: string, options: { allowNegative?: boolean } = {}) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) throw new Error(`[AcuDice][Gacha] ${label} 必须是有效数字`);
    const integer = Math.trunc(numeric);
    if (!options.allowNegative && integer < 0) throw new Error(`[AcuDice][Gacha] ${label} 不能小于 0`);
    return integer;
  };
  return normalizeAcuDiceGachaInteger;
}
