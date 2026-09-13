// @ts-nocheck
/**
 * find-character-attribute-row.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { findExplicitAttributeTableNameColumnIndex, findNameColumnIndex } from '../../entities/name-alias';
export function createFindCharacterAttributeRow(deps: any) {
  const findCharacterAttributeRow = (
    characterName: unknown,
    rawData: DiceRawData | null | undefined,
  ): CharacterAttributeRowLookup | null => {
    if (!rawData) return null;

    const wantsUser = deps.isUserCharacterName(characterName);
    const data = rawData as DiceRawData;

    for (const key in data) {
      const sheet = data[key];
      if (!sheet?.name || !Array.isArray(sheet.content)) continue;
      const sheetName = sheet.name;
      const headers = (sheet.content[0] || []) as DiceTableCell[];
      const explicitNameIdx = findExplicitAttributeTableNameColumnIndex(headers);
      const canScanAttributeTable = deps.findAttributeColumnIndices(headers).length > 0 && explicitNameIdx >= 0;

      if (deps.isPlayerTableName(sheetName) && sheet.content[1]) {
        const playerRow = sheet.content[1];
        const nameIdx = findNameColumnIndex(headers);
        const playerName = String(playerRow[nameIdx] || '');
        if (wantsUser || deps.characterNamesMatch(playerName, characterName)) {
          return {
            sheetKey: key,
            sheet: sheet as { name?: string; content: DiceTableCell[][] },
            rowIndex: 1,
            headers,
            isUser: true,
          };
        }
      }

      if (!wantsUser && !deps.isPlayerTableName(sheetName) && (deps.isNpcLikeTableName(sheetName) || canScanAttributeTable)) {
        const nameIdx = explicitNameIdx >= 0 ? explicitNameIdx : findNameColumnIndex(headers);
        for (let rowIndex = 1; rowIndex < sheet.content.length; rowIndex++) {
          const row = sheet.content[rowIndex];
          if (!row) continue;
          if (deps.characterNamesMatch(String(row[nameIdx] || ''), characterName)) {
            return {
              sheetKey: key,
              sheet: sheet as { name?: string; content: DiceTableCell[][] },
              rowIndex,
              headers,
              isUser: false,
            };
          }
        }
      }
    }

    return null;
  };
  return findCharacterAttributeRow;
}
