// @ts-nocheck
/**
 * build-check-value-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBuildCheckValueText(deps: any) {
  const buildCheckValueText = (options: {
    preset: AdvancedDicePreset;
    characterName: string;
    actionName: string;
    attrValue: number;
    attrMod: number;
    skillMod: number;
    mode: 'normal' | 'contest';
    attrNameOverride?: string | null;
    skillNameOverride?: string | null;
  }): string => {
    const entry = deps.getAttributeEntryForCharacter(options.characterName, options.actionName);
    const resolvedActionName = entry?.name || options.actionName;
    const mappedTarget = deps.resolveQuickSelectTarget(resolvedActionName, entry?.source, options.preset, options.mode);
    const attrModText = options.attrMod !== 0 ? `（调整值${deps.formatSignedModifier(options.attrMod)}）` : '';
    const attributeName =
      options.attrNameOverride ||
      (mappedTarget === 'skillMod'
        ? options.attrMod !== 0
          ? options.preset.attribute?.label || '属性值'
          : null
        : resolvedActionName);
    const skillName = options.skillNameOverride || (mappedTarget === 'skillMod' ? resolvedActionName : null);

    const parts: string[] = [];
    if (attributeName) parts.push(`${attributeName}${options.attrValue}${attrModText}`);
    if (skillName) parts.push(`${skillName}（技能加值${deps.formatSignedModifier(options.skillMod)}）`);
    else if (options.skillMod !== 0) parts.push(`技能加值${deps.formatSignedModifier(options.skillMod)}`);

    if (parts.length > 0) return parts.join('+');
    return `${options.preset.attribute?.label || '属性值'}${options.attrValue}${attrModText}`;
  };
  return buildCheckValueText;
}
