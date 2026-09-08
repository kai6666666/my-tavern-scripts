// @ts-nocheck
/**
 * features/api/characters.ts
 * Feature-Sliced: 对外 API 的角色/属性读取方法（listCharacters/getCharacterAttributes/getAttributeValue）。
 * 通过 DI 注入表格数据与属性读取函数，与 monolith 解耦。
 */

export class AcuDiceCharacters {
  private readonly deps: {
    getRawData: () => any;
    processJsonData: (raw: any) => any;
    findTable: (tables: any, key: string) => any;
    parseRows: (tableResult: any, key: string) => any[];
    getFullAttributesForCharacter: (name: string) => Array<{ name: string; value: number }>;
    getAttributeValueInternal: (name: string, attribute: string) => number | null;
  };

  constructor(deps: {
    getRawData: () => any;
    processJsonData: (raw: any) => any;
    findTable: (tables: any, key: string) => any;
    parseRows: (tableResult: any, key: string) => any[];
    getFullAttributesForCharacter: (name: string) => Array<{ name: string; value: number }>;
    getAttributeValueInternal: (name: string, attribute: string) => number | null;
  }) {
    this.deps = deps;
  }

  listCharacters(): string[] {
    const rawData = this.deps.getRawData();
    if (!rawData) return [];

    const allTables = this.deps.processJsonData(rawData || {});
    const characters: string[] = [];

    const playerResult = this.deps.findTable(allTables, 'player');
    if (playerResult?.data?.rows?.length > 0) {
      characters.push('<user>');
    }

    const npcResult = this.deps.findTable(allTables, 'npc');
    if (npcResult) {
      const npcParsed = this.deps.parseRows(npcResult, 'npc');
      npcParsed.forEach(npc => {
        if (npc.name && typeof npc.name === 'string') {
          characters.push(npc.name);
        }
      });
    }

    return characters;
  }

  getCharacterAttributes(name: string): Array<{ name: string; value: number }> {
    if (!name || typeof name !== 'string') {
      throw new Error('[AcuDice] getCharacterAttributes() 需要一个有效的角色名');
    }
    return this.deps.getFullAttributesForCharacter(name);
  }

  getAttributeValue(name: string, attribute: string): number | null {
    if (!name || typeof name !== 'string') {
      throw new Error('[AcuDice] getAttributeValue() 需要一个有效的角色名');
    }
    if (!attribute || typeof attribute !== 'string') {
      throw new Error('[AcuDice] getAttributeValue() 需要一个有效的属性名');
    }
    return this.deps.getAttributeValueInternal(name, attribute);
  }
}