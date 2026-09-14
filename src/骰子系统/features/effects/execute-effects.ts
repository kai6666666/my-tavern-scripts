// @ts-nocheck
/**
 * execute-effects.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { parseEffectValueInput } from '../../shared/effect-math';
export function createExecuteEffects(deps: any) {
  async function executeEffects(pendingCtx: PendingEffectContext): Promise<EffectResult[]> {
    const results: EffectResult[] = [];
    const { preset, matchedOutcome, context } = pendingCtx;
    const replayOperations: EffectReplayOperation[] = [];
    const deferredSecondaryCallbacks: Array<() => void> = [];
    const baseData = deps.getCachedRawData() || deps.getTableData();
    if (!baseData) {
      throw new Error('效果执行失败：无法获取表格数据');
    }
    const transactionalData = JSON.parse(JSON.stringify(baseData));
    const modifiedSheetKeys = new Set<string>();
    const overrideMap = new Map<string, ComputedEffect>();
    if (pendingCtx.effectOverrides && pendingCtx.effectOverrides.length > 0) {
      pendingCtx.effectOverrides.forEach(item => {
        overrideMap.set(item.effectId, item);
      });
    }

    if (!matchedOutcome.effects || matchedOutcome.effects.length === 0) {
      return results;
    }

    console.info(`[DICE] Executing ${matchedOutcome.effects.length} effects for outcome "${matchedOutcome.name}"`);

    for (const effect of matchedOutcome.effects) {
      // 1. 检查条件
      if (effect.condition) {
        const condContext = {
          $roll: context.roll,
          $attr: context.attributeValue,
          $mod: context.modifier,
          $dc: context.dc,
        };
        const condResult = deps.evaluateCondition(effect.condition, condContext);
        if (!condResult.success || !condResult.value) {
          console.info(`[DICE] Effect ${effect.id} skipped: condition "${effect.condition}" not met`);
          continue;
        }
      }

      // 2. 检查 allowedTargets
      if (preset.effectsConfig?.allowedTargets && preset.effectsConfig.allowedTargets.length > 0) {
        if (!preset.effectsConfig.allowedTargets.includes(effect.target)) {
          console.warn(`[DICE] Effect ${effect.id} blocked: target "${effect.target}" not in allowedTargets`);
          continue;
        }
      }

      // 3. 解析 value（支持骰子表达式）
      let finalValue = 0;
      let formulaText = '';
      let rolledValue: number | undefined;
      const override = overrideMap.get(effect.id);
      if (override) {
        finalValue = Math.abs(override.computedValue);
        formulaText = override.formula || String(effect.value || '0');
        rolledValue = Number.isFinite(override.rolledValue) ? override.rolledValue : undefined;
        console.info(
          `[DICE] Effect ${effect.id}: use confirmed override "${override.formula}" => ${override.computedValue}`,
        );
      } else {
        const parsedValue = parseEffectValueInput(effect.value, `Effect ${effect.id}`);
        formulaText = parsedValue.formulaText;
        finalValue = parsedValue.finalValue;
        rolledValue = parsedValue.rolledValue;
        if (parsedValue.valid) {
          console.info(`[DICE] Effect ${effect.id}: rolled "${formulaText}" = ${finalValue}`);
        }
      }

      // 4. 执行属性更新（使用 updateSingleAttribute 支持属性字符串格式）
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
          skipSave: true,
          dataOverride: transactionalData,
        },
      );
      if (updateResult.modifiedSheetKey) modifiedSheetKeys.add(updateResult.modifiedSheetKey);

      // 5. 记录结果
      const effectResult: EffectResult = {
        effectId: effect.id,
        success: updateResult.success,
        oldValue: updateResult.oldValue,
        newValue: updateResult.newValue,
        error: updateResult.error,
        target: updateResult.resolvedAttrName || effect.target,
        level: 1,
        triggerType: 'primary',
        branchLabel: `L1/${matchedOutcome.name}`,
        formulaText,
        rolledValue,
      };
      results.push(effectResult);

      if (updateResult.success) {
        replayOperations.push({
          characterName: context.characterName,
          target: effect.target,
          operation: effect.operation,
          value: finalValue,
          initValue: effect.initValue,
          min: effect.min,
          max: effect.max,
          aliasCandidates,
          resultRef: effectResult,
        });
      }

      if (updateResult.success) {
        console.info(
          `[DICE] Effect executed: ${context.characterName}.${updateResult.resolvedAttrName || effect.target} ${effect.operation} ${finalValue} (${updateResult.oldValue} → ${updateResult.newValue})`,
        );
      } else {
        console.error(`[DICE] Effect ${effect.id} failed: ${updateResult.error}`);
      }
    }

    const secondaryResults = await deps.executeSecondaryEffectsChain(
      preset,
      results,
      {
        characterName: context.characterName,
        attributeName: context.attributeName,
        attributeValue: context.attributeValue,
      },
      transactionalData,
      modifiedSheetKeys,
      replayOperations,
      deferredSecondaryCallbacks,
    );

    const allResults = [...results, ...secondaryResults];
    const hasFailure = allResults.some(r => !r.success);

    // all-or-nothing: 任一效果失败则整批回滚（不提交 transactionalData）
    if (hasFailure) {
      return allResults.map(r =>
        r.success
          ? {
              ...r,
              success: false,
              error: r.error || '事务回滚：同批次存在失败效果，整批未提交',
            }
          : r,
      );
    }

    // 在保存队列的同一临界区内读取最新数据、重放补丁并提交
    return deps.runInSaveQueue(async () => {
      const latestData = deps.getCachedRawData() || deps.getTableData();
      if (!latestData) {
        return allResults.map(r =>
          r.success
            ? {
                ...r,
                success: false,
                error: r.error || '事务回滚：提交阶段无法读取最新数据',
              }
            : r,
        );
      }

      const latestTransactionalData = JSON.parse(JSON.stringify(latestData));
      const latestModifiedSheetKeys = new Set<string>();
      for (const op of replayOperations) {
        const replayResult = await deps.updateSingleAttribute(op.characterName, op.target, op.operation, op.value, {
          initValue: op.initValue,
          min: op.min,
          max: op.max,
          aliasCandidates: op.aliasCandidates,
          skipSave: true,
          dataOverride: latestTransactionalData,
        });

        if (!replayResult.success) {
          return allResults.map(r =>
            r.success
              ? {
                  ...r,
                  success: false,
                  error: r.error || `事务回滚：最新数据重放失败 (${replayResult.error || 'unknown'})`,
                }
              : r,
          );
        }

        if (replayResult.modifiedSheetKey) latestModifiedSheetKeys.add(replayResult.modifiedSheetKey);
        op.resultRef.oldValue = replayResult.oldValue;
        op.resultRef.newValue = replayResult.newValue;
        op.resultRef.target = replayResult.resolvedAttrName || op.resultRef.target;
        op.resultRef.error = undefined;
      }

      if (latestModifiedSheetKeys.size > 0) {
        try {
          await deps.performSaveDataOnly(latestTransactionalData, Array.from(latestModifiedSheetKeys));
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          return allResults.map(result => ({
            ...result,
            success: false,
            error: result.error || `保存失败：${message}`,
          }));
        }
      }

      deferredSecondaryCallbacks.forEach(run => run());

      return allResults;
    });
  }
  return executeEffects;
}
