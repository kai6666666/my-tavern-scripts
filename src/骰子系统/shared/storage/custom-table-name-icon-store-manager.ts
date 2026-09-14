// @ts-nocheck
/**
 * custom-table-name-icon-store-manager.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from './store';
export function createCustomTableNameIconStoreManager(deps: any) {
  const CustomTableNameIconStoreManager = (() => {
    let cache: Record<string, CustomTableNameIconEntry> | null = null;

    const load = (): Record<string, CustomTableNameIconEntry> => {
      if (cache) return cache;
      const raw = Store.get(deps.STORAGE_KEY_CUSTOM_TABLE_NAME_ICONS, {});
      const next: Record<string, CustomTableNameIconEntry> = {};
      if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
        Object.values(raw as Record<string, unknown>).forEach(value => {
          const entry = deps.normalizeCustomTableNameIconEntry(value);
          if (!entry) return;
          next[deps.getCustomTableNameIconContextKey(entry)] = entry;
        });
      }
      cache = next;
      return next;
    };

    const get = (context: CustomTableNameIconContext): CustomTableNameIconEntry | null =>
      load()[deps.getCustomTableNameIconContextKey(context)] || null;

    const getAll = (): CustomTableNameIconEntry[] => Object.values(load());

    const save = (entry: CustomTableNameIconEntry): boolean => {
      const normalizedEntry = deps.normalizeCustomTableNameIconEntry(entry);
      if (!normalizedEntry) return false;
      const next = { ...load(), [deps.getCustomTableNameIconContextKey(normalizedEntry)]: normalizedEntry };
      cache = next;
      Store.set(deps.STORAGE_KEY_CUSTOM_TABLE_NAME_ICONS, next);
      return true;
    };

    const remove = (context: CustomTableNameIconContext): boolean => {
      const key = deps.getCustomTableNameIconContextKey(context);
      const current = load();
      if (!current[key]) return false;
      const next = { ...current };
      delete next[key];
      cache = next;
      Store.set(deps.STORAGE_KEY_CUSTOM_TABLE_NAME_ICONS, next);
      return true;
    };

    const invalidate = (): void => {
      cache = null;
    };

    return {
      load,
      get,
      getAll,
      save,
      delete: remove,
      invalidate,
    };
  })();
  return CustomTableNameIconStoreManager;
}
