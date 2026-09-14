// @ts-nocheck
/**
 * add-crud-column-alias.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createAddCrudColumnAlias(deps: any) {
  const addCrudColumnAlias = (aliases: Record<string, string>, alias: string, columnName: string): void => {
    const trimmedAlias = deps.normalizeDiffText(alias);
    const normalizedAlias = deps.normalizeCrudHeaderLookupKey(trimmedAlias);
    [trimmedAlias, normalizedAlias].forEach(key => {
      if (key && !aliases[key]) aliases[key] = columnName;
    });
  };
  return addCrudColumnAlias;
}
