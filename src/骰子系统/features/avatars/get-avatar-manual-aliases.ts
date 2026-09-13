// @ts-nocheck
/**
 * get-avatar-manual-aliases.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetAvatarManualAliases(deps: any) {
  const getAvatarManualAliases = (name: string): string[] => {
    if (!name) return [];
    const avatarMap = deps.getAvatarManager().load() as Record<string, { aliases?: unknown[] } | undefined>;
    const data = avatarMap[name];
    if (!data || !Array.isArray(data.aliases)) return [];
    return data.aliases.map(alias => String(alias ?? '').trim()).filter(Boolean);
  };
  return getAvatarManualAliases;
}
