// @ts-nocheck
/**
 * acu-dice-roll-instance.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { AcuDiceRoll } from './roll';
export function createAcuDiceRollInstance(deps: any) {
  const acuDiceRoll = new AcuDiceRoll({
    evaluateFormula: (expr: string, ctx: any) => deps.evaluateFormula(expr, ctx),
  });
  return acuDiceRoll;
}
