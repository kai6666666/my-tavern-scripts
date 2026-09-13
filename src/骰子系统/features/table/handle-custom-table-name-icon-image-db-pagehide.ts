// @ts-nocheck
/**
 * handle-custom-table-name-icon-image-db-pagehide.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { CustomTableNameIconImageDB } from '../../shared/storage/custom-table-name-icon-image-db';
export function createHandleCustomTableNameIconImageDBPagehide(deps: any) {
  const handleCustomTableNameIconImageDBPagehide = (): void => {
    CustomTableNameIconImageDB.cleanup();
  };
  return handleCustomTableNameIconImageDBPagehide;
}
