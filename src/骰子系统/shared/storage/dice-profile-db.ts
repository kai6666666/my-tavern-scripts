// @ts-nocheck
/**
 * dice-profile-db.ts
 * Feature-Sliced: 骰子配置档案 IndexedDB 适配器（自包含）
 */

  export const DiceProfileDB = {
    DB_NAME: 'acu_dice_profiles',
    STORE_NAME: 'profiles',
    DB_VERSION: 1,
    _db: null as IDBDatabase | null,

    async init(): Promise<IDBDatabase> {
      if (this._db) return this._db;
      return await new Promise((resolve, reject) => {
        const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
        request.onerror = () => {
          console.error('[DICE][PROFILE]Profile IndexedDB 打开失败:', request.error);
          reject(request.error || new Error('Profile IndexedDB 打开失败'));
        };
        request.onsuccess = () => {
          this._db = request.result;
          resolve(this._db);
        };
        request.onupgradeneeded = event => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(this.STORE_NAME)) {
            const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
            store.createIndex('sourceType', 'source.type', { unique: false });
            store.createIndex('fingerprint', 'fingerprint', { unique: false });
          }
        };
      });
    },

    async get(id: string): Promise<DiceProfileRecord | null> {
      if (!id) return null;
      const db = await this.init();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(this.STORE_NAME, 'readonly');
        const request = tx.objectStore(this.STORE_NAME).get(id);
        request.onsuccess = () => resolve((request.result as DiceProfileRecord | undefined) || null);
        request.onerror = () => reject(request.error || new Error('Profile 读取失败'));
      });
    },

    async getAll(): Promise<DiceProfileRecord[]> {
      const db = await this.init();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(this.STORE_NAME, 'readonly');
        const request = tx.objectStore(this.STORE_NAME).getAll();
        request.onsuccess = () => resolve((request.result || []) as DiceProfileRecord[]);
        request.onerror = () => reject(request.error || new Error('Profile 列表读取失败'));
      });
    },

    async put(record: DiceProfileRecord): Promise<boolean> {
      const db = await this.init();
      return await new Promise(resolve => {
        const tx = db.transaction(this.STORE_NAME, 'readwrite');
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => {
          console.error('[DICE][PROFILE]Profile 写入事务失败:', tx.error);
          resolve(false);
        };
        tx.onabort = () => {
          console.error('[DICE][PROFILE]Profile 写入事务中止:', tx.error);
          resolve(false);
        };
        tx.objectStore(this.STORE_NAME).put(record);
      });
    },

    async delete(id: string): Promise<boolean> {
      if (!id) return false;
      const db = await this.init();
      return await new Promise(resolve => {
        const tx = db.transaction(this.STORE_NAME, 'readwrite');
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
        tx.onabort = () => resolve(false);
        tx.objectStore(this.STORE_NAME).delete(id);
      });
    },
  };

