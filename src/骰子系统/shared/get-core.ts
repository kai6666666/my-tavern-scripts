// @ts-nocheck
/**
 * get-core.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCore(deps: any) {
  const getCore = () => {
    const w = deps.getTavernHostWindow();
    // 动态获取 jQuery
    const $ = w.jQuery || window.jQuery;

    // 只有当缓存存在且宿主窗口/jQuery 仍一致时才复用，避免移动端多层 iframe 下拿到旧 document
    if (deps.get_coreCache() && deps.get_coreCache().$ && deps.get_coreCache().hostWindow === w && deps.get_coreCache().$ === $) return deps.get_coreCache();

    const core = {
      $: $,
      hostWindow: w,
      getDB: () => w.AutoCardUpdaterAPI || window.AutoCardUpdaterAPI,
      clipboard: w.navigator?.clipboard || window.navigator.clipboard,
      // 增强查找：依次尝试 当前窗口 -> 父窗口 -> 顶层窗口 (带跨域保护)
      ST:
        w.SillyTavern ||
        window.SillyTavern ||
        (() => {
          try {
            return window.top ? window.top.SillyTavern : null;
          } catch (e) {
            return null;
          }
        })(),
    };

    // 只有成功获取到 jQuery 后才锁定缓存，防止初始化过早导致永久失效
    if ($) deps.set_coreCache(core);
    return core;
  };
  return getCore;
}
