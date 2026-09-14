// @ts-nocheck
/**
 * parse-in-scene-status.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createParseInSceneStatus(deps: any) {
  const parseInSceneStatus = (value, headerName) => {
    const val = String(value || '')
      .trim()
      .toLowerCase();
    const header = String(headerName || '').toLowerCase();
    if (!val) return false;

    if (header.includes('离场')) {
      return val === '否' || val === 'false' || val === 'no';
    }

    return val.startsWith('在场') || val === 'true' || val === '是' || val === 'yes';
  };
  return parseInSceneStatus;
}
