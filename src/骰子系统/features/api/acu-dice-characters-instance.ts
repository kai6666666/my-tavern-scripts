// @ts-nocheck
/**
 * acu-dice-characters-instance.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { AcuDiceCharacters } from './characters';
export function createAcuDiceCharactersInstance(deps: any) {
  const acuDiceCharacters = new AcuDiceCharacters({
    getRawData: () => deps.getCachedRawData() || deps.getTableData(),
    processJsonData: (raw: any) => deps.processJsonData(raw),
    findTable: (tables: any, key: string) => deps.getDashboardDataParser().findTable(tables, key),
    parseRows: (tableResult: any, key: string) => deps.getDashboardDataParser().parseRows(tableResult, key),
    getFullAttributesForCharacter: (name: string) => deps.getFullAttributesForCharacter(name),
    getAttributeValueInternal: (name: string, attribute: string) => deps.getAttributeValue(name, attribute),
  });
  return acuDiceCharacters;
}
