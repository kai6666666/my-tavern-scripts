// @ts-nocheck
/**
 * store.ts
 * Feature-Sliced: shared 层 - localStorage 存储适配器（含最后快照 key 常量）。
 */

export const STORAGE_KEY_LAST_SNAPSHOT = 'acu_data_snapshot_v19';

  export const Store = {
    get: (key, def = null) => {
      try {
        return JSON.parse(localStorage.getItem(key)) ?? def;
      } catch {
        return def;
      }
    },
    set: (key, val): boolean => {
      try {
        localStorage.setItem(key, JSON.stringify(val));
        return true;
      } catch (e) {
        // 捕获存储空间已满错误
        if (e.name === 'QuotaExceededError' || e.message.includes('quota')) {
          console.warn('[DICE]ACU 存储空间已满，触发静默清理策略...');
          try {
            // 1. 优先删除最占空间的“数据快照” (不影响功能，只会导致下次刷新暂时没有蓝色高亮)
            localStorage.removeItem(STORAGE_KEY_LAST_SNAPSHOT);

            // 2. 再次尝试保存
            localStorage.setItem(key, JSON.stringify(val));
            return true;
          } catch (retryErr) {
            // 如果清理后还是存不下，才弹窗打扰用户
            console.error('[DICE]ACU Store 清理后依然失败', retryErr);
            if (window.toastr && !window._acuQuotaAlerted) {
              window.toastr.warning('⚠️ 浏览器存储空间严重不足，配置保存失败');
              window._acuQuotaAlerted = true;
              setTimeout(() => (window._acuQuotaAlerted = false), 10000);
            }
          }
        } else {
          console.error('[DICE]ACU Store', e);
        }
        return false;
      }
    },
  };

