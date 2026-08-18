// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=18「FavoritesDB - 收藏夹 IndexedDB 存储」
// 原行范围：6616-7035（含 banner/JSDoc 6603-7035）；拆分批次 1；外部 closure 依赖：1（getDiceStatsContext@19）
// 接线说明：getDiceStatsContext 定义于 index.ts IIFE 内无法 export，采用运行时注入避免循环 import：
//   index.ts IIFE 末尾调用 __wireDiceStatsContextGetter(getDiceStatsContext) 注入真实实现；
//   未注入时回退为 unknown_chat / unknown_character（与 IIFE 内默认值一致）。

let getDiceStatsContext = () => ({ chatId: "unknown_chat", characterId: "unknown_character" });

export function __wireDiceStatsContextGetter(fn) {
  getDiceStatsContext = fn;
}
  // ========================================
  // FavoritesDB - 收藏夹 IndexedDB 存储
  // ========================================
  /**
   * @typedef {Object} FavoriteItem
   * @property {string} id - UUID
   * @property {string[]} header - 列名数组 (不含首列null)
   * @property {(string|number)[]} rowData - 值数组 (与header对应)
   * @property {string[]} tags - 用户标签
   * @property {number} createdAt - 创建时间戳
   * @property {number} updatedAt - 最后修改时间戳
   * @property {{tableUid: string, tableName: string, chatId: string}} [sourceInfo] - 来源信息
   */
  interface FavoriteItem {
    id: string;
    header: string[];
    rowData: (string | number)[];
    tags: string[];
    createdAt: number;
    updatedAt: number;
    sourceInfo?: {
      tableUid: string;
      tableName: string;
      chatId: string;
    };
  }

  const FavoritesDB = {
    DB_NAME: 'acu_favorites',
    STORE_NAME: 'items',
    DB_VERSION: 1,
    _db: null as IDBDatabase | null,

    // 初始化数据库
    async init(): Promise<IDBDatabase> {
      if (this._db) return this._db;

      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

        request.onerror = () => {
          console.error('[DICE]FavoritesDB 打开数据库失败:', request.error);
          reject(request.error);
        };

        request.onsuccess = () => {
          this._db = request.result;
          resolve(this._db);
        };

        request.onupgradeneeded = event => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(this.STORE_NAME)) {
            // 主键为 id (UUID)
            db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
          }
        };
      });
    },

    // 添加收藏项
    async add(item: FavoriteItem): Promise<boolean> {
      if (!item || !item.id) return false;

      try {
        const db = await this.init();
        return new Promise((resolve, reject) => {
          const tx = db.transaction(this.STORE_NAME, 'readwrite');
          const store = tx.objectStore(this.STORE_NAME);

          const request = store.add(item);
          request.onsuccess = () => resolve(true);
          request.onerror = () => {
            console.error('[DICE]FavoritesDB add 失败:', request.error);
            reject(request.error);
          };
        });
      } catch (e) {
        console.error('[DICE]FavoritesDB add error:', e);
        return false;
      }
    },

    // 按ID获取
    async get(id: string): Promise<FavoriteItem | null> {
      if (!id) return null;

      try {
        const db = await this.init();
        return new Promise(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readonly');
          const store = tx.objectStore(this.STORE_NAME);
          const request = store.get(id);

          request.onsuccess = () => {
            resolve(request.result || null);
          };

          request.onerror = () => resolve(null);
        });
      } catch (e) {
        console.error('[DICE]FavoritesDB get error:', e);
        return null;
      }
    },

    // 更新收藏项 (合并更新)
    async update(id: string, updates: Partial<FavoriteItem>): Promise<boolean> {
      if (!id) return false;

      try {
        const existing = await this.get(id);
        if (!existing) return false;

        const updated = {
          ...existing,
          ...updates,
          id: existing.id, // 确保 id 不被覆盖
          updatedAt: Date.now(),
        };

        const db = await this.init();
        return new Promise((resolve, reject) => {
          const tx = db.transaction(this.STORE_NAME, 'readwrite');
          const store = tx.objectStore(this.STORE_NAME);

          const request = store.put(updated);
          request.onsuccess = () => resolve(true);
          request.onerror = () => {
            console.error('[DICE]FavoritesDB update 失败:', request.error);
            reject(request.error);
          };
        });
      } catch (e) {
        console.error('[DICE]FavoritesDB update error:', e);
        return false;
      }
    },

    // 删除收藏项
    async delete(id: string): Promise<boolean> {
      if (!id) return false;

      try {
        const db = await this.init();
        return new Promise(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readwrite');
          const store = tx.objectStore(this.STORE_NAME);
          const request = store.delete(id);

          request.onsuccess = () => resolve(true);
          request.onerror = () => resolve(false);
        });
      } catch (e) {
        console.error('[DICE]FavoritesDB delete error:', e);
        return false;
      }
    },

    // 获取所有收藏项
    async getAll(): Promise<FavoriteItem[]> {
      try {
        const db = await this.init();
        return new Promise(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readonly');
          const store = tx.objectStore(this.STORE_NAME);
          const request = store.getAll();

          request.onsuccess = () => resolve(request.result || []);
          request.onerror = () => resolve([]);
        });
      } catch (e) {
        console.error('[DICE]FavoritesDB getAll error:', e);
        return [];
      }
    },

    // 获取所有唯一标签
    async getAllTags(): Promise<string[]> {
      try {
        const items = await this.getAll();
        const tagSet = new Set<string>();
        for (const item of items) {
          if (item.tags && Array.isArray(item.tags)) {
            for (const tag of item.tags) {
              if (tag) tagSet.add(tag);
            }
          }
        }
        return Array.from(tagSet).sort();
      } catch (e) {
        console.error('[DICE]FavoritesDB getAllTags error:', e);
        return [];
      }
    },

    // 按标签筛选
    async getByTag(tag: string): Promise<FavoriteItem[]> {
      if (!tag) return [];

      try {
        const items = await this.getAll();
        return items.filter(item => item.tags && item.tags.includes(tag));
      } catch (e) {
        console.error('[DICE]FavoritesDB getByTag error:', e);
        return [];
      }
    },

    // 清空所有
    async clear(): Promise<boolean> {
      try {
        const db = await this.init();
        return new Promise(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readwrite');
          const store = tx.objectStore(this.STORE_NAME);
          const request = store.clear();

          request.onsuccess = () => resolve(true);
          request.onerror = () => resolve(false);
        });
      } catch (e) {
        console.error('[DICE]FavoritesDB clear error:', e);
        return false;
      }
    },

    // 获取总数
    async count(): Promise<number> {
      try {
        const db = await this.init();
        return new Promise(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readonly');
          const store = tx.objectStore(this.STORE_NAME);
          const request = store.count();

          request.onsuccess = () => resolve(request.result || 0);
          request.onerror = () => resolve(0);
        });
      } catch (e) {
        console.error('[DICE]FavoritesDB count error:', e);
        return 0;
      }
    },
  };

  type DiceHistoryEventType = 'check' | 'contest';

  interface DiceHistoryStatRecord {
    id?: number;
    eventType: DiceHistoryEventType;
    timestamp: number;
    chatId: string;
    characterId: string;
    success: boolean;
    attrName: string;
    formula: string;
    total: number;
    target: number;
    outcomeText: string;
  }

  interface DiceHistoryStatsSummary {
    total: number;
    checks: number;
    contests: number;
    checkSuccess: number;
    checkSuccessRate: number;
  }

  const DiceHistoryStatsDB = {
    DB_NAME: 'acu_dice_history_stats',
    STORE_NAME: 'records',
    DB_VERSION: 1,
    _db: null as IDBDatabase | null,

    async init(): Promise<IDBDatabase> {
      if (this._db) return this._db;

      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

        request.onerror = () => {
          console.error('[DICE]DiceHistoryStatsDB 打开数据库失败:', request.error);
          reject(request.error);
        };

        request.onsuccess = () => {
          this._db = request.result;
          resolve(this._db);
        };

        request.onupgradeneeded = event => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(this.STORE_NAME)) {
            const store = db.createObjectStore(this.STORE_NAME, {
              keyPath: 'id',
              autoIncrement: true,
            });
            store.createIndex('eventType', 'eventType', { unique: false });
            store.createIndex('timestamp', 'timestamp', { unique: false });
            store.createIndex('chatId', 'chatId', { unique: false });
            store.createIndex('characterId', 'characterId', { unique: false });
            store.createIndex('chatCharacter', ['chatId', 'characterId'], { unique: false });
          }
        };
      });
    },

    async add(record: DiceHistoryStatRecord): Promise<void> {
      try {
        const db = await this.init();
        await new Promise<void>(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readwrite');
          tx.oncomplete = () => resolve();
          tx.onerror = () => {
            console.warn('[DICE]DiceHistoryStatsDB add 失败:', tx.error);
            resolve();
          };
          tx.objectStore(this.STORE_NAME).add(record);
        });
      } catch (error) {
        console.warn('[DICE]DiceHistoryStatsDB add error:', error);
      }
    },

    async getAll(): Promise<DiceHistoryStatRecord[]> {
      try {
        const db = await this.init();
        return await new Promise(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readonly');
          const request = tx.objectStore(this.STORE_NAME).getAll();
          request.onsuccess = () => resolve((request.result || []) as DiceHistoryStatRecord[]);
          request.onerror = () => resolve([]);
        });
      } catch (error) {
        console.warn('[DICE]DiceHistoryStatsDB getAll error:', error);
        return [];
      }
    },

    async clear(): Promise<void> {
      try {
        const db = await this.init();
        await new Promise<void>(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readwrite');
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
          tx.objectStore(this.STORE_NAME).clear();
        });
      } catch (error) {
        console.warn('[DICE]DiceHistoryStatsDB clear error:', error);
      }
    },

    async recordEvent(event: string, payload: unknown): Promise<void> {
      if (event !== 'check' && event !== 'contest') return;

      const context = getDiceStatsContext();
      const record = payload as Record<string, unknown>;
      const now = Date.now();
      const timestampRaw = Number(record.timestamp);
      const timestamp = Number.isFinite(timestampRaw) ? timestampRaw : now;

      const entry: DiceHistoryStatRecord = {
        eventType: event,
        timestamp,
        chatId: context.chatId,
        characterId: context.characterId,
        success: false,
        attrName: '',
        formula: '',
        total: 0,
        target: 0,
        outcomeText: '',
      };

      if (event === 'check') {
        entry.success = Boolean(record.success);
        entry.attrName = String(record.attrName || '检定');
        entry.formula = String(record.formula || '');
        entry.total = Number(record.total) || 0;
        entry.target = Number(record.target) || 0;
        entry.outcomeText = String(record.outcomeText || (entry.success ? '成功' : '失败'));
      } else {
        const winner = String(record.winner || 'tie');
        entry.success = winner !== 'tie';
        const left = (record.left || {}) as Record<string, unknown>;
        const right = (record.right || {}) as Record<string, unknown>;
        entry.attrName = `${String(left.attribute || '')} vs ${String(right.attribute || '')}`.trim() || '对抗检定';
        entry.formula = 'contest';
        entry.total = Number(left.roll) || 0;
        entry.target = Number(left.target) || 0;
        entry.outcomeText = String(record.message || (winner === 'tie' ? '平局' : '分出胜负'));
      }

      await this.add(entry);
    },

    summarize(records: DiceHistoryStatRecord[]): DiceHistoryStatsSummary {
      const checks = records.filter(item => item.eventType === 'check');
      const contests = records.filter(item => item.eventType === 'contest');
      const checkSuccess = checks.filter(item => item.success).length;
      const checkSuccessRate = checks.length > 0 ? Number(((checkSuccess / checks.length) * 100).toFixed(1)) : 0;
      return {
        total: records.length,
        checks: checks.length,
        contests: contests.length,
        checkSuccess,
        checkSuccessRate,
      };
    },

    async getDashboardStats(): Promise<Record<DiceStatsScope, DiceHistoryStatsSummary>> {
      const all = await this.getAll();
      const context = getDiceStatsContext();
      const hasChatScope = context.chatId !== 'unknown_chat';
      const hasCharacterScope = context.characterId !== 'unknown_character';

      const chatRecords = hasChatScope
        ? all.filter(item => item.chatId === context.chatId && item.chatId !== 'unknown_chat')
        : [];
      const characterRecords = hasCharacterScope
        ? all.filter(item => item.characterId === context.characterId && item.characterId !== 'unknown_character')
        : [];

      return {
        chat: this.summarize(chatRecords),
        character: this.summarize(characterRecords),
        global: this.summarize(all),
      };
    },
  };
export { FavoritesDB, DiceHistoryStatsDB }; // __wireDiceStatsContextGetter 已由头部 export function 导出
export type { FavoriteItem, DiceHistoryEventType, DiceHistoryStatRecord, DiceHistoryStatsSummary };
