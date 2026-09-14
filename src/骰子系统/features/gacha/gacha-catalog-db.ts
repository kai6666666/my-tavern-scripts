// @ts-nocheck
/**
 * features/gacha/gacha-catalog-db.ts
 * Feature-Sliced: entities/data 层 - 骰子商店"自定义物品"分类目录的 IndexedDB 适配器。
 * 自包含（仅依赖全局 indexedDB/console 与内部记录类型），由 index.ts(app 层) 实例化并注入。
 */

export interface GachaCatalogRecord {
  scopeKey: string;
  version: string;
  items: unknown[];
  updatedAt: number;
  [key: string]: unknown;
}

class GachaCatalogDBImpl {
  DB_NAME = 'acu_gacha_catalogs';
  STORE_NAME = 'catalogs';
  DB_VERSION = 1;
  _db: IDBDatabase | null = null;

  async init(): Promise<IDBDatabase> {
    if (this._db) return this._db;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      request.onerror = () => {
        console.error('[DICE][GACHA]自定义物品 IndexedDB 打开失败:', request.error);
        reject(request.error);
      };
      request.onsuccess = () => {
        this._db = request.result;
        resolve(this._db);
      };
      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: 'scopeKey' });
        }
      };
    });
  }

  async get(scopeKey: string): Promise<GachaCatalogRecord | null> {
    if (!scopeKey) return null;
    try {
      const db = await this.init();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(this.STORE_NAME, 'readonly');
        let record: GachaCatalogRecord | null = null;
        tx.oncomplete = () => resolve(record);
        tx.onerror = () => {
          console.warn('[DICE][GACHA]读取自定义物品 IndexedDB 事务失败:', tx.error);
          reject(tx.error || new Error('读取自定义物品 IndexedDB 事务失败'));
        };
        tx.onabort = () => reject(tx.error || new Error('读取自定义物品 IndexedDB 事务中止'));
        const request = tx.objectStore(this.STORE_NAME).get(scopeKey);
        request.onsuccess = () => {
          record = (request.result as GachaCatalogRecord | undefined) || null;
        };
        request.onerror = () => {
          console.warn('[DICE][GACHA]读取自定义物品 IndexedDB 请求失败:', request.error);
          reject(request.error || new Error('读取自定义物品 IndexedDB 请求失败'));
        };
      });
    } catch (error) {
      console.warn('[DICE][GACHA]读取自定义物品 IndexedDB 失败:', error);
      throw error;
    }
  }

  async put(record: GachaCatalogRecord): Promise<boolean> {
    try {
      const db = await this.init();
      return await new Promise(resolve => {
        const tx = db.transaction(this.STORE_NAME, 'readwrite');
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => {
          console.error('[DICE][GACHA]写入自定义物品 IndexedDB 事务失败:', tx.error);
        };
        tx.onabort = () => {
          console.error('[DICE][GACHA]写入自定义物品 IndexedDB 事务中止:', tx.error);
          resolve(false);
        };
        const request = tx.objectStore(this.STORE_NAME).put(record);
        request.onerror = () => {
          console.error('[DICE][GACHA]写入自定义物品 IndexedDB 失败:', request.error);
        };
      });
    } catch (error) {
      console.error('[DICE][GACHA]写入自定义物品 IndexedDB 异常:', error);
      return false;
    }
  }

  async getAll(): Promise<GachaCatalogRecord[]> {
    try {
      const db = await this.init();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(this.STORE_NAME, 'readonly');
        let records: GachaCatalogRecord[] = [];
        tx.oncomplete = () => resolve(records);
        tx.onerror = () => {
          console.warn('[DICE][GACHA]读取全部自定义物品 IndexedDB 事务失败:', tx.error);
        };
        tx.onabort = () => reject(tx.error || new Error('读取全部自定义物品事务中止'));
        const request = tx.objectStore(this.STORE_NAME).getAll();
        request.onsuccess = () => {
          records = (request.result || []) as GachaCatalogRecord[];
        };
        request.onerror = () => {
          console.warn('[DICE][GACHA]读取全部自定义物品 IndexedDB 请求失败:', request.error);
        };
      });
    } catch (error) {
      console.warn('[DICE][GACHA]读取全部自定义物品 IndexedDB 失败:', error);
      throw error;
    }
  }

  async clear(): Promise<boolean> {
    try {
      const db = await this.init();
      return await new Promise(resolve => {
        const tx = db.transaction(this.STORE_NAME, 'readwrite');
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => {
          console.error('[DICE][GACHA]清空自定义物品 IndexedDB 事务失败:', tx.error);
        };
        tx.onabort = () => {
          console.error('[DICE][GACHA]清空自定义物品 IndexedDB 事务中止:', tx.error);
          resolve(false);
        };
        const request = tx.objectStore(this.STORE_NAME).clear();
        request.onerror = () => {
          console.error('[DICE][GACHA]清空自定义物品 IndexedDB 失败:', request.error);
        };
      });
    } catch (error) {
      console.error('[DICE][GACHA]清空自定义物品 IndexedDB 失败:', error);
      return false;
    }
  }

  async replaceAll(records: readonly GachaCatalogRecord[]): Promise<boolean> {
    try {
      const db = await this.init();
      return await new Promise(resolve => {
        const tx = db.transaction(this.STORE_NAME, 'readwrite');
        const store = tx.objectStore(this.STORE_NAME);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => {
          console.error('[DICE][GACHA]替换自定义物品 IndexedDB 事务失败:', tx.error);
        };
        tx.onabort = () => {
          console.error('[DICE][GACHA]替换自定义物品 IndexedDB 事务中止:', tx.error);
          resolve(false);
        };
        const clearRequest = store.clear();
        clearRequest.onerror = () => {
          console.error('[DICE][GACHA]替换自定义物品 IndexedDB 清空失败:', clearRequest.error);
        };
        clearRequest.onsuccess = () => {
          try {
            records.forEach(record => {
              const request = store.put(record);
              request.onerror = () => {
                console.error('[DICE][GACHA]替换自定义物品 IndexedDB 写入失败:', request.error);
              };
            });
          } catch (error) {
            console.error('[DICE][GACHA]替换自定义物品 IndexedDB 写入异常:', error);
            tx.abort();
          }
        };
      });
    } catch (error) {
      console.error('[DICE][GACHA]替换自定义物品 IndexedDB 失败:', error);
      return false;
    }
  }
}

export const GachaCatalogDB = new GachaCatalogDBImpl();
