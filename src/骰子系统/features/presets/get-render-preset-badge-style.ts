// @ts-nocheck
/**
 * get-render-preset-badge-style.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetRenderPresetBadgeStyle(deps: any) {
  const getRenderPresetBadgeStyle = (text: string, preset: RenderPreset): string => {
    const rules = preset.rules.badges;
    if (!rules.enabled) return '';
    const str = String(text || '').trim();
    if (!str) return '';
    if (rules.numericPattern && (/^[0-9]+%?$/.test(str) || /^Lv\.\d+$/.test(str))) return 'acu-badge-green';
    if (str.length <= rules.shortTextMaxLength && !str.includes('http')) return 'acu-badge-neutral';
    if (rules.statusValues.includes(str)) return 'acu-badge-neutral';
    return '';
  };
  return getRenderPresetBadgeStyle;
}
