// @ts-nocheck
/**
 * favorites-manager.ts
 * Feature-Sliced: 收藏夹管理器（依赖于 FavoritesDB 模块）
 */

import { FavoritesDB } from '../../shared/storage/favorites-db';

  export const FavoritesManager = {
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

