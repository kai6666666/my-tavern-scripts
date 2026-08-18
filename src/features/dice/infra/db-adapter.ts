// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=2「数据库适配层 (LockManager -> GodDB API)」
// 原行范围：151-1317（含 banner 143-1317）；拆分批次 7；外部 closure 依赖：11（PRIMARY_KEYS@1 / getTableData@30 / cachedRawData@29 / evaluateCondition@28 / updateSingleAttribute@29 / runInSaveQueue@30 / performSaveDataOnly@30 / rollComplexDiceExpression@28 / getFullAttributesForCharacter@29 / evaluateFormula@28 / isSameAttributeAlias@29 / getAttributeValue@29）
// 接线说明：PRIMARY_KEYS 已拆至 engine/primary-keys.ts、evaluateCondition/rollComplexDiceExpression/evaluateFormula 已拆至 engine/formula-parser.ts（均不引用本文件，无循环），直接 import；
//   getTableData/cachedRawData/updateSingleAttribute/getFullAttributesForCharacter/isSameAttributeAlias/getAttributeValue@29、runInSaveQueue/performSaveDataOnly@30 定义于 index.ts IIFE 内无法 export，采用运行时注入：
//   index.ts IIFE 末尾调用 __wireDbAdapterDeps({...}) 注入；
//   未注入时模块级引用为 null（全部仅在运行时函数内调用，注入先于任何调用，与 IIFE 内原时序等价）。
//   PendingEffectContext/EffectResult/EffectTrace 等类型标注来自 index.ts IIFE 内（章节21/29），@ts-nocheck 下无运行时影响。

import { PRIMARY_KEYS } from '../engine/primary-keys';
import { evaluateCondition, evaluateFormula, rollComplexDiceExpression } from '../engine/formula-parser';

let getTableData = null;
let cachedRawData = null;
let updateSingleAttribute = null;
let getFullAttributesForCharacter = null;
let isSameAttributeAlias = null;
let getAttributeValue = null;
let runInSaveQueue = null;
let performSaveDataOnly = null;

export function __wireDbAdapterDeps(deps) {
  getTableData = deps.getTableData;
  cachedRawData = deps.cachedRawData;
  updateSingleAttribute = deps.updateSingleAttribute;
  getFullAttributesForCharacter = deps.getFullAttributesForCharacter;
  isSameAttributeAlias = deps.isSameAttributeAlias;
  getAttributeValue = deps.getAttributeValue;
  runInSaveQueue = deps.runInSaveQueue;
  performSaveDataOnly = deps.performSaveDataOnly;
}
  // ========================================
  // 数据库适配层 (LockManager -> GodDB API)
  // ========================================

  /**
   * 获取数据库锁定API
   * @returns API对象，如果不可用返回null
   */
  function getDbLockAPI(): any {
    // 递归找到真正的顶层窗口（处理多层iframe嵌套）
    let topWindow: Window = window;
    try {
      while (topWindow.parent && topWindow.parent !== topWindow) {
        topWindow = topWindow.parent;
      }
    } catch (e) {
      // 跨域情况下无法访问parent，使用当前window
    }

    // 优先从顶层窗口获取，然后尝试当前窗口
    const api = (topWindow as any).AutoCardUpdaterAPI || (window as any).AutoCardUpdaterAPI;
    return api || null;
  }

  /**
   * 根据表名获取sheetKey
   * @param tableName - 表名（如"主角信息"）
   * @returns sheetKey（如"sheet_0"），找不到返回null
   */
  function getSheetKeyByTableName(tableName: string): string | null {
    try {
      const data = getTableData({ silent: true }) as Record<
        string,
        { name: string; content: (string | number | null)[][] }
      > | null;
      if (!data) return null;

      for (const key in data) {
        if (key.startsWith('sheet_') && data[key]?.name === tableName) {
          return key;
        }
      }
    } catch (e) {
      console.warn('[DICE]getSheetKeyByTableName 失败:', e);
    }
    return null;
  }

  /**
   * 通过主键值查找行索引
   * @param sheetKey - 表格标识
   * @param tableName - 表名
   * @param primaryKeyValue - 主键值（格式可能是 "字段名=值" 或纯值）
   * @returns 行索引（从0开始），找不到返回null
   */
  function findRowIndexByPrimaryKey(sheetKey: string, tableName: string, primaryKeyValue: string): number | null {
    try {
      const data = getTableData({ silent: true }) as Record<
        string,
        { name: string; content: (string | number | null)[][] }
      > | null;
      const sheet = data?.[sheetKey];
      if (!sheet || !sheet.content || !Array.isArray(sheet.content) || sheet.content.length < 2) {
        return null;
      }

      const headers = sheet.content[0] as string[];
      const pkField = PRIMARY_KEYS[tableName as keyof typeof PRIMARY_KEYS];

      // 处理特殊情况：全局数据表等没有主键的情况
      if (pkField === null) {
        return primaryKeyValue === '_row_0' ? 0 : null;
      }

      if (!pkField) return null;

      const pkIndex = headers.indexOf(pkField);
      if (pkIndex === -1) {
        console.warn(`[DICE]findRowIndexByPrimaryKey: 在表 ${tableName} 中找不到主键字段 ${pkField}`);
        return null;
      }

      // 【修复】解析 primaryKeyValue，提取实际值
      // getRowKey() 返回格式: "姓名=张三" -> 需要提取 "张三"
      let actualValue = primaryKeyValue;
      const eqIdx = primaryKeyValue.indexOf('=');
      if (eqIdx !== -1) {
        actualValue = primaryKeyValue.substring(eqIdx + 1);
      }

      // 遍历数据行（从索引1开始）
      for (let i = 1; i < sheet.content.length; i++) {
        const row = sheet.content[i];
        if (row && String(row[pkIndex]) === String(actualValue)) {
          // 数据库的 rowIndex 是从 0 开始的数据行索引（对应 content[1]）
          return i - 1;
        }
      }
    } catch (e) {
      console.warn('[DICE]findRowIndexByPrimaryKey 失败:', e);
    }
    return null;
  }

  /**
   * 安全地修改角色卡属性值
   * @param characterName - 角色名称
   * @param attrName - 属性名称
   * @param operation - 操作类型: 'add' | 'subtract' | 'set'
   * @param value - 操作数值
   * @param options - 可选配置 { initValue?: number, min?: number, max?: number }
   * @returns Promise<{ success: boolean, oldValue: number, newValue: number, error?: string }>
   */
  async function safeUpdateAttribute(
    characterName: string,
    attrName: string,
    operation: 'add' | 'subtract' | 'set',
    value: number,
    options?: { initValue?: number; min?: number; max?: number },
  ): Promise<{ success: boolean; oldValue: number; newValue: number; error?: string }> {
    console.info(`[DICE]safeUpdateAttribute: ${characterName}.${attrName} ${operation} ${value}`);

    try {
      // 1. 获取 DbLockAPI
      const api = getDbLockAPI();
      if (!api || typeof api.updateCell !== 'function') {
        const error = '数据库 API 不可用';
        console.error(`[DICE]safeUpdateAttribute: ${error}`);
        return { success: false, oldValue: 0, newValue: 0, error };
      }

      // 2. 读取当前运行时数据
      const data = getTableData({ silent: true }) as Record<
        string,
        { name: string; content: (string | number | null)[][] }
      > | null;
      if (!data) {
        const error = '无法读取表格数据';
        console.error(`[DICE]safeUpdateAttribute: ${error}`);
        return { success: false, oldValue: 0, newValue: 0, error };
      }

      // 3. 查找角色所在表格和行索引
      let targetSheetKey: string | null = null;
      let targetRowIndex: number | null = null;
      let targetColIndex: number = -1;

      // 遍历所有表格查找角色
      for (const sheetKey in data) {
        if (!sheetKey.startsWith('sheet_')) continue;
        const sheet = data[sheetKey];
        if (!sheet || !sheet.content || !Array.isArray(sheet.content) || sheet.content.length < 2) continue;

        const headers = sheet.content[0] as string[];
        const pkField = PRIMARY_KEYS[sheet.name as keyof typeof PRIMARY_KEYS];

        // 跳过无主键的表格
        if (pkField === undefined) continue;

        // 处理特殊情况：全局数据表等没有主键的情况
        if (pkField === null) {
          if (characterName === '_row_0') {
            targetSheetKey = sheetKey;
            targetRowIndex = 0;
            targetColIndex = headers.indexOf(attrName);
            break;
          }
          continue;
        }

        // 查找主键列索引
        const pkIndex = headers.indexOf(pkField);
        if (pkIndex === -1) continue;

        // 遍历数据行查找角色
        for (let i = 1; i < sheet.content.length; i++) {
          const row = sheet.content[i];
          if (row && String(row[pkIndex]) === String(characterName)) {
            targetSheetKey = sheetKey;
            targetRowIndex = i - 1; // 数据库的 rowIndex 是从 0 开始的数据行索引
            targetColIndex = headers.indexOf(attrName);
            break;
          }
        }

        if (targetSheetKey) break;
      }

      if (!targetSheetKey || targetRowIndex === null) {
        const error = `找不到角色: ${characterName}`;
        console.warn(`[DICE]safeUpdateAttribute: ${error}`);
        return { success: false, oldValue: 0, newValue: 0, error };
      }

      if (targetColIndex === -1) {
        const error = `角色 ${characterName} 中找不到属性: ${attrName}`;
        console.warn(`[DICE]safeUpdateAttribute: ${error}`);
        return { success: false, oldValue: 0, newValue: 0, error };
      }

      // 4. 检查锁定状态
      const lockState = api.getTableLockState?.(targetSheetKey);
      if (lockState) {
        // 检查行锁定
        const isRowLocked = lockState.rows?.includes(targetRowIndex) ?? false;
        if (isRowLocked) {
          const error = `角色 ${characterName} 的整行已被锁定`;
          console.warn(`[DICE]safeUpdateAttribute: ${error}`);
          return { success: false, oldValue: 0, newValue: 0, error };
        }

        // 检查单元格锁定
        // 注意: targetColIndex 包含行号列，数据库的 colIndex 不包含行号列，需要 -1
        const cellKey = `${targetRowIndex}:${targetColIndex - 1}`;
        const isCellLocked = lockState.cells?.includes(cellKey) ?? false;
        if (isCellLocked) {
          const error = `属性 ${characterName}.${attrName} 已被锁定`;
          console.warn(`[DICE]safeUpdateAttribute: ${error}`);
          return { success: false, oldValue: 0, newValue: 0, error };
        }
      }

      // 5. 获取旧值或初始化
      const sheet = data[targetSheetKey];
      const currentValue = sheet.content[targetRowIndex + 1][targetColIndex]; // +1 因为 content[0] 是表头
      let oldValue: number;

      if (currentValue === null || currentValue === undefined || currentValue === '') {
        if (options?.initValue !== undefined) {
          oldValue = options.initValue;
          console.info(`[DICE]safeUpdateAttribute: 属性 ${attrName} 不存在，初始化为 ${oldValue}`);
        } else {
          const error = `属性 ${attrName} 不存在且未提供 initValue`;
          console.warn(`[DICE]safeUpdateAttribute: ${error}`);
          return { success: false, oldValue: 0, newValue: 0, error };
        }
      } else {
        oldValue = typeof currentValue === 'number' ? currentValue : parseFloat(String(currentValue));
        if (isNaN(oldValue)) {
          const error = `属性 ${attrName} 的值 "${currentValue}" 无法转换为数字`;
          console.warn(`[DICE]safeUpdateAttribute: ${error}`);
          return { success: false, oldValue: 0, newValue: 0, error };
        }
      }

      // 6. 执行操作
      let newValue: number;
      switch (operation) {
        case 'add':
          newValue = oldValue + value;
          break;
        case 'subtract':
          newValue = oldValue - value;
          break;
        case 'set':
          newValue = value;
          break;
        default:
          const error = `不支持的操作类型: ${operation}`;
          console.error(`[DICE]safeUpdateAttribute: ${error}`);
          return { success: false, oldValue, newValue: oldValue, error };
      }

      // 7. 应用 min/max 约束
      const min = options?.min ?? -Infinity;
      const max = options?.max ?? Infinity;
      newValue = Math.max(min, Math.min(max, newValue));

      console.info(
        `[DICE]safeUpdateAttribute: ${characterName}.${attrName} ${oldValue} → ${newValue} (${operation} ${value})`,
      );

      // 8. 通过新版 CRUD API 更新数据
      const updateResult = await api.updateCell({
        tableName: sheet.name,
        rowIndex: targetRowIndex + 1,
        colIdentifier: attrName,
        value: newValue,
        skipNotify: true,
      });
      if (updateResult === false) {
        const error = `更新 ${sheet.name}.${attrName} 失败`;
        console.error(`[DICE]safeUpdateAttribute: ${error}`);
        return { success: false, oldValue, newValue: oldValue, error };
      }
      const refreshedData = getTableData({ silent: true });
      if (refreshedData) cachedRawData = refreshedData;

      console.info(`[DICE]safeUpdateAttribute: 成功修改 ${characterName}.${attrName}`);
      return { success: true, oldValue, newValue };
    } catch (e) {
      const error = `修改属性时发生异常: ${e instanceof Error ? e.message : String(e)}`;
      console.error(`[DICE]safeUpdateAttribute: ${error}`, e);
      return { success: false, oldValue: 0, newValue: 0, error };
    }
  }

  /**
   * 执行检定后果效果
   * 在 MESSAGE_SENT 事件中调用，异步执行不阻塞消息发送
   * @param pendingCtx 待执行的后果上下文
   * @returns 执行结果数组
   */
  async function executeEffects(pendingCtx: PendingEffectContext): Promise<EffectResult[]> {
    const results: EffectResult[] = [];
    const { preset, matchedOutcome, context } = pendingCtx;
    const replayOperations: EffectReplayOperation[] = [];
    const deferredSecondaryCallbacks: Array<() => void> = [];
    const baseData = cachedRawData || getTableData();
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
        const condResult = evaluateCondition(effect.condition, condContext);
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

      const updateResult = await updateSingleAttribute(
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

    const secondaryResults = await executeSecondaryEffectsChain(
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
    return runInSaveQueue(async () => {
      const latestData = cachedRawData || getTableData();
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
        const replayResult = await updateSingleAttribute(op.characterName, op.target, op.operation, op.value, {
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
          await performSaveDataOnly(latestTransactionalData, Array.from(latestModifiedSheetKeys));
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

  function parseEffectValueInput(
    rawValue: unknown,
    traceLabel: string,
  ): {
    formulaText: string;
    finalValue: number;
    rolledValue: number;
    valid: boolean;
  } {
    const formulaText = String(rawValue ?? '').trim() || '0';
    const rollResult = rollComplexDiceExpression(formulaText);
    if (Number.isNaN(rollResult.total)) {
      console.warn(`[DICE] ${traceLabel} 效果值解析失败: "${formulaText}"，按 0 处理`);
      return {
        formulaText,
        finalValue: 0,
        rolledValue: 0,
        valid: false,
      };
    }

    const value = Math.round(rollResult.total);
    return {
      formulaText,
      finalValue: value,
      rolledValue: value,
      valid: true,
    };
  }

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
      const currentAttrs = getFullAttributesForCharacter(context.characterName, transactionalData);
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

      const condResult = evaluateCondition(expr, exprContext);
      if (condResult.success && condResult.value !== undefined) {
        const val = typeof condResult.value === 'boolean' ? (condResult.value ? 1 : 0) : Number(condResult.value);
        if (Number.isFinite(val)) return val;
      }

      const formulaExpr = expr.replace(/\$[a-zA-Z_]\w*/g, token => {
        const val = exprContext[token];
        return typeof val === 'number' && Number.isFinite(val) ? String(val) : '0';
      });
      const formulaValue = evaluateFormula(formulaExpr, liveFormulaContext);
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
          if (!isSameAttributeAlias(resultTarget, secEffect.trigger.attribute)) continue;

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
              const value = getAttributeValue(context.characterName, candidate, subCheckCandidates);
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
              const condResult = evaluateCondition(effect.condition, condContext);
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

            const updateResult = await updateSingleAttribute(
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

  /**
   * 根据后果执行结果计算输出模板变量
   * @param results 后果执行结果数组
   * @returns 可用于 outputContext 的变量对象
   */
  function computeEffectVariables(results: EffectResult[]): Record<string, string | number | boolean> {
    if (!results || results.length === 0) {
      return {
        effectTarget: '',
        effectOperation: '',
        effectDelta: 0,
        effectDeltaFormula: '',
        effectOldValue: 0,
        effectNewValue: 0,
        effectSummary: '',
        effectText: '',
        hasEffect: false,
        effectCount: 0,
        effectResults: '[]',
      };
    }

    // 使用最后一个成功的结果，若全部失败则使用最后一个
    const successResults = results.filter(r => r.success);
    const lastSuccess =
      successResults.length > 0 ? successResults[successResults.length - 1] : results[results.length - 1];

    const delta = lastSuccess.newValue - lastSuccess.oldValue;
    const operation = delta > 0 ? '增加' : delta < 0 ? '减少' : '设置为';

    // 生成所有成功效果的摘要
    const summaries = successResults.map(r => {
      const d = r.newValue - r.oldValue;
      const op = d > 0 ? '+' : '';
      return `${r.effectId}: ${op}${d} (${r.oldValue}→${r.newValue})`;
    });

    return {
      effectTarget: lastSuccess.effectId,
      effectOperation: operation,
      effectDelta: Math.abs(delta),
      effectDeltaFormula: `${Math.abs(delta)}`,
      effectOldValue: lastSuccess.oldValue,
      effectNewValue: lastSuccess.newValue,
      effectSummary:
        successResults.length > 0
          ? `${operation} ${Math.abs(delta)} (${lastSuccess.oldValue} → ${lastSuccess.newValue})`
          : '',
      effectText: summaries.join('; '),
      hasEffect: successResults.length > 0,
      effectCount: successResults.length,
      effectResults: JSON.stringify(results),
    };
  }

  function buildEffectTraceLines(results: EffectResult[]): string[] {
    if (!results || results.length === 0) return [];
    return results.map(item => {
      const prefix = item.branchLabel ? `[${item.branchLabel}] ` : item.level ? `[L${item.level}] ` : '';
      const target = item.target || '-';
      // 失败条目优先（事务回滚时所有结果被标记 success:false，outputMessage 条目也不应显示为成功）
      if (!item.success && item.error) {
        return `${prefix}✗ ${target} 变更失败: ${item.error}`;
      }
      // 信息输出型条目（来自 secondaryEffect.outputText）
      if (item.outputMessage) {
        return `${prefix}${item.outputMessage}`;
      }
      const delta = item.newValue - item.oldValue;
      const sign = delta > 0 ? '+' : '';
      const icon = item.success ? '✓' : '✗';
      const formulaInfo = item.formulaText
        ? ` ｜算式:${item.formulaText}${item.rolledValue !== undefined ? ` ｜掷值:${item.rolledValue}` : ''}`
        : '';
      return `${prefix}${icon} ${target} ${item.oldValue} → ${item.newValue} (${sign}${delta})${formulaInfo}`;
    });
  }

  function buildEffectMetaLines(
    results: EffectResult[],
    options?: {
      branchReasonText?: string;
    },
  ): string[] {
    if (!results || results.length === 0) return [];
    const settledHeader = '【已填表】以下数值效果已同步填表，无需重复填表。';
    const lines = results
      .filter(item => item.success)
      .map(item => {
        if (item.outputMessage) {
          return item.outputMessage;
        }

        const target = item.target || '属性';
        const delta = item.newValue - item.oldValue;
        const sign = delta > 0 ? '+' : '';
        const primaryBranch = item.branchLabel?.startsWith('L1/') ? item.branchLabel.slice(3) : '';
        const formulaDetail =
          item.formulaText && item.rolledValue !== undefined
            ? `，${primaryBranch ? `按${primaryBranch}分支` : '按当前分支'}算式${item.formulaText}得到${item.rolledValue}`
            : '';

        const reasonPrefix = primaryBranch ? `命中${primaryBranch}分支后，` : '';
        return `${reasonPrefix}${target}从${item.oldValue}变为${item.newValue}（变化${sign}${delta}${formulaDetail}）`;
      });

    // 避免与主检定叙事重复：优先输出效果行，仅在没有效果行时回退到分支原因
    if (lines.length > 0) return [settledHeader, ...lines];
    if (options?.branchReasonText) return [settledHeader, options.branchReasonText];
    return [];
  }

  /**
   * 根据待执行的效果定义预计算输出模板变量
   * 用于在输出模板中显示预期的效果信息（实际执行在消息发送后）
   * @param effects 效果定义数组
   * @returns 可用于 outputContext 的变量对象
   */
  function computePendingEffectVariables(effects: Effect[] | undefined): Record<string, string | number | boolean> {
    if (!effects || effects.length === 0) {
      return {
        effectTarget: '',
        effectOperation: '',
        effectDelta: 0,
        effectDeltaFormula: '',
        effectOldValue: 0,
        effectNewValue: 0,
        effectSummary: '',
        effectText: '',
        hasEffect: false,
        effectCount: 0,
        effectResults: '[]',
      };
    }

    // 使用第一个效果作为主要显示
    const firstEffect = effects[0];
    const operationMap: Record<string, string> = {
      add: '增加',
      subtract: '减少',
      set: '设置为',
    };
    const operation = operationMap[firstEffect.operation] || firstEffect.operation;

    // 生成所有效果的预期摘要
    const summaries = effects.map(e => {
      const op = operationMap[e.operation] || e.operation;
      return `${e.target}: ${op} ${e.value}`;
    });

    return {
      effectTarget: firstEffect.target,
      effectOperation: operation,
      effectDelta: 0, // 未执行，无法知道实际变化量
      effectDeltaFormula: firstEffect.value,
      effectOldValue: 0, // 未执行，无法知道原值
      effectNewValue: 0, // 未执行，无法知道新值
      effectSummary: `${firstEffect.target} ${operation} ${firstEffect.value}`,
      effectText: summaries.join('; '),
      hasEffect: true,
      effectCount: effects.length,
      effectResults: JSON.stringify(effects.map(e => ({ effectId: e.id, pending: true }))),
    };
  }
export {
  getDbLockAPI,
  getSheetKeyByTableName,
  findRowIndexByPrimaryKey,
  safeUpdateAttribute,
  executeEffects,
  parseEffectValueInput,
  executeSecondaryEffectsChain,
  computeEffectVariables,
  buildEffectTraceLines,
  buildEffectMetaLines,
  computePendingEffectVariables,
}; // __wireDbAdapterDeps 已由头部 export function 导出
