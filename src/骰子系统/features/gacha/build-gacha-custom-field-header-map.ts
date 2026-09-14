// @ts-nocheck
/**
 * build-gacha-custom-field-header-map.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBuildGachaCustomFieldHeaderMap(deps: any) {
  const buildGachaCustomFieldHeaderMap = (headers: unknown[]): Map<string, number> => {
    const headerMap = new Map<string, number>();
    if (!Array.isArray(headers)) return headerMap;

    headers.forEach((header, index) => {
      const headerName = String(header ?? '').trim();
      if (!headerName || headerMap.has(headerName)) return;
      headerMap.set(headerName, index);
    });

    return headerMap;
  };
  return buildGachaCustomFieldHeaderMap;
}
