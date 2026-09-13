// @ts-nocheck
/**
 * get-user-avatar-url.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetUserAvatarUrl(deps: any) {
  const getUserAvatarUrl = () => {
    try {
      // 方法1: 从页面 DOM 中查找用户头像元素
      const w = window.parent || window;
      const $ = w.jQuery || window.jQuery;
      if ($) {
        // SillyTavern 用户头像通常在 #user_avatar_block img 或 .avatar[title="You"] img
        const $avatar = $('#user_avatar_block img').first();
        if ($avatar.length && $avatar.attr('src')) {
          return $avatar.attr('src');
        }
        // 备选：查找聊天中用户消息的头像
        const $userMes = $('.mes[is_user="true"]').last().find('.avatar img');
        if ($userMes.length && $userMes.attr('src')) {
          return $userMes.attr('src');
        }
      }
      // 方法2: 尝试从 SillyTavern API 获取
      const ST = w.SillyTavern || window.SillyTavern;
      if (ST && ST.getContext) {
        const ctx = ST.getContext();
        if (ctx && ctx.userAvatar) {
          return ctx.userAvatar;
        }
      }
    } catch (e) {
      console.warn('[DICE]ACU getUserAvatarUrl error:', e);
    }
    return null;
  };
  return getUserAvatarUrl;
}
