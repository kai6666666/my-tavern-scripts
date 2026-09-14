// @ts-nocheck
/**
 * compare-version.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCompareVersion(deps: any) {
  const compareVersion = (v1, v2) => {
    // 处理数字版本号（向后兼容）
    const normalizeVersion = v => {
      if (typeof v === 'number') return `${v}.0.0`;
      if (typeof v !== 'string') return '0.0.0';
      return v;
    };
    const nv1 = normalizeVersion(v1);
    const nv2 = normalizeVersion(v2);
    const parts1 = nv1.split('.').map(Number);
    const parts2 = nv2.split('.').map(Number);
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const p1 = parts1[i] || 0;
      const p2 = parts2[i] || 0;
      if (p1 < p2) return -1;
      if (p1 > p2) return 1;
    }
    return 0;
  };
  return compareVersion;
}
