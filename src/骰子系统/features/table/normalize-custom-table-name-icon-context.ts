// @ts-nocheck
/**
 * normalize-custom-table-name-icon-context.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeCustomTableNameIconContext(deps: any) {
  const normalizeCustomTableNameIconContext = (value: unknown): CustomTableNameIconContext | null => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const raw = value as Record<string, unknown>;
    const moduleId = deps.normalizeCustomTableNameIconKeyPart(raw.moduleId);
    const tableName = deps.normalizeCustomTableNameIconKeyPart(raw.tableName);
    const section = deps.normalizeCustomTableNameIconKeyPart(raw.section);
    const name = deps.normalizeCustomTableNameIconKeyPart(raw.name);
    if (!deps.isCustomTableNameIconModuleId(moduleId) || !deps.isCustomTableNameIconSection(section)) return null;
    if (!tableName || !name) return null;
    return {
      moduleId,
      tableName,
      section,
      name,
    };
  };
  return normalizeCustomTableNameIconContext;
}
