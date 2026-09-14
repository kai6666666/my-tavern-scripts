// @ts-nocheck
/**
 * get-persona-name.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetPersonaName(deps: any) {
  const getPersonaName = () => {
    try {
      // 方法1: SillyTavern 标准 API
      const w = window.parent || window;
      if (w.SillyTavern?.getContext) {
        const ctx = w.SillyTavern.getContext();
        if (ctx?.name1) return ctx.name1;
      }
      // 方法2: 直接访问全局变量
      if (typeof name1 !== 'undefined' && name1) return name1;
      if (w.name1) return w.name1;
      // 方法3: 从 DOM 中查找
      const $ = w.jQuery || window.jQuery;
      if ($) {
        const $persona = $('#user_avatar_block .avatar-name, #persona_name_input').first();
        if ($persona.length) {
          const name = $persona.val?.() || $persona.text?.();
          if (name && name.trim()) return name.trim();
        }
      }
    } catch (e) {
      console.warn('[DICE]ACU getPersonaName error:', e);
    }
    return null;
  };
  return getPersonaName;
}
