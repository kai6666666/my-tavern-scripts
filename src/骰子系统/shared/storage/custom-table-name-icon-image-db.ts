// @ts-nocheck
/**
 * custom-table-name-icon-image-db.ts
 * Feature-Sliced: 自定义表格图标图片 IndexedDB 适配器（自包含）
 */

  export const CustomTableNameIconImageDB = {
    DB_NAME: 'acu_custom_table_name_icon_images',
    STORE_NAME: 'images',
    DB_VERSION: 1,
    _db: null as IDBDatabase | null,
    _urlCache: new Map<string, string>(),
    _failedUrlCache: new Set<string>(),
    _failedLocalKeyCache: new Set<string>(),

    async init(): Promise<IDBDatabase> {
      if (this._db) return this._db;
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
        request.onerror = () => {
          console.error('[DICE][CUSTOM_ICON]自定义图标图片 IndexedDB 打开失败:', request.error);
          reject(request.error);
        };
        request.onsuccess = () => {
          this._db = request.result;
          resolve(this._db);
        };
        request.onupgradeneeded = event => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(this.STORE_NAME)) {
            db.createObjectStore(this.STORE_NAME, { keyPath: 'key' });
          }
        };
      });
    },

    markUrlFailed(url: string): void {
      const normalizedUrl = String(url || '').trim();
      if (!normalizedUrl) return;
      this._failedUrlCache.add(normalizedUrl);
    },

    markLocalKeyFailed(key: string): void {
      const normalizedKey = String(key || '').trim();
      if (!normalizedKey) return;
      this._failedLocalKeyCache.add(normalizedKey);
    },

    clearUrlFailure(url: string): void {
      const normalizedUrl = String(url || '').trim();
      if (!normalizedUrl) return;
      this._failedUrlCache.delete(normalizedUrl);
    },

    clearLocalKeyFailure(key: string): void {
      const normalizedKey = String(key || '').trim();
      if (!normalizedKey) return;
      this._failedLocalKeyCache.delete(normalizedKey);
    },

    hasUrlFailed(url: string): boolean {
      const normalizedUrl = String(url || '').trim();
      return normalizedUrl ? this._failedUrlCache.has(normalizedUrl) : false;
    },

    hasLocalKeyFailed(key: string): boolean {
      const normalizedKey = String(key || '').trim();
      return normalizedKey ? this._failedLocalKeyCache.has(normalizedKey) : false;
    },

    async save(key: string, blob: Blob): Promise<boolean> {
      const normalizedKey = String(key || '').trim();
      if (!normalizedKey || !blob) return false;
      try {
        const db = await this.init();
        if (this._urlCache.has(normalizedKey)) {
          URL.revokeObjectURL(this._urlCache.get(normalizedKey) || '');
          this._urlCache.delete(normalizedKey);
        }
        this.clearLocalKeyFailure(normalizedKey);
        return await new Promise(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readwrite');
          const request = tx.objectStore(this.STORE_NAME).put({
            key: normalizedKey,
            blob,
            size: blob.size,
            type: blob.type,
            updatedAt: Date.now(),
          } satisfies CustomTableNameIconImageRecord);
          request.onsuccess = () => resolve(true);
          request.onerror = () => {
            console.error('[DICE][CUSTOM_ICON]保存自定义图标图片失败:', request.error);
            this.markLocalKeyFailed(normalizedKey);
            resolve(false);
          };
        });
      } catch (error) {
        console.error('[DICE][CUSTOM_ICON]保存自定义图标图片异常:', error);
        this.markLocalKeyFailed(normalizedKey);
        return false;
      }
    },

    async get(key: string): Promise<string | null> {
      const normalizedKey = String(key || '').trim();
      if (!normalizedKey) return null;
      if (this._failedLocalKeyCache.has(normalizedKey)) return null;
      if (this._urlCache.has(normalizedKey)) return this._urlCache.get(normalizedKey) || null;
      try {
        const db = await this.init();
        return await new Promise(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readonly');
          const request = tx.objectStore(this.STORE_NAME).get(normalizedKey);
          request.onsuccess = () => {
            const result = request.result as CustomTableNameIconImageRecord | undefined;
            if (!result?.blob) {
              this.markLocalKeyFailed(normalizedKey);
              resolve(null);
              return;
            }
            const url = URL.createObjectURL(result.blob);
            this._urlCache.set(normalizedKey, url);
            this.clearLocalKeyFailure(normalizedKey);
            resolve(url);
          };
          request.onerror = () => {
            this.markLocalKeyFailed(normalizedKey);
            resolve(null);
          };
        });
      } catch (error) {
        console.warn('[DICE][CUSTOM_ICON]读取自定义图标图片失败:', error);
        this.markLocalKeyFailed(normalizedKey);
        return null;
      }
    },

    async delete(key: string): Promise<boolean> {
      const normalizedKey = String(key || '').trim();
      if (!normalizedKey) return false;
      try {
        if (this._urlCache.has(normalizedKey)) {
          URL.revokeObjectURL(this._urlCache.get(normalizedKey) || '');
          this._urlCache.delete(normalizedKey);
        }
        this.clearLocalKeyFailure(normalizedKey);
        const db = await this.init();
        return await new Promise(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readwrite');
          const request = tx.objectStore(this.STORE_NAME).delete(normalizedKey);
          request.onsuccess = () => resolve(true);
          request.onerror = () => {
            this.markLocalKeyFailed(normalizedKey);
            resolve(false);
          };
        });
      } catch (error) {
        console.warn('[DICE][CUSTOM_ICON]删除自定义图标图片失败:', error);
        this.markLocalKeyFailed(normalizedKey);
        return false;
      }
    },

    cleanup(): void {
      this._urlCache.forEach(url => URL.revokeObjectURL(url));
      this._urlCache.clear();
      this._failedUrlCache.clear();
      this._failedLocalKeyCache.clear();
    },
  };

