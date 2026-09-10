// @ts-nocheck
/**
 * favorites-db.ts
 * Feature-Sliced: 收藏夹 IndexedDB 适配器（自包含）
 */

  export const FavoritesDB = {
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

