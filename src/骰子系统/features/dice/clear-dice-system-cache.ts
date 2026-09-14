// @ts-nocheck
/**
 * clear-dice-system-cache.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createClearDiceSystemCache(deps: any) {
  const clearDiceSystemCache = async (): Promise<void> => {
    if (!('caches' in window)) {
      console.log('[DICE] Cache API 不可用，直接刷新');
      return;
    }

    try {
      const cacheNames = await caches.keys();
      const urlPatterns = ['jsdelivr.net/gh/jerryzmtz/my-tavern-scripts', '/dist/骰子系统/'];

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();

        for (const request of requests) {
          const url = request.url;
          // 匹配 jsDelivr 上的骰子系统脚本
          if (urlPatterns.some(pattern => url.includes(pattern))) {
            await cache.delete(request);
            console.log('[DICE] 已清理缓存:', url);
          }
        }
      }
      console.log('[DICE] 脚本缓存清理完成');
    } catch (err) {
      console.warn('[DICE] 缓存清理失败:', err);
    }
  };
  return clearDiceSystemCache;
}
