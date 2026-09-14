// @ts-nocheck
/**
 * execute-secondary-effects-chain.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { parseEffectValueInput } from '../../shared/effect-math';
import { rollComplexDiceExpression } from '../../features/dice/dice-engine';
export function createExecuteSecondaryEffectsChain(deps: any) {
  async function executeSecondaryEffectsChain(
    preset: AdvancedDicePreset,
    effectResults: EffectResult[],
    context: { characterName: string; attributeName: string; attributeValue: number },
    transactionalData?: Record<string, { name: string; content: (string | number | null)[][] }>,
    modifiedSheetKeys?: Set<string>,
    replayOperations?: EffectReplayOperation[],
    deferredSecondaryCallbacks?: Array<() => void>,
  ): Promise<EffectResult[]> {
    const secondaryEffects = preset.secondaryEffects;
    if (!secondaryEffects || secondaryEffects.length === 0) return [];

    const clamp = (num: number, min: number, max: number): number => Math.max(min, Math.min(max, num));
    const maxDepth = clamp(Number(preset.secondaryMaxDepth ?? 3), 1, 8);
    const triggerCounts = new Map<string, number>();
    const allGenerated: EffectResult[] = [];
    const localDeferredCallbacks: Array<() => void> = [];
    const callbackQueue = deferredSecondaryCallbacks || localDeferredCallbacks;
    let currentLevelResults = effectResults.filter(r => r.success);

    const buildFormulaContext = (): Record<string, number> => {
      const currentAttrs = deps.getFullAttributesForCharacter(context.characterName, transactionalData);
      const formulaContext: Record<string, number> = {};
      currentAttrs.forEach(attr => {
        if (attr && typeof attr.name === 'string' && typeof attr.value === 'number' && !isNaN(attr.value)) {
          formulaContext[attr.name] = attr.value;
        }
      });
      return formulaContext;
    };

    const compare = (operator: SecondaryEffect['trigger']['operator'], left: number, right: number): boolean => {
      switch (operator) {
        case 'gt':
          return left > right;
        case 'gte':
          return left >= right;
        case 'lt':
          return left < right;
        case 'lte':
          return left <= right;
        case 'eq':
          return left === right;
        default:
          return false;
      }
    };

    const resolveThresholdValue = (value: string, result: EffectResult, depth: number): number => {
      const rawExpr = String(value || '').trim();
      if (!rawExpr) return 0;

      // 兼容 {意志}/5 形式
      const expr = rawExpr.replace(/\{([^}]+)\}/g, '$1');
      const delta = Math.abs(result.newValue - result.oldValue);
      const liveFormulaContext = buildFormulaContext();
      const exprContext: Record<string, number> = {
        ...liveFormulaContext,
        $attr: result.newValue,
        $old: result.oldValue,
        $new: result.newValue,
        $delta: delta,
        $depth: depth,
      };

      const condResult = deps.evaluateCondition(expr, exprContext);
      if (condResult.success && condResult.value !== undefined) {
        const val = typeof condResult.value === 'boolean' ? (condResult.value ? 1 : 0) : Number(condResult.value);
        if (Number.isFinite(val)) return val;
      }

      const formulaExpr = expr.replace(/\$[a-zA-Z_]\w*/g, token => {
        const val = exprContext[token];
        return typeof val === 'number' && Number.isFinite(val) ? String(val) : '0';
      });
      const formulaValue = deps.evaluateFormula(formulaExpr, liveFormulaContext);
      if (typeof formulaValue === 'number' && Number.isFinite(formulaValue)) return formulaValue;

      const fallbackNum = parseFloat(expr);
      return Number.isFinite(fallbackNum) ? fallbackNum : 0;
    };

    const renderTemplateText = (text: string, vars: Record<string, string | number | boolean | undefined>): string => {
      return String(text || '').replace(/\$([a-zA-Z_]\w*)/g, (match, key: string) => {
        const varKey = `$${key}`;
        const val = vars[varKey];
        if (val === undefined || val === null) return match;
        return String(val);
      });
    };

    const renderTemplateTextTwice = (
      text: string,
      vars: Record<string, string | number | boolean | undefined>,
    ): string => {
      const pass1 = renderTemplateText(text, vars);
      return renderTemplateText(pass1, vars);
    };

    const appendNamedRandomTables = (
      outputVars: Record<string, string | number | boolean>,
      randomTables?: SecondaryEffect['randomTables'],
    ): void => {
      if (!randomTables) return;
      for (const [tableKey, tableDef] of Object.entries(randomTables)) {
        if (!tableDef || !tableDef.dice) continue;
        const tableRoll = rollComplexDiceExpression(tableDef.dice);
        outputVars[`$${tableKey}Roll`] = tableRoll.total;
        const rawResult = tableDef.entries?.[tableRoll.total] ?? String(tableRoll.total);
        outputVars[`$${tableKey}Result`] = renderTemplateTextTwice(rawResult, outputVars);
      }
    };

    for (let depth = 2; depth <= maxDepth + 1; depth++) {
      if (currentLevelResults.length === 0) break;
      const nextLevelResults: EffectResult[] = [];

      const secondaryTriggerMode: 'first' | 'all' = preset.secondaryTriggerMode === 'all' ? 'all' : 'first';

      for (const secEffect of secondaryEffects) {
        if (secEffect.enabled === false) continue;
        const maxTriggerCount = Math.max(1, secEffect.maxTriggerCount ?? 1);
        const currentCount = triggerCounts.get(secEffect.id) || 0;
        if (currentCount >= maxTriggerCount) continue;

        const matchedCandidates: Array<{ result: EffectResult; thresholdValue: number }> = [];
        for (const result of currentLevelResults) {
          if (!result.success) continue;
          const resultTarget = result.target || result.effectId;
          if (!deps.isSameAttributeAlias(resultTarget, secEffect.trigger.attribute)) continue;

          const attrValue = result.newValue;
          const delta = Math.abs(result.newValue - result.oldValue);
          const thresholdValue = resolveThresholdValue(secEffect.trigger.value, result, depth);
          const compareValue = secEffect.trigger.type === 'threshold' ? attrValue : delta;
          const isTriggered = compare(secEffect.trigger.operator, compareValue, thresholdValue);
          if (!isTriggered) continue;

          matchedCandidates.push({ result, thresholdValue });
          if (secondaryTriggerMode === 'first') break;
        }

        if (matchedCandidates.length === 0) continue;

        const remainingTriggerCount = Math.max(0, maxTriggerCount - currentCount);
        if (remainingTriggerCount === 0) continue;

        let consumedMatches = 0;
        const generatedByMatch: EffectResult[][] = [];

        for (let candidateIndex = 0; candidateIndex < matchedCandidates.length; candidateIndex++) {
          if (consumedMatches >= remainingTriggerCount) break;

          const matched = matchedCandidates[candidateIndex];
          const matchedResult = matched.result;
          const matchedThresholdValue = matched.thresholdValue;
          const attrValue = matchedResult.newValue;
          const delta = Math.abs(matchedResult.newValue - matchedResult.oldValue);
          const nextMatchIndex = consumedMatches + 1;
          let callbackScheduled = false;

          if (secEffect.callback) {
            const callbackFn = (window as Record<string, unknown>)[secEffect.callback];
            if (typeof callbackFn === 'function') {
              const callbackPayload: Record<string, unknown> = {
                attrValue,
                delta,
                context,
                depth,
                thresholdValue: matchedThresholdValue,
                matchIndex: nextMatchIndex,
                chainMode: secondaryTriggerMode,
              };
              callbackScheduled = true;
              const runCallback = () => {
                try {
                  (callbackFn as (effect: SecondaryEffect, data: Record<string, unknown>) => void)(
                    secEffect,
                    callbackPayload,
                  );
                  console.info(
                    `[DICE] Secondary effect callback triggered: ${secEffect.id} (depth=${depth}, mode=${secondaryTriggerMode}, match=${nextMatchIndex}, ${secEffect.trigger.type} ${secEffect.trigger.operator} ${matchedThresholdValue})`,
                  );
                } catch (e) {
                  console.error(`[DICE] Secondary effect callback error:`, e);
                }
              };

              callbackQueue.push(runCallback);
            }
          }

          const effectsToRun: Effect[] = [...(secEffect.effects || [])];
          const generatedForCurrentMatch: EffectResult[] = [];
          const baseOutputVars: Record<string, string | number | boolean> = {
            $delta: delta,
            $old: matchedResult.oldValue,
            $new: matchedResult.newValue,
            $attr: attrValue,
            $depth: depth,
            $initiator: context.characterName,
            $attribute: matchedResult.target || context.attributeName,
          };

          // 渲染 outputText 模板并生成信息型 EffectResult
          if (secEffect.outputText) {
            const outputVars: Record<string, string | number | boolean> = {
              ...baseOutputVars,
            };
            // 随机表: 投骰并查表，注入 $tableRoll 和 $tableResult
            if (secEffect.randomTable) {
              const tableRoll = rollComplexDiceExpression(secEffect.randomTable.dice);
              outputVars.$tableRoll = tableRoll.total;
              const rawTableResult = secEffect.randomTable.entries[tableRoll.total] || `未知(${tableRoll.total})`;
              outputVars.$tableResult = renderTemplateTextTwice(rawTableResult, outputVars);
            }
            appendNamedRandomTables(outputVars, secEffect.randomTables);
            const renderedText = renderTemplateTextTwice(secEffect.outputText, outputVars);
            const infoResult: EffectResult = {
              effectId: secEffect.id,
              success: true,
              oldValue: matchedResult.oldValue,
              newValue: matchedResult.newValue,
              target: matchedResult.target,
              level: depth,
              triggerType: secEffect.trigger.type,
              triggerSourceId: secEffect.id,
              triggerThreshold: matchedThresholdValue,
              triggerMatchIndex: nextMatchIndex,
              outputMessage: renderedText,
              branchLabel: `L${depth}/${secEffect.id}`,
            };
            // infoResult 只进 allGenerated（最终返回）和 generatedForCurrentMatch（当次统计），
            // 不进 nextLevelResults（下一层级输入），避免其继承的 delta/oldValue/newValue 误触发下游 delta/threshold 效果
            allGenerated.push(infoResult);
            generatedForCurrentMatch.push(infoResult);
          }

          if (secEffect.subCheck) {
            const subCheck = secEffect.subCheck;
            const subCheckCandidates = [subCheck.attribute, ...(subCheck.attributeCandidates || [])].filter(
              (item, idx, arr) => Boolean(item) && arr.indexOf(item) === idx,
            );
            const subCheckLabel = subCheck.label || subCheck.attribute;
            let subCheckAttrName = subCheck.attribute;
            let subCheckAttrValue: number | null = null;
            for (const candidate of subCheckCandidates) {
              const value = deps.getAttributeValue(context.characterName, candidate, subCheckCandidates);
              if (typeof value === 'number' && Number.isFinite(value)) {
                subCheckAttrName = candidate;
                subCheckAttrValue = value;
                break;
              }
            }

            if (subCheckAttrValue === null) {
              const fallbackText =
                subCheck.missingAttributeText ||
                '⚠ 无法自动进行$subCheckLabel：发起者缺少属性[$subCheckAttrName]，请手动判定。';
              const missingVars: Record<string, string | number | boolean> = {
                ...baseOutputVars,
                $subCheckLabel: subCheckLabel,
                $subCheckAttrName: subCheckAttrName,
              };
              const infoResult: EffectResult = {
                effectId: `${secEffect.id}_subcheck_missing`,
                success: true,
                oldValue: matchedResult.oldValue,
                newValue: matchedResult.newValue,
                target: matchedResult.target,
                level: depth,
                triggerType: secEffect.trigger.type,
                triggerSourceId: secEffect.id,
                triggerThreshold: matchedThresholdValue,
                triggerMatchIndex: nextMatchIndex,
                outputMessage: renderTemplateText(fallbackText, missingVars),
                branchLabel: `L${depth}/${secEffect.id}/${subCheckLabel}:缺失属性`,
              };
              allGenerated.push(infoResult);
              generatedForCurrentMatch.push(infoResult);
            } else {
              const subCheckDice = subCheck.dice || '1d100';
              const subCheckRoll = rollComplexDiceExpression(subCheckDice).total;
              const subCheckTarget =
                typeof subCheck.targetValue === 'string' && subCheck.targetValue.trim().length > 0
                  ? resolveThresholdValue(subCheck.targetValue, matchedResult, depth)
                  : subCheckAttrValue;
              const subCheckOperator = subCheck.operator || 'lte';
              const subCheckPassed = compare(subCheckOperator, subCheckRoll, subCheckTarget);
              const subCheckJudge = subCheckPassed ? '成立' : '不成立';
              const branch = subCheckPassed ? subCheck.success : subCheck.failure;
              const subCheckVars: Record<string, string | number | boolean> = {
                ...baseOutputVars,
                $subCheckLabel: subCheckLabel,
                $subCheckAttrName: subCheckAttrName,
                $subCheckAttrValue: subCheckAttrValue,
                $subCheckDice: subCheckDice,
                $subCheckRoll: subCheckRoll,
                $subCheckTarget: subCheckTarget,
                $subCheckOperator: subCheckOperator,
                $subCheckPassed: subCheckPassed ? 1 : 0,
                $subCheckJudge: subCheckJudge,
              };

              if (branch?.randomTable) {
                const tableRoll = rollComplexDiceExpression(branch.randomTable.dice);
                subCheckVars.$tableRoll = tableRoll.total;
                const rawTableResult = branch.randomTable.entries[tableRoll.total] || `未知(${tableRoll.total})`;
                subCheckVars.$tableResult = renderTemplateTextTwice(rawTableResult, subCheckVars);
              }
              appendNamedRandomTables(
                subCheckVars,
                branch?.randomTables as SecondaryEffect['randomTables'] | undefined,
              );

              if (branch?.outputText) {
                const infoResult: EffectResult = {
                  effectId: `${secEffect.id}_subcheck_${subCheckPassed ? 'success' : 'failure'}`,
                  success: true,
                  oldValue: matchedResult.oldValue,
                  newValue: matchedResult.newValue,
                  target: matchedResult.target,
                  level: depth,
                  triggerType: secEffect.trigger.type,
                  triggerSourceId: secEffect.id,
                  triggerThreshold: matchedThresholdValue,
                  triggerMatchIndex: nextMatchIndex,
                  outputMessage: renderTemplateTextTwice(branch.outputText, subCheckVars),
                  branchLabel: `L${depth}/${secEffect.id}/${subCheckLabel}:${subCheckPassed ? '成功' : '失败'}`,
                };
                allGenerated.push(infoResult);
                generatedForCurrentMatch.push(infoResult);
              }

              if (branch?.effects && branch.effects.length > 0) {
                effectsToRun.push(...branch.effects);
              }
            }
          }

          for (const effect of effectsToRun) {
            if (effect.condition) {
              const formulaContextForCondition = buildFormulaContext();
              const condContext = {
                $roll: 0,
                $attr: matchedResult.newValue,
                $old: matchedResult.oldValue,
                $new: matchedResult.newValue,
                $delta: delta,
                $depth: depth,
                $mod: 0,
                $dc: 0,
                ...formulaContextForCondition,
              };
              const condResult = deps.evaluateCondition(effect.condition, condContext);
              if (!condResult.success || !condResult.value) continue;
            }

            if (preset.effectsConfig?.allowedTargets && preset.effectsConfig.allowedTargets.length > 0) {
              if (!preset.effectsConfig.allowedTargets.includes(effect.target)) continue;
            }

            const parsedValue = parseEffectValueInput(effect.value, `Secondary ${secEffect.id}/${effect.id}`);
            const finalValue = parsedValue.finalValue;

            const aliasCandidates = [...(preset.effectsConfig?.allowedTargets || []), context.attributeName].filter(
              (name, idx, arr) => Boolean(name) && arr.indexOf(name) === idx,
            );

            const updateResult = await deps.updateSingleAttribute(
              context.characterName,
              effect.target,
              effect.operation,
              finalValue,
              {
                initValue: effect.initValue,
                min: effect.min,
                max: effect.max,
                aliasCandidates,
                skipSave: Boolean(transactionalData),
                dataOverride: transactionalData,
              },
            );
            if (updateResult.modifiedSheetKey && modifiedSheetKeys)
              modifiedSheetKeys.add(updateResult.modifiedSheetKey);

            const generatedResult: EffectResult = {
              effectId: effect.id,
              success: updateResult.success,
              oldValue: updateResult.oldValue,
              newValue: updateResult.newValue,
              error: updateResult.error,
              target: updateResult.resolvedAttrName || effect.target,
              level: depth,
              triggerType: secEffect.trigger.type,
              triggerSourceId: secEffect.id,
              triggerThreshold: matchedThresholdValue,
              triggerMatchIndex: nextMatchIndex,
              branchLabel: `L${depth}/${secEffect.id}`,
              formulaText: parsedValue.formulaText,
              rolledValue: parsedValue.rolledValue,
            };
            nextLevelResults.push(generatedResult);
            allGenerated.push(generatedResult);
            generatedForCurrentMatch.push(generatedResult);

            if (updateResult.success && replayOperations) {
              replayOperations.push({
                characterName: context.characterName,
                target: effect.target,
                operation: effect.operation,
                value: finalValue,
                initValue: effect.initValue,
                min: effect.min,
                max: effect.max,
                aliasCandidates,
                resultRef: generatedResult,
              });
            }
          }

          if (!callbackScheduled && generatedForCurrentMatch.length === 0) {
            continue;
          }

          consumedMatches += 1;
          generatedByMatch.push(generatedForCurrentMatch);
        }

        if (consumedMatches === 0) continue;

        triggerCounts.set(secEffect.id, currentCount + consumedMatches);

        for (const grouped of generatedByMatch) {
          grouped.forEach(item => {
            item.triggerMatchCount = consumedMatches;
          });
        }
      }

      currentLevelResults = nextLevelResults.filter(r => r.success);
    }

    if (!deferredSecondaryCallbacks) {
      const hasFailure = allGenerated.some(item => !item.success);
      if (!hasFailure) {
        localDeferredCallbacks.forEach(run => run());
      }
    }

    return allGenerated;
  }
  return executeSecondaryEffectsChain;
}
