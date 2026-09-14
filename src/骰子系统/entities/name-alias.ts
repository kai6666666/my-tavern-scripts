// @ts-nocheck
/**
 * entities/name-alias.ts
 * Feature-Sliced: entities 层 - 角色名别名域。
 * 包含纯助手（名称解析/列查找/表格判定）与运行时别名注册表（类化，DI 注入 AvatarManager 访问）。
 */

export const CHARACTER_NAME_COLUMN_KEYS = ['姓名', '名称', '名字', '角色名', '人物名', '人物名称', 'name', 'Name'];
export const ATTRIBUTE_TABLE_NAME_COLUMN_KEYS = [
  '姓名',
  '名称',
  '名字',
  '角色名',
  '人物名',
  '人物名称',
  '对象',
  '检定对象',
  '对象名',
  '对象名称',
  'name',
  'Name',
];

export const parseCharacterName = (rawName: string): { displayName: string; aliases: string[] } => {
  if (!rawName) return { displayName: '', aliases: [] };
  const trimmed = String(rawName).trim();
  const parts = trimmed
    .split(/[,，]/)
    .map(s => s.trim())
    .filter(Boolean);
  if (parts.length <= 1) return { displayName: trimmed, aliases: [] };

  // 找到最长的名称作为主key；长度相同时，靠前的优先
  let bestIdx = 0;
  for (let i = 1; i < parts.length; i++) {
    if (parts[i].length > parts[bestIdx].length) bestIdx = i;
  }
  const displayName = parts[bestIdx];
  const aliases = parts.filter((_, i) => i !== bestIdx);
  return { displayName, aliases };
};

/**
 * 获取角色的显示名称（主key）
 * 如果原始名称包含逗号分隔的多个名称，返回最长的那个
 * 如果不含逗号，原样返回
 */
export const getDisplayName = (rawName: string): string => {
  return parseCharacterName(rawName).displayName;
};

export const findNameColumnIndex = (headers: unknown[], fallbackIndex = 1): number => {
  const index = headers.findIndex(header => {
    const text = String(header || '');
    const lowerText = text.toLowerCase();
    return CHARACTER_NAME_COLUMN_KEYS.some(keyword => {
      const keywordText = String(keyword);
      return text.includes(keywordText) || lowerText.includes(keywordText.toLowerCase());
    });
  });
  if (index >= 0) return index;
  if (headers.length > fallbackIndex) return fallbackIndex;
  return headers.length > 0 ? 0 : fallbackIndex;
};

export const findExplicitAttributeTableNameColumnIndex = (headers: unknown[]): number => {
  return headers.findIndex(header => {
    const text = String(header || '').trim();
    if (!text) return false;
    const lowerText = text.toLowerCase();
    return ATTRIBUTE_TABLE_NAME_COLUMN_KEYS.some(keyword => {
      const keywordText = String(keyword);
      const lowerKeyword = keywordText.toLowerCase();
      if (keywordText === '名称') return text === '名称';
      if (keywordText === '对象' || keywordText === '检定对象') return text === keywordText;
      if (lowerKeyword === 'name') return lowerText === 'name';
      return text.includes(keywordText) || lowerText.includes(lowerKeyword);
    });
  });
};

export const getRowDisplayName = (row: unknown[], headers: unknown[], fallbackIndex = 1): string => {
  const nameIndex = findNameColumnIndex(headers, fallbackIndex);
  return getDisplayName(String(row[nameIndex] || ''));
};

/**
 * 判断一个表格是否是角色相关表格（主角信息、NPC、角色等）
 * 用于决定是否对该表格的名称列应用 getDisplayName
 */
export const isCharacterTable = (tableName: string): boolean => {
  const keywords = [
    '主角',
    '角色',
    '人物',
    '对象',
    'NPC',
    '伙伴',
    '队友',
    '宠物',
    '弟子',
    '成员',
    'player',
    'character',
  ];
  return keywords.some(kw => tableName.toLowerCase().includes(kw.toLowerCase()));
};

/**
 * 全局角色名别名注册表（运行时，非持久化）
 * 从角色表格中解析逗号分隔的名称，自动建立别名映射
 * 与 AvatarManager 的手动别名互补：手动别名优先级更高
 */
export class NameAliasRegistryCore {
  // alias → primaryName（自动检测，无冲突）
  private _autoAliases = new Map<string, string>();
  // 冲突别名：alias → [primaryName1, primaryName2, ...]
  private _conflicts = new Map<string, string[]>();
  // 所有主名称 → 原始名称（含逗号）的映射
  private _displayNames = new Map<string, string>();

  private readonly deps: {
    getManualPrimaryName: (name: string) => string;
    getAvatarMap: () => Record<string, { aliases?: unknown[] } | undefined>;
  };

  constructor(deps: {
    getManualPrimaryName: (name: string) => string;
    getAvatarMap: () => Record<string, { aliases?: unknown[] } | undefined>;
  }) {
    this.deps = deps;
  }

  /**
   * 从所有角色表重建别名映射
   * 扫描角色表中的名称列，解析逗号分隔格式，建立别名关系
   * 冲突的别名（同一别名出现在多个角色中）不会自动注册
   */
  rebuild(allTables: Record<string, { headers: string[]; rows: (string | number | null)[][]; key?: string }>) {
    this._autoAliases.clear();
    this._conflicts.clear();
    this._displayNames.clear();

    // alias → 拥有该别名的所有主名称
    const aliasOwners = new Map<string, string[]>();

    for (const tableName in allTables) {
      if (!isCharacterTable(tableName)) continue;
      const table = allTables[tableName];
      const headers = table.headers || [];
      const rows = table.rows || [];

      // 查找名称列
      const nameIdx = findNameColumnIndex(headers);

      rows.forEach(row => {
        const rawName = String(row[nameIdx] || '').trim();
        if (!rawName) return;
        const { displayName, aliases } = parseCharacterName(rawName);
        if (!displayName) return;

        // 记录 displayName → rawName 映射
        this._displayNames.set(displayName, rawName);

        if (aliases.length === 0) return;

        for (const alias of aliases) {
          if (!aliasOwners.has(alias)) aliasOwners.set(alias, []);
          const owners = aliasOwners.get(alias)!;
          if (!owners.includes(displayName)) owners.push(displayName);
        }
      });
    }

    // 分类：无冲突 → _autoAliases，有冲突 → _conflicts
    for (const [alias, owners] of aliasOwners) {
      if (owners.length === 1) {
        this._autoAliases.set(alias, owners[0]);
      } else {
        this._conflicts.set(alias, [...owners]);
      }
    }

    if (this._autoAliases.size > 0) {
      console.info(
        `[DICE]别名注册表: 自动注册 ${this._autoAliases.size} 个别名` +
          (this._conflicts.size > 0 ? `, ${this._conflicts.size} 个冲突已跳过` : ''),
      );
    }
  }

  /**
   * 将名称解析为主名称（display name）
   * 优先级：直接逗号解析 > AvatarManager手动别名 > 自动检测别名 > 原名
   */
  resolve(name: string): string {
    if (!name) return name;

    // 1. 如果名称本身包含逗号，直接解析出主名称
    if (name.includes(',') || name.includes('，')) {
      return getDisplayName(name);
    }

    // 2. 检查 AvatarManager 手动别名（优先级最高）
    const manualPrimary = this.deps.getManualPrimaryName(name);
    if (manualPrimary !== name) return manualPrimary;

    // 3. 检查自动检测的别名
    const autoPrimary = this._autoAliases.get(name);
    if (autoPrimary) return autoPrimary;

    return name;
  }

  /**
   * 获取某个主名称的所有别名（合并自动检测 + AvatarManager手动别名）
   */
  getAliases(primaryName: string): string[] {
    const result: string[] = [];

    // 自动检测的别名
    for (const [alias, owner] of this._autoAliases) {
      if (owner === primaryName && !result.includes(alias)) result.push(alias);
    }

    // AvatarManager 手动别名
    const manualAliases = this.deps.getAvatarMap()[primaryName]?.aliases || [];
    for (const a of manualAliases) {
      if (!result.includes(a)) result.push(a);
    }

    return result;
  }

  /**
   * 获取冲突的别名信息
   */
  getConflicts(): Map<string, string[]> {
    return new Map(this._conflicts);
  }

  /**
   * 检查某个名称是否是已知的主名称
   */
  isDisplayName(name: string): boolean {
    return this._displayNames.has(name);
  }
}