// @ts-nocheck
/**
 * bookmark-manager.ts
 * Feature-Sliced: features 层模块（工厂版，DI 注入依赖）。
 */

export function createBookmarkManager(deps: any) {
  const BookmarkManager = {
    STORAGE_KEY_PREFIX: 'acu_bookmarks_v1_',
    MAX_CONTEXTS: 20, // 最多保留多少个聊天的bookmark数据

    _cache: null,
    _currentContextId: null,

    // 获取当前上下文专属的存储键
    _getStorageKey(ctxId) {
      return this.STORAGE_KEY_PREFIX + (ctxId || deps.getCurrentContextFingerprint());
    },

    // 清理过旧的bookmark数据，只保留最近使用的 N 个
    _cleanupOldContexts() {
      try {
        const prefix = this.STORAGE_KEY_PREFIX;
        const allKeys = [];

        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(prefix)) {
            allKeys.push(key);
          }
        }

        if (allKeys.length <= this.MAX_CONTEXTS) {
          // 数据量在限制内，无需清理
          return;
        }

        // 按最后访问时间排序（通过内部 _lastAccess 字段）
        const keyWithTime = allKeys.map(key => {
          try {
            const data = JSON.parse(localStorage.getItem(key));
            return { key, time: data?._lastAccess || 0 };
          } catch {
            return { key, time: 0 };
          }
        });

        keyWithTime.sort((a, b) => b.time - a.time);

        // 删除超出限制的旧数据
        const toDelete = keyWithTime.slice(this.MAX_CONTEXTS);
        toDelete.forEach(item => {
          localStorage.removeItem(item.key);
        });

        if (toDelete.length > 0) {
          console.log(
            `[DICE]BookmarkManager 清理了 ${toDelete.length} 个过期的bookmark数据（当前保留 ${this.MAX_CONTEXTS} 个聊天的数据，清理前共有 ${allKeys.length} 个）`,
          );
        }
      } catch (e) {
        console.warn('[DICE]BookmarkManager 清理失败', e);
      }
    },

    _load() {
      const ctxId = deps.getCurrentContextFingerprint();

      // 上下文变化时清空缓存
      if (this._currentContextId !== ctxId) {
        this._cache = null;
        this._currentContextId = ctxId;
      }

      if (!this._cache) {
        try {
          const stored = localStorage.getItem(this._getStorageKey());
          this._cache = stored ? JSON.parse(stored) : {};
          // 移除内部元数据字段，不暴露给业务逻辑
          delete this._cache._lastAccess;
        } catch (e) {
          this._cache = {};
        }
      }
      return this._cache;
    },

    _save() {
      try {
        // 写入时附带最后访问时间戳
        const dataToSave = { ...this._cache, _lastAccess: Date.now() };
        localStorage.setItem(this._getStorageKey(), JSON.stringify(dataToSave));

        // 每次保存后尝试清理（内部有数量判断，不会频繁执行）
        this._cleanupOldContexts();
      } catch (e) {
        console.warn('[DICE]BookmarkManager 保存失败', e);
      }
    },

    isBookmarked(tableName, rowKey) {
      const data = this._load();
      return !!(data[tableName] && data[tableName][rowKey]);
    },

    toggleBookmark(tableName, rowKey) {
      const data = this._load();
      if (!data[tableName]) data[tableName] = {};

      if (data[tableName][rowKey]) {
        // 取消bookmark
        delete data[tableName][rowKey];
        if (Object.keys(data[tableName]).length === 0) {
          delete data[tableName];
        }
      } else {
        // 添加bookmark
        data[tableName][rowKey] = true;
      }
      this._save();
    },

    getBookmarks(tableName) {
      const data = this._load();
      if (!data[tableName]) return [];
      return Object.keys(data[tableName]);
    },

    // 清理当前聊天的所有bookmark（调试用）
    clearCurrentContext() {
      localStorage.removeItem(this._getStorageKey());
      this._cache = null;
    },
  };


  return BookmarkManager;
}
