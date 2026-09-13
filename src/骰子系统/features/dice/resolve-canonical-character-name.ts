// @ts-nocheck
/**
 * resolve-canonical-character-name.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createResolveCanonicalCharacterName(deps: any) {
  const resolveCanonicalCharacterName = (name: unknown): string => {
    const rawName = String(name ?? '').trim();
    if (!rawName || deps.isUserCharacterName(rawName)) return '<user>';
    return deps.getNameAliasRegistry().resolve(rawName);
  };
  return resolveCanonicalCharacterName;
}
