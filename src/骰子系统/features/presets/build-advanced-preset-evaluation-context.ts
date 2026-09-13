// @ts-nocheck
/**
 * build-advanced-preset-evaluation-context.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBuildAdvancedPresetEvaluationContext(deps: any) {
  const buildAdvancedPresetEvaluationContext = (
    preset: AdvancedDicePreset,
    rawContext?: Record<string, unknown>,
  ): Record<string, string | number | boolean | RollResult> => {
    const rollRecord = rawContext && deps.isAdvancedPresetRecord(rawContext.roll) ? rawContext.roll : {};
    const rollTotal = deps.coerceAdvancedPresetContextNumber(rawContext?.rollTotal ?? rollRecord.total, 50);
    const rollTags = deps.readAdvancedPresetContextTags(rawContext?.rollTags ?? rollRecord.tags);
    const context: Record<string, string | number | boolean | RollResult> = {
      $roll: deps.createAdvancedPresetRollResult(rollTotal, rollTags),
      $attr: deps.coerceAdvancedPresetContextNumber(rawContext?.attr ?? rawContext?.attribute, 50),
      $attrMod: 0,
      $dc: deps.coerceAdvancedPresetContextNumber(rawContext?.dc, 0),
      $mod: deps.coerceAdvancedPresetContextNumber(rawContext?.mod, 0),
      $skillMod: deps.coerceAdvancedPresetContextNumber(rawContext?.skillMod, 0),
    };

    if (preset.attribute?.computeModifier) {
      const evalResult = deps.evaluateCondition(preset.attribute.computeModifier, context as Record<string, number>);
      if (evalResult.success) {
        const rawValue = evalResult.value;
        context.$attrMod = typeof rawValue === 'number' && Number.isFinite(rawValue) ? rawValue : rawValue ? 1 : 0;
      }
    }

    if (Array.isArray(preset.customFields)) {
      preset.customFields.forEach(field => {
        context[`$${field.id}`] = deps.coerceAdvancedPresetContextNumber(field.defaultValue, 0);
      });
    }

    if (preset.outcomePolicy?.kind === 'minRank') {
      const requiredRankVarId = preset.outcomePolicy.requiredRankVarId;
      const varKey = requiredRankVarId.startsWith('$') ? requiredRankVarId : `$${requiredRankVarId}`;
      context[varKey] = 1;
    }

    if (rawContext) {
      const vars = deps.isAdvancedPresetRecord(rawContext.vars) ? rawContext.vars : {};
      Object.entries(vars).forEach(([key, value]) => deps.assignAdvancedPresetContextNumber(context, key, value));
      Object.entries(rawContext).forEach(([key, value]) => {
        if (['roll', 'rollTotal', 'rollTags', 'vars', 'attr', 'attribute', 'dc', 'mod', 'skillMod'].includes(key)) {
          return;
        }
        deps.assignAdvancedPresetContextNumber(context, key, value);
      });
    }

    if (Array.isArray(preset.derivedVars)) {
      preset.derivedVars.forEach(spec => {
        if (!spec || typeof spec.id !== 'string' || typeof spec.expr !== 'string') return;
        const evalResult = deps.evaluateCondition(spec.expr, context as Record<string, number>);
        if (!evalResult.success) return;
        const value = evalResult.value;
        context[`$${spec.id}`] = typeof value === 'number' && Number.isFinite(value) ? value : value ? 1 : 0;
      });
    }

    return context;
  };
  return buildAdvancedPresetEvaluationContext;
}
