// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=20「角色名称解析与别名系统」
// 原行范围：8106-8989（含 banner 8096-8989）；拆分批次 7；外部 closure 依赖：30（AvatarManager@19 / replaceUserPlaceholders@19 / getPlayerName@19 / getPersonaName@19 / getDisplayPlayerName@19 / createDialogueIndentRenderer(import) / getConfig@30 / DEFAULT_CONFIG@29 / cachedRawData@29 / getTableData@30 / processJsonData@30 / getAvatarLookupNames@19 / LocalAvatarDB@17 / RenderPresetManager@11 / escapeHtml@3 / getTavernHostDocument@29 / isNpcTableName@1 / getDiceConfig@21 / LOCATION_EMOJI_MAP(import) / ELEMENT_EMOJI_MAP(import) / resolveDashboardCustomTableNameIconContextInfo@29 / resolveGlobalInteractionSectionMeta@29 / resolveCustomTableNameIcon@29 / isCustomTableNameIconImageUrlValid@29 / CustomTableNameIconImageDB@29 / getGachaRewardTargetTableLabel@45 / getGachaRewardParseResult@45 / getGachaRewardTargetOptions@45 / normalizeGachaTargetTable@45 / isRenderableImageUrlValid@3）
// 接线说明：AvatarManager/getAvatarLookupNames/getDisplayPlayerName/getPersonaName/getPlayerName/replaceUserPlaceholders 已拆至 favorites/favorites-manager.ts、LocalAvatarDB 已拆至 favorites/local-avatar-db.ts、
//   escapeHtml/isRenderableImageUrlValid 已拆至 favorites/bookmark-manager.ts、isNpcTableName 已拆至 engine/primary-keys.ts、
//   RenderPresetManager@11 与 getDiceConfig@21 同批次拆至 presets/render-preset-manager.ts / engine/mvu-visualizer.ts（均不引用本文件，无循环）直接 import；
//   createDialogueIndentRenderer/LOCATION_EMOJI_MAP/ELEMENT_EMOJI_MAP 为 index.ts 既有模块级 import，随本文件迁移（index.ts 侧同步移除不再使用的同名 import）；
//   getConfig/getTableData/processJsonData@30、DEFAULT_CONFIG/cachedRawData/getTavernHostDocument/resolveDashboardCustomTableNameIconContextInfo/resolveGlobalInteractionSectionMeta/resolveCustomTableNameIcon/isCustomTableNameIconImageUrlValid/CustomTableNameIconImageDB@29、
//   getGachaRewardTargetTableLabel/getGachaRewardParseResult/getGachaRewardTargetOptions/normalizeGachaTargetTable@45 定义于 index.ts IIFE 内无法 export，采用运行时注入：
//   index.ts IIFE 末尾调用 __wireCharacterNameResolverDeps({...}) 注入；
//   未注入时模块级引用为 null（全部仅在运行时函数内调用；dialogueIndentRenderer 构造期仅捕获闭包不调用，注入先于任何渲染，与 IIFE 内原时序等价）。
//   substitudeMacros/formatAsTavernRegexedString/builtin/retrieveDisplayedMessage/getChatMessages/$ 为全局符号（IIFE 内亦无声明），无需接线。

import { AvatarManager, getAvatarLookupNames, getDisplayPlayerName, getPersonaName, getPlayerName, replaceUserPlaceholders } from '../favorites/favorites-manager';
import { LocalAvatarDB } from '../favorites/local-avatar-db';
import { escapeHtml, isRenderableImageUrlValid } from '../favorites/bookmark-manager';
import { isNpcTableName } from '../engine/primary-keys';
import { ELEMENT_EMOJI_MAP, LOCATION_EMOJI_MAP } from '../engine/emoji-maps';
import { createDialogueIndentRenderer } from '../ui/dialogue-indent-renderer';
import { RenderPresetManager } from '../presets/render-preset-manager';
import { getDiceConfig } from './mvu-visualizer';

let getConfig = null;
let DEFAULT_CONFIG = null;
let cachedRawData = null;
let getTableData = null;
let processJsonData = null;
let getTavernHostDocument = null;
let resolveDashboardCustomTableNameIconContextInfo = null;
let resolveGlobalInteractionSectionMeta = null;
let resolveCustomTableNameIcon = null;
let isCustomTableNameIconImageUrlValid = null;
let CustomTableNameIconImageDB = null;
let getGachaRewardTargetTableLabel = null;
let getGachaRewardParseResult = null;
let getGachaRewardTargetOptions = null;
let normalizeGachaTargetTable = null;

export function __wireCharacterNameResolverDeps(deps) {
  getConfig = deps.getConfig;
  DEFAULT_CONFIG = deps.DEFAULT_CONFIG;
  cachedRawData = deps.cachedRawData;
  getTableData = deps.getTableData;
  processJsonData = deps.processJsonData;
  getTavernHostDocument = deps.getTavernHostDocument;
  resolveDashboardCustomTableNameIconContextInfo = deps.resolveDashboardCustomTableNameIconContextInfo;
  resolveGlobalInteractionSectionMeta = deps.resolveGlobalInteractionSectionMeta;
  resolveCustomTableNameIcon = deps.resolveCustomTableNameIcon;
  isCustomTableNameIconImageUrlValid = deps.isCustomTableNameIconImageUrlValid;
  CustomTableNameIconImageDB = deps.CustomTableNameIconImageDB;
  getGachaRewardTargetTableLabel = deps.getGachaRewardTargetTableLabel;
  getGachaRewardParseResult = deps.getGachaRewardParseResult;
  getGachaRewardTargetOptions = deps.getGachaRewardTargetOptions;
  normalizeGachaTargetTable = deps.normalizeGachaTargetTable;
}
  // ========================================
  // 角色名称解析与别名系统
  // ========================================

  /**
   * 解析逗号分隔的角色名称，提取主名称（display name）和别名
   * 规则：最长的名称为主key，长度相同时靠前的优先
   * 例如："千早爱音,千早,爱音" → { displayName: "千早爱音", aliases: ["千早", "爱音"] }
   * 例如："奥兹艾萨克，奥兹，艾萨克" → { displayName: "奥兹艾萨克", aliases: ["奥兹", "艾萨克"] }
   */
  const parseCharacterName = (rawName: string): { displayName: string; aliases: string[] } => {
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
  const getDisplayName = (rawName: string): string => {
    return parseCharacterName(rawName).displayName;
  };

  const CHARACTER_NAME_COLUMN_KEYS = ['姓名', '名称', '名字', '角色名', '人物名', '人物名称', 'name', 'Name'];
  const ATTRIBUTE_TABLE_NAME_COLUMN_KEYS = [
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

  const findNameColumnIndex = (headers: unknown[], fallbackIndex = 1): number => {
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

  const findExplicitAttributeTableNameColumnIndex = (headers: unknown[]): number => {
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

  const getRowDisplayName = (row: unknown[], headers: unknown[], fallbackIndex = 1): string => {
    const nameIndex = findNameColumnIndex(headers, fallbackIndex);
    return getDisplayName(String(row[nameIndex] || ''));
  };

  /**
   * 判断一个表格是否是角色相关表格（主角信息、NPC、角色等）
   * 用于决定是否对该表格的名称列应用 getDisplayName
   */
  const isCharacterTable = (tableName: string): boolean => {
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
  const NameAliasRegistry = {
    // alias → primaryName（自动检测，无冲突）
    _autoAliases: new Map<string, string>(),
    // 冲突别名：alias → [primaryName1, primaryName2, ...]
    _conflicts: new Map<string, string[]>(),
    // 所有主名称 → 原始名称（含逗号）的映射
    _displayNames: new Map<string, string>(),

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
    },

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
      const manualPrimary = AvatarManager.getPrimaryName(name);
      if (manualPrimary !== name) return manualPrimary;

      // 3. 检查自动检测的别名
      const autoPrimary = this._autoAliases.get(name);
      if (autoPrimary) return autoPrimary;

      return name;
    },

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
      const manualAliases = AvatarManager.load()[primaryName]?.aliases || [];
      for (const a of manualAliases) {
        if (!result.includes(a)) result.push(a);
      }

      return result;
    },

    /**
     * 获取冲突的别名信息
     */
    getConflicts(): Map<string, string[]> {
      return new Map(this._conflicts);
    },

    /**
     * 检查某个名称是否是已知的主名称
     */
    isDisplayName(name: string): boolean {
      return this._displayNames.has(name);
    },
  };

  const USER_NODE_KEY = '{{user}}';
  const USER_PLACEHOLDER_KEYS = [USER_NODE_KEY, '<user>'];

  const isUserPlaceholderKey = (name: string): boolean =>
    USER_PLACEHOLDER_KEYS.some(key => name.toLowerCase() === key.toLowerCase());

  type DiceTableCell = string | number | null;
  type DiceRawSheet = { name?: string; content?: DiceTableCell[][] };
  type DiceRawData = Record<string, DiceRawSheet>;

  interface CharacterAttributeRowLookup {
    sheetKey: string;
    sheet: { name?: string; content: DiceTableCell[][] };
    rowIndex: number;
    headers: DiceTableCell[];
    isUser: boolean;
  }

  const normalizeCharacterNameForCompare = (value: unknown): string => {
    return getDisplayName(String(value ?? '').trim())
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/\s+/g, '')
      .toLowerCase();
  };

  const pushUniqueNameCandidate = (candidates: string[], value: unknown): void => {
    const name = String(value ?? '').trim();
    if (!name) return;
    if (!candidates.includes(name)) candidates.push(name);
  };

  const getAvatarManualAliases = (name: string): string[] => {
    if (!name) return [];
    const avatarMap = AvatarManager.load() as Record<string, { aliases?: unknown[] } | undefined>;
    const data = avatarMap[name];
    if (!data || !Array.isArray(data.aliases)) return [];
    return data.aliases.map(alias => String(alias ?? '').trim()).filter(Boolean);
  };

  const getCharacterNameCandidates = (name: unknown, includeResolved = true): string[] => {
    const rawName = String(name ?? '').trim();
    if (!rawName) return [];

    const candidates: string[] = [];
    const addParsedName = (value: string): void => {
      const parsed = parseCharacterName(value);
      pushUniqueNameCandidate(candidates, value);
      pushUniqueNameCandidate(candidates, parsed.displayName);
      parsed.aliases.forEach(alias => pushUniqueNameCandidate(candidates, alias));
    };

    addParsedName(rawName);

    const replacedName = replaceUserPlaceholders(rawName);
    if (typeof replacedName === 'string' && replacedName !== rawName) {
      addParsedName(replacedName);
    }

    const displayName = getDisplayName(rawName);
    const replacedDisplayName = replaceUserPlaceholders(displayName);
    if (typeof replacedDisplayName === 'string' && replacedDisplayName !== displayName) {
      addParsedName(replacedDisplayName);
    }

    getAvatarManualAliases(rawName).forEach(alias => addParsedName(alias));
    if (displayName !== rawName) {
      getAvatarManualAliases(displayName).forEach(alias => addParsedName(alias));
    }

    if (includeResolved) {
      const resolvedName = NameAliasRegistry.resolve(rawName);
      if (resolvedName && resolvedName !== rawName) {
        addParsedName(resolvedName);
      }
    }

    return candidates;
  };

  const getUserCharacterNameCandidates = (): string[] => {
    const seeds: string[] = [...USER_PLACEHOLDER_KEYS, '主角'];
    [getPlayerName(), getPersonaName(), getDisplayPlayerName()].forEach(name => pushUniqueNameCandidate(seeds, name));
    USER_PLACEHOLDER_KEYS.forEach(key =>
      getAvatarManualAliases(key).forEach(alias => pushUniqueNameCandidate(seeds, alias)),
    );

    const candidates: string[] = [];
    seeds.forEach(seed => {
      getCharacterNameCandidates(seed).forEach(candidate => pushUniqueNameCandidate(candidates, candidate));
    });
    return candidates;
  };

  const isUserCharacterName = (name: unknown): boolean => {
    const rawName = String(name ?? '').trim();
    if (!rawName) return true;

    const userKeys = new Set(getUserCharacterNameCandidates().map(normalizeCharacterNameForCompare).filter(Boolean));
    return getCharacterNameCandidates(rawName).some(candidate => {
      const key = normalizeCharacterNameForCompare(candidate);
      return Boolean(key) && userKeys.has(key);
    });
  };

  const resolveCanonicalCharacterName = (name: unknown): string => {
    const rawName = String(name ?? '').trim();
    if (!rawName || isUserCharacterName(rawName)) return '<user>';
    return NameAliasRegistry.resolve(rawName);
  };

  const characterNamesMatch = (storedName: unknown, lookupName: unknown): boolean => {
    const lookupRaw = String(lookupName ?? '').trim();
    if (!lookupRaw) return isUserCharacterName(storedName);

    const storedIsUser = isUserCharacterName(storedName);
    const lookupIsUser = isUserCharacterName(lookupRaw);
    if (storedIsUser || lookupIsUser) return storedIsUser && lookupIsUser;

    const storedKeys = new Set(
      getCharacterNameCandidates(storedName).map(normalizeCharacterNameForCompare).filter(Boolean),
    );
    return getCharacterNameCandidates(lookupRaw).some(candidate => {
      const key = normalizeCharacterNameForCompare(candidate);
      return Boolean(key) && storedKeys.has(key);
    });
  };

  const dialogueIndentRenderer = createDialogueIndentRenderer({
    getConfig: () => getConfig(),
    getDefaultTheme: () => String(DEFAULT_CONFIG.theme),
    getCachedRawData: () => cachedRawData,
    getTableData: () => getTableData({ silent: true }),
    processJsonData: json => processJsonData(json),
    rebuildNameAliases: tables => NameAliasRegistry.rebuild(tables),
    getNameAliases: name => NameAliasRegistry.getAliases(name),
    resolveNameAlias: name => NameAliasRegistry.resolve(name),
    getAvatarLookupNames: name => getAvatarLookupNames(name),
    getAvatarAll: () => AvatarManager.getAll() as Record<string, { aliases?: unknown[] } | undefined>,
    getAvatarPrimaryName: name => AvatarManager.getPrimaryName(name),
    getAvatarAsync: name => AvatarManager.getAsync(name),
    getAvatarOffsetX: name => AvatarManager.getOffsetX(name),
    getAvatarOffsetY: name => AvatarManager.getOffsetY(name),
    getAvatarScale: name => AvatarManager.getScale(name),
    getAvatarImageColor: name => AvatarManager.getImageColor(name),
    getLocalAvatarNames: () => LocalAvatarDB.getAllNames() as Promise<string[]>,
    getTagFilter: () => RenderPresetManager.getDialogueIndentTagFilter(),
    isCharacterTable,
    findNameColumnIndex,
    getCharacterNameCandidates,
    getDisplayName,
    replaceUserPlaceholders: text => replaceUserPlaceholders(text),
    escapeHtml,
    formatMessageBeforeDialogueIndent: text => {
      let processedText = text;
      if (typeof substitudeMacros === 'function') {
        processedText = substitudeMacros(processedText);
      }
      if (typeof formatAsTavernRegexedString === 'function') {
        return String(formatAsTavernRegexedString(processedText, 'ai_output', 'display', { depth: 0 }));
      }
      return processedText;
    },
    formatRegexedMessageFragment: text => {
      if (typeof builtin !== 'undefined' && typeof builtin.renderMarkdown === 'function') {
        return builtin.renderMarkdown(text);
      }
      return escapeHtml(text).replace(/\n/g, '<br>');
    },
    getHostDocument: () => getTavernHostDocument(),
    getJQuery: () => $,
    retrieveDisplayedMessage: messageId => {
      if (typeof retrieveDisplayedMessage !== 'function') return null;
      try {
        return retrieveDisplayedMessage(messageId);
      } catch (error) {
        console.warn('[DICE]正文头像渲染获取显示楼层失败，改用选择器:', error);
        return null;
      }
    },
    emitMessageRendered: messageId => {
      try {
        const source = window.SillyTavern?.eventSource;
        const events = window.SillyTavern?.eventTypes || window.tavern_events;
        const eventName = events?.CHARACTER_MESSAGE_RENDERED;
        if (source && eventName) {
          void source.emit(eventName, Number(messageId));
        }
      } catch (error) {
        console.warn('[DICE]正文头像渲染通知前端块重新渲染失败:', error);
      }
    },
    getLatestAssistantMessage: () => {
      try {
        const messages = getChatMessages(-1);
        const latest = Array.isArray(messages) ? messages[0] : null;
        if (!latest || latest.role !== 'assistant' || latest.is_system || latest.is_hidden) return null;
        return latest;
      } catch (error) {
        console.warn('[DICE]正文头像渲染读取最新楼层失败:', error);
        return null;
      }
    },
    warn: (message, error) => console.warn(`[DICE]${message}:`, error),
  });

  const scheduleDialogueIndentRender = (): void => dialogueIndentRenderer.schedule();
  const refreshDialogueIndentRender = (): void => dialogueIndentRenderer.refreshNow();

  const isPlayerTableName = (tableName: string): boolean => {
    const normalized = String(tableName || '').toLowerCase();
    return tableName.includes('主角') || tableName.includes('玩家') || normalized.includes('player');
  };

  const isNpcLikeTableName = (tableName: string): boolean => {
    const normalized = String(tableName || '').toLowerCase();
    return (
      isNpcTableName(tableName) ||
      tableName.includes('人物') ||
      tableName.includes('NPC') ||
      tableName.includes('角色') ||
      tableName.includes('对象') ||
      normalized.includes('character')
    );
  };

  const findAttributeColumnIndices = (headers: unknown[], includeSkill = false): number[] => {
    const cols: number[] = [];
    headers.forEach((header, idx) => {
      const text = String(header || '');
      if (text.includes('属性') || (includeSkill && text.includes('技能'))) {
        cols.push(idx);
      }
    });
    return cols;
  };

  const pickFallbackAttributeColumn = (cols: number[], headers: unknown[]): number => {
    if (cols.length === 0) return -1;
    const baseCol = cols.find(col => String(headers[col] || '').includes('基础属性'));
    if (baseCol !== undefined) return baseCol;
    const specialCol = cols.find(col => {
      const text = String(headers[col] || '');
      return text.includes('特有属性') || text.includes('特别属性');
    });
    if (specialCol !== undefined) return specialCol;
    return cols[0];
  };

  const findPrimaryAttributeColumns = (headers: unknown[]): { baseColIndex: number; specialColIndex: number } => {
    let baseColIndex = -1;
    let specialColIndex = -1;

    headers.forEach((header, idx) => {
      const text = String(header || '');
      if (text.includes('基础属性')) {
        baseColIndex = idx;
      } else if (text.includes('特有属性') || text.includes('特别属性')) {
        specialColIndex = idx;
      }
    });

    if (baseColIndex < 0) {
      const genericCol = findAttributeColumnIndices(headers).find(col => {
        const text = String(headers[col] || '');
        return !text.includes('特有') && !text.includes('特别');
      });
      baseColIndex = genericCol ?? -1;
    }

    return { baseColIndex, specialColIndex };
  };

  const findCharacterAttributeRow = (
    characterName: unknown,
    rawData: DiceRawData | null | undefined,
  ): CharacterAttributeRowLookup | null => {
    if (!rawData) return null;

    const wantsUser = isUserCharacterName(characterName);
    const data = rawData as DiceRawData;

    for (const key in data) {
      const sheet = data[key];
      if (!sheet?.name || !Array.isArray(sheet.content)) continue;
      const sheetName = sheet.name;
      const headers = (sheet.content[0] || []) as DiceTableCell[];
      const explicitNameIdx = findExplicitAttributeTableNameColumnIndex(headers);
      const canScanAttributeTable = findAttributeColumnIndices(headers).length > 0 && explicitNameIdx >= 0;

      if (isPlayerTableName(sheetName) && sheet.content[1]) {
        const playerRow = sheet.content[1];
        const nameIdx = findNameColumnIndex(headers);
        const playerName = String(playerRow[nameIdx] || '');
        if (wantsUser || characterNamesMatch(playerName, characterName)) {
          return {
            sheetKey: key,
            sheet: sheet as { name?: string; content: DiceTableCell[][] },
            rowIndex: 1,
            headers,
            isUser: true,
          };
        }
      }

      if (!wantsUser && !isPlayerTableName(sheetName) && (isNpcLikeTableName(sheetName) || canScanAttributeTable)) {
        const nameIdx = explicitNameIdx >= 0 ? explicitNameIdx : findNameColumnIndex(headers);
        for (let rowIndex = 1; rowIndex < sheet.content.length; rowIndex++) {
          const row = sheet.content[rowIndex];
          if (!row) continue;
          if (characterNamesMatch(String(row[nameIdx] || ''), characterName)) {
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

  const resolveUserGraphName = (name: string): string => {
    const displayName = getDisplayName(String(name || '').trim());
    if (!displayName) return displayName;

    const avatarPrimary = AvatarManager.getPrimaryName(displayName);
    if (
      isUserPlaceholderKey(displayName) ||
      isUserPlaceholderKey(avatarPrimary) ||
      isUserCharacterName(displayName) ||
      isUserCharacterName(avatarPrimary)
    ) {
      return USER_NODE_KEY;
    }

    const userAliases = new Set<string>(USER_PLACEHOLDER_KEYS);
    USER_PLACEHOLDER_KEYS.forEach(key => {
      const aliases = AvatarManager.load()[key]?.aliases || [];
      aliases.forEach(alias => {
        if (alias) userAliases.add(alias);
      });
    });

    const personaName = getPersonaName();
    if (personaName) userAliases.add(getDisplayName(personaName));

    const diceCfg = getDiceConfig();
    if (diceCfg.autoMergeProtagonist !== false) {
      userAliases.add('主角');
      const playerName = getPlayerName();
      if (playerName) userAliases.add(getDisplayName(playerName));
    }

    const normalizedUserAliases = [...userAliases].map(alias => alias.toLowerCase());
    const candidates = [displayName, avatarPrimary, NameAliasRegistry.resolve(displayName)]
      .filter(Boolean)
      .map(candidate => candidate.toLowerCase());

    if (candidates.some(candidate => normalizedUserAliases.includes(candidate))) {
      return USER_NODE_KEY;
    }

    return avatarPrimary;
  };

  // 渲染图标：支持 fa:xxx 简写格式和原生emoji
  const renderIcon = (icon: string | null): string => {
    if (!icon) return '';
    if (icon.startsWith('fa:')) {
      const name = icon.slice(3);
      return `<i class="fa-solid fa-${name} acu-icon"></i>`;
    }
    if (icon.startsWith('ti:')) {
      const name = icon.slice(3);
      return `<i class="ti ti-${name} acu-icon"></i>`;
    }
    return escapeHtml(icon); // 原样返回emoji
  };

  const getLocationEmoji = name => {
    if (!name) return null;
    const lowerName = name.toLowerCase();
    for (const [pattern, emoji] of LOCATION_EMOJI_MAP) {
      if (pattern.test(lowerName)) return emoji;
    }
    return null;
  };

  // 获取地点名的所有候选emoji（用于去重分配）
  const getEmojiCandidates = (name: string): string[] => {
    if (!name) return [];
    const lowerName = name.toLowerCase();
    const candidates: string[] = [];
    for (const [pattern, emoji] of LOCATION_EMOJI_MAP) {
      if (pattern.test(lowerName)) {
        candidates.push(emoji);
      }
    }
    return candidates;
  };

  // 批量分配emoji，实现去重（最短名称优先）
  const resolveBatchLocationEmojis = (names: string[]): Map<string, string | null> => {
    // 1. 计算每个地点的候选列表
    const candidatesMap = new Map<string, string[]>();
    for (const name of names) {
      candidatesMap.set(name, getEmojiCandidates(name));
    }

    // 2. 按长度排序（最短优先），同长度按字母序
    const sortedNames = [...names].sort((a, b) => {
      if (a.length !== b.length) return a.length - b.length;
      return a.localeCompare(b);
    });

    // 3. 贪心分配
    const usedEmojis = new Set<string>();
    const result = new Map<string, string | null>();

    for (const name of sortedNames) {
      const candidates = candidatesMap.get(name) || [];
      const available = candidates.find(e => !usedEmojis.has(e));
      if (available) {
        result.set(name, available);
        usedEmojis.add(available);
      } else {
        // 所有候选都被占用，回退到第一个候选（允许重复显示）
        result.set(name, candidates.length > 0 ? candidates[0] : null);
      }
    }

    return result;
  };

  const getElementEmoji = (name, type) => {
    if (!name && !type) return null;
    const lowerName = name?.toLowerCase();
    const lowerType = type?.toLowerCase();
    for (const [pattern, emoji] of ELEMENT_EMOJI_MAP) {
      if (lowerName && pattern.test(lowerName)) return emoji;
    }
    for (const [pattern, emoji] of ELEMENT_EMOJI_MAP) {
      if (lowerType && pattern.test(lowerType)) return emoji;
    }
    return null;
  };

  const renderThemeIconContent = (icon: string | null | undefined): string => {
    if (!icon) return '<i class="fa-solid fa-cube"></i>';
    if (icon.startsWith('fa:')) {
      return `<i class="fa-solid fa-${icon.slice(3)}"></i>`;
    }
    if (icon.startsWith('ti:')) {
      return `<i class="ti ti-${icon.slice(3)}"></i>`;
    }
    return escapeHtml(icon);
  };

  const createCustomTableNameIconContext = (
    moduleId:
      | 'table-name'
      | 'item'
      | 'equipment'
      | 'faction'
      | 'shop'
      | 'global-interaction-panel'
      | 'global-interaction-map-marker',
    tableName: unknown,
    section: 'table' | 'item' | 'equipment' | 'faction' | 'shop' | 'map' | 'task' | 'skill' | 'generic',
    name: unknown,
  ): CustomTableNameIconContext => ({
    moduleId,
    tableName: String(tableName ?? '').trim(),
    section,
    name: String(name ?? '').trim(),
  });

  const createGlobalInteractionCustomTableNameIconContext = (
    tableName: unknown,
    name: unknown,
  ): CustomTableNameIconContext | null => {
    const normalizedTableName = String(tableName ?? '').trim();
    const normalizedName = String(name ?? '').trim();
    if (!normalizedTableName || !normalizedName) return null;
    const dashboardContextInfo = resolveDashboardCustomTableNameIconContextInfo(normalizedTableName);
    if (dashboardContextInfo) {
      return createCustomTableNameIconContext(
        dashboardContextInfo.moduleId,
        normalizedTableName,
        dashboardContextInfo.section,
        normalizedName,
      );
    }
    const meta = resolveGlobalInteractionSectionMeta(normalizedTableName);
    const section = meta.kind as CustomTableNameIconSection;
    if (section === 'character') return null;
    const moduleId = section === 'map' ? 'global-interaction-map-marker' : 'global-interaction-panel';
    return createCustomTableNameIconContext(moduleId, normalizedTableName, section, normalizedName);
  };

  const renderAsyncImageIconSlotContent = (
    fallbackContent: string,
    options: { url?: string | null; localKey?: string | null },
  ): string => {
    const url = String(options.url || '').trim();
    const localKey = String(options.localKey || '').trim();
    if (!url && !localKey) return fallbackContent;
    const sourceClass = url ? 'acu-custom-table-name-url-icon' : 'acu-custom-table-name-local-icon';
    const sourceAttr = url
      ? ` data-custom-table-name-icon-url="${escapeHtml(url)}"`
      : ` data-custom-table-name-icon-local-key="${escapeHtml(localKey)}"`;
    return `<span class="acu-custom-table-name-icon-slot acu-custom-table-name-icon ${sourceClass}"${sourceAttr} style="display:inline-flex;align-items:center;justify-content:center;width:100%;height:100%;border-radius:inherit;overflow:hidden;">${fallbackContent}</span>`;
  };

  const renderCustomTableNameIconContent = (
    fallbackContent: string,
    context?: CustomTableNameIconContext | null,
  ): string => {
    const resolved = resolveCustomTableNameIcon('fa-table', context);
    if (!resolved.entry) return fallbackContent;
    if (resolved.entry.sourceType === 'url') {
      const url = String(resolved.entry.imageUrl || '').trim();
      if (!url || !isCustomTableNameIconImageUrlValid(url) || CustomTableNameIconImageDB.hasUrlFailed(url)) {
        return fallbackContent;
      }
      return renderAsyncImageIconSlotContent(fallbackContent, { url });
    }
    const localKey = String(resolved.entry.localIconKey || '').trim();
    if (!localKey || CustomTableNameIconImageDB.hasLocalKeyFailed(localKey)) return fallbackContent;
    return renderAsyncImageIconSlotContent(fallbackContent, { localKey });
  };

  const getGachaItemCustomTableNameIconContext = (
    item: Pick<GachaItemDefinition, 'name' | 'rewardTarget' | 'targetTable' | 'targetColumns'>,
    rawDataOverride?: unknown,
  ): CustomTableNameIconContext | null => {
    const target: GachaRewardTarget = item.rewardTarget === 'equipment' ? 'equipment' : 'inventory';
    let tableName = getGachaRewardTargetTableLabel(target);
    try {
      const parsed = getGachaRewardParseResult(
        rawDataOverride || cachedRawData || getTableData(),
        target,
        getGachaRewardTargetOptions(item),
      );
      tableName = parsed.tableName || tableName;
    } catch {
      tableName = normalizeGachaTargetTable(item.targetTable) || tableName;
    }
    return createCustomTableNameIconContext(
      target === 'equipment' ? 'equipment' : 'item',
      tableName,
      target === 'equipment' ? 'equipment' : 'item',
      item.name,
    );
  };

  const renderGachaItemIconContent = (
    item: Pick<GachaItemDefinition, 'name' | 'type' | 'icon'>,
    customContext?: CustomTableNameIconContext | null,
  ): string => {
    const fallback = renderThemeIconContent(item.icon || getElementEmoji(item.name, item.type));
    return renderCustomTableNameIconContent(fallback, customContext);
  };

  const applyAsyncImageUrlToElement = (
    element: HTMLElement,
    url: string,
    stateKey: string,
    options?: { onError?: () => void },
  ) => {
    const normalizedUrl = String(url || '').trim();
    if (!normalizedUrl || !isRenderableImageUrlValid(normalizedUrl)) return;
    if (!element.dataset.customIconFallbackHtml) {
      element.dataset.customIconFallbackHtml = element.innerHTML;
    }
    element.dataset[stateKey] = normalizedUrl;
    element.style.backgroundImage = '';
    element.classList.remove('has-image');
    const image = new Image();
    image.alt = '';
    image.decoding = 'async';
    image.draggable = false;
    image.className = 'acu-custom-async-image';
    image.style.display = 'block';
    image.style.width = '100%';
    image.style.height = '100%';
    image.style.maxWidth = '100%';
    image.style.maxHeight = '100%';
    image.style.objectFit = 'cover';
    image.style.objectPosition = 'center';
    image.style.borderRadius = 'inherit';
    image.style.background = 'transparent';
    image.style.pointerEvents = 'none';
    image.onload = () => {
      if (!element.isConnected || element.dataset[stateKey] !== normalizedUrl) return;
      element.style.backgroundImage = '';
      element.classList.add('has-image');
      element.innerHTML = '';
      element.appendChild(image);
    };
    image.onerror = () => {
      if (!element.isConnected || element.dataset[stateKey] !== normalizedUrl) return;
      element.style.backgroundImage = '';
      element.classList.remove('has-image');
      const fallbackHtml = element.dataset.customIconFallbackHtml;
      if (typeof fallbackHtml === 'string') {
        element.innerHTML = fallbackHtml;
      }
      options?.onError?.();
    };
    image.src = normalizedUrl;
  };

  const hydrateCustomTableNameIconsIn = (root: HTMLElement | JQuery<HTMLElement> | Document = document) => {
    const rootEl = root instanceof HTMLElement || root instanceof Document ? root : root[0];
    if (!rootEl) return;
    rootEl
      .querySelectorAll<HTMLElement>('.acu-custom-table-name-url-icon[data-custom-table-name-icon-url]')
      .forEach(element => {
        const url = String(element.dataset.customTableNameIconUrl || '').trim();
        if (!url || !isCustomTableNameIconImageUrlValid(url) || CustomTableNameIconImageDB.hasUrlFailed(url)) return;
        applyAsyncImageUrlToElement(element, url, 'customTableNameIconResolvedUrl', {
          onError: () => {
            CustomTableNameIconImageDB.markUrlFailed(url);
          },
        });
      });
    rootEl
      .querySelectorAll<HTMLElement>('.acu-custom-table-name-local-icon[data-custom-table-name-icon-local-key]')
      .forEach(element => {
        const localKey = String(element.dataset.customTableNameIconLocalKey || '').trim();
        if (!localKey || CustomTableNameIconImageDB.hasLocalKeyFailed(localKey)) return;
        void CustomTableNameIconImageDB.get(localKey)
          .then(url => {
            if (!url) {
              CustomTableNameIconImageDB.markLocalKeyFailed(localKey);
              return;
            }
            if (!element.isConnected) return;
            applyAsyncImageUrlToElement(element, url, 'customTableNameIconResolvedUrl', {
              onError: () => {
                CustomTableNameIconImageDB.markLocalKeyFailed(localKey);
              },
            });
          })
          .catch(() => {
            CustomTableNameIconImageDB.markLocalKeyFailed(localKey);
          });
      });
  };
export {
  parseCharacterName,
  getDisplayName,
  CHARACTER_NAME_COLUMN_KEYS,
  ATTRIBUTE_TABLE_NAME_COLUMN_KEYS,
  findNameColumnIndex,
  findExplicitAttributeTableNameColumnIndex,
  getRowDisplayName,
  isCharacterTable,
  NameAliasRegistry,
  USER_NODE_KEY,
  USER_PLACEHOLDER_KEYS,
  isUserPlaceholderKey,
  normalizeCharacterNameForCompare,
  pushUniqueNameCandidate,
  getAvatarManualAliases,
  getCharacterNameCandidates,
  getUserCharacterNameCandidates,
  isUserCharacterName,
  resolveCanonicalCharacterName,
  characterNamesMatch,
  dialogueIndentRenderer,
  scheduleDialogueIndentRender,
  refreshDialogueIndentRender,
  isPlayerTableName,
  isNpcLikeTableName,
  findAttributeColumnIndices,
  pickFallbackAttributeColumn,
  findPrimaryAttributeColumns,
  findCharacterAttributeRow,
  resolveUserGraphName,
  renderIcon,
  getLocationEmoji,
  getEmojiCandidates,
  resolveBatchLocationEmojis,
  getElementEmoji,
  renderThemeIconContent,
  createCustomTableNameIconContext,
  createGlobalInteractionCustomTableNameIconContext,
  renderAsyncImageIconSlotContent,
  renderCustomTableNameIconContent,
  getGachaItemCustomTableNameIconContext,
  renderGachaItemIconContent,
  applyAsyncImageUrlToElement,
  hydrateCustomTableNameIconsIn,
}; // __wireCharacterNameResolverDeps 已由头部 export function 导出
export type { DiceTableCell, DiceRawSheet, DiceRawData, CharacterAttributeRowLookup };
