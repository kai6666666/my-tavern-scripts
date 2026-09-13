// @ts-nocheck
/**
 * get-current-context-fingerprint.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCurrentContextFingerprint(deps: any) {
  const getCurrentContextFingerprint = () => {
    try {
      // 方式1: 酒馆标准 API
      if (typeof SillyTavern !== 'undefined' && SillyTavern.getCurrentChatId) {
        return SillyTavern.getCurrentChatId();
      }
      // 方式2: 直接访问属性
      if (typeof SillyTavern !== 'undefined' && SillyTavern.chatId) {
        return SillyTavern.chatId;
      }
      // 方式3: 父窗口 (iframe 场景)
      if (window.parent?.SillyTavern?.getCurrentChatId) {
        return window.parent.SillyTavern.getCurrentChatId();
      }
    } catch (e) {
      console.warn('[DICE]ACU getCurrentContextFingerprint error:', e);
    }
    return 'unknown_context';
  };
  return getCurrentContextFingerprint;
}
