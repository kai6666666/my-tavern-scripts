// @ts-nocheck
/**
 * build-auto-check-suggestion-guide.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBuildAutoCheckSuggestionGuide(deps: any) {
  const buildAutoCheckSuggestionGuide = (preset: AdvancedDicePreset): Required<CheckSuggestionGuide> => {
    const supportsContest = deps.AdvancedDicePresetManager.supportsContest(preset);
    const diceExpression = preset.diceExpression || '1d100';
    const hasDc = !preset.dc?.hidden;
    const hasMod = !!preset.mod && !preset.mod.hidden;
    const hasSkillMod = !!preset.skillMod && !preset.skillMod.hidden;
    const customParamText =
      preset.customFields
        ?.filter(field => !field.hidden)
        .map(field => `${field.id}=<${field.label || field.id}>`)
        .join(' ') || '';
    const paramPieces = [
      hasDc ? 'dc=<目标值>' : '',
      hasMod ? 'mod=<修正值>' : '',
      hasSkillMod ? 'skillMod=<技能加值或属性名>' : '',
      customParamText,
    ]
      .filter(Boolean)
      .join(' ');
    const suffix = paramPieces ? ` ${paramPieces}` : '';

    return {
      rule:
        `使用当前检定预设「${preset.name}」：掷骰公式为 ${diceExpression}，按该预设的 outcomes、判定策略与输出模板裁决结果。` +
        '属性名必须来自下方角色属性清单并原样引用；需要额外参数时使用 key=value。',
      dsl:
        `普通检定：检定 <角色> <属性>${suffix}\n` +
        (supportsContest ? `对抗检定：对抗 <发起者> <属性> vs <对手> <属性>${suffix}\n` : '') +
        '固定成功：必成\n固定失败：必败\n无需检定：无',
      examples:
        `1. 展示文本：<角色>尝试完成一个关键行动。\n   骰子命令：检定 <角色> <属性>${suffix}\n` +
        (supportsContest
          ? `2. 展示文本：<角色>与<对手>在同一目标上相互较量。\n   骰子命令：对抗 <角色> <属性> vs <对手> <属性>\n`
          : '') +
        '3. 展示文本：行动结果已经明确，不需要投骰。\n   骰子命令：无',
    };
  };
  return buildAutoCheckSuggestionGuide;
}
