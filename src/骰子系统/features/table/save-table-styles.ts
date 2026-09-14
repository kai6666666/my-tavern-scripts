// @ts-nocheck
/**
 * save-table-styles.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import { STORAGE_KEY_TABLE_STYLES } from '../../shared/storage-keys';
export function createSaveTableStyles(deps: any) {
  const saveTableStyles = v => Store.set(STORAGE_KEY_TABLE_STYLES, v);
  return saveTableStyles;
}
