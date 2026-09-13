// @ts-nocheck
/**
 * get-custom-table-name-icon-manager-invalid-source-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCustomTableNameIconManagerInvalidSourceText(deps: any) {
  const getCustomTableNameIconManagerInvalidSourceText = (
    reason: CustomTableNameIconInvalidSourceReason | null,
  ): string => {
    if (reason === 'invalid_protocol') return '仅支持 http/https 图片地址';
    if (reason === 'svg_url' || reason === 'svg_mime') return '不支持 SVG 图片';
    if (reason === 'unsupported_mime') return '仅支持 PNG、JPEG、WebP、GIF';
    if (reason === 'oversize') return '本地图片不能超过 1 MB';
    return '图片来源无效';
  };
  return getCustomTableNameIconManagerInvalidSourceText;
}
