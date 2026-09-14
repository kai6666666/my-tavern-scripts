// @ts-nocheck
/**
 * resolve-isolation-key.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createResolveIsolationKey(deps: any) {
  const resolveIsolationKey = (msg: DbChatMessage, isolated: Record<string, unknown> | null): string | null => {
    if (typeof msg?.TavernDB_ACU_Identity === 'string') {
      const identity = msg.TavernDB_ACU_Identity;
      if (isolated && Object.prototype.hasOwnProperty.call(isolated, identity)) return identity;
    }
    if (isolated && Object.prototype.hasOwnProperty.call(isolated, '')) return '';
    if (isolated) {
      const keys = Object.keys(isolated);
      if (keys.length === 1) return keys[0];
    }
    return null;
  };
  return resolveIsolationKey;
}
