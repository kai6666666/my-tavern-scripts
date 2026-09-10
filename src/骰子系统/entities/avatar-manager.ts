// @ts-nocheck
/**
 * entities/avatar-manager.ts
 * Feature-Sliced: entities 层 - 头像管理域（工厂版）。
 * 通过 DI 注入 Store 访问 / 图片规范化 / 名称查找 / 本地头像库，与 monolith 解耦。
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createAvatarManager(deps: any) {
  const AvatarManager = {
    _cache: null,

    load() {
      if (!this._cache) {
        const raw = deps.storeGet(deps.storageKey, {});
        this._cache = {};
        for (const name in raw) {
          if (typeof raw[name] === 'string') {
            this._cache[name] = {
              url: deps.normalizeStorableImageUrl(raw[name]),
              offsetX: 50,
              offsetY: 50,
              scale: 150,
              aliases: [],
              createdAt: 0,
            };
          } else {
            const imageColor = deps.normalizeAvatarHexColor(raw[name].imageColor);
            const imageColorSource =
              raw[name].imageColorSource === 'manual' ? 'manual' : imageColor ? 'auto' : undefined;
            this._cache[name] = {
              url: deps.normalizeStorableImageUrl(raw[name].url),
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
      deps.storeSet(deps.storageKey, this._cache || {});
      this._cache = null;
    },

    // 同步获取（仅 URL 和 ST 头像，不含本地图片）
    get(name) {
      const lookupNames = deps.getAvatarLookupNames(name);
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
      const lookupNames = new Set(deps.getAvatarLookupNames(name));
      [...lookupNames].forEach(lookupName => {
        const primaryName = this.getPrimaryName(lookupName);
        if (primaryName) lookupNames.add(primaryName);
      });

      // 1. 优先查本地 IndexedDB
      for (const lookupName of lookupNames) {
        const localUrl = await deps.localAvatarGet(lookupName);
        if (localUrl) return localUrl;
      }

      // 2. 回退到同步方法（URL / ST头像）
      return this.get(name);
    },

    // 检查是否有本地图片
    async hasLocalAvatar(name) {
      if (!name) return false;
      const lookupNames = new Set(deps.getAvatarLookupNames(name));
      [...lookupNames].forEach(lookupName => {
        const primaryName = this.getPrimaryName(lookupName);
        if (primaryName) lookupNames.add(primaryName);
      });
      for (const lookupName of lookupNames) {
        const has = await deps.localAvatarHas(lookupName);
        if (has) return true;
      }
      return false;
    },

    // 保存本地图片
    async saveLocalAvatar(name, blob) {
      return await deps.localAvatarSave(name, blob);
    },

    // 删除本地图片
    async deleteLocalAvatar(name) {
      return await deps.localAvatarDelete(name);
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
      const color = deps.normalizeAvatarHexColor(data?.imageColor);
      if (color) return color;
      return deps.getAvatarFallbackColor(this.getPrimaryName(name));
    },

    getImageColorSource(name) {
      const data = this._resolveByAlias(name);
      return deps.normalizeAvatarHexColor(data?.imageColor) ? data?.imageColorSource || 'auto' : 'fallback';
    },

    setImageColor(name, color, source: AvatarImageColorSource = 'manual') {
      if (!name) return false;
      const normalized = deps.normalizeAvatarHexColor(color);
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
      const lookupNames = deps.getAvatarLookupNames(name);
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
      const lookupNames = deps.getAvatarLookupNames(name);
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
      const existingImageColor = deps.normalizeAvatarHexColor(existing?.imageColor);
      const normalizedUrl = deps.normalizeStorableImageUrl(url);
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
        const importedUrl = deps.normalizeStorableImageUrl(imported.url);
        const importedImageColor = deps.normalizeAvatarHexColor(imported.imageColor);
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
        const importedUrl = deps.normalizeStorableImageUrl(jsonData.avatars[name].url);
        if (!importedUrl && !deps.normalizeAvatarHexColor(jsonData.avatars[name].imageColor)) continue;
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

  return AvatarManager;
}
