// @ts-nocheck
/**
 * get-badge-style.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetBadgeStyle(deps: any) {
  const getBadgeStyle = text => {
    if (!text) return '';
    const str = String(text).trim();
    if (/^[0-9]+%?$/.test(str) || /^Lv\.\d+$/.test(str)) return 'acu-badge-green';
    if (str.length <= 6 && !str.includes('http')) return 'acu-badge-neutral';
    if (['是', '否', '有', '无', '死亡', '存活'].includes(str)) return 'acu-badge-neutral';
    return '';
  };
  return getBadgeStyle;
}
