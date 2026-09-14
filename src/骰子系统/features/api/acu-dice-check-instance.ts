// @ts-nocheck
/**
 * acu-dice-check-instance.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { AcuDiceCheck } from './check';
import { rollComplexDiceExpression } from '../dice/dice-engine';
export function createAcuDiceCheckInstance(deps: any) {
  const acuDiceCheck = new AcuDiceCheck({
    getDiceConfig: () => deps.getDiceConfig(),
    getAttributeValueInternal: (name: string, attr: string) => deps.getAttributeValue(name, attr),
    rollComplexDiceExpression: (expr: string, ctx?: any) => rollComplexDiceExpression(expr, ctx),
    appendCheckHistory: (entry: any) => {
      deps.getCheckHistory().push(entry);
      if (deps.getCheckHistory().length > deps.getMAX_HISTORY()) {
        deps.getCheckHistory().shift();
      }
    },
    emitEvent: (event: string, payload: any) => deps.emitEvent(event, payload),
  });
  return acuDiceCheck;
}
