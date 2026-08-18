// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=17「LocalAvatarDB - 本地头像 IndexedDB 存储」
// 原行范围：6386-6601（含 banner 6383-6601）；拆分批次 1；外部 closure 依赖：0
  // ========================================
  // LocalAvatarDB - 本地头像 IndexedDB 存储
  // ========================================
  const LocalAvatarDB = {
    DB_NAME: 'acu_local_avatars',
    STORE_NAME: 'avatars',
    DB_VERSION: 1,
    _db: null,
    _urlCache: new Map(), // 缓存 ObjectURL 避免重复创建

    // 初始化数据库
    async init() {
      if (this._db) return this._db;

      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

        request.onerror = () => {
          console.error('[DICE]LocalAvatarDB 打开数据库失败:', request.error);
          reject(request.error);
        };

        request.onsuccess = () => {
          this._db = request.result;
          resolve(this._db);
        };

        request.onupgradeneeded = event => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(this.STORE_NAME)) {
            // 主键为角色名
            db.createObjectStore(this.STORE_NAME, { keyPath: 'name' });
          }
        };
      });
    },

    // 保存图片（自动去重：相同 name 会覆盖）
    async save(name, blob) {
      if (!name || !blob) return false;

      try {
        const db = await this.init();
        return new Promise((resolve, reject) => {
          const tx = db.transaction(this.STORE_NAME, 'readwrite');
          const store = tx.objectStore(this.STORE_NAME);

          // 清理旧的 ObjectURL 缓存
          if (this._urlCache.has(name)) {
            URL.revokeObjectURL(this._urlCache.get(name));
            this._urlCache.delete(name);
          }

          const data = {
            name: name,
            blob: blob,
            size: blob.size,
            type: blob.type,
            updatedAt: Date.now(),
          };

          const request = store.put(data);
          request.onsuccess = () => resolve(true);
          request.onerror = () => {
            console.error('[DICE]LocalAvatarDB 保存失败:', request.error);
            reject(request.error);
          };
        });
      } catch (e) {
        console.error('[DICE]LocalAvatarDB save error:', e);
        return false;
      }
    },

    // 获取图片 URL（返回 ObjectURL）
    async get(name) {
      if (!name) return null;

      // 先查缓存
      if (this._urlCache.has(name)) {
        return this._urlCache.get(name);
      }

      try {
        const db = await this.init();
        return new Promise(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readonly');
          const store = tx.objectStore(this.STORE_NAME);
          const request = store.get(name);

          request.onsuccess = () => {
            const data = request.result;
            if (data && data.blob) {
              const url = URL.createObjectURL(data.blob);
              this._urlCache.set(name, url);
              resolve(url);
            } else {
              resolve(null);
            }
          };

          request.onerror = () => resolve(null);
        });
      } catch (e) {
        console.error('[DICE]LocalAvatarDB get error:', e);
        return null;
      }
    },

    // 检查是否存在本地图片
    async has(name) {
      if (!name) return false;

      try {
        const db = await this.init();
        return new Promise(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readonly');
          const store = tx.objectStore(this.STORE_NAME);
          const request = store.getKey(name);

          request.onsuccess = () => resolve(request.result !== undefined);
          request.onerror = () => resolve(false);
        });
      } catch (e) {
        return false;
      }
    },

    // 删除图片
    async delete(name) {
      if (!name) return false;

      try {
        // 清理 ObjectURL 缓存
        if (this._urlCache.has(name)) {
          URL.revokeObjectURL(this._urlCache.get(name));
          this._urlCache.delete(name);
        }

        const db = await this.init();
        return new Promise(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readwrite');
          const store = tx.objectStore(this.STORE_NAME);
          const request = store.delete(name);

          request.onsuccess = () => resolve(true);
          request.onerror = () => resolve(false);
        });
      } catch (e) {
        console.error('[DICE]LocalAvatarDB delete error:', e);
        return false;
      }
    },

    // 获取所有已存储的角色名列表
    async getAllNames() {
      try {
        const db = await this.init();
        return new Promise(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readonly');
          const store = tx.objectStore(this.STORE_NAME);
          const request = store.getAllKeys();

          request.onsuccess = () => resolve(request.result || []);
          request.onerror = () => resolve([]);
        });
      } catch (e) {
        return [];
      }
    },

    // 获取存储统计信息
    async getStats() {
      try {
        const db = await this.init();
        return new Promise(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readonly');
          const store = tx.objectStore(this.STORE_NAME);
          const request = store.getAll();

          request.onsuccess = () => {
            const items = request.result || [];
            const totalSize = items.reduce((sum, item) => sum + (item.size || 0), 0);
            resolve({
              count: items.length,
              totalSize: totalSize,
              totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
            });
          };

          request.onerror = () => resolve({ count: 0, totalSize: 0, totalSizeMB: '0' });
        });
      } catch (e) {
        return { count: 0, totalSize: 0, totalSizeMB: '0' };
      }
    },

    // 清理所有数据
    async clearAll() {
      try {
        // 清理所有 ObjectURL 缓存
        this._urlCache.forEach(url => URL.revokeObjectURL(url));
        this._urlCache.clear();

        const db = await this.init();
        return new Promise(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readwrite');
          const store = tx.objectStore(this.STORE_NAME);
          const request = store.clear();

          request.onsuccess = () => resolve(true);
          request.onerror = () => resolve(false);
        });
      } catch (e) {
        console.error('[DICE]LocalAvatarDB clearAll error:', e);
        return false;
      }
    },
  };
export { LocalAvatarDB };
