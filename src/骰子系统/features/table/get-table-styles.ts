// @ts-nocheck
/**
 * get-table-styles.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_TABLE_STYLES } from '../../shared/storage-keys';
import { Store } from '../../shared/storage/store';
export function createGetTableStyles(deps: any) {
  const getTableStyles = () => Store.get(STORAGE_KEY_TABLE_STYLES, {});
  return getTableStyles;
}
