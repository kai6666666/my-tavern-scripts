// @ts-nocheck
/**
 * build-check-suggestion-preset-side.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { rollComplexDiceExpression } from '../../features/dice/dice-engine';
export function createBuildCheckSuggestionPresetSide(deps: any) {
  const buildCheckSuggestionPresetSide = (
    preset: AdvancedDicePreset,
    input: {
      characterName: string;
      attributeName: string;
      params: CheckSuggestionParams;
      targetValue?: number | null;
      diceExpression?: string;
    },
  ): CheckSuggestionPresetSideResult => {
    const defaultAttr = deps.resolveCheckSuggestionDefaultValue(preset.attribute?.defaultValue, {});
    const rawAttrEntry = deps.getAttributeEntryForCharacter(input.characterName, input.attributeName);
    const mappedTarget = deps.getCheckSuggestionMappedTarget(preset, input.attributeName, rawAttrEntry?.source);
    const rawAttrValue = rawAttrEntry?.value ?? null;
    let attrValue = defaultAttr;
    if (input.params.attr !== undefined) {
      attrValue = deps.resolveCheckSuggestionNumberParam(input.params.attr, input.characterName, defaultAttr);
    } else if (input.targetValue !== undefined && input.targetValue !== null) {
      attrValue = input.targetValue;
    } else if (mappedTarget !== 'skillMod' && rawAttrValue !== null) {
      attrValue = rawAttrValue;
    }

    const dc = deps.resolveCheckSuggestionNumberParam(
      input.params.dc,
      input.characterName,
      deps.resolveCheckSuggestionDefaultValue(preset.dc?.defaultValue, { $attr: attrValue }),
    );
    const mod = deps.resolveCheckSuggestionNumberParam(
      input.params.mod,
      input.characterName,
      preset.mod?.hidden && input.params.mod === undefined
        ? 0
        : deps.resolveCheckSuggestionDefaultValue(preset.mod?.defaultValue, { $attr: attrValue }),
      { preferAttribute: false },
    );
    let skillMod = deps.resolveCheckSuggestionNumberParam(
      input.params.skillMod,
      input.characterName,
      deps.resolveCheckSuggestionDefaultValue(preset.skillMod?.defaultValue, { $attr: attrValue }),
    );
    if (input.params.skillMod === undefined && mappedTarget === 'skillMod' && rawAttrValue !== null) {
      skillMod = rawAttrValue;
    }

    let attrMod = 0;
    if (preset.attribute?.computeModifier) {
      attrMod = deps.evaluateConditionNumber(preset.attribute.computeModifier, { $attr: attrValue }, 0);
    }

    const customValues: Record<string, string | number | boolean> = {};
    if (Array.isArray(preset.customFields)) {
      preset.customFields.forEach(field => {
        customValues[`$${field.id}`] = deps.resolveCheckSuggestionFieldValue(field, input.params, input.characterName);
      });
    }

    const baseContext: Record<string, string | number | boolean | RollResult> = {
      $attr: attrValue,
      $attrMod: attrMod,
      $skillMod: skillMod,
      $dc: dc,
      $mod: mod,
      $isPushed: 0,
      ...customValues,
    };

    const derivedValues: Record<string, number> = {};
    if (Array.isArray(preset.derivedVars)) {
      preset.derivedVars.forEach(spec => {
        const id = spec?.id?.trim();
        if (!id) return;
        const varName = id.startsWith('$') ? id : `$${id}`;
        const evalResult = deps.evaluateCondition(spec.expr, { ...baseContext, ...derivedValues } as Record<string, number>);
        if (!evalResult.success) {
          console.warn(`[DICE] 检定建议派生变量 ${varName} 计算失败:`, evalResult.error);
          derivedValues[varName] = 0;
          return;
        }
        const rawValue = evalResult.value;
        derivedValues[varName] =
          typeof rawValue === 'number' && Number.isFinite(rawValue) ? rawValue : rawValue ? 1 : 0;
      });
    }

    let diceExpression = input.diceExpression || preset.diceExpression || '1d100';
    if (Array.isArray(preset.dicePatches)) {
      const patchContext: Record<string, string | number | boolean | RollResult> = {
        ...baseContext,
        ...derivedValues,
      };
      preset.dicePatches.forEach(patch => {
        if (!patch) return;
        if (patch.when) {
          const conditionResult = deps.evaluateCondition(patch.when, patchContext as Record<string, number>);
          if (!conditionResult.success) {
            console.warn('[DICE] 检定建议 dicePatches 条件评估失败:', conditionResult.error);
            return;
          }
          const shouldApply =
            typeof conditionResult.value === 'number' ? conditionResult.value !== 0 : Boolean(conditionResult.value);
          if (!shouldApply) return;
        }
        const resolvedTemplate = String(patch.template || '').replace(/\$[a-zA-Z_]\w*/g, match => {
          const value = patchContext[match];
          return typeof value === 'number' && Number.isFinite(value) ? String(value) : '0';
        });
        if (patch.op === 'append') diceExpression = `${diceExpression}${resolvedTemplate}`;
        else if (patch.op === 'prepend') diceExpression = `${resolvedTemplate}${diceExpression}`;
        else if (patch.op === 'replace') diceExpression = resolvedTemplate;
      });
    }

    const rollResult = rollComplexDiceExpression(diceExpression);
    if (Number.isNaN(rollResult.total)) {
      throw new Error(`无效的骰子公式：${diceExpression}`);
    }

    const postRollDerivedValues: Record<string, number> = {};
    if (Array.isArray(preset.derivedVars)) {
      const postRollContext: Record<string, string | number | boolean | RollResult> = {
        $roll: rollResult,
        '$roll.total': rollResult.total,
        ...baseContext,
        ...customValues,
      };
      preset.derivedVars.forEach(spec => {
        const id = spec?.id?.trim();
        if (!id) return;
        const varName = id.startsWith('$') ? id : `$${id}`;
        const evalResult = deps.evaluateCondition(spec.expr, { ...postRollContext, ...postRollDerivedValues } as Record<
          string,
          number
        >);
        if (!evalResult.success) {
          console.warn(`[DICE] 检定建议派生变量 ${varName} (投骰后) 计算失败:`, evalResult.error);
          postRollDerivedValues[varName] = 0;
          return;
        }
        const rawValue = evalResult.value;
        postRollDerivedValues[varName] =
          typeof rawValue === 'number' && Number.isFinite(rawValue) ? rawValue : rawValue ? 1 : 0;
      });
    }

    const context: Record<string, string | number | boolean | RollResult> = {
      $roll: rollResult,
      '$roll.total': rollResult.total,
      ...baseContext,
      ...postRollDerivedValues,
    };
    const outcomeResult = deps.evaluateCheckSuggestionOutcome(preset, context);
    const outcome = outcomeResult.outcome;
    const displayOutcome = deps.getAdvancedPresetDisplayOutcome(outcomeResult);
    const displayExpr = displayOutcome.displayExpr ?? displayOutcome.condition;
    const conditionExpr = deps.replaceCheckSuggestionConditionVars(displayExpr, context, rollResult);
    const displayExprResult = deps.evaluateCondition(displayExpr, context as Record<string, number>);
    const rawDisplayExprValue = displayExprResult.value;
    const displayValue =
      typeof rawDisplayExprValue === 'number' && Number.isFinite(rawDisplayExprValue)
        ? rawDisplayExprValue
        : conditionExpr;
    const judgeResultText =
      displayExprResult.success &&
      (typeof displayExprResult.value === 'number' ? displayExprResult.value !== 0 : Boolean(displayExprResult.value))
        ? '成立'
        : '不成立';

    const outputVars: Record<string, string | number | boolean> = {};
    Object.entries({ ...customValues, ...postRollDerivedValues }).forEach(([key, value]) => {
      outputVars[key.startsWith('$') ? key.slice(1) : key] = value;
    });

    return {
      characterName: input.characterName,
      attributeName: input.attributeName,
      attrValue,
      attrMod,
      dc,
      mod,
      skillMod,
      customValues,
      derivedValues: postRollDerivedValues,
      diceExpression,
      rollResult,
      rollTotal: rollResult.total,
      context,
      outcome,
      conditionExpr,
      judgeResultText,
      displayValue,
      outputVars,
    };
  };
  return buildCheckSuggestionPresetSide;
}
