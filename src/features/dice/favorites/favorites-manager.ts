// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=19「FavoritesManager - 收藏夹业务逻辑层」
// 原行范围：7041-8094（含 banner 7039-8094）；拆分批次 6；外部 closure 依赖：9（FavoritesDB@18 / cachedRawData@29 / getTableData@30 / getRowDisplayName@20 / getDiceConfig@21 / Store@29 / STORAGE_KEY_AVATAR_MAP@3 / normalizeStorableImageUrl@3 / LocalAvatarDB@17）
// 接线说明：FavoritesDB@18、LocalAvatarDB@17 已拆出（同目录，不引用本文件，无循环）直接 import；
//   STORAGE_KEY_AVATAR_MAP/normalizeStorableImageUrl@3 随本批次拆至 bookmark-manager.ts（不引用本文件，无循环）直接 import；
//   cachedRawData/getRowDisplayName/getDiceConfig/Store@29、getTableData@30 定义于 index.ts IIFE 内无法 export，采用运行时注入：
//   index.ts IIFE 末尾调用 __wireFavoritesManagerDeps({ cachedRawData, getTableData, getRowDisplayName, getDiceConfig, Store }) 注入；
//   未注入时模块级引用为 null（方法仅在运行时调用，注入先于任何调用，与 IIFE 内原时序等价）。
//   getCurrentChatId/name1/getCharData/SillyTavern 为全局符号（IIFE 内同样未声明，getCurrentChatId 处有 typeof 保护），无需接线。

import { FavoritesDB } from './favorites-db';
import { LocalAvatarDB } from './local-avatar-db';
import { STORAGE_KEY_AVATAR_MAP, normalizeStorableImageUrl } from './bookmark-manager';
import type { FavoriteItem, DiceHistoryStatsSummary } from './favorites-db';

let cachedRawData = null;
let getTableData = null;
let getRowDisplayName = null;
let getDiceConfig = null;
let Store = null;

export function __wireFavoritesManagerDeps(deps) {
  cachedRawData = deps.cachedRawData;
  getTableData = deps.getTableData;
  getRowDisplayName = deps.getRowDisplayName;
  getDiceConfig = deps.getDiceConfig;
  Store = deps.Store;
}
  // ========================================
  // FavoritesManager - 收藏夹业务逻辑层
  // ========================================

  interface TableCompatibility {
    tableUid: string;
    tableName: string;
    mode: 'strict' | 'loose' | 'incompatible';
    matchedCols: string[];
    unmatchedCols: string[];
    matchRatio: number;
  }

  const FavoritesManager = {
    // 添加收藏
    async addFavorite(
      tableUid: string,
      tableName: string,
      header: string[],
      rowData: (string | number)[],
      tags: string[] = [],
    ): Promise<FavoriteItem | null> {
      try {
        const chatId = SillyTavern.getCurrentChatId() || '';
        const item: FavoriteItem = {
          id: crypto.randomUUID(),
          header: header,
          rowData: rowData,
          tags: tags,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          sourceInfo: {
            tableUid,
            tableName,
            chatId,
          },
        };

        const success = await FavoritesDB.add(item);
        if (success) {
          console.log('[DICE]FavoritesManager 添加收藏:', item.id);
          return item;
        }
        return null;
      } catch (e) {
        console.error('[DICE]FavoritesManager addFavorite error:', e);
        return null;
      }
    },

    // 更新收藏
    async updateFavorite(id: string, updates: Partial<FavoriteItem>): Promise<boolean> {
      try {
        const success = await FavoritesDB.update(id, updates);
        if (success) {
          console.log('[DICE]FavoritesManager 更新收藏:', id);
        }
        return success;
      } catch (e) {
        console.error('[DICE]FavoritesManager updateFavorite error:', e);
        return false;
      }
    },

    // 复制收藏
    async duplicateFavorite(id: string): Promise<FavoriteItem | null> {
      try {
        const original = await FavoritesDB.get(id);
        if (!original) return null;

        const copy: FavoriteItem = {
          ...original,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        const success = await FavoritesDB.add(copy);
        if (success) {
          console.log('[DICE]FavoritesManager 复制收藏:', id, '->', copy.id);
          return copy;
        }
        return null;
      } catch (e) {
        console.error('[DICE]FavoritesManager duplicateFavorite error:', e);
        return null;
      }
    },

    // 删除收藏
    async deleteFavorite(id: string): Promise<boolean> {
      try {
        const success = await FavoritesDB.delete(id);
        if (success) {
          console.log('[DICE]FavoritesManager 删除收藏:', id);
        }
        return success;
      } catch (e) {
        console.error('[DICE]FavoritesManager deleteFavorite error:', e);
        return false;
      }
    },

    // 添加标签
    async addTag(id: string, tag: string): Promise<boolean> {
      try {
        const item = await FavoritesDB.get(id);
        if (!item) return false;

        if (!item.tags.includes(tag)) {
          item.tags.push(tag);
          return await FavoritesDB.update(id, { tags: item.tags });
        }
        return true;
      } catch (e) {
        console.error('[DICE]FavoritesManager addTag error:', e);
        return false;
      }
    },

    // 移除标签
    async removeTag(id: string, tag: string): Promise<boolean> {
      try {
        const item = await FavoritesDB.get(id);
        if (!item) return false;

        const index = item.tags.indexOf(tag);
        if (index > -1) {
          item.tags.splice(index, 1);
          return await FavoritesDB.update(id, { tags: item.tags });
        }
        return true;
      } catch (e) {
        console.error('[DICE]FavoritesManager removeTag error:', e);
        return false;
      }
    },

    // 获取所有标签
    async getAllTags(): Promise<string[]> {
      return await FavoritesDB.getAllTags();
    },

    // 获取所有收藏
    async getAll(): Promise<FavoriteItem[]> {
      return await FavoritesDB.getAll();
    },

    // 按标签获取
    async getByTag(tag: string): Promise<FavoriteItem[]> {
      return await FavoritesDB.getByTag(tag);
    },

    // 按ID获取
    async getById(id: string): Promise<FavoriteItem | null> {
      return await FavoritesDB.get(id);
    },

    // 查找兼容表格
    findCompatibleTables(favorite: FavoriteItem, currentTables: Record<string, any>): TableCompatibility[] {
      const results: TableCompatibility[] = [];

      for (const uid in currentTables) {
        const table = currentTables[uid];
        if (!table || !table.content || !table.content[0]) continue;

        // 获取表头（去掉首列null）
        const tableHeader: string[] = table.content[0].slice(1).map((h: any) => String(h || ''));

        // 检查是否严格匹配
        const isStrict =
          favorite.header.length === tableHeader.length && favorite.header.every((h, i) => h === tableHeader[i]);

        // 计算匹配列
        const matchedCols = favorite.header.filter(h => tableHeader.includes(h));
        const unmatchedCols = favorite.header.filter(h => !tableHeader.includes(h));
        const matchRatio = favorite.header.length > 0 ? matchedCols.length / favorite.header.length : 0;

        if (isStrict) {
          results.push({
            tableUid: uid,
            tableName: table.name || uid,
            mode: 'strict',
            matchedCols,
            unmatchedCols,
            matchRatio: 1,
          });
        } else if (matchRatio > 0) {
          results.push({
            tableUid: uid,
            tableName: table.name || uid,
            mode: 'loose',
            matchedCols,
            unmatchedCols,
            matchRatio,
          });
        }
      }

      // 按匹配度排序（strict优先，然后按matchRatio降序）
      return results.sort((a, b) => {
        if (a.mode === 'strict' && b.mode !== 'strict') return -1;
        if (a.mode !== 'strict' && b.mode === 'strict') return 1;
        return b.matchRatio - a.matchRatio;
      });
    },

    // 映射行数据到目标表格
    mapRowToTable(favorite: FavoriteItem, targetHeader: string[]): (string | number | null)[] {
      const newRow: (string | number | null)[] = [null]; // 首列固定null
      for (const col of targetHeader) {
        const srcIndex = favorite.header.indexOf(col);
        newRow.push(srcIndex >= 0 ? favorite.rowData[srcIndex] : '');
      }
      return newRow;
    },

    // 导出收藏夹
    async exportFavorites(): Promise<string> {
      try {
        const items = await FavoritesDB.getAll();
        const exportData = {
          version: 1,
          exportedAt: Date.now(),
          items: items,
        };
        return JSON.stringify(exportData, null, 2);
      } catch (e) {
        console.error('[DICE]FavoritesManager exportFavorites error:', e);
        return '';
      }
    },

    // 导入收藏夹
    async importFavorites(jsonStr: string): Promise<{ added: number; updated: number } | null> {
      try {
        const data = JSON.parse(jsonStr);
        if (!data || !data.items || !Array.isArray(data.items)) {
          console.error('[DICE]FavoritesManager 导入格式无效');
          return null;
        }

        let added = 0;
        let updated = 0;

        for (const item of data.items) {
          if (!item.id || !item.header || !item.rowData) continue;

          const existing = await FavoritesDB.get(item.id);
          if (existing) {
            // 覆盖更新
            await FavoritesDB.update(item.id, {
              header: item.header,
              rowData: item.rowData,
              tags: item.tags || [],
              updatedAt: Date.now(),
              sourceInfo: item.sourceInfo,
            });
            updated++;
          } else {
            // 新增
            const newItem: FavoriteItem = {
              id: item.id,
              header: item.header,
              rowData: item.rowData,
              tags: item.tags || [],
              createdAt: item.createdAt || Date.now(),
              updatedAt: Date.now(),
              sourceInfo: item.sourceInfo,
            };
            await FavoritesDB.add(newItem);
            added++;
          }
        }

        console.log('[DICE]FavoritesManager 导入完成:', added, '新增,', updated, '更新');
        return { added, updated };
      } catch (e) {
        console.error('[DICE]FavoritesManager importFavorites error:', e);
        return null;
      }
    },
  };

  // [新增] 获取 SillyTavern 用户头像 URL
  const getUserAvatarUrl = () => {
    try {
      // 方法1: 从页面 DOM 中查找用户头像元素
      const w = window.parent || window;
      const $ = w.jQuery || window.jQuery;
      if ($) {
        // SillyTavern 用户头像通常在 #user_avatar_block img 或 .avatar[title="You"] img
        const $avatar = $('#user_avatar_block img').first();
        if ($avatar.length && $avatar.attr('src')) {
          return $avatar.attr('src');
        }
        // 备选：查找聊天中用户消息的头像
        const $userMes = $('.mes[is_user="true"]').last().find('.avatar img');
        if ($userMes.length && $userMes.attr('src')) {
          return $userMes.attr('src');
        }
      }
      // 方法2: 尝试从 SillyTavern API 获取
      const ST = w.SillyTavern || window.SillyTavern;
      if (ST && ST.getContext) {
        const ctx = ST.getContext();
        if (ctx && ctx.userAvatar) {
          return ctx.userAvatar;
        }
      }
    } catch (e) {
      console.warn('[DICE]ACU getUserAvatarUrl error:', e);
    }
    return null;
  };

  // [新增] 获取主角名字（用于判断是否是主角）
  const getPlayerName = () => {
    const rawData = cachedRawData || (typeof getTableData === 'function' ? getTableData() : null);
    if (rawData) {
      for (const key in rawData) {
        const sheet = rawData[key];
        if (sheet?.name?.includes('主角') && sheet.content?.[1]) {
          const headers = sheet.content[0] || [];
          const displayName = getRowDisplayName(sheet.content[1], headers);
          if (displayName) return displayName;
        }
      }
    }
    return null;
  };

  // [新增] 获取 SillyTavern Persona 名称（用于显示）
  const getPersonaName = () => {
    try {
      // 方法1: SillyTavern 标准 API
      const w = window.parent || window;
      if (w.SillyTavern?.getContext) {
        const ctx = w.SillyTavern.getContext();
        if (ctx?.name1) return ctx.name1;
      }
      // 方法2: 直接访问全局变量
      if (typeof name1 !== 'undefined' && name1) return name1;
      if (w.name1) return w.name1;
      // 方法3: 从 DOM 中查找
      const $ = w.jQuery || window.jQuery;
      if ($) {
        const $persona = $('#user_avatar_block .avatar-name, #persona_name_input').first();
        if ($persona.length) {
          const name = $persona.val?.() || $persona.text?.();
          if (name && name.trim()) return name.trim();
        }
      }
    } catch (e) {
      console.warn('[DICE]ACU getPersonaName error:', e);
    }
    return null;
  };

  // [新增] 获取用于显示的玩家名称（优先 Persona，其次主角表，最后默认值）
  const getDisplayPlayerName = () => {
    return getPersonaName() || getPlayerName() || '主角';
  };

  // [新增] 替换文本中的用户占位符为 Persona 名称（仅用于显示）
  const replaceUserPlaceholders = text => {
    if (!text || typeof text !== 'string') return text;
    const displayName = getDisplayPlayerName();
    // 替换 <user>、{{user}}（不区分大小写）
    let result = text.replace(/<user>/gi, displayName);
    result = result.replace(/\{\{user\}\}/gi, displayName);
    return result;
  };

  const USER_AVATAR_LOOKUP_KEYS = ['{{user}}', '<user>'] as const;

  const getAvatarLookupNames = (name: unknown): string[] => {
    const originalName = String(name || '').trim();
    const names = originalName ? [originalName] : [];
    const playerName = String(getPlayerName() || '').trim();
    const personaName = String(getPersonaName() || '').trim();
    const lowerName = originalName.toLowerCase();
    const autoMergeProtagonist = getDiceConfig().autoMergeProtagonist !== false;
    const isUserAvatar =
      USER_AVATAR_LOOKUP_KEYS.some(key => key.toLowerCase() === lowerName) ||
      (autoMergeProtagonist && originalName === '主角') ||
      (autoMergeProtagonist && Boolean(playerName) && originalName === playerName) ||
      (personaName ? originalName === personaName : false);

    if (isUserAvatar) {
      names.push(...USER_AVATAR_LOOKUP_KEYS);
    }

    return [...new Set(names.filter(Boolean))];
  };

  type DiceStatsScope = 'chat' | 'character' | 'global';

  interface DiceStatsContext {
    chatId: string;
    characterId: string;
  }

  const getDiceStatsContext = (): DiceStatsContext => {
    const ST = SillyTavern;
    let chatId = 'unknown_chat';
    let characterId = 'unknown_character';

    try {
      if (typeof getCurrentChatId === 'function') {
        const directChatId = getCurrentChatId();
        if (directChatId !== null && directChatId !== undefined) {
          const parsed = String(directChatId).trim();
          if (parsed) chatId = parsed;
        }
      }
      if (typeof ST?.getCurrentChatId === 'function') {
        const currentChatId = ST.getCurrentChatId();
        if (currentChatId !== null && currentChatId !== undefined) {
          const parsed = String(currentChatId).trim();
          if (parsed) chatId = parsed;
        }
      }
    } catch {
      // ignore
    }

    try {
      if (typeof getCharData === 'function') {
        const currentChar = getCharData('current', true);
        const avatarId = String(currentChar?.avatar || '').trim();
        if (avatarId) {
          characterId = avatarId;
        }
      }

      if (characterId === 'unknown_character') {
        const cid = ST?.characterId;
        const chars = ST?.characters;
        const idx = Number.parseInt(String(cid ?? ''), 10);
        if (!Number.isNaN(idx) && idx >= 0 && Array.isArray(chars) && idx < chars.length) {
          const avatarId = String(chars[idx]?.avatar || '').trim();
          if (avatarId) {
            characterId = avatarId;
          }
        }
      }
    } catch {
      // ignore
    }

    return { chatId, characterId };
  };

  const DICE_STATS_SCOPE_LABELS: Record<DiceStatsScope, string> = {
    chat: '本聊天',
    character: '本角色卡',
    global: '全局',
  };

  const isDiceStatsScopeUnavailable = (scope: DiceStatsScope, context: DiceStatsContext): boolean =>
    (scope === 'chat' && context.chatId === 'unknown_chat') ||
    (scope === 'character' && context.characterId === 'unknown_character');

  const renderDiceHistoryStatsHtml = (
    allStats: Record<DiceStatsScope, DiceHistoryStatsSummary>,
    scope: DiceStatsScope,
  ): string => {
    const activeStats = allStats[scope];
    const scopeUnavailable = isDiceStatsScopeUnavailable(scope, getDiceStatsContext());
    return `
      <div class="acu-history-stats-grid">
        <div class="acu-history-stat-card"><small>本聊天</small><strong>${allStats.chat.total}</strong></div>
        <div class="acu-history-stat-card"><small>本角色卡</small><strong>${allStats.character.total}</strong></div>
        <div class="acu-history-stat-card"><small>全局</small><strong>${allStats.global.total}</strong></div>
      </div>
      <div class="acu-history-stats-summary">
        <span>当前统计范围：${DICE_STATS_SCOPE_LABELS[scope]}</span>
        <div class="acu-history-stats-values">
          <span>总数：<b>${activeStats.total}</b></span>
          <span>普通：<b>${activeStats.checks}</b></span>
          <span>对抗：<b>${activeStats.contests}</b></span>
          <span>成功率：<b class="is-success">${activeStats.checkSuccessRate}%</b></span>
        </div>
      </div>
      ${scopeUnavailable ? '<div class="acu-history-scope-note">当前环境未识别到该范围ID，仅显示已识别范围数据。</div>' : ''}
    `;
  };

  type AvatarImageColorSource = 'manual' | 'auto';

  const normalizeAvatarHexColor = (value: unknown): string | null => {
    const raw = String(value ?? '').trim();
    const hex = raw.startsWith('#') ? raw.slice(1) : raw;
    if (/^[0-9a-fA-F]{3}$/.test(hex)) {
      return `#${hex
        .split('')
        .map(char => `${char}${char}`)
        .join('')
        .toUpperCase()}`;
    }
    if (/^[0-9a-fA-F]{6}$/.test(hex)) {
      return `#${hex.toUpperCase()}`;
    }
    return null;
  };

  const clampAvatarNumber = (value: unknown, min: number, max: number, fallback: number): number => {
    const num = Number(value);
    if (!Number.isFinite(num)) return fallback;
    return Math.max(min, Math.min(max, num));
  };

  const rgbToAvatarHex = (r: number, g: number, b: number): string => {
    const toHex = (value: number) =>
      Math.max(0, Math.min(255, Math.round(value)))
        .toString(16)
        .padStart(2, '0')
        .toUpperCase();
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const avatarHexToRgb = (value: unknown): { r: number; g: number; b: number } | null => {
    const color = normalizeAvatarHexColor(value);
    if (!color) return null;
    return {
      r: Number.parseInt(color.slice(1, 3), 16),
      g: Number.parseInt(color.slice(3, 5), 16),
      b: Number.parseInt(color.slice(5, 7), 16),
    };
  };

  const rgbToAvatarHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const delta = max - min;
    const l = (max + min) / 2;
    if (delta === 0) return { h: 0, s: 0, l };
    const s = delta / (1 - Math.abs(2 * l - 1));
    let h = 0;
    if (max === rn) {
      h = ((gn - bn) / delta) % 6;
    } else if (max === gn) {
      h = (bn - rn) / delta + 2;
    } else {
      h = (rn - gn) / delta + 4;
    }
    return { h: (h * 60 + 360) % 360, s, l };
  };

  const avatarHexToHsl = (value: unknown): { h: number; s: number; l: number } | null => {
    const rgb = avatarHexToRgb(value);
    if (!rgb) return null;
    return rgbToAvatarHsl(rgb.r, rgb.g, rgb.b);
  };

  const hslToAvatarHex = (h: number, s: number, l: number): string => {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hp = h / 60;
    const x = c * (1 - Math.abs((hp % 2) - 1));
    let r1 = 0;
    let g1 = 0;
    let b1 = 0;
    if (hp >= 0 && hp < 1) {
      r1 = c;
      g1 = x;
    } else if (hp < 2) {
      r1 = x;
      g1 = c;
    } else if (hp < 3) {
      g1 = c;
      b1 = x;
    } else if (hp < 4) {
      g1 = x;
      b1 = c;
    } else if (hp < 5) {
      r1 = x;
      b1 = c;
    } else {
      r1 = c;
      b1 = x;
    }
    const m = l - c / 2;
    return rgbToAvatarHex((r1 + m) * 255, (g1 + m) * 255, (b1 + m) * 255);
  };

  const getAvatarFallbackColor = (name: unknown): string => {
    const text = String(name ?? '').trim() || 'avatar';
    let hash = 2166136261;
    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    const hue = Math.abs(hash) % 360;
    const saturation = 0.54 + ((hash >>> 8) % 18) / 100;
    const lightness = 0.46 + ((hash >>> 16) % 14) / 100;
    return hslToAvatarHex(hue, saturation, lightness);
  };

  const isLikelyAvatarSkinTone = (h: number, s: number, l: number): boolean => {
    return h >= 16 && h <= 52 && s >= 0.18 && s <= 0.72 && l >= 0.34 && l <= 0.84;
  };

  const normalizeInferredAvatarColor = (r: number, g: number, b: number): string => {
    const hsl = rgbToAvatarHsl(r, g, b);
    const s = Math.max(0.28, Math.min(0.72, hsl.s));
    const l = Math.max(0.34, Math.min(0.66, hsl.l));
    return hslToAvatarHex(hsl.h, s, l);
  };

  const loadAvatarImageForColor = (source: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = 'async';
      if (!/^(blob|data):/i.test(source)) {
        image.crossOrigin = 'anonymous';
      }
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('头像图片无法读取'));
      image.src = source;
    });

  const inferAvatarImageColor = async (
    imageSource: string,
    options: { offsetX?: unknown; offsetY?: unknown; scale?: unknown } = {},
  ): Promise<string | null> => {
    const source = String(imageSource || '').trim();
    if (!source) return null;

    try {
      const image = await loadAvatarImageForColor(source);
      const sampleSize = 96;
      const canvas = document.createElement('canvas');
      canvas.width = sampleSize;
      canvas.height = sampleSize;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return null;

      ctx.clearRect(0, 0, sampleSize, sampleSize);
      const scale = clampAvatarNumber(options.scale, 80, 320, 150);
      const offsetX = clampAvatarNumber(options.offsetX, 0, 100, 50);
      const offsetY = clampAvatarNumber(options.offsetY, 0, 100, 50);
      const naturalWidth = image.naturalWidth || image.width;
      const naturalHeight = image.naturalHeight || image.height;
      if (!naturalWidth || !naturalHeight) return null;

      const drawWidth = sampleSize * (scale / 100);
      const drawHeight = drawWidth * (naturalHeight / naturalWidth);
      const left = (sampleSize - drawWidth) * (offsetX / 100);
      const top = (sampleSize - drawHeight) * (offsetY / 100);
      ctx.drawImage(image, left, top, drawWidth, drawHeight);

      const pixels = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
      const clusters = new Map<
        string,
        { r: number; g: number; b: number; weight: number; score: number; count: number }
      >();

      for (let y = 0; y < sampleSize; y += 2) {
        for (let x = 0; x < sampleSize; x += 2) {
          const idx = (y * sampleSize + x) * 4;
          const alpha = pixels[idx + 3];
          if (alpha < 180) continue;

          const r = pixels[idx];
          const g = pixels[idx + 1];
          const b = pixels[idx + 2];
          const hsl = rgbToAvatarHsl(r, g, b);
          let weight = 1;
          const nx = x / (sampleSize - 1);
          const ny = y / (sampleSize - 1);

          if (ny < 0.48) weight *= 1.45;
          if (nx < 0.28 || nx > 0.72) weight *= 1.25;
          if (nx > 0.34 && nx < 0.66 && ny > 0.3 && ny < 0.78) weight *= 0.56;
          if (hsl.s < 0.16) weight *= 0.28;
          if (hsl.l < 0.12 || hsl.l > 0.92) weight *= 0.18;
          if (isLikelyAvatarSkinTone(hsl.h, hsl.s, hsl.l)) weight *= 0.34;

          const hueBin = Math.floor(hsl.h / 18);
          const saturationBin = Math.floor(hsl.s * 4);
          const lightnessBin = Math.floor(hsl.l * 4);
          const key = `${hueBin}:${saturationBin}:${lightnessBin}`;
          const existing = clusters.get(key) || { r: 0, g: 0, b: 0, weight: 0, score: 0, count: 0 };
          const score = weight * (0.32 + hsl.s * 1.78) * (1 - Math.min(0.55, Math.abs(hsl.l - 0.52)));
          existing.r += r * weight;
          existing.g += g * weight;
          existing.b += b * weight;
          existing.weight += weight;
          existing.score += score;
          existing.count++;
          clusters.set(key, existing);
        }
      }

      let best: { r: number; g: number; b: number; weight: number; score: number; count: number } | null = null;
      for (const cluster of clusters.values()) {
        if (cluster.count < 4 || cluster.weight <= 0) continue;
        if (!best || cluster.score > best.score) {
          best = cluster;
        }
      }

      if (!best || best.score < 4) return null;
      const bestR = best.r / best.weight;
      const bestG = best.g / best.weight;
      const bestB = best.b / best.weight;
      if (rgbToAvatarHsl(bestR, bestG, bestB).s < 0.18) return null;
      return normalizeInferredAvatarColor(bestR, bestG, bestB);
    } catch (error) {
      console.warn('[DICE]头像颜色推断失败，改用角色名 fallback:', error);
      return null;
    }
  };

  // 头像管理工具（支持裁剪偏移）
  const AvatarManager = {
    _cache: null,

    load() {
      if (!this._cache) {
        const raw = Store.get(STORAGE_KEY_AVATAR_MAP, {});
        this._cache = {};
        for (const name in raw) {
          if (typeof raw[name] === 'string') {
            this._cache[name] = {
              url: normalizeStorableImageUrl(raw[name]),
              offsetX: 50,
              offsetY: 50,
              scale: 150,
              aliases: [],
              createdAt: 0,
            };
          } else {
            const imageColor = normalizeAvatarHexColor(raw[name].imageColor);
            const imageColorSource =
              raw[name].imageColorSource === 'manual' ? 'manual' : imageColor ? 'auto' : undefined;
            this._cache[name] = {
              url: normalizeStorableImageUrl(raw[name].url),
              offsetX: raw[name].offsetX ?? 50,
              offsetY: raw[name].offsetY ?? 50,
              scale: raw[name].scale ?? 150,
              aliases: raw[name].aliases || [],
              createdAt: raw[name].createdAt ?? 0,
              imageColor: imageColor || undefined,
              imageColorSource,
              imageColorUpdatedAt: imageColor ? (raw[name].imageColorUpdatedAt ?? 0) : undefined,
            };
          }
        }
      }
      return this._cache;
    },

    save() {
      Store.set(STORAGE_KEY_AVATAR_MAP, this._cache || {});
      this._cache = null;
    },

    // 同步获取（仅 URL 和 ST 头像，不含本地图片）
    get(name) {
      const lookupNames = getAvatarLookupNames(name);
      const avatarMap = this.load();
      for (const lookupName of lookupNames) {
        const data = avatarMap[lookupName];
        if (data && data.url) return data.url;
      }

      for (const key in this._cache) {
        if (this._cache[key].aliases && lookupNames.some(lookupName => this._cache[key].aliases.includes(lookupName))) {
          if (this._cache[key].url) return this._cache[key].url;
        }
      }

      return null;
    },

    // 异步获取（优先级：本地图片 > URL > ST头像）
    async getAsync(name) {
      if (!name) return null;
      const lookupNames = new Set(getAvatarLookupNames(name));
      [...lookupNames].forEach(lookupName => {
        const primaryName = this.getPrimaryName(lookupName);
        if (primaryName) lookupNames.add(primaryName);
      });

      // 1. 优先查本地 IndexedDB
      for (const lookupName of lookupNames) {
        const localUrl = await LocalAvatarDB.get(lookupName);
        if (localUrl) return localUrl;
      }

      // 2. 回退到同步方法（URL / ST头像）
      return this.get(name);
    },

    // 检查是否有本地图片
    async hasLocalAvatar(name) {
      if (!name) return false;
      const lookupNames = new Set(getAvatarLookupNames(name));
      [...lookupNames].forEach(lookupName => {
        const primaryName = this.getPrimaryName(lookupName);
        if (primaryName) lookupNames.add(primaryName);
      });
      for (const lookupName of lookupNames) {
        const has = await LocalAvatarDB.has(lookupName);
        if (has) return true;
      }
      return false;
    },

    // 保存本地图片
    async saveLocalAvatar(name, blob) {
      return await LocalAvatarDB.save(name, blob);
    },

    // 删除本地图片
    async deleteLocalAvatar(name) {
      return await LocalAvatarDB.delete(name);
    },

    getOffsetX(name) {
      const data = this._resolveByAlias(name);
      return data ? (data.offsetX ?? 50) : 50;
    },

    getOffsetY(name) {
      const data = this._resolveByAlias(name);
      return data ? (data.offsetY ?? 50) : 50;
    },

    getScale(name) {
      const data = this._resolveByAlias(name);
      return data ? (data.scale ?? 150) : 150;
    },

    getImageColor(name) {
      const data = this._resolveByAlias(name);
      const color = normalizeAvatarHexColor(data?.imageColor);
      if (color) return color;
      return getAvatarFallbackColor(this.getPrimaryName(name));
    },

    getImageColorSource(name) {
      const data = this._resolveByAlias(name);
      return normalizeAvatarHexColor(data?.imageColor) ? data?.imageColorSource || 'auto' : 'fallback';
    },

    setImageColor(name, color, source: AvatarImageColorSource = 'manual') {
      if (!name) return false;
      const normalized = normalizeAvatarHexColor(color);
      if (!normalized) return false;
      const data = this.load()[name] || {
        url: '',
        offsetX: 50,
        offsetY: 50,
        scale: 150,
        aliases: [],
        createdAt: Date.now(),
      };
      data.imageColor = normalized;
      data.imageColorSource = source;
      data.imageColorUpdatedAt = Date.now();
      this.load()[name] = data;
      this.save();
      return true;
    },

    clearImageColor(name) {
      const data = this._resolveByAlias(name);
      if (!data) return;
      delete data.imageColor;
      delete data.imageColorSource;
      delete data.imageColorUpdatedAt;
      this.save();
    },

    // 根据名字或别名找到主记录
    _resolveByAlias(name) {
      const lookupNames = getAvatarLookupNames(name);
      const avatarMap = this.load();
      for (const lookupName of lookupNames) {
        const data = avatarMap[lookupName];
        if (data) return data;
      }
      for (const key in this._cache) {
        if (this._cache[key].aliases && lookupNames.some(lookupName => this._cache[key].aliases.includes(lookupName))) {
          return this._cache[key];
        }
      }
      return null;
    },

    // 获取主名称（如果传入的是别名，返回主名称）
    getPrimaryName(name) {
      const lookupNames = getAvatarLookupNames(name);
      const avatarMap = this.load();
      for (const lookupName of lookupNames) {
        if (avatarMap[lookupName]) return lookupName;
      }
      for (const key in this._cache) {
        if (this._cache[key].aliases && lookupNames.some(lookupName => this._cache[key].aliases.includes(lookupName))) {
          return key;
        }
      }
      return name;
    },

    set(name, url, offsetX = 50, offsetY = 50, scale = 150, aliases = []) {
      const existing = this.load()[name];
      const createdAt = existing ? (existing.createdAt ?? 0) : Date.now();
      const existingImageColor = normalizeAvatarHexColor(existing?.imageColor);
      const normalizedUrl = normalizeStorableImageUrl(url);
      this.load()[name] = {
        url: normalizedUrl,
        offsetX,
        offsetY,
        scale,
        aliases,
        createdAt,
        imageColor: existingImageColor || undefined,
        imageColorSource: existingImageColor ? existing?.imageColorSource : undefined,
        imageColorUpdatedAt: existingImageColor ? existing?.imageColorUpdatedAt : undefined,
      };
      this.save();
    },

    setPosition(name, offsetX, offsetY) {
      const data = this.load()[name];
      if (data) {
        data.offsetX = offsetX;
        data.offsetY = offsetY;
        this.save();
      }
    },

    setScale(name, scale) {
      const data = this.load()[name];
      if (data) {
        data.scale = scale;
        this.save();
      }
    },

    setAliases(name, aliases) {
      const data = this.load()[name];
      if (data) {
        data.aliases = aliases;
        this.save();
      }
    },

    remove(name) {
      delete this.load()[name];
      this.save();
    },

    getAll() {
      return this.load();
    },

    // 导出为JSON对象
    exportData() {
      return {
        version: 1,
        exportTime: new Date().toISOString(),
        avatars: this.load(),
      };
    },

    // 导入数据，返回统计信息
    importData(jsonData, overwriteConflicts = true) {
      if (!jsonData || !jsonData.avatars) {
        throw new Error('无效的配置文件格式');
      }

      const current = this.load();
      const stats = { added: 0, updated: 0, skipped: 0 };

      for (const name in jsonData.avatars) {
        const imported = jsonData.avatars[name];
        const importedUrl = normalizeStorableImageUrl(imported.url);
        const importedImageColor = normalizeAvatarHexColor(imported.imageColor);
        if (!importedUrl && !importedImageColor) continue;

        if (current[name]) {
          // 冲突
          if (overwriteConflicts) {
            current[name] = {
              url: importedUrl,
              offsetX: imported.offsetX ?? 50,
              offsetY: imported.offsetY ?? 50,
              scale: imported.scale ?? 150,
              aliases: imported.aliases || [],
              createdAt: imported.createdAt ?? 0,
              imageColor: importedImageColor || undefined,
              imageColorSource: importedImageColor
                ? imported.imageColorSource === 'manual'
                  ? 'manual'
                  : 'auto'
                : undefined,
              imageColorUpdatedAt: importedImageColor ? (imported.imageColorUpdatedAt ?? 0) : undefined,
            };
            stats.updated++;
          } else {
            stats.skipped++;
          }
        } else {
          // 新增
          current[name] = {
            url: importedUrl,
            offsetX: imported.offsetX ?? 50,
            offsetY: imported.offsetY ?? 50,
            scale: imported.scale ?? 150,
            aliases: imported.aliases || [],
            createdAt: imported.createdAt ?? 0,
            imageColor: importedImageColor || undefined,
            imageColorSource: importedImageColor
              ? imported.imageColorSource === 'manual'
                ? 'manual'
                : 'auto'
              : undefined,
            imageColorUpdatedAt: importedImageColor ? (imported.imageColorUpdatedAt ?? 0) : undefined,
          };
          stats.added++;
        }
      }

      this.save();
      return stats;
    },

    // 分析导入文件，返回冲突信息
    analyzeImport(jsonData) {
      if (!jsonData || !jsonData.avatars) {
        return { valid: false, error: '无效的配置文件格式' };
      }

      const current = this.load();
      const result = { valid: true, total: 0, newItems: [], conflicts: [] };

      for (const name in jsonData.avatars) {
        const importedUrl = normalizeStorableImageUrl(jsonData.avatars[name].url);
        if (!importedUrl && !normalizeAvatarHexColor(jsonData.avatars[name].imageColor)) continue;
        result.total++;
        if (current[name]) {
          result.conflicts.push(name);
        } else {
          result.newItems.push(name);
        }
      }

      return result;
    },
  };
export {
  FavoritesManager,
  getUserAvatarUrl,
  getPlayerName,
  getPersonaName,
  getDisplayPlayerName,
  replaceUserPlaceholders,
  USER_AVATAR_LOOKUP_KEYS,
  getAvatarLookupNames,
  getDiceStatsContext,
  DICE_STATS_SCOPE_LABELS,
  isDiceStatsScopeUnavailable,
  renderDiceHistoryStatsHtml,
  normalizeAvatarHexColor,
  clampAvatarNumber,
  rgbToAvatarHex,
  avatarHexToRgb,
  rgbToAvatarHsl,
  avatarHexToHsl,
  hslToAvatarHex,
  getAvatarFallbackColor,
  isLikelyAvatarSkinTone,
  normalizeInferredAvatarColor,
  loadAvatarImageForColor,
  inferAvatarImageColor,
  AvatarManager,
}; // __wireFavoritesManagerDeps 已由头部 export function 导出
export type { TableCompatibility, DiceStatsScope, DiceStatsContext, AvatarImageColorSource };
