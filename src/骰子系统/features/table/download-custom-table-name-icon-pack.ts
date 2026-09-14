// @ts-nocheck
/**
 * download-custom-table-name-icon-pack.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { getCustomTableNameIconPackDownloadFileName } from './build-custom-table-name-icon-pack';
export function createDownloadCustomTableNameIconPack(deps: any) {
  const downloadCustomTableNameIconPack = (pack: CustomTableNameIconPack): void => {
    const json = JSON.stringify(pack, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = getCustomTableNameIconPackDownloadFileName();
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };
  return downloadCustomTableNameIconPack;
}
