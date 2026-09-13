// @ts-nocheck
/**
 * acu-dice-contest.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { AcuDiceContest } from './contest';
import { rollComplexDiceExpression } from '../../features/dice/dice-engine';
export function createAcuDiceContest(deps: any) {
  const acuDiceContest = new AcuDiceContest({
    getRawData: () => deps.getCachedRawData() || deps.getTableData(),
    processJsonData: (raw: any) => deps.processJsonData(raw),
    rebuildAliasRegistry: (tables: any) => deps.NameAliasRegistry.rebuild(tables),
    resolveCanonicalCharacterName: (name: string) => deps.resolveCanonicalCharacterName(name),
    getAttributeValueInternal: (name: string, attr: string) => deps.getAttributeValue(name, attr),
    getDiceConfig: () => deps.getDiceConfig(),
    normalizeDiceFormula: (f: string) => deps.normalizeCheckSuggestionDiceFormula(f),
    rollComplexDiceExpression: (expr: string) => rollComplexDiceExpression(expr),
    getSuccessLevel: (roll: number, target: number, sides: number) => deps.getSuccessLevel(roll, target, sides),
    appendContestHistory: (entry: any) => {
      deps.getContestHistory().push(entry);
      if (deps.getContestHistory().length > deps.getMAX_HISTORY()) {
        deps.getContestHistory().shift();
      }
    },
    emitEvent: (event: string, payload: any) => deps.emitEvent(event, payload),
  });
  return acuDiceContest;
}
