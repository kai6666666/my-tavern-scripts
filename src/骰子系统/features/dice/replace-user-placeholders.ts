// @ts-nocheck
/**
 * replace-user-placeholders.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createReplaceUserPlaceholders(deps: any) {
  const replaceUserPlaceholders = text => {
    if (!text || typeof text !== 'string') return text;
    const displayName = deps.getDisplayPlayerName();
    // 替换 <user>、{{user}}（不区分大小写）
    let result = text.replace(/<user>/gi, displayName);
    result = result.replace(/\{\{user\}\}/gi, displayName);
    return result;
  };
  return replaceUserPlaceholders;
}
