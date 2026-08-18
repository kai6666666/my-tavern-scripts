// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=47「测试函数：验证配对表修复逻辑」
// 原行范围：71764-72478（含 banner 71760-72478）；拆分批次 9A；外部 closure 依赖：48（cloneGachaState/getGachaState/createDefaultGachaState/getGachaActivePoolTag/getGachaFortuneProgressView/canDeleteGachaPoolDefinition/serializeGachaCatalogItemForExport/runInSaveQueue/touchGachaActivity/recordGachaFortuneGain/assertSaveStoredGachaStateSnapshot/refreshGachaVisualization/emitEvent/getRuntimeGachaRawData/ensureGachaCatalogLoaded/analyzeGachaCatalogImport/getGachaCatalogImportFailureMessage/applyGachaCatalogImport/refreshGachaShardShop/showGachaSettingsDialog/formatGachaCatalogImportStatsText/normalizeGachaPoolDefinition/GACHA_ALL_POOL_TAG/getConfiguredGachaPoolDefinitions/buildDefaultGachaPoolDefinition/isBuiltinGachaPoolId/saveGachaPoolSettings/getCustomGachaItemDefinitions/saveStoredGachaCatalog/deleteGachaItemSetting/normalizeGachaPoolId/deleteGachaPoolConfig/showDiceSystemConfirmDialog/performGachaDraw/getVisibleGachaPoolConfigDefinitions/updateGachaPoolTag/getAllGachaPoolConfigDefinitions/getAllGachaItemDefinitions/getActiveGachaPoolTags/isGachaItemEnabled/compareGachaItemDefinitionsForDisplay/exportGachaCatalogJson/showGachaVisualization/closeGachaVisualization/showGachaShardShop/rootWindow/getRuntimeErrorMessage/getCore）
// 接线说明：extractCodesFromTable/buildCodeMapping/alignAndFixPairedTables 已拆至 misc/paired-table-fix.ts、MvuModule 已拆至 engine/mvu-visualizer.ts、
//   FORTUNE_CURRENCY_NAME/GACHA_CATALOG_EXPORT_KIND/GACHA_CATALOG_VERSION/GACHA_ITEM_DEFINITIONS/GACHA_DRAW_COST_SINGLE/GACHA_DRAW_COST_TEN/GACHA_RARITY_ORDER/GACHA_REWARD_TARGETS 来自 engine/gacha-items（均不引用本文件，无循环）直接 import；
//   showActionableErrorToast 来自 ../ui/actionable-error-toast；
//   其余 48 个依赖（@45 gacha 函数、runInSaveQueue/getRuntimeErrorMessage@30、showDiceSystemConfirmDialog/getCore@29、emitEvent/rootWindow@44）定义于 index.ts IIFE 内无法 export，采用运行时注入：
//   index.ts IIFE 末尾调用 __wireDebugTestFunctionsDeps({...}) 注入；
//   未注入时模块级引用为 null（全部仅在运行时函数内调用，注入先于任何调用，与 IIFE 内原时序等价）。
// 注：sections.json 记录 idx 47 endLine=72503（含 IIFE 收尾段），实际提取至 72478（bindAcuDiceGachaRegexActions 结尾），
//   IIFE 收尾段（AcuDiceAPI.gacha 挂载 / defineAcuDiceOnWindow / notifyReady / init 调度）留在 index.ts。

import { extractCodesFromTable, buildCodeMapping, alignAndFixPairedTables } from './paired-table-fix';
import { MvuModule } from '../engine/mvu-visualizer';
import { showActionableErrorToast } from '../ui/actionable-error-toast';
import { FORTUNE_CURRENCY_NAME, GACHA_CATALOG_EXPORT_KIND, GACHA_CATALOG_VERSION, GACHA_ITEM_DEFINITIONS, GACHA_DRAW_COST_SINGLE, GACHA_DRAW_COST_TEN, GACHA_RARITY_ORDER, GACHA_REWARD_TARGETS } from '../engine/gacha-items';

let cloneGachaState = null;
let getGachaState = null;
let createDefaultGachaState = null;
let getGachaActivePoolTag = null;
let getGachaFortuneProgressView = null;
let canDeleteGachaPoolDefinition = null;
let serializeGachaCatalogItemForExport = null;
let runInSaveQueue = null;
let touchGachaActivity = null;
let recordGachaFortuneGain = null;
let assertSaveStoredGachaStateSnapshot = null;
let refreshGachaVisualization = null;
let emitEvent = null;
let getRuntimeGachaRawData = null;
let ensureGachaCatalogLoaded = null;
let analyzeGachaCatalogImport = null;
let getGachaCatalogImportFailureMessage = null;
let applyGachaCatalogImport = null;
let refreshGachaShardShop = null;
let showGachaSettingsDialog = null;
let formatGachaCatalogImportStatsText = null;
let normalizeGachaPoolDefinition = null;
let GACHA_ALL_POOL_TAG = null;
let getConfiguredGachaPoolDefinitions = null;
let buildDefaultGachaPoolDefinition = null;
let isBuiltinGachaPoolId = null;
let saveGachaPoolSettings = null;
let getCustomGachaItemDefinitions = null;
let saveStoredGachaCatalog = null;
let deleteGachaItemSetting = null;
let normalizeGachaPoolId = null;
let deleteGachaPoolConfig = null;
let showDiceSystemConfirmDialog = null;
let performGachaDraw = null;
let getVisibleGachaPoolConfigDefinitions = null;
let updateGachaPoolTag = null;
let getAllGachaPoolConfigDefinitions = null;
let getAllGachaItemDefinitions = null;
let getActiveGachaPoolTags = null;
let isGachaItemEnabled = null;
let compareGachaItemDefinitionsForDisplay = null;
let exportGachaCatalogJson = null;
let showGachaVisualization = null;
let closeGachaVisualization = null;
let showGachaShardShop = null;
let rootWindow = null;
let getRuntimeErrorMessage = null;
let getCore = null;

export function __wireDebugTestFunctionsDeps(deps) {
  cloneGachaState = deps.cloneGachaState;
  getGachaState = deps.getGachaState;
  createDefaultGachaState = deps.createDefaultGachaState;
  getGachaActivePoolTag = deps.getGachaActivePoolTag;
  getGachaFortuneProgressView = deps.getGachaFortuneProgressView;
  canDeleteGachaPoolDefinition = deps.canDeleteGachaPoolDefinition;
  serializeGachaCatalogItemForExport = deps.serializeGachaCatalogItemForExport;
  runInSaveQueue = deps.runInSaveQueue;
  touchGachaActivity = deps.touchGachaActivity;
  recordGachaFortuneGain = deps.recordGachaFortuneGain;
  assertSaveStoredGachaStateSnapshot = deps.assertSaveStoredGachaStateSnapshot;
  refreshGachaVisualization = deps.refreshGachaVisualization;
  emitEvent = deps.emitEvent;
  getRuntimeGachaRawData = deps.getRuntimeGachaRawData;
  ensureGachaCatalogLoaded = deps.ensureGachaCatalogLoaded;
  analyzeGachaCatalogImport = deps.analyzeGachaCatalogImport;
  getGachaCatalogImportFailureMessage = deps.getGachaCatalogImportFailureMessage;
  applyGachaCatalogImport = deps.applyGachaCatalogImport;
  refreshGachaShardShop = deps.refreshGachaShardShop;
  showGachaSettingsDialog = deps.showGachaSettingsDialog;
  formatGachaCatalogImportStatsText = deps.formatGachaCatalogImportStatsText;
  normalizeGachaPoolDefinition = deps.normalizeGachaPoolDefinition;
  GACHA_ALL_POOL_TAG = deps.GACHA_ALL_POOL_TAG;
  getConfiguredGachaPoolDefinitions = deps.getConfiguredGachaPoolDefinitions;
  buildDefaultGachaPoolDefinition = deps.buildDefaultGachaPoolDefinition;
  isBuiltinGachaPoolId = deps.isBuiltinGachaPoolId;
  saveGachaPoolSettings = deps.saveGachaPoolSettings;
  getCustomGachaItemDefinitions = deps.getCustomGachaItemDefinitions;
  saveStoredGachaCatalog = deps.saveStoredGachaCatalog;
  deleteGachaItemSetting = deps.deleteGachaItemSetting;
  normalizeGachaPoolId = deps.normalizeGachaPoolId;
  deleteGachaPoolConfig = deps.deleteGachaPoolConfig;
  showDiceSystemConfirmDialog = deps.showDiceSystemConfirmDialog;
  performGachaDraw = deps.performGachaDraw;
  getVisibleGachaPoolConfigDefinitions = deps.getVisibleGachaPoolConfigDefinitions;
  updateGachaPoolTag = deps.updateGachaPoolTag;
  getAllGachaPoolConfigDefinitions = deps.getAllGachaPoolConfigDefinitions;
  getAllGachaItemDefinitions = deps.getAllGachaItemDefinitions;
  getActiveGachaPoolTags = deps.getActiveGachaPoolTags;
  isGachaItemEnabled = deps.isGachaItemEnabled;
  compareGachaItemDefinitionsForDisplay = deps.compareGachaItemDefinitionsForDisplay;
  exportGachaCatalogJson = deps.exportGachaCatalogJson;
  showGachaVisualization = deps.showGachaVisualization;
  closeGachaVisualization = deps.closeGachaVisualization;
  showGachaShardShop = deps.showGachaShardShop;
  rootWindow = deps.rootWindow;
  getRuntimeErrorMessage = deps.getRuntimeErrorMessage;
  getCore = deps.getCore;
}
  // ========================================
  // 测试函数：验证配对表修复逻辑
  // ========================================
  // 在浏览器控制台运行：window.testPairedTableFix()
  window.testPairedTableFix = function () {
    // 构造测试数据：包含空白行、共同编码、各自独有编码、跳号
    const prefix = 'AM';
    const startFrom = 1;
    const columnName = '编码索引';

    // 总结表（表1）：AM0001, AM0002, 空白(错误行), AM0030, 空白(错误行)
    // 有效编码：AM0001, AM0002, AM0030
    const table1Sheet = {
      name: '总结表',
      content: [
        ['编码索引', '时间跨度', '纪要'],
        ['AM0001', '时间1', '纪要1'],
        ['AM0002', '时间2', '纪要2'],
        [null, '时间3-错误行', '纪要3-错误行'], // 空白编码（错误行，应保持不动）
        ['AM0030', '时间4', '纪要4'],
        [null, '时间5-错误行', '纪要5-错误行'], // 空白编码（错误行，应保持不动）
      ],
    };

    // 总结大纲表（表2）：空白(错误行), AM0002, AM0030, AM0040, AM0050
    // 有效编码：AM0002, AM0030, AM0040, AM0050
    const table2Sheet = {
      name: '总体大纲',
      content: [
        ['编码索引', '时间跨度', '大纲'],
        [null, '时间A-错误行', '大纲A-错误行'], // 空白编码（错误行，应保持不动）
        ['AM0002', '时间B', '大纲B'],
        ['AM0030', '时间C', '大纲C'],
        ['AM0040', '时间D', '大纲D'],
        ['AM0050', '时间E', '大纲E'],
      ],
    };

    // 提取编码
    const extract1 = extractCodesFromTable(table1Sheet, columnName, prefix);
    const extract2 = extractCodesFromTable(table2Sheet, columnName, prefix);

    // 构建映射
    const mapping = buildCodeMapping(extract1.allCodes, extract2.allCodes, prefix, startFrom);

    // 执行修复
    const rawData = {};
    const result = alignAndFixPairedTables(
      table1Sheet,
      'sheet1',
      table2Sheet,
      'sheet2',
      columnName,
      mapping,
      prefix,
      startFrom,
      rawData,
    );

    // 验证结果
    const getValidCodes = sheet =>
      sheet.content
        .slice(1)
        .map(r => r[0])
        .filter(c => c && String(c).match(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\d+$`)));

    const codes1 = getValidCodes(table1Sheet);
    const codes2 = getValidCodes(table2Sheet);

    // 检查空白行是否保持原数据
    const emptyRows1 = table1Sheet.content
      .slice(1)
      .filter(r => !r[0] || !String(r[0]).match(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\d+$`)));
    const emptyRows2 = table2Sheet.content
      .slice(1)
      .filter(r => !r[0] || !String(r[0]).match(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\d+$`)));

    // 验证编码是否严格递增
    const validateSequence = (codes, prefix, startFrom) => {
      const numbers = codes
        .map(c => {
          if (!c) return null;
          const match = c.match(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\d+)$`));
          return match ? parseInt(match[1], 10) : null;
        })
        .filter(n => n !== null);

      for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] !== startFrom + i) {
          return false;
        }
      }
      return true;
    };

    const isValid1 = validateSequence(codes1, prefix, startFrom);
    const isValid2 = validateSequence(codes2, prefix, startFrom);

    // 验证两个表的有效编码集合是否一致
    const set1 = new Set(codes1);
    const set2 = new Set(codes2);
    const setsEqual = set1.size === set2.size && [...set1].every(c => set2.has(c));

    // 验证空白行数据是否保留
    const emptyRowsPreserved1 = emptyRows1.some(r => r[1] && r[1].includes('错误行'));
    const emptyRowsPreserved2 = emptyRows2.some(r => r[1] && r[1].includes('错误行'));

    return {
      table1Sheet,
      table2Sheet,
      result,
      codes1,
      codes2,
      emptyRows1,
      emptyRows2,
      isValid1,
      isValid2,
      setsEqual,
      emptyRowsPreserved1,
      emptyRowsPreserved2,
      // 综合验证：有效编码严格递增 + 两表有效编码一致 + 空白行数据保留
      isValid: isValid1 && isValid2 && setsEqual && emptyRowsPreserved1 && emptyRowsPreserved2,
    };
  };

  // 暴露诊断工具到全局（方便控制台调用）
  window.diagnoseDiceVariables = async function () {
    if (typeof MvuModule !== 'undefined' && typeof MvuModule.diagnoseVariableFramework === 'function') {
      return await MvuModule.diagnoseVariableFramework();
    } else {
      console.error('[DICE]MvuModule 未初始化或诊断工具不可用');
      return null;
    }
  };

  const cloneAcuDiceApiValue = value => {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  };

  const normalizeAcuDiceGachaInteger = (value: unknown, label: string, options: { allowNegative?: boolean } = {}) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) throw new Error(`[AcuDice][Gacha] ${label} 必须是有效数字`);
    const integer = Math.trunc(numeric);
    if (!options.allowNegative && integer < 0) throw new Error(`[AcuDice][Gacha] ${label} 不能小于 0`);
    return integer;
  };

  const buildAcuDiceGachaStateSnapshot = (state?: GachaState | null) => {
    const sourceState = state ? cloneGachaState(state) : getGachaState(undefined, true) || createDefaultGachaState();
    sourceState.activePoolTag = getGachaActivePoolTag(sourceState);
    return {
      fortune: Math.max(0, Math.floor(Number(sourceState.wallet.fortune || 0))),
      wallet: cloneAcuDiceApiValue(sourceState.wallet),
      activePoolTag: sourceState.activePoolTag,
      pity: cloneAcuDiceApiValue(sourceState.pity),
      recentRewards: cloneAcuDiceApiValue(sourceState.recentRewards),
      totalDraws: Math.max(0, Math.floor(Number(sourceState.totalDraws || 0))),
      inputStats: cloneAcuDiceApiValue(sourceState.inputStats),
      progress: getGachaFortuneProgressView(sourceState, { projectActiveProgress: true }),
    };
  };

  const serializeAcuDiceGachaPool = (pool: GachaPoolDefinition) => ({
    id: pool.id,
    name: pool.name,
    builtin: pool.builtin === true,
    visibleInTabs: pool.visibleInTabs === true,
    includeInAll: pool.includeInAll === true,
    order: Number(pool.order) || 0,
    canDelete: canDeleteGachaPoolDefinition(pool),
  });

  const serializeAcuDiceGachaItem = (item: GachaItemDefinition, customIds?: ReadonlySet<string>) => ({
    ...serializeGachaCatalogItemForExport(item),
    source: customIds?.has(item.id) ? 'custom' : 'builtin',
  });

  const serializeAcuDiceGachaDrawOutcome = (outcome: GachaDrawOutcome) => ({
    kind: outcome.kind,
    item: serializeAcuDiceGachaItem(outcome.item),
    quantity: outcome.quantity,
    duplicateConverted: outcome.duplicateConverted,
    shardGain: outcome.shardGain,
  });

  const serializeAcuDiceGachaDrawResult = (result: Awaited<ReturnType<typeof performGachaDraw>>) => ({
    success: result.success === true,
    drawCount: result.drawCount,
    cost: result.cost,
    outcomes: result.outcomes.map(serializeAcuDiceGachaDrawOutcome),
    state: buildAcuDiceGachaStateSnapshot(result.state),
    message: result.message,
    error: result.error || undefined,
  });

  const changeAcuDiceGachaFortune = async (
    mode: 'set' | 'add',
    value: unknown,
    options: { silent?: boolean; reason?: string; detail?: string } = {},
  ) => {
    const amount = normalizeAcuDiceGachaInteger(value, mode === 'set' ? FORTUNE_CURRENCY_NAME : `${FORTUNE_CURRENCY_NAME}变化量`, {
      allowNegative: mode === 'add',
    });
    let result: {
      before: number;
      after: number;
      delta: number;
      state: ReturnType<typeof buildAcuDiceGachaStateSnapshot>;
    } | null = null;

    await runInSaveQueue(async () => {
      const state = touchGachaActivity(getGachaState(undefined, true));
      if (!state) throw new Error('骰子商店状态不可用');
      const before = Math.max(0, Math.floor(Number(state.wallet.fortune || 0)));
      const after = mode === 'set' ? amount : Math.max(0, before + amount);
      state.wallet.fortune = after;
      const delta = after - before;
      if (delta > 0) {
        const reason = String(options.reason || 'API调整').trim() || 'API调整';
        const detail = String(options.detail || reason).trim() || reason;
        recordGachaFortuneGain(state, delta, reason, `${detail} +${delta}`);
      }
      assertSaveStoredGachaStateSnapshot(state);
      refreshGachaVisualization();
      result = {
        before,
        after,
        delta,
        state: buildAcuDiceGachaStateSnapshot(state),
      };
    });

    if (!result) throw new Error('骰子商店状态保存失败');
    if (!options.silent && window.toastr) {
      if (result.delta === 0) {
        window.toastr.info(`${FORTUNE_CURRENCY_NAME}保持 ${result.after}`, '骰子商店');
      } else {
        const verb = result.delta > 0 ? '增加' : '减少';
        window.toastr.success(
          `${FORTUNE_CURRENCY_NAME}${verb} ${Math.abs(result.delta)}，当前 ${result.after}`,
          '骰子商店',
        );
      }
    }
    emitEvent('gacha:fortune', result);
    return result;
  };

  const stringifyAcuDiceGachaCatalogInput = (input: unknown): string => {
    if (typeof input === 'string') return input;
    if (Array.isArray(input)) {
      return JSON.stringify({ kind: GACHA_CATALOG_EXPORT_KIND, version: GACHA_CATALOG_VERSION, items: input });
    }
    if (input && typeof input === 'object') {
      const record = input as Record<string, unknown>;
      if (!Array.isArray(record.items) && record.name && record.quality) {
        return JSON.stringify({ kind: GACHA_CATALOG_EXPORT_KIND, version: GACHA_CATALOG_VERSION, items: [record] });
      }
    }
    return JSON.stringify(input);
  };

  const normalizeAcuDiceGachaImportMode = (mode: unknown): GachaCatalogImportMode => {
    const value = String(mode || 'overwrite').trim();
    return value === 'skip' || value === 'rename' || value === 'overwrite' ? value : 'overwrite';
  };

  const importAcuDiceGachaCatalog = async (
    input: unknown,
    options: { mode?: GachaCatalogImportMode; silent?: boolean } = {},
  ) => {
    const jsonString = stringifyAcuDiceGachaCatalogInput(input);
    const mode = normalizeAcuDiceGachaImportMode(options.mode);
    let stats: GachaCatalogImportStats | null = null;

    await runInSaveQueue(async () => {
      const rawData = getRuntimeGachaRawData();
      await ensureGachaCatalogLoaded(rawData);
      const analysis = analyzeGachaCatalogImport(jsonString, rawData);
      if (!analysis || analysis.items.length === 0) {
        throw new Error(getGachaCatalogImportFailureMessage(analysis));
      }
      stats = await applyGachaCatalogImport(rawData, analysis, mode);
      refreshGachaVisualization();
      refreshGachaShardShop();
      if ($('.acu-gacha-settings-overlay').length) void showGachaSettingsDialog();
    });

    if (!stats) throw new Error('骰子商店目录导入失败');
    if (!options.silent && window.toastr) {
      const title = stats.warnings.length > 0 ? '骰子商店导入完成，有部分跳过' : '骰子商店导入完成';
      window.toastr.success(formatGachaCatalogImportStatsText(stats), title);
    }
    const result = cloneAcuDiceApiValue(stats);
    emitEvent('gacha:catalog', { action: 'import', mode, stats: result });
    return result;
  };

  const upsertAcuDiceGachaPool = async (input: unknown, options: { silent?: boolean } = {}) => {
    const normalizedPool =
      typeof input === 'string'
        ? normalizeGachaPoolDefinition({ id: input, name: input, includeInAll: true, visibleInTabs: true })
        : normalizeGachaPoolDefinition(input);
    if (!normalizedPool || !normalizedPool.id || normalizedPool.id === GACHA_ALL_POOL_TAG) {
      throw new Error('[AcuDice][Gacha] upsertPool() 需要有效卡池 id');
    }

    const pools = getConfiguredGachaPoolDefinitions();
    const index = pools.findIndex(pool => pool.id === normalizedPool.id);
    const existing = index >= 0 ? pools[index] : null;
    const nextPool = {
      ...(existing || buildDefaultGachaPoolDefinition(normalizedPool.id, normalizedPool)),
      ...normalizedPool,
      builtin: existing?.builtin === true || isBuiltinGachaPoolId(normalizedPool.id),
      visibleInTabs: normalizedPool.includeInAll === true,
      includeInAll: normalizedPool.includeInAll === true,
    };
    if (index >= 0) pools[index] = nextPool;
    else pools.push(nextPool);
    saveGachaPoolSettings(pools);
    refreshGachaVisualization();
    refreshGachaShardShop();
    if ($('.acu-gacha-settings-overlay').length) void showGachaSettingsDialog();
    const result = serializeAcuDiceGachaPool(nextPool);
    if (!options.silent && window.toastr) window.toastr.success(`卡池「${result.name}」已保存`, '骰子商店');
    emitEvent('gacha:catalog', { action: 'upsertPool', pool: result });
    return result;
  };

  const removeAcuDiceGachaCustomItem = async (itemId: unknown, options: { silent?: boolean } = {}) => {
    const id = String(itemId || '').trim();
    if (!id) throw new Error('[AcuDice][Gacha] removeCustomItem() 需要物品 id');
    let result: { removed: boolean; item: ReturnType<typeof serializeAcuDiceGachaItem> | null } | null = null;

    await runInSaveQueue(async () => {
      const rawData = getRuntimeGachaRawData();
      await ensureGachaCatalogLoaded(rawData);
      const customItems = getCustomGachaItemDefinitions(rawData);
      const item = customItems.find(candidate => candidate.id === id) || null;
      if (!item) {
        if (GACHA_ITEM_DEFINITIONS.some(candidate => candidate.id === id)) {
          throw new Error('内置物品不能通过 API 删除，只能在商店设置里禁用');
        }
        result = { removed: false, item: null };
        return;
      }
      const nextItems = customItems.filter(candidate => candidate.id !== id);
      const saved = await saveStoredGachaCatalog(nextItems);
      if (!saved) throw new Error('自定义物品删除保存失败');
      deleteGachaItemSetting(id);
      refreshGachaVisualization();
      refreshGachaShardShop();
      if ($('.acu-gacha-settings-overlay').length) void showGachaSettingsDialog();
      result = { removed: true, item: serializeAcuDiceGachaItem(item, new Set([id])) };
    });

    if (!result) throw new Error('自定义物品删除失败');
    if (result.removed && !options.silent && window.toastr) window.toastr.success('自定义物品已删除', '骰子商店');
    emitEvent('gacha:catalog', { action: 'removeCustomItem', ...result });
    return result;
  };

  const removeAcuDiceGachaCustomPool = async (poolId: unknown, options: { silent?: boolean } = {}) => {
    const id = normalizeGachaPoolId(poolId);
    if (!id || id === GACHA_ALL_POOL_TAG) throw new Error('[AcuDice][Gacha] removeCustomPool() 需要有效的自定义卡池 id');
    let removed = false;

    await runInSaveQueue(async () => {
      const rawData = getRuntimeGachaRawData();
      await ensureGachaCatalogLoaded(rawData);
      const pool = getConfiguredGachaPoolDefinitions().find(candidate => candidate.id === id);
      if (pool && !canDeleteGachaPoolDefinition(pool)) {
        throw new Error('内置卡池不能通过 API 删除，只能调整是否参与全部池');
      }
      removed = await deleteGachaPoolConfig(id, rawData);
      refreshGachaVisualization();
      refreshGachaShardShop();
      if ($('.acu-gacha-settings-overlay').length) void showGachaSettingsDialog();
    });

    const result = { removed, poolId: id };
    if (removed && !options.silent && window.toastr) window.toastr.success(`卡池「${id}」已删除`, '骰子商店');
    emitEvent('gacha:catalog', { action: 'removeCustomPool', ...result });
    return result;
  };

  const AcuDiceGachaAPI = {
    costs: {
      singleDraw: GACHA_DRAW_COST_SINGLE,
      tenDraw: GACHA_DRAW_COST_TEN,
    },
    currencyName: FORTUNE_CURRENCY_NAME,
    rarities: [...GACHA_RARITY_ORDER],
    rewardTargets: [...GACHA_REWARD_TARGETS],

    getState() {
      return buildAcuDiceGachaStateSnapshot();
    },

    async setFortune(amount: number, options: { silent?: boolean; reason?: string; detail?: string } = {}) {
      return await changeAcuDiceGachaFortune('set', amount, options);
    },

    async addFortune(delta: number, options: { silent?: boolean; reason?: string; detail?: string } = {}) {
      return await changeAcuDiceGachaFortune('add', delta, options);
    },

    async clearFortune(options: { silent?: boolean; confirm?: boolean; reason?: string; detail?: string } = {}) {
      if (options.confirm === true) {
        const currentFortune = buildAcuDiceGachaStateSnapshot().fortune;
        if (currentFortune > 0) {
          const confirmed = await showDiceSystemConfirmDialog({
            title: `清空${FORTUNE_CURRENCY_NAME}`,
            message: `确定要清空当前${FORTUNE_CURRENCY_NAME}余额吗？`,
            detail: `当前余额：${currentFortune}\n这次调用来自 AcuDice.gacha API。`,
            iconClass: 'fa-eraser',
            confirmText: `清空${FORTUNE_CURRENCY_NAME}`,
            cancelText: '取消',
            tone: 'danger',
          });
          if (!confirmed) {
            const state = buildAcuDiceGachaStateSnapshot();
            return { before: currentFortune, after: currentFortune, delta: 0, canceled: true, state };
          }
        }
      }
      const result = await changeAcuDiceGachaFortune('set', 0, {
        silent: options.silent,
        reason: options.reason || 'API清空',
        detail: options.detail || `清空${FORTUNE_CURRENCY_NAME}`,
      });
      return { ...result, canceled: false };
    },

    async draw(count: number = 1) {
      const result = serializeAcuDiceGachaDrawResult(await performGachaDraw(count));
      emitEvent('gacha:draw', result);
      return result;
    },

    async singleDraw() {
      return await AcuDiceGachaAPI.draw(1);
    },

    async tenDraw() {
      return await AcuDiceGachaAPI.draw(10);
    },

    setActivePool(poolTag: string) {
      const id = normalizeGachaPoolId(poolTag);
      if (!id) throw new Error('[AcuDice][Gacha] setActivePool() 需要卡池 id');
      const visiblePools = getVisibleGachaPoolConfigDefinitions();
      if (!visiblePools.some(pool => pool.id === id)) throw new Error(`[AcuDice][Gacha] 未找到可见卡池: ${id}`);
      updateGachaPoolTag(id);
      const state = buildAcuDiceGachaStateSnapshot();
      emitEvent('gacha:pool_change', { poolTag: id, state });
      return state;
    },

    setPool(poolTag: string) {
      return AcuDiceGachaAPI.setActivePool(poolTag);
    },

    async listPools(options: { includeHidden?: boolean } = {}) {
      const rawData = getRuntimeGachaRawData();
      await ensureGachaCatalogLoaded(rawData);
      const pools = options.includeHidden ? getAllGachaPoolConfigDefinitions(rawData) : getVisibleGachaPoolConfigDefinitions(rawData);
      return pools.map(serializeAcuDiceGachaPool);
    },

    async listItems(
      options: { poolTag?: string; includeDisabled?: boolean; customOnly?: boolean; source?: 'all' | 'custom' | 'builtin' } = {},
    ) {
      const rawData = getRuntimeGachaRawData();
      await ensureGachaCatalogLoaded(rawData);
      const customIds = new Set(getCustomGachaItemDefinitions(rawData).map(item => item.id));
      let items = getAllGachaItemDefinitions(rawData);
      const poolTag = normalizeGachaPoolId(options.poolTag);
      if (poolTag) {
        const activeTags = getActiveGachaPoolTags(poolTag);
        items = items.filter(item => item.poolTags.some(tag => activeTags.includes(tag)));
      }
      if (options.includeDisabled !== true) items = items.filter(isGachaItemEnabled);
      if (options.customOnly === true || options.source === 'custom') items = items.filter(item => customIds.has(item.id));
      if (options.source === 'builtin') items = items.filter(item => !customIds.has(item.id));
      return items.sort(compareGachaItemDefinitionsForDisplay).map(item => serializeAcuDiceGachaItem(item, customIds));
    },

    async exportCatalog(options: { poolTag?: string } = {}) {
      const rawData = getRuntimeGachaRawData();
      await ensureGachaCatalogLoaded(rawData);
      return exportGachaCatalogJson(rawData, normalizeGachaPoolId(options.poolTag));
    },

    async importCatalog(input: unknown, options: { mode?: GachaCatalogImportMode; silent?: boolean } = {}) {
      return await importAcuDiceGachaCatalog(input, options);
    },

    async upsertItems(input: unknown, options: { mode?: GachaCatalogImportMode; silent?: boolean } = {}) {
      return await importAcuDiceGachaCatalog(input, { mode: options.mode || 'overwrite', silent: options.silent });
    },

    async upsertPool(input: unknown, options: { silent?: boolean } = {}) {
      return await upsertAcuDiceGachaPool(input, options);
    },

    async removeCustomItem(itemId: string, options: { silent?: boolean } = {}) {
      return await removeAcuDiceGachaCustomItem(itemId, options);
    },

    async removeCustomPool(poolId: string, options: { silent?: boolean } = {}) {
      return await removeAcuDiceGachaCustomPool(poolId, options);
    },

    async openShop() {
      await showGachaVisualization();
      return buildAcuDiceGachaStateSnapshot();
    },

    closeShop() {
      closeGachaVisualization();
    },

    async openShardShop() {
      await showGachaShardShop();
      return buildAcuDiceGachaStateSnapshot();
    },

    async openSettings() {
      await showGachaSettingsDialog();
    },
  };

  const ACUDICE_GACHA_REGEX_ACTION_SELECTOR = '[data-acu-gacha-action]';

  const getAcuDiceGachaRegexToastr = () => {
    try {
      return window.toastr || (rootWindow !== window ? (rootWindow as unknown as { toastr?: typeof window.toastr }).toastr : undefined);
    } catch {
      return window.toastr;
    }
  };

  const setAcuDiceGachaRegexActionBusy = (element: HTMLElement, busy: boolean) => {
    element.classList.toggle('is-busy', busy);
    if (busy) {
      element.dataset.acuGachaBusy = '1';
      element.setAttribute('aria-disabled', 'true');
    } else {
      delete element.dataset.acuGachaBusy;
      element.removeAttribute('aria-disabled');
    }
  };

  const getAcuDiceGachaRegexInteger = (element: HTMLElement, key: string, fallback = 0): number => {
    const raw = element.dataset[key] ?? element.getAttribute(`data-${key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`);
    const value = Number.parseInt(String(raw ?? ''), 10);
    return Number.isFinite(value) ? value : fallback;
  };

  const executeAcuDiceGachaRegexAction = async (element: HTMLElement) => {
    const action = String(element.dataset.acuGachaAction || '').trim();
    const toastr = getAcuDiceGachaRegexToastr();

    switch (action) {
      case 'openShop':
      case 'shop':
        await AcuDiceGachaAPI.openShop();
        break;

      case 'addFortune': {
        const amount = getAcuDiceGachaRegexInteger(element, 'acuGachaAmount');
        const result = await AcuDiceGachaAPI.addFortune(amount, {
          reason: '正则按钮',
          detail: String(element.dataset.acuGachaDetail || ''),
        });
        toastr?.success?.(`当前${FORTUNE_CURRENCY_NAME}：${result.after}`, '骰子商店');
        break;
      }

      case 'clearFortune': {
        const result = await AcuDiceGachaAPI.clearFortune({ confirm: true, reason: '正则按钮' });
        if (!result.canceled) toastr?.success?.(`${FORTUNE_CURRENCY_NAME}已清空`, '骰子商店');
        break;
      }

      case 'state': {
        const state = AcuDiceGachaAPI.getState();
        console.log('[AcuDice.gacha] state', state);
        toastr?.info?.(`当前${FORTUNE_CURRENCY_NAME}：${state.fortune}`, '骰子商店');
        break;
      }

      case 'singleDraw': {
        const result = await AcuDiceGachaAPI.singleDraw();
        console.log('[AcuDice.gacha] singleDraw', result);
        break;
      }

      case 'tenDraw': {
        const result = await AcuDiceGachaAPI.tenDraw();
        console.log('[AcuDice.gacha] tenDraw', result);
        break;
      }

      case 'openShardShop':
      case 'shardShop':
        await AcuDiceGachaAPI.openShardShop();
        break;

      case 'createTestCatalog':
        await AcuDiceGachaAPI.upsertPool({ id: 'API测试', name: 'API测试', includeInAll: true, order: 990 }, { silent: true });
        await AcuDiceGachaAPI.upsertItems(
          {
            items: [
              {
                id: 'regex_test_candy',
                name: '测试糖',
                type: '道具',
                quality: '普通',
                description: '正则按钮测试用糖果',
                poolTags: ['API测试'],
                weight: 1,
                stackable: true,
                unique: false,
                grantQuantity: 1,
                rewardTarget: 'inventory',
              },
            ],
          },
          { mode: 'overwrite', silent: true },
        );
        AcuDiceGachaAPI.setActivePool('API测试');
        toastr?.success?.('已创建 API测试 池和 测试糖', '骰子商店');
        break;

      case 'drawTestCatalog': {
        AcuDiceGachaAPI.setActivePool('API测试');
        await AcuDiceGachaAPI.addFortune(20, { silent: true, reason: '正则奖池测试' });
        const result = await AcuDiceGachaAPI.singleDraw();
        console.log('[AcuDice.gacha] API测试池单抽', result);
        break;
      }

      case 'listTestCatalog': {
        const items = await AcuDiceGachaAPI.listItems({ poolTag: 'API测试', includeDisabled: true });
        console.log('[AcuDice.gacha] API测试池物品', items);
        toastr?.info?.(`API测试池物品数：${items.length}`, '骰子商店');
        break;
      }

      case 'clearTestCatalog':
        await AcuDiceGachaAPI.removeCustomItem('regex_test_candy', { silent: true });
        await AcuDiceGachaAPI.removeCustomPool('API测试', { silent: true });
        toastr?.success?.('已清理 API测试 池', '骰子商店');
        break;

      case 'listPools': {
        const pools = await AcuDiceGachaAPI.listPools({ includeHidden: true });
        console.log('[AcuDice.gacha] pools', pools);
        toastr?.info?.(`卡池数：${pools.length}`, '骰子商店');
        break;
      }

      case 'exportCatalog': {
        const json = await AcuDiceGachaAPI.exportCatalog();
        console.log('[AcuDice.gacha] custom catalog JSON', json);
        toastr?.info?.('已输出到浏览器控制台', '骰子商店');
        break;
      }

      case 'openSettings':
      case 'settings':
        await AcuDiceGachaAPI.openSettings();
        break;

      default:
        console.warn('[AcuDice][GachaRegex] 未知按钮动作:', action);
        toastr?.warning?.(`未知骰子商店动作：${action || '(空)'}`, '骰子商店');
    }
  };

  const handleAcuDiceGachaRegexAction = async (element: HTMLElement) => {
    if (element.dataset.acuGachaBusy === '1' || element.getAttribute('aria-disabled') === 'true') return;

    setAcuDiceGachaRegexActionBusy(element, true);
    try {
      await executeAcuDiceGachaRegexAction(element);
    } catch (error) {
      const message = getRuntimeErrorMessage(error);
      console.error('[AcuDice][GachaRegex] 按钮执行失败:', error);
      showActionableErrorToast(`骰子商店按钮执行失败：${message}`, { title: '骰子商店', developerHint: true });
    } finally {
      setAcuDiceGachaRegexActionBusy(element, false);
    }
  };

  function bindAcuDiceGachaRegexActions() {
    const { $ } = getCore();
    if (!$) return;

    $('body')
      .off('click.acu_gacha_regex_action')
      .on('click.acu_gacha_regex_action', ACUDICE_GACHA_REGEX_ACTION_SELECTOR, function (event) {
        event.preventDefault();
        event.stopPropagation();
        void handleAcuDiceGachaRegexAction(this as HTMLElement);
      });

    $('body')
      .off('keydown.acu_gacha_regex_action')
      .on('keydown.acu_gacha_regex_action', ACUDICE_GACHA_REGEX_ACTION_SELECTOR, function (event) {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        event.stopPropagation();
        void handleAcuDiceGachaRegexAction(this as HTMLElement);
      });
  }
export {
  cloneAcuDiceApiValue,
  normalizeAcuDiceGachaInteger,
  buildAcuDiceGachaStateSnapshot,
  serializeAcuDiceGachaPool,
  serializeAcuDiceGachaItem,
  serializeAcuDiceGachaDrawOutcome,
  serializeAcuDiceGachaDrawResult,
  changeAcuDiceGachaFortune,
  stringifyAcuDiceGachaCatalogInput,
  normalizeAcuDiceGachaImportMode,
  importAcuDiceGachaCatalog,
  upsertAcuDiceGachaPool,
  removeAcuDiceGachaCustomItem,
  removeAcuDiceGachaCustomPool,
  AcuDiceGachaAPI,
  ACUDICE_GACHA_REGEX_ACTION_SELECTOR,
  getAcuDiceGachaRegexToastr,
  setAcuDiceGachaRegexActionBusy,
  getAcuDiceGachaRegexInteger,
  executeAcuDiceGachaRegexAction,
  handleAcuDiceGachaRegexAction,
  bindAcuDiceGachaRegexActions,
}; // __wireDebugTestFunctionsDeps 已由头部 export function 导出
