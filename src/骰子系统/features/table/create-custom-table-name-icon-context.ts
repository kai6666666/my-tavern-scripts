// @ts-nocheck
/**
 * create-custom-table-name-icon-context.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCreateCustomTableNameIconContext(deps: any) {
  const createCustomTableNameIconContext = (
    moduleId:
      | 'table-name'
      | 'item'
      | 'equipment'
      | 'faction'
      | 'shop'
      | 'global-interaction-panel'
      | 'global-interaction-map-marker',
    tableName: unknown,
    section: 'table' | 'item' | 'equipment' | 'faction' | 'shop' | 'map' | 'task' | 'skill' | 'generic',
    name: unknown,
  ): CustomTableNameIconContext => ({
    moduleId,
    tableName: String(tableName ?? '').trim(),
    section,
    name: String(name ?? '').trim(),
  });
  return createCustomTableNameIconContext;
}
