// @ts-nocheck
/**
 * dice-history-stats-db.ts
 * Feature-Sliced: features 层模块（工厂版，DI 注入依赖）。
 */

export function createDiceHistoryStatsDB(deps: any) {
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

      const context = deps.getDiceStatsContext();
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
      const context = deps.getDiceStatsContext();
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


  return DiceHistoryStatsDB;
}
