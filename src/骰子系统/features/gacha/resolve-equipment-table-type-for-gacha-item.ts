// @ts-nocheck
/**
 * resolve-equipment-table-type-for-gacha-item.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createResolveEquipmentTableTypeForGachaItem(deps: any) {
  const resolveEquipmentTableTypeForGachaItem = (
    item: GachaItemDefinition,
    headers: unknown[] = [],
    colMap?: GachaRewardColumnMap,
    sheet?: unknown,
  ): string => {
    const inferredType = deps.inferEquipmentTableTypeForGachaItem(item);
    const typeColumnIndex = Number(colMap?.type);
    if (!Number.isInteger(typeColumnIndex) || typeColumnIndex < 0 || !sheet) return inferredType;

    const headerName = String(headers[typeColumnIndex] || '').trim();
    const columnAliasMap = deps.buildCrudColumnAliasMap(sheet);
    const columnName = deps.getCrudColumnNameForHeader(columnAliasMap, headerName);
    const allowedValues = deps.buildCrudEnumConstraintMap(sheet)[columnName]?.values || [];
    if (allowedValues.length === 0) return inferredType;

    const rawType = String(item.type || '').trim();
    const candidates = [rawType, inferredType, '防具', '护具', '衣物'];
    if (inferredType === '武器') candidates.push('武器');
    if (inferredType === '饰品') candidates.push('饰品', '首饰', '配饰');
    return candidates.find(candidate => candidate && allowedValues.includes(candidate)) || inferredType;
  };
  return resolveEquipmentTableTypeForGachaItem;
}
