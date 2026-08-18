// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=21「MVU 变量可视化模块 v2.0」
// 原行范围：8995-12382（含 banner 8991-12382，banner 含副标题行）；拆分批次 7；外部 closure 依赖：20（isNumericCell@29 / RenderPresetManager@11 / getTutorialButtonHtml@30 / saveActiveTabState@29 / getActiveTabState@29 / renderInterface@45 / showDicePanel@29 / getPanelDragStartHeight@29 / setPanelRequestedHeight@29 / getTableHeights@29 / saveTableHeights@29 / savePanelRequestedHeight@29 / resetPanelRequestedHeight@29 / getConfig@30 / setupOverlayClose@3 / canWriteMvuPanel@29 / Store@29 / STORAGE_KEY_DICE_CONFIG@3 / readTextareaVisibleValue@3 / syncTextareaDiceCacheFromVisibleText@3 / storeTextareaDiceCache@3 / createMetaCheckResultRegex@3 / DICE_RESULT_PLACEHOLDER@3 / clearTextareaDiceCache@3 / setTextareaValueAndNotify@3）
// 接线说明：RenderPresetManager@11 同批次拆至 presets/render-preset-manager.ts（不引用本文件，无循环）直接 import；
//   STORAGE_KEY_DICE_CONFIG/setupOverlayClose/readTextareaVisibleValue/syncTextareaDiceCacheFromVisibleText/storeTextareaDiceCache/createMetaCheckResultRegex/DICE_RESULT_PLACEHOLDER/clearTextareaDiceCache/setTextareaValueAndNotify@3 已拆至 favorites/bookmark-manager.ts、showActionableErrorToast 来自 ../ui/actionable-error-toast（均不引用本文件，无循环）直接 import；
//   isNumericCell/saveActiveTabState/getActiveTabState/showDicePanel/getPanelDragStartHeight/setPanelRequestedHeight/getTableHeights/saveTableHeights/savePanelRequestedHeight/resetPanelRequestedHeight/canWriteMvuPanel/Store@29、getTutorialButtonHtml/getConfig@30、renderInterface@45 定义于 index.ts IIFE 内无法 export，采用运行时注入：
//   index.ts IIFE 末尾调用 __wireMvuVisualizerDeps({...}) 注入；
//   未注入时模块级引用为 null（全部仅在运行时方法内调用，注入先于任何调用，与 IIFE 内原时序等价）。
//   getLastMessageId/getChatMessages/retrieveDisplayedMessage/formatAsDisplayedMessage 为全局符号，无需接线。

import { showActionableErrorToast } from '../ui/actionable-error-toast';
import { RenderPresetManager } from '../presets/render-preset-manager';
import { DICE_RESULT_PLACEHOLDER, STORAGE_KEY_DICE_CONFIG, clearTextareaDiceCache, createMetaCheckResultRegex, readTextareaVisibleValue, setTextareaValueAndNotify, setupOverlayClose, storeTextareaDiceCache, syncTextareaDiceCacheFromVisibleText } from '../favorites/bookmark-manager';

let isNumericCell = null;
let getTutorialButtonHtml = null;
let saveActiveTabState = null;
let getActiveTabState = null;
let renderInterface = null;
let showDicePanel = null;
let getPanelDragStartHeight = null;
let setPanelRequestedHeight = null;
let getTableHeights = null;
let saveTableHeights = null;
let savePanelRequestedHeight = null;
let resetPanelRequestedHeight = null;
let getConfig = null;
let canWriteMvuPanel = null;
let Store = null;

export function __wireMvuVisualizerDeps(deps) {
  isNumericCell = deps.isNumericCell;
  getTutorialButtonHtml = deps.getTutorialButtonHtml;
  saveActiveTabState = deps.saveActiveTabState;
  getActiveTabState = deps.getActiveTabState;
  renderInterface = deps.renderInterface;
  showDicePanel = deps.showDicePanel;
  getPanelDragStartHeight = deps.getPanelDragStartHeight;
  setPanelRequestedHeight = deps.setPanelRequestedHeight;
  getTableHeights = deps.getTableHeights;
  saveTableHeights = deps.saveTableHeights;
  savePanelRequestedHeight = deps.savePanelRequestedHeight;
  resetPanelRequestedHeight = deps.resetPanelRequestedHeight;
  getConfig = deps.getConfig;
  canWriteMvuPanel = deps.canWriteMvuPanel;
  Store = deps.Store;
}
  // ========================================
  // MVU 变量可视化模块 v2.0
  // 独立模块 - 卡片分组式 UI
  // ========================================
  const MvuModule = (function () {
    'use strict';

    // [新增] MVU 路径解析函数 - 用于投骰快捷选择（移到模块内部避免影响执行顺序）
    function parseMvuPathForDice(path, value) {
      try {
        if (!path || typeof path !== 'string') {
          return { initiator: null, attrName: null, candidates: [] };
        }

        // 用 . 分割路径
        const parts = path.split('.').filter(p => p && p.trim());

        if (parts.length === 0) {
          return { initiator: null, attrName: null, candidates: [] };
        }

        // 仅用于从 MVU 路径里猜角色名/属性名；不控制骰子图标是否显示。
        const nonAttributePathParts = [
          '角色列表',
          '系统',
          '列表',
          '表',
          '数据',
          '信息',
          '变量',
          '属性',
          '状态',
          'stat_data',
          'delta_data',
        ];

        const filteredParts = parts.filter(p => !nonAttributePathParts.includes(p));

        // 提取可能的发起者（通常是倒数第二或第三层，排除黑名单后）
        let initiator = null;
        if (filteredParts.length >= 2) {
          // 倒数第二层通常是角色名
          initiator = filteredParts[filteredParts.length - 2];
        } else if (filteredParts.length === 1) {
          // 只有一层，可能是角色名
          initiator = filteredParts[0];
        }

        // 提取属性名（通常是最后一层）
        let attrName = null;
        if (filteredParts.length > 0) {
          attrName = filteredParts[filteredParts.length - 1];
        } else if (parts.length > 0) {
          // 如果所有部分都在黑名单中，至少取最后一部分
          attrName = parts[parts.length - 1];
        }

        // 生成候选列表（所有非黑名单的部分）
        const candidates = filteredParts.length > 0 ? filteredParts : parts.slice(-1);

        return {
          initiator: initiator || null,
          attrName: attrName || null,
          candidates: candidates,
        };
      } catch (e) {
        console.warn('[DICE]parseMvuPathForDice 解析路径时出错', e);
        return { initiator: null, attrName: null, candidates: [] };
      }
    }

    // ===== 私有变量 =====
    const MODULE_ID = '__mvu__';
    let cachedEraData = null; // 缓存 ERA 数据
    let cachedEraDataChatId: string | null = null;

    function getCurrentChatIdSafe(): string | null {
      const ST = window.SillyTavern || window.parent?.SillyTavern;
      try {
        return typeof ST?.getCurrentChatId === 'function' ? ST.getCurrentChatId() : null;
      } catch {
        return null;
      }
    }

    function clearMvuCacheIfChatChanged() {
      const chatId = getCurrentChatIdSafe();
      if (!cachedEraData) return;
      if (!chatId) return;
      if (cachedEraDataChatId && cachedEraDataChatId !== chatId) {
        cachedEraData = null;
        cachedEraDataChatId = null;
      }
    }

    function isLwbChatContext(): boolean {
      const lwbGuard = globalThis.LWB_Guard || window.LWB_Guard || window.parent?.LWB_Guard;
      if (typeof lwbGuard !== 'object' || lwbGuard === null) return false;

      const ST = window.SillyTavern || window.parent?.SillyTavern;
      const chatMetadata = ST?.chatMetadata;
      if (typeof chatMetadata !== 'object' || chatMetadata === null) return false;

      // 关键修复：如果 ERA 框架存在且有 ERA 数据，优先使用 ERA 而非 LWB
      const eventEmit = window.eventEmit || window.parent?.eventEmit;
      const eventOn = window.eventOn || window.parent?.eventOn;
      if (typeof eventEmit === 'function' && typeof eventOn === 'function') {
        const variablesUnknown = (chatMetadata as { variables?: unknown }).variables;
        if (typeof variablesUnknown === 'object' && variablesUnknown !== null) {
          const variables = variablesUnknown as Record<string, unknown>;
          // 如果有 ERA 保留键，明确是 ERA 卡
          if (variables.ERAMetaData !== undefined || variables.stat_data !== undefined) {
            return false;
          }
        }
      }

      // 关键修复：如果 MVU 框架存在，优先使用 MVU 而非 LWB
      // MVU 数据存储在消息楼层变量中，不在 chatMetadata.variables 中
      // 因此即使 chatMetadata 有 LWB_* 残留键，也应该优先使用 MVU
      if (typeof window.Mvu !== 'undefined' && typeof window.Mvu.getMvuData === 'function') {
        // MVU 框架可用，尝试检查是否有 MVU 数据
        try {
          const mvuData = window.Mvu.getMvuData({ type: 'message', message_id: 'latest' });
          // 如果能成功获取 MVU 数据（即使 stat_data 为空），说明这是 MVU 卡
          if (mvuData !== null && mvuData !== undefined) {
            return false;
          }
        } catch {
          // MVU 获取失败，继续检查 LWB
        }
      }

      // LWB_Guard 是全局的，安装扩展后一直存在，不能作为单独判据。
      // 必须有明确的 LWB 标记才能判定为 LWB 卡。

      // 检查 chatMetadata 顶层是否有 LWB_* 标记
      const hasLwbMetaKey = Object.keys(chatMetadata).some(k => k.startsWith('LWB_') || k.startsWith('lwb_'));
      if (hasLwbMetaKey) return true;

      const variablesUnknown = (chatMetadata as { variables?: unknown }).variables;
      if (typeof variablesUnknown !== 'object' || variablesUnknown === null) return false;

      const variables = variablesUnknown as Record<string, unknown>;

      // 检查 variables 中是否有 LWB_* 标记
      const hasLwbVarKey = Object.keys(variables).some(k => k.startsWith('LWB_') || k.startsWith('lwb_'));
      if (hasLwbVarKey) return true;

      // 关键修复：只有当有明确的 LWB 标记时才认为是 LWB
      // 不再使用启发式检测（JSON 字符串值），因为这会误判 MVU 卡
      // MVU 卡的数据存储在消息楼层变量中，不在 chatMetadata.variables 中
      // 如果没有 LWB_* 标记，就不是 LWB 卡
      return false;
    }

    // ===== 检测当前聊天是否有 ERA 特征数据 =====
    function hasEraDataInCurrentChat(): boolean {
      const ST = window.SillyTavern || window.parent?.SillyTavern;
      const chatMetadata = ST?.chatMetadata;
      if (typeof chatMetadata !== 'object' || chatMetadata === null) return false;

      const variablesUnknown = (chatMetadata as { variables?: unknown }).variables;
      if (typeof variablesUnknown !== 'object' || variablesUnknown === null) return false;

      const variables = variablesUnknown as Record<string, unknown>;
      // ERA 特征：有 ERAMetaData 或 stat_data 键
      return variables.ERAMetaData !== undefined || variables.stat_data !== undefined;
    }

    // ===== 智能检测变量源 =====
    function detectMode() {
      clearMvuCacheIfChatChanged();

      // 如果有缓存数据，检查数据来源标记
      if (cachedEraData && cachedEraData._source) {
        return cachedEraData._source;
      }

      // [新增] 优先检测 LWB (小白X)，因为 LWB 需要特殊处理
      if (isLwbChatContext()) {
        console.log('[DICE]MvuModule 智能检测到 LWB (小白X) 框架');
        return 'lwb';
      }

      // 检测 ERA：框架存在 且 当前聊天有 ERA 特征数据
      const eventEmit = window.eventEmit || window.parent?.eventEmit;
      const eventOn = window.eventOn || window.parent?.eventOn;
      const eraFrameworkExists = typeof eventEmit === 'function' && typeof eventOn === 'function';

      if (eraFrameworkExists && hasEraDataInCurrentChat()) {
        console.log('[DICE]MvuModule 智能检测到 ERA 框架（当前聊天有 ERA 数据）');
        return 'era';
      }

      // 其次检测 MVU
      if (typeof window.Mvu !== 'undefined' && typeof window.Mvu.getMvuData === 'function') {
        console.log('[DICE]MvuModule 智能检测到 MVU 框架');
        return 'mvu';
      }

      // 如果 ERA 框架存在但当前聊天无数据，仍返回 ERA（新建聊天场景）
      if (eraFrameworkExists) {
        console.log('[DICE]MvuModule 智能检测到 ERA 框架（新聊天，无数据）');
        return 'era';
      }

      // 默认 MVU
      console.log('[DICE]MvuModule 未检测到框架，默认使用 MVU 模式');
      return 'mvu';
    }

    // ===== 增强的智能检测（带数据验证）=====
    async function detectModeWithData() {
      // [新增] 1. 优先尝试 LWB（因为需要特殊处理）
      if (isLwbChatContext()) {
        const lwbData = getLwbData();
        console.log('[DICE]检测到 LWB 框架，数据条目数:', Object.keys(lwbData.stat_data).length);
        return { mode: 'lwb', data: lwbData };
      }

      // 2. 检测 ERA：框架存在 且 当前聊天有 ERA 特征数据
      const eventEmit = window.eventEmit || window.parent?.eventEmit;
      const eventOn = window.eventOn || window.parent?.eventOn;
      const eraFrameworkExists = typeof eventEmit === 'function' && typeof eventOn === 'function';

      if (eraFrameworkExists && hasEraDataInCurrentChat()) {
        try {
          // 尝试实际获取 ERA 数据（带超时）
          const eraData = await Promise.race([
            getEraData(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('ERA timeout')), 2000)),
          ]);

          if (eraData && eraData.stat_data) {
            console.log('[DICE]检测到 ERA 框架且数据可用');
            return { mode: 'era', data: eraData };
          }
        } catch (e) {
          console.warn('[DICE]ERA 框架存在但数据不可用:', e.message);
        }
      }

      // 3. 尝试 MVU
      try {
        await waitGlobalInitialized('Mvu');

        if (typeof window.Mvu !== 'undefined' && typeof window.Mvu.getMvuData === 'function') {
          const mvuData = window.Mvu.getMvuData({ type: 'message', message_id: 'latest' });

          if (mvuData && mvuData.stat_data) {
            console.log('[DICE]检测到 MVU 框架且数据可用');
            return {
              mode: 'mvu',
              data: {
                stat_data: mvuData.stat_data || null,
                display_data: mvuData.display_data || {},
                delta_data: mvuData.delta_data || {},
                schema: mvuData.schema || null,
                _source: 'mvu', // 标记数据来源
              },
            };
          }
        }
      } catch (e) {
        console.warn('[DICE]MVU 框架检测失败:', e);
      }

      // 3. 都不可用，返回默认 MVU 模式（向后兼容）
      console.warn('[DICE]未检测到可用的变量框架，默认使用 MVU 模式');
      return { mode: 'mvu', data: null };
    }

    // ===== LWB (小白X) 数据获取函数 =====
    // JSON解析辅助函数（基于 LWB 源码分析，只需单次解析）
    // 注意：LWB 不存在双重序列化，只做单次 JSON.parse
    function parseJsonSafe(value: unknown): unknown {
      if (typeof value !== 'string') return value;

      const trimmed = value.trim();
      if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return value;

      try {
        return JSON.parse(trimmed) as unknown;
      } catch {
        return value;
      }
    }

    // 获取小白X变量数据
    function getLwbData() {
      try {
        // iframe 兼容的 SillyTavern 访问
        const ST = window.SillyTavern || window.parent?.SillyTavern;
        const variables = ST?.chatMetadata?.variables || {};
        const stat_data: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(variables)) {
          // 跳过小白X内部键（防御性编程）
          if (key.startsWith('LWB_') || key.startsWith('lwb_')) continue;

          // 使用 parseJsonSafe 处理 JSON 字符串（单次解析）
          const parsed = parseJsonSafe(value);

          // 只保留嵌套对象（plot-log特征）
          if (typeof parsed === 'object' && parsed !== null) {
            stat_data[key] = parsed;
          }
        }

        // 关键：始终返回对象，即使 stat_data 为空
        // 确保 _source: 'lwb' 进入缓存，使 detectMode() 返回 'lwb'
        // 注意：不在此处更新 cachedEraData，由调用方负责
        return {
          stat_data,
          display_data: {},
          delta_data: {},
          _source: 'lwb',
        };
      } catch (e) {
        console.warn('[DICE]获取LWB变量失败:', e);
        // 即使出错也返回空的 LWB 数据对象，确保模式标记正确
        return {
          stat_data: {},
          display_data: {},
          delta_data: {},
          _source: 'lwb',
        };
      }
    }

    // ===== ERA 数据获取函数 =====
    // 异步获取ERA变量数据
    async function getEraData() {
      return new Promise(resolve => {
        const timeoutId = setTimeout(() => {
          console.warn('[DICE]MvuModule ERA查询超时');
          resolve(null);
        }, 5000);

        // 尝试获取 eventEmit 和 eventOn（支持 iframe 环境）
        const eventEmit = window.eventEmit || window.parent?.eventEmit;
        const eventOn = window.eventOn || window.parent?.eventOn;
        const eventOff = window.eventOff || window.parent?.eventOff;

        const onResult = detail => {
          clearTimeout(timeoutId);
          // 移除事件监听（如果 eventOff 不可用，则忽略）
          if (typeof eventOff === 'function') {
            try {
              eventOff('era:queryResult', onResult);
            } catch (e) {
              console.warn('[DICE]MvuModule 移除事件监听失败:', e);
            }
          }

          // console.log('[DICE]MvuModule 收到ERA查询结果:', JSON.stringify(detail, null, 2));
          // console.log('[DICE]MvuModule detail.result:', JSON.stringify(detail.result, null, 2));

          if (detail.result && detail.result.error) {
            console.error('[DICE]MvuModule ERA查询失败:', detail.result.error);
            resolve(null);
            return;
          }

          const statData = detail.result?.statWithoutMeta || null;
          // console.log('[DICE]MvuModule 提取的 stat_data:', JSON.stringify(statData, null, 2));

          const result = {
            stat_data: statData,
            delta_data: {},
            schema: null,
            _source: 'era', // 标记数据来源
          };

          // 缓存数据
          cachedEraData = result;
          cachedEraDataChatId = getCurrentChatIdSafe();

          resolve(result);
        };

        try {
          console.log('[DICE]MvuModule 开始获取ERA数据...');
          console.log('[DICE]MvuModule ERA API 检查:', {
            eventEmit: typeof eventEmit === 'function',
            eventOn: typeof eventOn === 'function',
            eventOff: typeof eventOff === 'function',
          });

          if (typeof eventOn !== 'function') {
            console.error('[DICE]MvuModule eventOn 不可用');
            clearTimeout(timeoutId);
            resolve(null);
            return;
          }
          if (typeof eventEmit !== 'function') {
            console.error('[DICE]MvuModule eventEmit 不可用');
            clearTimeout(timeoutId);
            resolve(null);
            return;
          }

          eventOn('era:queryResult', onResult);
          eventEmit('era:getCurrentVars');
        } catch (e) {
          clearTimeout(timeoutId);
          console.error('[DICE]MvuModule ERA API调用失败:', e);
          resolve(null);
        }
      });
    }

    // ERA 变量设置函数
    async function setEraValue(path, newValue) {
      return new Promise(resolve => {
        const timeoutId = setTimeout(() => {
          console.warn('[DICE]MvuModule ERA写入超时');
          resolve(false);
        }, 5000);

        // 尝试获取 eventEmit 和 eventOn（支持 iframe 环境）
        const eventEmit = window.eventEmit || window.parent?.eventEmit;
        const eventOn = window.eventOn || window.parent?.eventOn;
        const eventOff = window.eventOff || window.parent?.eventOff;

        const onWriteDone = detail => {
          clearTimeout(timeoutId);
          if (typeof eventOff === 'function') {
            eventOff('era:writeDone', onWriteDone);
          }
          console.log('[DICE]MvuModule ERA写入成功');
          resolve(true);
        };

        try {
          console.log('[DICE]MvuModule 开始设置ERA变量:', path, newValue);

          if (typeof eventOn !== 'function') {
            console.error('[DICE]MvuModule eventOn 不可用');
            clearTimeout(timeoutId);
            resolve(false);
            return;
          }
          if (typeof eventEmit !== 'function') {
            console.error('[DICE]MvuModule eventEmit 不可用');
            clearTimeout(timeoutId);
            resolve(false);
            return;
          }

          eventOn('era:writeDone', onWriteDone);
          eventEmit('era:updateByPath', {
            path: path,
            value: newValue,
          });
        } catch (e) {
          clearTimeout(timeoutId);
          console.error('[DICE]MvuModule ERA API调用失败:', e);
          resolve(false);
        }
      });
    }

    // ===== 样式定义 =====
    const STYLES = `
            /* MVU 面板容器 */
            .acu-mvu-panel {
                height: 100%;
                display: flex;
                flex-direction: column;
                min-height: 300px; /* 确保面板有足够的最小高度，避免显示为白条 */
                overflow: hidden; /* 不在这里滚动，让父容器处理 */
            }
            .acu-mvu-panel .acu-panel-header {
                background: var(--acu-table-head);
                border-bottom: 1px solid var(--acu-border);
                padding: 10px 12px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-shrink: 0;
            }
            .acu-mvu-panel .acu-panel-header .acu-panel-title {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 600;
                color: var(--acu-text-main);
            }
            .acu-mvu-panel .acu-panel-header .acu-panel-title i {
                color: var(--acu-accent);
            }
            .acu-mvu-panel .acu-header-actions {
                display: flex;
                gap: 4px;
            }
            .acu-mvu-panel .mvu-header-btn {
                background: transparent;
                border: 1px solid transparent;
                color: var(--acu-text-sub);
                cursor: pointer;
                padding: 5px;
                font-size: 14px;
                border-radius: 6px;
                transition:
                    background-color var(--acu-motion-fast) var(--acu-ease-standard),
                    color var(--acu-motion-fast) var(--acu-ease-standard),
                    border-color var(--acu-motion-fast) var(--acu-ease-standard);
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .acu-mvu-panel .mvu-header-btn:hover {
                background: var(--acu-table-hover);
                color: var(--acu-accent);
                border-color: var(--acu-border);
            }
            .acu-mvu-panel .mvu-header-btn.active {
                background: var(--acu-btn-bg);
                color: var(--acu-accent);
                border-color: var(--acu-accent);
                font-weight: bold;
            }
            /* [新增] 数值模式样式 */
            .mvu-numeric-mode {
                padding: 0;
            }
            .mvu-numeric-level-controls {
                position: sticky;
                top: 0;
                z-index: 10;
            }
            /* [新增] 可折叠层级控制样式 */
            .mvu-level-controls-collapsible {
                margin-bottom: 8px;
            }
            .mvu-level-controls-header {
                transition: background-color var(--acu-motion-fast) var(--acu-ease-standard);
            }
            .mvu-level-controls-header:hover {
                background: var(--acu-table-hover) !important;
            }
            .mvu-level-controls-body {
                overflow-y: auto;
                overflow-x: hidden;
                transition:
                    opacity var(--acu-motion-fast) var(--acu-ease-standard),
                    border-color var(--acu-motion-fast) var(--acu-ease-standard);
                max-height: 300px; /* 限制最大高度，超出时可滚动 */
                scrollbar-width: thin;
            }
            /* 移动端使用更小的最大高度 */
            @media (max-width: 768px) {
                .mvu-level-controls-body {
                    max-height: 200px;
                }
            }
            .mvu-level-controls-body::-webkit-scrollbar {
                width: 6px;
            }
            .mvu-level-controls-body::-webkit-scrollbar-track {
                background: transparent;
            }
            .mvu-level-controls-body::-webkit-scrollbar-thumb {
                background: var(--acu-border);
                border-radius: 3px;
            }
            .mvu-level-controls-body::-webkit-scrollbar-thumb:hover {
                background: var(--acu-text-sub);
            }
            .mvu-level-controls-collapsible.collapsed .mvu-level-controls-body {
                max-height: 0 !important;
                padding-top: 0 !important;
                padding-bottom: 0 !important;
                border-bottom: none !important;
                margin: 0 !important;
            }
            .mvu-level-controls-toggle-icon {
                transition: transform var(--acu-motion-fast) var(--acu-ease-standard);
            }
            .mvu-level-controls-collapsible.collapsed .mvu-level-controls-toggle-icon {
                transform: rotate(-90deg);
            }
            .mvu-numeric-items {
                max-height: calc(100vh - 200px);
                overflow-y: auto;
            }
            .mvu-numeric-item {
                transition: background-color var(--acu-motion-fast) var(--acu-ease-standard);
            }
            .mvu-numeric-item:hover {
                background: var(--acu-table-hover) !important;
            }
            .mvu-dice-icon {
                transition:
                    opacity var(--acu-motion-fast) var(--acu-ease-standard),
                    color var(--acu-motion-fast) var(--acu-ease-standard);
            }
            .mvu-dice-icon:hover {
                opacity: 1 !important;
                color: var(--acu-accent);
            }
            .mvu-level-toggle:hover {
                opacity: 1 !important;
            }
            .mvu-level-toggle[data-visible="true"]:hover {
                background: var(--acu-accent) !important;
                color: var(--acu-btn-active-text) !important;
                border-color: var(--acu-accent) !important;
            }
            .mvu-level-toggle[data-visible="false"]:hover,
            .mvu-level-toggle[data-visible=""]:hover {
                background: var(--acu-table-hover) !important;
                color: var(--acu-text-sub) !important;
                border-color: var(--acu-border) !important;
            }

            /* MVU 内容区 - 始终使用竖向滚动模式 */
            .mvu-content {
                display: flex;
                flex-direction: column;
                overflow-x: hidden;
                overflow-y: auto; /* 直接在内容区启用滚动 */
                flex: 1 1 auto;
                min-height: 0; /* 关键：允许 flex 子项缩小以启用滚动 */
                max-height: 100%; /* 限制最大高度为父容器 */
                padding: 12px;
                scrollbar-width: thin;
            }
            .mvu-content::-webkit-scrollbar {
                display: none;
            }
            .mvu-content .mvu-card {
                flex: 0 0 auto; /* 不拉伸，保持自然高度 */
                min-width: 100%;
                max-width: 100%;
                width: 100%;
            }
            /* MVU面板始终支持滚动 */
            .acu-mvu-panel {
                overflow-y: auto !important;
                overflow-x: hidden !important;
                flex: 1 1 0; /* 关键：使用 flex-basis: 0 让容器可以正确计算滚动 */
                min-height: 300px; /* 确保面板有足够的最小高度，避免显示为白条 */
            }

            /* MVU 卡片 */
            .mvu-card {
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                margin-bottom: 10px;
                overflow: hidden;
            }
            .mvu-card:last-child {
                margin-bottom: 0;
            }
            .mvu-card-header {
                background: var(--acu-table-head);
                padding: 8px 12px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                cursor: pointer;
                user-select: none;
                transition: background-color var(--acu-motion-fast) var(--acu-ease-standard);
            }
            .mvu-card-header:hover {
                background: var(--acu-table-hover);
            }
            .mvu-card-title {
                font-weight: 600;
                color: var(--acu-accent);
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .mvu-card-count {
                font-size: 11px;
                color: var(--acu-text-sub);
                font-weight: normal;
            }
            .mvu-card-toggle {
                color: var(--acu-text-sub);
                font-size: 10px;
                transition: transform 0.2s;
            }
            .mvu-card.collapsed .mvu-card-toggle {
                transform: rotate(-90deg);
            }
            .mvu-card-body {
                padding: 8px 12px;
                display: block;
                overflow: hidden; /* 为 slideUp/slideDown 动画提供支持 */
            }
            .mvu-card.collapsed .mvu-card-body {
                display: none;
            }

            /* 嵌套卡片 */
            .mvu-card .mvu-card {
                background: var(--acu-table-head);
                margin: 6px 0;
            }
            .mvu-card .mvu-card .mvu-card-header {
                background: rgba(128,128,128,0.1);
                padding: 6px 10px;
            }
            .mvu-card .mvu-card .mvu-card-body {
                padding: 6px 10px;
            }

            /* 嵌套卡片横向布局 - 只对嵌套卡片生效，键值对保持正常块级显示 */
            .mvu-card-body.horizontal-nested {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                gap: 12px;
                overflow-x: auto;
                overflow-y: visible;
                -webkit-overflow-scrolling: touch;
                padding-bottom: 8px;
                align-items: flex-start;
            }
            /* 如果父卡片有 has-nested-cards 类，使用 wrap 布局，让键值对和嵌套卡片可以换行 */
            .mvu-card.has-nested-cards .mvu-card-body.horizontal-nested {
                flex-wrap: wrap;
            }
            /* 键值对行保持正常块级显示，占满一行 */
            .mvu-card-body.horizontal-nested > .mvu-row {
                display: flex;
                flex: 0 0 100%;
                width: 100%;
                max-width: 100%; /* 确保不超过容器宽度 */
                box-sizing: border-box;
            }
            /* 如果父卡片有 has-nested-cards 类，键值对应该根据内容自适应宽度，但仍然占满一行 */
            .mvu-card.has-nested-cards .mvu-card-body.horizontal-nested > .mvu-row {
                flex: 0 0 auto; /* 根据内容自适应宽度 */
                min-width: 100%; /* 确保占满一行 */
                width: auto; /* 根据内容自适应宽度 */
                max-width: 450px; /* 限制键值对的最大宽度，避免占用过多横向空间 */
                box-sizing: border-box;
            }
            @media (min-width: 769px) {
                .mvu-card.has-nested-cards .mvu-card-body.horizontal-nested > .mvu-row {
                    max-width: 550px; /* 大屏幕下也限制键值对的最大宽度 */
                }
            }
            /* 只有嵌套卡片才横向排列 - 智能宽度 */
            .mvu-card-body.horizontal-nested > .mvu-card {
                flex: 0 0 auto; /* 根据内容自动调整宽度 */
                min-width: 200px;
                max-width: 350px;
                width: auto;
            }
            /* 如果嵌套卡片内部也有横向排列的子卡片，移除最大宽度限制，允许根据内容自适应 */
            .mvu-card-body.horizontal-nested > .mvu-card.has-nested-cards {
                min-width: 400px; /* 为包含嵌套卡片的嵌套卡片设置更大的最小宽度 */
                max-width: none; /* 移除最大宽度限制，允许根据内容自适应 */
            }
            @media (min-width: 769px) {
                .mvu-card-body.horizontal-nested > .mvu-card {
                    min-width: 240px;
                    max-width: 400px;
                }
                .mvu-card-body.horizontal-nested > .mvu-card.has-nested-cards {
                    min-width: 500px; /* 为包含嵌套卡片的嵌套卡片设置更大的最小宽度 */
                    max-width: none; /* 移除最大宽度限制，允许根据内容自适应 */
                }
            }

            /* 键值对行 */
            .mvu-row {
                display: flex;
                align-items: flex-start;
                padding: 5px 0;
                border-bottom: 1px dashed var(--acu-border);
            }
            .mvu-row:last-child {
                border-bottom: none;
            }
            .mvu-key {
                color: var(--acu-text-sub);
                min-width: 80px;
                max-width: 120px;
                flex-shrink: 0;
                font-size: 12px;
                padding-right: 8px;
                word-break: break-all;
            }
            .mvu-value-wrap {
                flex: 1;
                display: flex;
                align-items: center;
                gap: 6px;
                min-width: 0;
            }
            .mvu-value {
                color: var(--acu-text-main);
                font-size: var(--acu-font-size, 13px);
                cursor: pointer;
                padding: 1px 6px;
                border-radius: 4px;
                transition: background 0.2s;
                word-break: break-word;
                flex: 0 1 auto;
            }
            .mvu-value:hover {
                background: var(--acu-table-hover);
            }
            .mvu-value.mvu-array-value {
                font-size: calc(var(--acu-font-size, 13px) * 0.92);
                color: var(--acu-text-sub);
            }
            .mvu-change-indicator {
                color: var(--acu-success-text);
                font-weight: bold;
                font-size: 12px;
                flex-shrink: 0;
            }
            .mvu-row.mvu-changed {
                background: var(--acu-success-bg);
                margin: 0 -12px;
                padding: 5px 12px;
                border-radius: 4px;
            }
            .mvu-card .mvu-card .mvu-row.mvu-changed {
                margin: 0 -10px;
                padding: 5px 10px;
            }

            /* 空状态 */
            .mvu-empty {
                text-align: center;
                padding: 40px 20px;
                color: var(--acu-text-sub);
                flex: 1;
                min-width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            .mvu-empty i {
                font-size: 32px;
                margin-bottom: 12px;
                display: block;
                opacity: 0.5;
            }
            .mvu-empty p {
                margin: 0 0 6px 0;
            }
            .mvu-empty .mvu-empty-hint {
                font-size: 12px;
                opacity: 0.7;
            }

            /* 编辑弹窗 */
            .mvu-edit-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                animation: mvuFadeIn 0.15s ease-out;
            }
            .mvu-edit-dialog {
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                padding: 16px;
                width: 90%;
                max-width: 400px;
                animation: mvuSlideIn 0.2s ease-out;
            }
            .mvu-edit-title {
                font-weight: 600;
                color: var(--acu-text-main);
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .mvu-edit-path {
                font-size: 11px;
                color: var(--acu-text-sub);
                background: var(--acu-table-head);
                padding: 6px 10px;
                border-radius: 4px;
                margin-bottom: 12px;
                word-break: break-all;
                font-family: monospace;
            }
            .mvu-edit-textarea {
                width: 100%;
                min-height: 80px;
                padding: 10px;
                border: 1px solid var(--acu-border);
                border-radius: 4px;
                background: var(--acu-input-bg, var(--acu-bg-panel));
                color: var(--acu-text-main);
                font-size: 13px;
                resize: vertical;
                box-sizing: border-box;
            }
            .mvu-edit-textarea:focus {
                outline: none;
                border-color: var(--acu-accent);
            }
            .mvu-edit-hint {
                font-size: 11px;
                color: var(--acu-text-sub);
                margin-top: 8px;
                opacity: 0.7;
            }
            .mvu-edit-btns {
                display: flex;
                justify-content: flex-end;
                gap: 8px;
                margin-top: 16px;
            }
            .mvu-edit-btn {
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: all 0.2s;
            }
            .mvu-edit-btn.mvu-btn-cancel {
                background: transparent;
                border: 1px solid var(--acu-border);
                color: var(--acu-text-sub);
            }
            .mvu-edit-btn.mvu-btn-cancel:hover {
                background: var(--acu-table-hover);
            }
            .mvu-edit-btn.mvu-btn-save {
                background: var(--acu-accent);
                border: 1px solid var(--acu-accent);
                color: var(--acu-btn-active-text);
            }
            .mvu-edit-btn.mvu-btn-save:hover {
                opacity: 0.9;
            }

            @keyframes mvuFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes mvuSlideIn {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-panel {
                display: flex;
                flex-direction: column;
                gap: 12px;
                min-width: 0;
                overflow-x: hidden !important;
                overflow-y: auto !important;
                background: var(--acu-bg-panel, transparent);
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-toolbar {
                display: flex;
                align-items: center;
                gap: 8px;
                flex-wrap: wrap;
                width: 100%;
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-search-wrapper {
                flex: 1 1 220px;
                min-width: 0;
            }
            .acu-wrapper.acu-dice-ui-root input.acu-global-interaction-search {
                width: 100%;
                min-width: 0;
                padding: 6px 10px 6px 26px;
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                background: var(--acu-card-bg);
                color: var(--acu-text-main);
            }
            .acu-wrapper.acu-dice-ui-root input.acu-global-interaction-search::placeholder {
                color: var(--acu-text-sub);
                opacity: 0.75;
            }
            .acu-wrapper.acu-dice-ui-root input.acu-global-interaction-search:focus-visible {
                outline: 2px solid var(--acu-accent);
                outline-offset: 2px;
                border-color: var(--acu-accent);
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-content {
                display: flex;
                flex-direction: column;
                gap: 10px;
                min-width: 0;
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-section {
                display: flex;
                flex-direction: column;
                gap: 8px;
                min-width: 0;
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-section-header {
                appearance: none;
                display: flex;
                align-items: center;
                gap: 8px;
                width: 100%;
                min-width: 0;
                padding: 0 2px;
                border: 0;
                background: transparent;
                color: var(--acu-text-main);
                font: inherit;
                font-size: 12px;
                font-weight: 800;
                cursor: pointer;
                text-align: left;
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-section-header:hover,
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-section-header:focus-visible {
                color: var(--acu-accent);
                outline: none;
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-section-header .acu-collapse-icon {
                flex: 0 0 12px;
                width: 12px;
                color: var(--acu-accent);
                font-size: 10px;
                transition: transform 0.2s;
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-section-title {
                display: flex;
                align-items: center;
                gap: 6px;
                min-width: 0;
                color: var(--acu-text-main);
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-section-title i {
                color: var(--acu-accent);
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-section-stats {
                margin-left: auto;
                color: var(--acu-text-sub);
                font-size: 11px;
                font-weight: 700;
                white-space: nowrap;
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-section-body {
                min-width: 0;
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-table-list {
                display: flex;
                flex-direction: column;
                gap: 6px;
                min-width: 0;
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-group {
                display: flex;
                flex-direction: column;
                gap: 0;
                min-width: 0;
                padding: 6px 8px;
                border: 1px solid color-mix(in srgb, var(--acu-border) 80%, var(--acu-accent) 20%);
                border-radius: 14px;
                background: linear-gradient(135deg, color-mix(in srgb, var(--acu-card-bg) 94%, var(--acu-accent) 6%), var(--acu-card-bg));
                box-shadow: inset 0 0 0 1px rgba(255,255,255,0.03);
                overflow: visible;
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-grid {
                display: flex !important;
                flex-wrap: wrap !important;
                gap: 2px !important;
                align-items: flex-start !important;
                justify-content: center;
                min-width: 0;
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-row {
                position: relative;
                display: flex !important;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                flex: 0 0 58px !important;
                width: 58px !important;
                min-width: 58px !important;
                max-width: 58px !important;
                min-height: 0 !important;
                padding: 1px !important;
                border: 0 !important;
                border-radius: 18px;
                background: transparent !important;
                box-shadow: none !important;
                overflow: visible !important;
                overflow-x: visible !important;
                overflow-y: visible !important;
                cursor: pointer;
                transition: transform 0.16s;
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-row:hover,
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-row:focus-visible {
                background: transparent !important;
                border-color: transparent !important;
                box-shadow: none !important;
                outline: none;
                transform: none !important;
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-row.is-expanded {
                z-index: 30;
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-row-character {
                background: transparent;
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-row-map {
                background: transparent;
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-row-main {
                appearance: none;
                display: flex;
                align-items: center;
                justify-content: center;
                flex: 0 0 56px;
                width: 56px;
                height: 56px;
                min-width: 56px;
                padding: 0;
                border: 1px solid color-mix(in srgb, var(--acu-border) 70%, var(--acu-accent) 30%);
                border-radius: 50%;
                background: radial-gradient(circle at 35% 24%, color-mix(in srgb, var(--acu-accent) 30%, transparent), transparent 48%), color-mix(in srgb, var(--acu-bg-panel) 74%, var(--acu-card-bg) 26%);
                box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--acu-card-bg) 64%, transparent), 0 6px 16px color-mix(in srgb, var(--acu-accent) 16%, transparent);
                color: inherit;
                font: inherit;
                overflow: hidden;
                cursor: pointer;
                transition: border-color 0.16s, box-shadow 0.16s, transform 0.16s;
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-row.is-expanded .acu-global-interaction-row-main {
                border-color: var(--acu-accent);
                box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--acu-card-bg) 72%, transparent), 0 0 0 3px color-mix(in srgb, var(--acu-accent) 18%, transparent), 0 8px 20px color-mix(in srgb, var(--acu-accent) 20%, transparent);
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-row-main:hover,
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-row-main:focus-visible {
                border-color: var(--acu-accent);
                outline: none;
                transform: translateY(-1px);
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-row-title {
                appearance: none;
                display: block;
                width: 100%;
                min-width: 0;
                max-width: 100%;
                padding: 0 2px 8px;
                border: 0;
                border-bottom: 1px dashed var(--acu-border);
                background: transparent;
                color: var(--acu-text-main);
                font: inherit;
                font-weight: 700;
                font-size: 14px;
                line-height: 1.35;
                text-align: center;
                white-space: normal;
                overflow-wrap: anywhere;
                cursor: pointer;
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-row-title:hover,
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-row-title:focus-visible {
                color: var(--acu-accent);
                outline: none;
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-map-mark {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex: 0 0 46px;
                width: 46px;
                height: 46px;
                border-radius: 50%;
                background: color-mix(in srgb, var(--acu-accent) 16%, transparent);
                color: var(--acu-accent);
                font-size: 22px;
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-generic-mark {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex: 0 0 46px;
                width: 46px;
                height: 46px;
                border-radius: 50%;
                background: color-mix(in srgb, var(--acu-accent) 14%, var(--acu-card-bg));
                color: var(--acu-text-main);
                font-size: 18px;
                font-weight: 800;
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-avatar {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 46px;
                height: 46px;
                border-radius: 50%;
                border: 2px solid color-mix(in srgb, var(--acu-accent) 64%, white 18%);
                background-color: color-mix(in srgb, var(--acu-accent) 18%, var(--acu-card-bg));
                background-size: cover;
                background-position: center;
                color: var(--acu-text-main);
                font-weight: 800;
                box-shadow: 0 0 0 3px color-mix(in srgb, var(--acu-accent) 14%, transparent), 0 6px 14px rgba(0,0,0,0.18);
                overflow: hidden;
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-details {
                display: none;
                position: absolute;
                top: calc(100% + 6px);
                left: 0;
                flex-direction: column;
                gap: 4px;
                width: max-content;
                min-width: 188px;
                max-width: 260px;
                padding: 10px;
                border: 1px solid color-mix(in srgb, var(--acu-border) 72%, var(--acu-accent) 28%);
                border-radius: 13px;
                background: color-mix(in srgb, var(--acu-bg-panel) 92%, black 8%);
                box-shadow: 0 14px 34px rgba(0,0,0,0.34), 0 0 0 1px rgba(255,255,255,0.035) inset;
                z-index: 40;
                overflow-x: hidden;
                overflow-y: auto;
                overscroll-behavior: contain;
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-row.is-expanded .acu-global-interaction-details,
            .acu-global-interaction-floating-host .acu-global-interaction-details.is-floating {
                display: flex;
            }
            .acu-global-interaction-floating-host {
                position: fixed;
                inset: 0;
                z-index: 31420;
                pointer-events: none;
                font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
                font-size: 13px;
                line-height: 1.5;
                color: var(--acu-text-main);
            }
            .acu-global-interaction-floating-host,
            .acu-global-interaction-floating-host *:not(i[class*="fa-"]):not(i[class*="ti-"]) {
                box-sizing: border-box;
                -webkit-tap-highlight-color: transparent;
                -webkit-font-smoothing: antialiased;
            }
            .acu-global-interaction-floating-host .acu-global-interaction-details {
                display: none;
                position: absolute;
                top: calc(100% + 6px);
                left: 0;
                flex-direction: column;
                gap: 4px;
                width: max-content;
                min-width: 188px;
                max-width: 260px;
                padding: 10px;
                border: 1px solid color-mix(in srgb, var(--acu-border) 72%, var(--acu-accent) 28%);
                border-radius: 13px;
                background: color-mix(in srgb, var(--acu-bg-panel) 92%, black 8%);
                box-shadow: 0 14px 34px rgba(0,0,0,0.34), 0 0 0 1px rgba(255,255,255,0.035) inset;
                z-index: 31421;
                overflow-x: hidden;
                overflow-y: auto;
                overscroll-behavior: contain;
                pointer-events: auto;
            }
            .acu-global-interaction-floating-host .acu-global-interaction-row-title {
                appearance: none;
                display: block;
                width: 100%;
                min-width: 0;
                max-width: 100%;
                padding: 0 2px 8px;
                border: 0;
                border-bottom: 1px dashed var(--acu-border);
                background: transparent;
                color: var(--acu-text-main);
                font: inherit;
                font-weight: 700;
                font-size: 14px;
                line-height: 1.35;
                text-align: center;
                white-space: normal;
                overflow-wrap: anywhere;
                cursor: pointer;
            }
            .acu-global-interaction-floating-host .acu-global-interaction-row-title:hover,
            .acu-global-interaction-floating-host .acu-global-interaction-row-title:focus-visible {
                color: var(--acu-accent);
                outline: none;
            }
            .acu-global-interaction-floating-host .acu-global-interaction-actions {
                display: flex;
                flex-direction: column;
                gap: 2px;
                justify-content: flex-start;
                min-width: 0;
            }
            .acu-global-interaction-floating-host .acu-global-interaction-action {
                display: inline-flex;
                align-items: center;
                justify-content: flex-start;
                gap: 4px;
                flex: 0 0 auto;
                width: 100%;
                min-width: 0;
                max-width: 100%;
                padding: 7px 9px;
                border: 1px solid transparent;
                border-radius: 8px;
                background: transparent;
                color: var(--acu-text-main);
                font-size: 13px;
                line-height: 1.25;
                text-align: left;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                cursor: pointer;
                transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.15s;
            }
            .acu-global-interaction-floating-host .acu-global-interaction-action:hover {
                background: var(--acu-accent);
                border-color: var(--acu-accent);
                color: var(--acu-btn-active-text, var(--acu-button-text-on-accent, var(--acu-bg-panel)));
                transform: translateX(2px);
            }
            .acu-global-interaction-floating-host .acu-global-interaction-action:focus-visible {
                outline: 2px solid var(--acu-accent);
                outline-offset: 1px;
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-actions {
                display: flex;
                flex-direction: column;
                gap: 2px;
                justify-content: flex-start;
                min-width: 0;
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-action {
                display: inline-flex;
                align-items: center;
                justify-content: flex-start;
                gap: 4px;
                flex: 0 0 auto;
                width: 100%;
                min-width: 0;
                max-width: 100%;
                padding: 7px 9px;
                border: 1px solid transparent;
                border-radius: 8px;
                background: transparent;
                color: var(--acu-text-main);
                font-size: 13px;
                line-height: 1.25;
                text-align: left;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                cursor: pointer;
                transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.15s;
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-action:hover {
                background: var(--acu-accent);
                border-color: var(--acu-accent);
                color: var(--acu-btn-active-text, var(--acu-button-text-on-accent, var(--acu-bg-panel)));
                transform: translateY(-1px);
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-action:focus-visible {
                outline: 2px solid var(--acu-accent);
                outline-offset: 2px;
                border-color: var(--acu-accent);
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-empty,
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-no-results {
                color: var(--acu-text-sub);
                overflow-wrap: anywhere;
            }
            .acu-wrapper.acu-dice-ui-root .acu-global-interaction-no-results[hidden] {
                display: none !important;
            }

            @media (max-width: 768px) {
                .acu-wrapper.acu-dice-ui-root .acu-global-interaction-toolbar {
                    flex-direction: column;
                    align-items: stretch;
                }
                .acu-wrapper.acu-dice-ui-root .acu-global-interaction-grid {
                    gap: 2px;
                }
                .acu-wrapper.acu-dice-ui-root .acu-global-interaction-search-wrapper,
                .acu-wrapper.acu-dice-ui-root input.acu-global-interaction-search {
                    width: 100%;
                    flex-basis: auto;
                }
            }

            /* 导航按钮 */
            .acu-nav-btn.acu-mvu-btn.active {
                background: var(--acu-btn-active-bg);
                color: var(--acu-btn-active-text);
            }
        `;

    // ===== 工具函数 =====
    function escapeHtml(s) {
      return String(s ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function isAvailable() {
      const mode = detectMode();

      if (mode === 'era') {
        // ERA 模式：检查 eventEmit 和 eventOn 是否可用（支持 iframe 环境）
        const eventEmit = window.eventEmit || window.parent?.eventEmit;
        const eventOn = window.eventOn || window.parent?.eventOn;
        const emitAvailable = typeof eventEmit === 'function';
        const onAvailable = typeof eventOn === 'function';
        return emitAvailable && onAvailable;
      } else if (mode === 'lwb') {
        // [新增] LWB 模式：检查 chatMetadata.variables 是否可访问
        const ST = window.SillyTavern || window.parent?.SillyTavern;
        return ST?.chatMetadata !== undefined;
      } else {
        // MVU 模式：检查 MVU 框架是否加载
        const mvuAvailable = typeof window.Mvu !== 'undefined' && typeof window.Mvu.getMvuData === 'function';
        return mvuAvailable;
      }
    }

    function getData() {
      console.warn('[DICE]警告: getData() 是同步函数，可能无法正确获取 MVU 数据。建议使用 getDataWithRetry()');

      clearMvuCacheIfChatChanged();

      // 优先返回缓存（可能来自 ERA 或 MVU）
      if (cachedEraData) {
        return cachedEraData;
      }

      // [新增] 尝试同步获取 LWB
      if (isLwbChatContext()) {
        const lwbData = getLwbData();
        cachedEraData = lwbData;
        cachedEraDataChatId = getCurrentChatIdSafe();
        console.log('[DICE]LWB 数据同步获取成功');
        return lwbData;
      }

      // 尝试同步获取 MVU（可能失败）
      try {
        if (typeof window.Mvu !== 'undefined' && typeof window.Mvu.getMvuData === 'function') {
          const allVars = window.Mvu.getMvuData({ type: 'message', message_id: 'latest' });

          if (allVars && allVars.stat_data) {
            const data = {
              stat_data: allVars.stat_data || null,
              display_data: allVars.display_data || {},
              delta_data: allVars.delta_data || {},
              schema: allVars.schema || null,
              _source: 'mvu', // 标记数据来源
            };

            cachedEraData = data; // 更新缓存
            cachedEraDataChatId = getCurrentChatIdSafe();
            return data;
          }
        }
      } catch (e) {
        console.warn('[DICE]同步获取 MVU 数据失败:', e);
      }

      return null;
    }

    // ===== MVU 专用重试函数 =====
    async function getMvuDataWithRetry(maxRetries = 3, retryDelay = 500) {
      try {
        // [修复] 首先检查 MVU API 是否已经可用，避免不必要的等待
        if (typeof window.Mvu === 'undefined' || typeof window.Mvu.getMvuData !== 'function') {
          // 只有在 MVU 未初始化时才等待，使用较短的超时时间
          try {
            await Promise.race([
              waitGlobalInitialized('Mvu'),
              new Promise((_, reject) => setTimeout(() => reject(new Error('等待 MVU 初始化超时')), 3000)),
            ]);
          } catch (e) {
            console.warn('[DICE]等待 MVU 初始化失败，尝试直接获取:', e.message);
            // 继续尝试，可能 MVU 已经部分可用
          }
        }

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            if (typeof window.Mvu === 'undefined' || typeof window.Mvu.getMvuData !== 'function') {
              throw new Error('MVU API 不可用');
            }

            const allVars = window.Mvu.getMvuData({ type: 'message', message_id: 'latest' });

            if (allVars && allVars.stat_data) {
              const data = {
                stat_data: allVars.stat_data || null,
                display_data: allVars.display_data || {},
                delta_data: allVars.delta_data || {},
                schema: allVars.schema || null,
                _source: 'mvu', // 标记数据来源
              };

              // 为 MVU 也添加缓存
              cachedEraData = data;
              cachedEraDataChatId = getCurrentChatIdSafe();
              console.log('[DICE]MVU 数据获取成功');
              return data;
            }
          } catch (e) {
            console.warn(`[DICE]MVU 数据获取失败 (尝试 ${attempt}/${maxRetries}):`, e);
          }

          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
          }
        }

        return null;
      } catch (e) {
        console.error('[DICE]MVU 初始化失败:', e);
        return null;
      }
    }

    // 支持重试获取数据的函数
    async function getDataWithRetry(maxRetries = 3, retryDelay = 500) {
      try {
        // 使用增强的检测函数
        const detection = await detectModeWithData();

        // 如果检测时已经获取到数据，直接返回
        if (detection.data) {
          cachedEraData = detection.data; // 更新缓存
          cachedEraDataChatId = getCurrentChatIdSafe();
          return detection.data;
        }

        // 否则根据模式进行重试
        const mode = detection.mode;

        if (mode === 'era') {
          // ERA 模式：重试获取
          for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
              const data = await getEraData();
              if (data && data.stat_data) {
                cachedEraData = data;
                cachedEraDataChatId = getCurrentChatIdSafe();
                return data;
              }
            } catch (e) {
              console.warn(`[DICE]ERA 数据获取失败 (尝试 ${attempt}/${maxRetries}):`, e);
            }

            if (attempt < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
          }

          // ERA 失败，尝试降级到 MVU
          console.warn('[DICE]ERA 数据获取失败，尝试降级到 MVU');
          return await getMvuDataWithRetry(maxRetries, retryDelay);
        } else if (mode === 'lwb') {
          // [新增] LWB 模式：重新获取
          const lwbData = getLwbData();
          cachedEraData = lwbData;
          cachedEraDataChatId = getCurrentChatIdSafe();
          return lwbData;
        } else {
          // MVU 模式
          return await getMvuDataWithRetry(maxRetries, retryDelay);
        }
      } catch (e) {
        console.error('[DICE]数据获取失败:', e);
        return null;
      }
    }

    // 判断是否是 ValueWithDescription 格式 [值, "描述"]
    function isVWD(value) {
      return (
        Array.isArray(value) &&
        value.length === 2 &&
        typeof value[1] === 'string' &&
        (typeof value[0] === 'number' || typeof value[0] === 'string' || typeof value[0] === 'boolean')
      );
    }

    // 判断是否是简单数组（元素都是原始值）
    function isSimpleArray(value) {
      if (!Array.isArray(value)) return false;
      return value.every(
        item => typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean' || item === null,
      );
    }

    // 获取变化指示器
    function getChangeIndicator(path, deltaData) {
      if (!deltaData || !path) return '';

      const parts = path.split('.');
      let current = deltaData;
      for (const part of parts) {
        if (current === null || current === undefined) return '';
        current = current[part];
      }

      if (!current) return '';

      if (typeof current === 'string' && current.includes('->')) {
        const match = current.match(/^(-?[\d.]+)->(-?[\d.]+)/);
        if (match) {
          const oldVal = parseFloat(match[1]);
          const newVal = parseFloat(match[2]);
          if (!isNaN(oldVal) && !isNaN(newVal)) {
            return newVal > oldVal ? '↑' : newVal < oldVal ? '↓' : '';
          }
        }
        return '•';
      }
      return '';
    }

    // 统计对象/数组的子项数量
    function countChildren(value) {
      if (Array.isArray(value)) {
        if (isVWD(value)) return 0;
        return value.length;
      }
      if (value && typeof value === 'object') {
        return Object.keys(value).filter(k => !k.startsWith('$')).length;
      }
      return 0;
    }

    // ===== 渲染函数 =====

    // 智能提取数值部分的显示值
    // 处理三种情况：纯数值、数值+描述、数值+范围+描述
    function extractNumericDisplayValue(value, isArray = false) {
      // 处理 null/undefined
      if (value === null || value === undefined) {
        return '';
      }

      // 数组类型：保持原有逻辑
      if (isArray || Array.isArray(value)) {
        if (isVWD(value)) {
          return String(value[0]);
        } else if (isSimpleArray(value)) {
          return value.map(v => String(v ?? '')).join(', ');
        } else {
          // 复杂数组，返回原始表示
          return String(value);
        }
      }

      // 转换为字符串处理
      const str = String(value).trim();

      // 1. 纯数值：匹配纯数字格式（如 "85", "-20", "100%"）
      if (/^-?\d+(\.\d+)?%?$/.test(str)) {
        return str;
      }

      // 2. 数值+范围+描述：匹配 "数值,[范围] 描述" 格式
      // 例如："0,[-20, 120] 对User的好感度。通过积极互动提升..."
      const rangeMatch = str.match(/^(-?\d+(?:\.\d+)?%?)(,\s*\[[^\]]+\])?\s+/);
      if (rangeMatch) {
        // 如果匹配到范围部分，返回数值和范围
        if (rangeMatch[2]) {
          return rangeMatch[1] + rangeMatch[2].trim();
        }
        // 如果没有范围，只返回数值部分
        return rangeMatch[1];
      }

      // 2.5. 数值/数值,描述：匹配 "数值/数值,描述" 格式
      // 例如："100/100,当前/最大生命值，格式为'当前/最大'。归零时你将陷入濒死或死亡状态。"
      const slashNumericMatch = str.match(/^(-?\d+(?:\.\d+)?%?\/-?\d+(?:\.\d+)?%?),/);
      if (slashNumericMatch) {
        return slashNumericMatch[1];
      }

      // 3. 数值,描述：匹配 "数值,描述" 格式（逗号后直接跟描述，没有空格和方括号）
      // 例如："150000,记录当前持有的资金，单位为蓝星币..."
      const commaDescMatch = str.match(/^(-?\d+(?:\.\d+)?%?),/);
      if (commaDescMatch) {
        return commaDescMatch[1];
      }

      // 4. 数值+描述：匹配 "数值 描述" 格式（数值后跟非数字字符）
      // 例如："85 对高坂月的好感度"
      const numericDescMatch = str.match(/^(-?\d+(?:\.\d+)?%?)\s+[^\d]/);
      if (numericDescMatch) {
        return numericDescMatch[1];
      }

      // 5. 其他情况：返回原始值
      return str;
    }

    // 从显示值中提取第一个数值（用于投骰）
    // 例如："85" -> 85, "85,[0,100]" -> 85, "0,[-20, 120]" -> 0
    function extractFirstNumericValue(displayValue) {
      if (!displayValue) return 0;
      const str = String(displayValue).trim();

      // 提取第一个数字（支持负数、小数、百分比）
      const match = str.match(/^(-?\d+(?:\.\d+)?)/);
      if (match) {
        const num = parseFloat(match[1]);
        return isNaN(num) ? 0 : num;
      }

      return 0;
    }

    // 渲染单个键值对行
    function renderRow(key, value, path, deltaData) {
      const changeIndicator = getChangeIndicator(path, deltaData);
      const changedClass = changeIndicator ? 'mvu-changed' : '';

      let displayValue;
      let valueClass = 'mvu-value';

      if (isVWD(value)) {
        displayValue = String(value[0]);
      } else if (isSimpleArray(value)) {
        displayValue = value.map(v => String(v ?? '')).join(', ');
        valueClass += ' mvu-array-value';
      } else {
        // 使用智能提取函数，只显示数值部分
        displayValue = extractNumericDisplayValue(value ?? '', false);
      }

      // [新增] 判断是否为数字或包含数字，如果是则添加骰子图标
      let diceIconHtml = '';
      try {
        // 先使用 extractNumericDisplayValue 提取显示值，然后提取第一个数值
        // 这样可以正确处理 "85,[0,100]" 这样的格式，提取 85 而不是 100
        if (typeof isNumericCell === 'function' && isNumericCell(displayValue)) {
          // 从显示值中提取第一个数值（用于投骰）
          const numericValue = extractFirstNumericValue(displayValue);
          if (numericValue > 0) {
            // 提取属性名：优先使用 key，如果 key 包含路径信息则提取最后一部分
            let attrName = key;
            if (key.includes('.')) {
              const parts = key.split('.');
              attrName = parts[parts.length - 1];
            }
            // 如果路径也包含信息，尝试从路径提取属性名
            if (path && path.includes('.')) {
              const pathParts = path.split('.');
              const lastPart = pathParts[pathParts.length - 1];
              // 如果路径最后一部分看起来像属性名（不是纯数字），使用它
              if (lastPart && !/^\d+$/.test(lastPart) && lastPart !== key) {
                attrName = lastPart;
              }
            }
            if (RenderPresetManager.shouldShowQuickCheck(attrName)) {
              diceIconHtml = `<i class="fa-solid fa-dice-d20 mvu-dice-icon acu-mvu-dice-icon" data-path="${escapeHtml(path)}" data-attr-name="${escapeHtml(attrName)}" data-attr-value="${numericValue}" title="快捷投骰"></i>`;
            }
          }
        }
      } catch (e) {
        console.warn('[DICE]MvuModule renderRow: 判断数字时出错', e);
      }

      return `
                <div class="mvu-row ${changedClass}">
                    <div class="mvu-key">${escapeHtml(key)}</div>
                    <div class="mvu-value-wrap">
                        <span class="${valueClass}" data-path="${escapeHtml(path)}">${escapeHtml(displayValue)}</span>
                        ${diceIconHtml}
                        ${changeIndicator ? `<span class="mvu-change-indicator">${changeIndicator}</span>` : ''}
                    </div>
                </div>
            `;
    }

    // 渲染卡片（递归）
    function renderCard(key, value, path, deltaData, depth, defaultExpanded, isHorizontal) {
      const childCount = countChildren(value);
      const collapsedClass = defaultExpanded ? '' : 'collapsed';

      let bodyHtml = '';
      let hasNestedCards = false; // 标记是否有嵌套卡片
      let nestedCardCount = 0; // 统计嵌套卡片数量（用于计算宽度）
      let rowCount = 0; // 统计键值对数量

      if (Array.isArray(value) && !isVWD(value) && !isSimpleArray(value)) {
        // 复杂数组：每个元素作为子卡片或行
        value.forEach((item, index) => {
          const itemPath = `${path}[${index}]`;

          if (item && typeof item === 'object' && !isVWD(item) && !isSimpleArray(item)) {
            hasNestedCards = true;
            nestedCardCount++;
            bodyHtml += renderCard(`[${index}]`, item, itemPath, deltaData, depth + 1, false, isHorizontal);
          } else {
            rowCount++;
            bodyHtml += renderRow(`[${index}]`, item, itemPath, deltaData);
          }
        });
      } else if (value && typeof value === 'object' && !isVWD(value)) {
        // 对象：遍历键值
        const entries = Object.entries(value).filter(([k]) => !k.startsWith('$'));

        for (const [childKey, childValue] of entries) {
          const childPath = path ? `${path}.${childKey}` : childKey;

          if (childValue && typeof childValue === 'object' && !isVWD(childValue) && !isSimpleArray(childValue)) {
            // 嵌套对象/数组 → 子卡片
            hasNestedCards = true;
            nestedCardCount++;
            bodyHtml += renderCard(childKey, childValue, childPath, deltaData, depth + 1, false, isHorizontal);
          } else {
            // 原始值或简单数组 → 行
            rowCount++;
            bodyHtml += renderRow(childKey, childValue, childPath, deltaData);
          }
        }
      }

      const countText = Array.isArray(value) ? `[${childCount}]` : `(${childCount})`;

      // 如果是横向模式且有嵌套卡片，为 card-body 添加 horizontal-nested 类
      const bodyClass = isHorizontal && hasNestedCards ? 'mvu-card-body horizontal-nested' : 'mvu-card-body';

      // 检查嵌套卡片是否需要更大的宽度（递归检查）
      let nestedCardsNeedWidth = false;
      if (isHorizontal && hasNestedCards && depth === 0) {
        // 对于顶层卡片，检查嵌套卡片内部是否有多个子卡片（需要横向排列）
        if (Array.isArray(value) && !isVWD(value) && !isSimpleArray(value)) {
          // 数组：检查每个嵌套项
          value.forEach(item => {
            if (item && typeof item === 'object' && !isVWD(item) && !isSimpleArray(item)) {
              const itemChildCount = countChildren(item);
              if (itemChildCount >= 2) nestedCardsNeedWidth = true;
            }
          });
        } else if (value && typeof value === 'object' && !isVWD(value)) {
          // 对象：检查每个嵌套键值
          const entries = Object.entries(value).filter(([k]) => !k.startsWith('$'));
          for (const [childKey, childValue] of entries) {
            if (childValue && typeof childValue === 'object' && !isVWD(childValue) && !isSimpleArray(childValue)) {
              const childChildCount = countChildren(childValue);
              if (childChildCount >= 2) nestedCardsNeedWidth = true;
            }
          }
        }
      }

      // 在横向模式下，只有当卡片内部主要是嵌套卡片（键值对很少或没有）时，才添加 has-nested-cards 类
      // 这样可以避免键值对占用过多横向空间
      // 对于顶层卡片（depth === 0）：
      //   - 如果嵌套卡片数量 >= 2 且键值对数量 <= 1，添加 has-nested-cards
      //   - 或者，如果嵌套卡片本身需要更大的宽度（内部有多个子卡片），也添加 has-nested-cards
      // 对于嵌套卡片（depth > 0），只有当只有嵌套卡片（rowCount === 0）且嵌套卡片数量 >= 2 时，才添加 has-nested-cards
      const shouldAddHasNestedClass =
        isHorizontal &&
        hasNestedCards &&
        ((depth === 0 && ((nestedCardCount >= 2 && rowCount <= 1) || nestedCardsNeedWidth)) || // 顶层卡片：嵌套卡片数量 >= 2 且键值对 <= 1，或者嵌套卡片需要更大宽度
          (depth > 0 && rowCount === 0 && nestedCardCount >= 2)); // 嵌套卡片：没有键值对且嵌套卡片数量 >= 2
      const hasNestedClass = shouldAddHasNestedClass ? ' has-nested-cards' : '';

      return `
                <div class="mvu-card${hasNestedClass} ${collapsedClass}" data-path="${escapeHtml(path)}" data-depth="${depth}">
                    <div class="mvu-card-header">
                        <div class="mvu-card-title">
                            <span>${escapeHtml(key)}</span>
                            <span class="mvu-card-count">${countText}</span>
                        </div>
                        <span class="mvu-card-toggle">▼</span>
                    </div>
                    <div class="${bodyClass}">
                        ${bodyHtml}
                    </div>
                </div>
            `;
    }

    // [新增] 渲染数值过滤模式
    function renderNumericMode(mvuData) {
      if (!mvuData || !mvuData.stat_data) {
        return '<div class="mvu-empty"><i class="fa-solid fa-inbox"></i><p>当前没有变量数据</p></div>';
      }

      // [新增] 读取层级显示偏好
      let visibleLevels = {};
      try {
        const saved = localStorage.getItem('acu_mvu_numeric_mode_visible_levels');
        if (saved) {
          visibleLevels = JSON.parse(saved);
        }
      } catch (e) {
        console.warn('[DICE]MvuModule 读取层级显示偏好失败', e);
      }

      // 收集所有数值项
      const numericItems = [];

      // 递归遍历收集数值项
      function collectNumericItems(obj, path, levelNames) {
        if (!obj || typeof obj !== 'object') return;

        if (Array.isArray(obj)) {
          if (isVWD(obj) || isSimpleArray(obj)) {
            // 简单数组，检查每个元素
            obj.forEach((item, index) => {
              const itemPath = path ? `${path}[${index}]` : `[${index}]`;
              const itemValue = String(item ?? '').trim();
              if (typeof isNumericCell === 'function' && isNumericCell(itemValue)) {
                // 先提取显示值，然后提取第一个数值（用于投骰）
                const displayValue = extractNumericDisplayValue(itemValue, false);
                const numValue = extractFirstNumericValue(displayValue);
                if (numValue > 0) {
                  numericItems.push({
                    path: itemPath,
                    key: `[${index}]`,
                    value: itemValue,
                    numericValue: numValue,
                    levelNames: [...levelNames],
                  });
                }
              }
            });
          } else {
            // 复杂数组，递归处理
            obj.forEach((item, index) => {
              const itemPath = path ? `${path}[${index}]` : `[${index}]`;
              const newLevelNames = [...levelNames, `[${index}]`];
              collectNumericItems(item, itemPath, newLevelNames);
            });
          }
        } else {
          // 对象，遍历键值
          const entries = Object.entries(obj).filter(([k]) => !k.startsWith('$'));
          for (const [key, value] of entries) {
            const childPath = path ? `${path}.${key}` : key;
            const newLevelNames = [...levelNames, key];

            if (value && typeof value === 'object' && !isVWD(value) && !isSimpleArray(value)) {
              // 嵌套对象，递归处理
              collectNumericItems(value, childPath, newLevelNames);
            } else {
              // 原始值，检查是否为数字
              const itemValue = String(value ?? '').trim();
              if (typeof isNumericCell === 'function' && isNumericCell(itemValue)) {
                // 先提取显示值，然后提取第一个数值（用于投骰）
                const displayValue = extractNumericDisplayValue(itemValue, false);
                const numValue = extractFirstNumericValue(displayValue);
                if (numValue > 0) {
                  numericItems.push({
                    path: childPath,
                    key: key,
                    value: itemValue,
                    numericValue: numValue,
                    levelNames: newLevelNames,
                  });
                }
              }
            }
          }
        }
      }

      // 收集所有数值项
      const topKeys = Object.keys(mvuData.stat_data).filter(k => !k.startsWith('$'));
      for (const key of topKeys) {
        const value = mvuData.stat_data[key];
        collectNumericItems(value, key, [key]);
      }

      // [新增] 黑名单过滤：检查路径中的所有层级
      const filteredNumericItems = numericItems.filter(item => {
        // 获取所有非数组索引的层级名称
        const nonArrayLevels = item.levelNames.filter(level => level && !level.startsWith('['));
        // 检查路径中的任意层级是否在黑名单中
        // 只要有一个层级匹配黑名单，就过滤掉整个项
        for (const levelKey of nonArrayLevels) {
          if (!RenderPresetManager.shouldShowQuickCheck(levelKey)) {
            return false;
          }
        }
        return true;
      });

      if (filteredNumericItems.length === 0) {
        return '<div class="mvu-empty"><i class="fa-solid fa-filter"></i><p>当前没有数值项</p></div>';
      }

      // 收集所有唯一的层级名称（使用过滤后的列表）
      // 【修复 2】排除最下层的属性名，只收集层级名
      const allLevelNames = new Set();
      filteredNumericItems.forEach(item => {
        // 排除最下层的属性名，只收集层级名
        const hierarchyLevels =
          item.levelNames.length > 1
            ? item.levelNames.slice(0, -1) // 排除最后一个
            : [];

        hierarchyLevels.forEach(level => {
          if (level && !level.startsWith('[')) {
            // 排除数组索引
            allLevelNames.add(level);
          }
        });
      });

      const levelNamesArray = Array.from(allLevelNames).sort();

      // 生成层级 toggle 控制区域（可折叠）
      let levelTogglesHtml = '';
      if (levelNamesArray.length > 0) {
        // 生成层级按钮内容
        let levelButtonsHtml = '';
        levelNamesArray.forEach(levelName => {
          const isVisible = visibleLevels[levelName] !== false; // 默认显示
          const activeClass = isVisible ? 'active' : '';
          levelButtonsHtml += `<button type="button" class="mvu-level-toggle acu-mvu-level-toggle ${activeClass}" data-level="${escapeHtml(levelName)}" data-visible="${isVisible}" aria-pressed="${isVisible ? 'true' : 'false'}" aria-label="${isVisible ? '隐藏' : '显示'}层级: ${escapeHtml(levelName)}" title="${isVisible ? '隐藏' : '显示'}层级: ${escapeHtml(levelName)}"><span>${escapeHtml(levelName)}</span></button>`;
        });

        // 包装为可折叠结构，默认折叠
        levelTogglesHtml = `
          <div class="mvu-level-controls-collapsible collapsed">
            <div class="mvu-level-controls-header acu-mvu-header">
              <span class="acu-mvu-header-text">显示层级</span>
              <i class="fa-solid fa-chevron-down mvu-level-controls-toggle-icon acu-mvu-toggle-icon"></i>
            </div>
            <div class="mvu-level-controls-body acu-mvu-body">
              ${levelButtonsHtml}
            </div>
          </div>
        `;
      }

      // 生成数值项列表（使用过滤后的列表）
      let itemsHtml = '';
      filteredNumericItems.forEach(item => {
        // 计算非数组层级（用于 data-levels 属性）
        const nonArrayLevels = item.levelNames.filter(level => !level.startsWith('['));

        // 根据层级显示偏好过滤显示的层级名称
        const visibleLevels = item.levelNames.filter(level => {
          if (level.startsWith('[')) return false; // 排除数组索引
          try {
            const saved = localStorage.getItem('acu_mvu_numeric_mode_visible_levels');
            if (saved) {
              const prefs = JSON.parse(saved);
              return prefs[level] !== false; // 默认显示
            }
          } catch (e) {
            // 忽略错误，默认显示
          }
          return true;
        });

        // 【修复 1】排除最下层名称，避免与属性名重复
        // 如果 visibleLevels 有多个元素，移除最后一个
        const pathLevels = visibleLevels.length > 1 ? visibleLevels.slice(0, -1) : [];

        // 检查该项的所有层级是否都可见（用于初始显示状态）
        // 注意：这里使用 nonArrayLevels 的前 N-1 个层级（排除最下层）
        const hierarchyLevels = nonArrayLevels.length > 1 ? nonArrayLevels.slice(0, -1) : [];

        const allLevelsVisible = hierarchyLevels.every(level => {
          try {
            const saved = localStorage.getItem('acu_mvu_numeric_mode_visible_levels');
            if (saved) {
              const prefs = JSON.parse(saved);
              return prefs[level] !== false; // 默认显示
            }
          } catch (e) {
            // 忽略错误，默认显示
          }
          return true;
        });

        // 生成路径显示（使用排除最下层后的层级）
        const pathDisplay = pathLevels.length > 0 ? pathLevels.join(' > ') : '';
        const attrName = item.key;

        // 提取属性名（从路径最后一部分）
        let finalAttrName = attrName;
        if (item.path && item.path.includes('.')) {
          const parts = item.path.split('.');
          finalAttrName = parts[parts.length - 1];
        }

        // 生成骰子图标
        const diceIconHtml = RenderPresetManager.shouldShowQuickCheck(finalAttrName)
          ? `<i class="fa-solid fa-dice-d20 mvu-dice-icon acu-mvu-dice-icon" data-path="${escapeHtml(item.path)}" data-attr-name="${escapeHtml(finalAttrName)}" data-attr-value="${item.numericValue}" title="快捷投骰"></i>`
          : '';

        // 使用智能提取函数，只显示数值部分
        let displayValue = extractNumericDisplayValue(item.value, false);
        // 在数值模式下，去掉范围部分（如去掉 ",[0, 100]"）
        displayValue = displayValue.replace(/,\s*\[[^\]]+\]/g, '');

        // 生成初始显示状态和 data-levels 属性
        // 注意：data-levels 存储的是层级名（排除最下层属性名）
        const displayStyle = allLevelsVisible ? '' : 'display:none;';
        const levelsJson = JSON.stringify(hierarchyLevels);

        itemsHtml += `
          <div class="mvu-numeric-item acu-mvu-item" data-levels='${escapeHtml(levelsJson)}' style="${displayStyle}">
            <div class="acu-mvu-item-content">
              <div class="mvu-path-display acu-mvu-path">${escapeHtml(pathDisplay)}</div>
              <div class="acu-mvu-item-row">
                <span class="acu-mvu-attr-name">${escapeHtml(finalAttrName)}</span>
                <span class="mvu-value acu-mvu-val" data-path="${escapeHtml(item.path)}" title="点击编辑">${escapeHtml(displayValue)}</span>
                ${diceIconHtml}
              </div>
            </div>
          </div>
        `;
      });

      return levelTogglesHtml + '<div class="mvu-numeric-items acu-mvu-list">' + itemsHtml + '</div>';
    }

    // ===== 公开 API =====
    return {
      MODULE_ID: MODULE_ID,

      isAvailable: isAvailable,
      getData: getData,
      getDataWithRetry: getDataWithRetry,

      // 诊断工具：检查变量框架状态
      diagnoseVariableFramework: async function () {
        const result = {
          timestamp: new Date().toISOString(),
          era: {
            available: false,
            eventEmit: typeof (window.eventEmit || window.parent?.eventEmit) === 'function',
            eventOn: typeof (window.eventOn || window.parent?.eventOn) === 'function',
            dataAvailable: false,
            error: null,
          },
          mvu: {
            available: false,
            apiExists: typeof window.Mvu !== 'undefined',
            getDataExists: typeof window.Mvu?.getMvuData === 'function',
            dataAvailable: false,
            error: null,
          },
          cache: {
            hasCache: !!cachedEraData,
            cacheKeys: cachedEraData ? Object.keys(cachedEraData) : [],
          },
          recommendation: '',
        };

        // 测试 ERA
        if (result.era.eventEmit && result.era.eventOn) {
          try {
            const eraData = await Promise.race([
              getEraData(),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000)),
            ]);
            result.era.available = true;
            result.era.dataAvailable = !!(eraData && eraData.stat_data);
          } catch (e) {
            result.era.error = e.message;
          }
        }

        // 测试 MVU
        if (result.mvu.apiExists && result.mvu.getDataExists) {
          try {
            // [修复] 使用较短的超时，避免阻塞诊断
            await Promise.race([
              waitGlobalInitialized('Mvu'),
              new Promise((_, reject) => setTimeout(() => reject(new Error('等待超时')), 2000)),
            ]);
            const mvuData = window.Mvu.getMvuData({ type: 'message', message_id: 'latest' });
            result.mvu.available = true;
            result.mvu.dataAvailable = !!(mvuData && mvuData.stat_data);
          } catch (e) {
            result.mvu.error = e.message;
          }
        }

        // 生成建议
        if (result.era.dataAvailable) {
          result.recommendation = 'ERA 框架可用且数据正常';
        } else if (result.mvu.dataAvailable) {
          result.recommendation = 'MVU 框架可用且数据正常';
        } else if (result.era.available || result.mvu.available) {
          result.recommendation = '框架已安装但数据不可用，请检查角色卡是否正确初始化变量';
        } else {
          result.recommendation = '未检测到任何变量框架，请确认已安装 MVU 或 ERA 插件';
        }

        return result;
      },

      injectStyles: function () {
        // 获取主页面的 document（兼容 iframe 环境）
        const targetDoc = window.parent?.document || document;
        if (targetDoc.getElementById('mvu-module-styles')) return;
        const styleEl = targetDoc.createElement('style');
        styleEl.id = 'mvu-module-styles';
        styleEl.textContent = STYLES;
        targetDoc.head.appendChild(styleEl);
      },

      renderNavButton: function (isActive) {
        // 总是显示按钮，不检查 isAvailable()，让用户可以随时尝试查看变量
        const activeClass = isActive ? 'active' : '';
        return `<button class="acu-nav-btn acu-mvu-btn $${activeClass}" id="acu-btn-mvu" data-table="$${MODULE_ID}" style="order:-1;">
                    <i class="fa-solid fa-code-branch"></i><span>变量</span>
                </button>`;
      },

      renderPanel: function () {
        // 简化逻辑：总是显示面板，不依赖复杂的加载状态判断
        // 直接尝试获取数据，如果失败或为空，显示相应的提示信息，但始终显示刷新按钮

        const mvuData = getData();

        // 智能检测当前模式（ERA、MVU 或 LWB）
        const varMode = (mvuData && mvuData._source) || detectMode();

        // [新增] 读取数值模式状态
        let isNumericMode = false;
        try {
          const saved = localStorage.getItem('acu_mvu_numeric_mode');
          isNumericMode = saved === 'true';
        } catch (e) {
          console.warn('[DICE]MvuModule 读取数值模式状态失败', e);
        }

        // MVU面板始终使用竖向滚动模式，不受全局布局配置影响
        const layoutMode = 'vertical-layout';

        // 生成面板标题
        const panelTitle = varMode === 'lwb' ? 'LWB 变量' : varMode === 'era' ? 'ERA 变量' : 'MVU 变量';

        // 如果无法获取数据（MVU 框架未加载或数据为 null）
        if (!mvuData) {
          return `
                        <div class="acu-panel-header">
                            <div class="acu-panel-title">
                                <div class="acu-title-main"><i class="fa-solid fa-code-branch"></i> <span class="acu-title-text">${panelTitle}</span></div>
                                <div class="acu-title-sub">(0项)</div>
                            </div>
                            <div class="acu-header-actions">
                                ${getTutorialButtonHtml('mvu', '查看变量面板教程')}
                                <button type="button" class="mvu-header-btn mvu-btn-refresh" aria-label="刷新变量" title="刷新（自动重试获取变量）">
                                    <i class="fa-solid fa-sync-alt"></i>
                                </button>
                                <div class="acu-height-control">
                                    <i class="fa-solid fa-arrows-up-down acu-height-drag-handle" data-table="${MvuModule.MODULE_ID}" title="↕️ 拖动调整面板高度 | 双击恢复默认"></i>
                                </div>
                                <button type="button" class="acu-close-btn" aria-label="关闭变量面板" title="关闭">
                                    <i class="fa-solid fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <div class="mvu-content ${layoutMode}">
                            <div class="mvu-empty">
                                <i class="fa-solid fa-exclamation-circle"></i>
                                <p>找不到变量框架数据</p>
                                <p class="mvu-empty-hint">会优先读取 ERA、MVU、LWB 变量框架；请点击右上角刷新，或关闭变量面板后重新打开。</p>
                            </div>
                        </div>
                    `;
        }

        // 如果 stat_data 为空或 null，显示空状态（但数据对象存在）
        if (
          !mvuData.stat_data ||
          (typeof mvuData.stat_data === 'object' && Object.keys(mvuData.stat_data).length === 0)
        ) {
          return `
                        <div class="acu-panel-header">
                            <div class="acu-panel-title">
                                <div class="acu-title-main"><i class="fa-solid fa-code-branch"></i> <span class="acu-title-text">${panelTitle}</span></div>
                                <div class="acu-title-sub">(0项)</div>
                            </div>
                            <div class="acu-header-actions">
                                ${getTutorialButtonHtml('mvu', '查看变量面板教程')}
                                <button type="button" class="mvu-header-btn mvu-btn-refresh" aria-label="刷新变量" title="刷新（自动重试获取变量）">
                                    <i class="fa-solid fa-sync-alt"></i>
                                </button>
                                <div class="acu-height-control">
                                    <i class="fa-solid fa-arrows-up-down acu-height-drag-handle" data-table="${MvuModule.MODULE_ID}" title="↕️ 拖动调整面板高度 | 双击恢复默认"></i>
                                </div>
                                <button type="button" class="acu-close-btn" aria-label="关闭变量面板" title="关闭">
                                    <i class="fa-solid fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <div class="mvu-content ${layoutMode}">
                            <div class="mvu-empty">
                                <i class="fa-solid fa-inbox"></i>
                                <p>当前没有变量数据</p>
                                <p class="mvu-empty-hint">${varMode === 'lwb' ? '当前没有变量数据，变量将在 AI 通过 plot-log 输出后显示' : '变量数据将在 AI 回复后自动初始化，或点击刷新按钮自动重试获取变量'}</p>
                            </div>
                        </div>
                    `;
        }

        // [新增] 如果启用数值模式，使用专门的渲染函数
        if (isNumericMode) {
          const numericHtml = renderNumericMode(mvuData);
          return `
                    <div class="acu-panel-header">
                        <div class="acu-panel-title">
                            <div class="acu-title-main"><i class="fa-solid fa-code-branch"></i> <span class="acu-title-text">${panelTitle}</span> <span style="font-size:calc(var(--acu-font-size,13px) * 0.85);color:var(--acu-text-sub);margin-left:6px;">(数值模式)</span></div>
                            <div class="acu-title-sub">(数值过滤)</div>
                        </div>
                        <div class="acu-header-actions">
                            ${getTutorialButtonHtml('mvu', '查看变量面板教程')}
                            <button type="button" class="mvu-header-btn mvu-btn-numeric-mode active" aria-label="切换到普通模式" aria-pressed="true" title="切换到普通模式">
                                <i class="fa-solid fa-list"></i>
                            </button>
                            <button type="button" class="mvu-header-btn mvu-btn-refresh" aria-label="刷新变量" title="刷新（自动重试获取变量）">
                                <i class="fa-solid fa-sync-alt"></i>
                            </button>
                            <div class="acu-height-control">
                                <i class="fa-solid fa-arrows-up-down acu-height-drag-handle" data-table="${MvuModule.MODULE_ID}" title="↕️ 拖动调整面板高度 | 双击恢复默认"></i>
                            </div>
                            <button type="button" class="acu-close-btn" aria-label="关闭变量面板" title="关闭">
                                <i class="fa-solid fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div class="mvu-content ${layoutMode} mvu-numeric-mode">
                        ${numericHtml}
                    </div>
                `;
        }

        // 有数据，正常显示
        const topKeys = Object.keys(mvuData.stat_data).filter(k => !k.startsWith('$'));

        let cardsHtml = '';
        for (const key of topKeys) {
          const value = mvuData.stat_data[key];
          const childCount = countChildren(value);

          if (value && typeof value === 'object' && !isVWD(value) && !isSimpleArray(value)) {
            // 对象/复杂数组 → 卡片（顶层默认展开）
            // MVU面板始终使用竖向滚动，所以 isHorizontal 始终为 false
            cardsHtml += renderCard(key, value, key, mvuData.delta_data, 0, true, false);
          } else {
            // 原始值或简单数组 → 单独一个迷你卡片
            cardsHtml += `
                            <div class="mvu-card" data-path="${escapeHtml(key)}" data-depth="0">
                                <div class="mvu-card-body">
                                    ${renderRow(key, value, key, mvuData.delta_data)}
                                </div>
                            </div>
                        `;
          }
        }

        return `
                    <div class="acu-panel-header">
                        <div class="acu-panel-title">
                            <div class="acu-title-main"><i class="fa-solid fa-code-branch"></i> <span class="acu-title-text">${panelTitle}</span></div>
                            <div class="acu-title-sub">(${topKeys.length}项)</div>
                        </div>
                        <div class="acu-header-actions">
                            ${getTutorialButtonHtml('mvu', '查看变量面板教程')}
                            <button type="button" class="mvu-header-btn mvu-btn-numeric-mode" aria-label="切换到数值模式" aria-pressed="false" title="切换到数值模式（仅显示数值项）">
                                <i class="fa-solid fa-filter"></i>
                            </button>
                            <button type="button" class="mvu-header-btn mvu-btn-refresh" aria-label="刷新变量" title="刷新（自动重试获取变量）">
                                <i class="fa-solid fa-sync-alt"></i>
                            </button>
                            <div class="acu-height-control">
                                <i class="fa-solid fa-arrows-up-down acu-height-drag-handle" data-table="${MvuModule.MODULE_ID}" title="↕️ 拖动调整面板高度 | 双击恢复默认"></i>
                            </div>
                            <button type="button" class="acu-close-btn" aria-label="关闭变量面板" title="关闭">
                                <i class="fa-solid fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div class="mvu-content ${layoutMode}">
                        ${cardsHtml}
                    </div>
                `;
      },

      bindEvents: function ($container) {
        // 使用主页面的 jQuery
        const $ = window.parent?.jQuery || window.jQuery;
        if (!$ || !$container || !$container.length) {
          console.warn('[DICE]MvuModule bindEvents: jQuery or container not available');
          return;
        }

        // 优先使用调用者传入的当前面板，避免多根渲染时绑定到旧面板。
        const $panel = $container && $container.length ? $container : $('#acu-data-area');
        if (!$panel.length) {
          console.warn('[DICE]MvuModule bindEvents: #acu-data-area not found');
          return;
        }

        // 解绑旧事件
        $panel.off('.mvu');

        // 卡片折叠/展开（改进版，添加平滑动画）
        $panel.on('click.mvu', '.mvu-card-header', function (e) {
          e.stopPropagation();
          const $card = $(this).closest('.mvu-card');
          const $body = $card.find('> .mvu-card-body').first();

          // 防止动画过程中重复点击
          if ($body.is(':animated') || $body.hasClass('animating')) return;

          if ($card.hasClass('collapsed')) {
            // 展开：先用 hide() 确保元素隐藏，移除 collapsed 类后再播放动画
            $body.hide();
            $card.removeClass('collapsed');
            $body.addClass('animating').slideDown(180, function () {
              $(this).removeClass('animating');
            });
          } else {
            // 收起
            $body.addClass('animating').slideUp(180, function () {
              $card.addClass('collapsed');
              $(this).removeClass('animating');
            });
          }
        });

        // 刷新按钮
        $panel.on('click.mvu', '.mvu-btn-refresh', function (e) {
          e.stopPropagation();
          MvuModule.refresh($panel);
        });

        // [新增] 数值模式切换按钮
        $panel.on('click.mvu', '.mvu-btn-numeric-mode', function (e) {
          e.stopPropagation();
          try {
            const isCurrentlyNumeric = $(this).hasClass('active');
            const newMode = !isCurrentlyNumeric;
            localStorage.setItem('acu_mvu_numeric_mode', String(newMode));
            // 刷新面板
            if (typeof saveActiveTabState === 'function') {
              const currentTab = getActiveTabState();
              saveActiveTabState(currentTab);
            }
            if (typeof renderInterface === 'function') {
              renderInterface();
            }
          } catch (e) {
            console.warn('[DICE]MvuModule 切换数值模式失败', e);
            if (window.toastr)
              showActionableErrorToast('切换 MVU 数值模式失败，偏好可能没有写入 localStorage。', {
                developerHint: true,
              });
          }
        });

        // [新增] 层级控制折叠/展开
        $panel.on('click.mvu', '.mvu-level-controls-header', function (e) {
          e.stopPropagation();
          const $header = $(this);
          const $collapsible = $header.closest('.mvu-level-controls-collapsible');

          // 切换 collapsed 类，CSS 会自动处理动画
          $collapsible.toggleClass('collapsed');
        });

        // [新增] 层级显示 toggle
        $panel.on('click.mvu', '.mvu-level-toggle', function (e) {
          e.stopPropagation();
          const $button = $(this);
          const levelName = $button.data('level');
          const currentVisible = $button.data('visible') === 'true' || $button.data('visible') === true;
          const isVisible = !currentVisible;

          try {
            const saved = localStorage.getItem('acu_mvu_numeric_mode_visible_levels');
            const visibleLevels = saved ? JSON.parse(saved) : {};
            visibleLevels[levelName] = isVisible;
            localStorage.setItem('acu_mvu_numeric_mode_visible_levels', JSON.stringify(visibleLevels));

            // 更新按钮样式和状态
            $button.data('visible', isVisible);
            $button.attr('data-visible', String(isVisible));
            if (isVisible) {
              $button.addClass('active');
              $button.css({
                background: 'var(--acu-accent)',
                color: 'var(--acu-btn-active-text)',
                borderColor: 'var(--acu-accent)',
                opacity: '1',
              });
              $button.attr('title', `隐藏层级: ${levelName}`);
              $button.attr('aria-pressed', 'true');
              $button.attr('aria-label', `隐藏层级: ${levelName}`);
            } else {
              $button.removeClass('active');
              $button.css({
                background: 'transparent',
                color: 'var(--acu-text-sub)',
                borderColor: 'var(--acu-border)',
                opacity: '0.5',
              });
              $button.attr('title', `显示层级: ${levelName}`);
              $button.attr('aria-pressed', 'false');
              $button.attr('aria-label', `显示层级: ${levelName}`);
            }

            // 【修复 3】局部更新路径显示，而不是全量重渲染
            $('.mvu-numeric-item').each(function () {
              const $item = $(this);
              try {
                const levels = JSON.parse($item.attr('data-levels') || '[]');
                if (levels.includes(levelName)) {
                  // 重新计算路径显示
                  const visibleLevels = levels.filter(level => {
                    const saved = localStorage.getItem('acu_mvu_numeric_mode_visible_levels');
                    const prefs = saved ? JSON.parse(saved) : {};
                    return prefs[level] !== false;
                  });

                  // 排除最下层，避免重复（这里 levels 已经是排除了最下层的）
                  const pathLevels = visibleLevels;

                  const newPathDisplay = pathLevels.length > 0 ? pathLevels.join(' > ') : '';

                  // 更新路径显示文本
                  $item.find('.mvu-path-display').text(newPathDisplay);
                }
              } catch (e) {
                console.warn('[DICE]MvuModule 更新路径显示失败', e);
              }
            });
          } catch (e) {
            console.warn('[DICE]MvuModule 更新层级显示偏好失败', e);
          }
        });

        // 点击值编辑
        $panel.on('click.mvu', '.mvu-value', function (e) {
          e.stopPropagation();
          const $value = $(this);
          const path = $value.data('path');
          if (!path) {
            console.warn('[DICE]MvuModule No path on value element');
            return;
          }
          const currentValue = $value
            .text()
            .replace(/\s*\$\s*$/, '')
            .trim(); // 移除末尾的 $

          MvuModule.showEditDialog(path, currentValue, async function (newValue) {
            if (newValue !== null && newValue !== currentValue) {
              const success = await MvuModule.setValue(path, newValue);
              const toastr = window.parent?.toastr || window.toastr;
              if (success) {
                $value.text(newValue);
                $value.css('background', 'var(--acu-success-bg)');
                setTimeout(() => $value.css('background', ''), 1500);
              } else {
                if (toastr)
                  showActionableErrorToast(`保存变量「${path}」失败。`, {
                    suggestion: '请刷新变量面板确认当前角色数据仍可写入；如果仍失败，请打开 Debug 控制台查看 MVU 写入日志。',
                  });
              }
            }
          });
        });

        // [新增] 点击骰子图标快捷投骰
        $panel.on('click.mvu', '.mvu-dice-icon', function (e) {
          e.stopPropagation();
          e.preventDefault();
          const $icon = $(this);
          const path = $icon.data('path');
          const attrName = $icon.data('attr-name') || '属性';
          const attrValue = parseInt($icon.data('attr-value'), 10) || 50;

          // 验证路径有效性
          if (!path) {
            console.warn('[DICE]MvuModule 骰子图标缺少路径信息');
            return;
          }

          // 检查 MVU 框架是否可用
          if (typeof window.Mvu === 'undefined' || typeof window.Mvu.getMvuData !== 'function') {
            console.warn('[DICE]MvuModule MVU 框架未加载，降级为普通投骰');
            // 降级为普通投骰，不解析路径
            if (typeof showDicePanel === 'function') {
              showDicePanel({
                attrValue: attrValue,
                targetValue: null, // 让showDicePanel根据模式自动计算
                targetName: attrName,
                initiatorName: '<user>',
                fromMvu: false,
              });
            }
            return;
          }

          // 尝试从路径解析发起者和属性名
          let parsedInfo = null;
          try {
            parsedInfo = parseMvuPathForDice(path, attrValue);
          } catch (e) {
            console.warn('[DICE]MvuModule 解析路径时出错', e);
          }

          // 调用投骰面板
          if (typeof showDicePanel === 'function') {
            showDicePanel({
              attrValue: attrValue,
              targetValue: null, // 让showDicePanel根据模式自动计算
              targetName: attrName,
              initiatorName: parsedInfo?.initiator || '<user>',
              fromMvu: true,
              mvuPath: path,
              mvuParsedInfo: parsedInfo,
            });
          }
        });

        // 阻止水平滑动冒泡，防止触发 ST 的 swipe regenerate
        (function () {
          // 使用主页面的 document（iframe 环境）
          const targetDoc = window.parent?.document || document;
          const $doc = $(targetDoc);

          // 先解绑旧事件，避免重复绑定
          $doc.off('touchstart.mvuSwipeFix touchmove.mvuSwipeFix touchend.mvuSwipeFix', '#acu-data-area');

          let touchStartX = 0;
          let touchStartY = 0;
          let isHorizontalSwipe = false;

          // 在 #acu-data-area 上处理，但检查是否是 MVU 面板
          $doc.on('touchstart.mvuSwipeFix', '#acu-data-area', function (e) {
            const $target = $(e.target);
            const isInMvuPanel = $target.closest('.acu-mvu-panel').length > 0;

            // 检查是否在 MVU 面板内
            if (!isInMvuPanel) return;

            if (e.originalEvent.touches.length === 1) {
              touchStartX = e.originalEvent.touches[0].clientX;
              touchStartY = e.originalEvent.touches[0].clientY;
              isHorizontalSwipe = false;
            }
          });

          $doc.on('touchmove.mvuSwipeFix', '#acu-data-area', function (e) {
            const $target = $(e.target);
            const isInMvuPanel = $target.closest('.acu-mvu-panel').length > 0;

            // 检查是否在 MVU 面板内
            if (!isInMvuPanel) {
              return;
            }

            if (e.originalEvent.touches.length !== 1) return;

            const touch = e.originalEvent.touches[0];
            const deltaX = Math.abs(touch.clientX - touchStartX);
            const deltaY = Math.abs(touch.clientY - touchStartY);

            // 如果是水平滑动为主（X位移 > Y位移 * 1.5），阻止冒泡和默认行为
            // 修改判断逻辑：当deltaY很小时，降低deltaX阈值；否则使用原来的判断
            const isHorizontal =
              deltaY < 5
                ? deltaX > 5 && deltaX > deltaY * 2 // deltaY很小时，只要deltaX > 5且明显大于deltaY就认为是水平滑动
                : deltaX > deltaY * 1.5 && deltaX > 10; // 正常情况使用原判断

            if (isHorizontal) {
              isHorizontalSwipe = true;
              e.stopImmediatePropagation();
              e.stopPropagation();
            }
          });

          $doc.on('touchend.mvuSwipeFix', '#acu-data-area', function (e) {
            const $target = $(e.target);
            const isInMvuPanel = $target.closest('.acu-mvu-panel').length > 0;

            // 检查是否在 MVU 面板内
            if (!isInMvuPanel) {
              isHorizontalSwipe = false;
              touchStartX = 0;
              touchStartY = 0;
              return;
            }

            // 如果是水平滑动，阻止冒泡和默认行为
            if (isHorizontalSwipe) {
              e.stopImmediatePropagation();
              e.stopPropagation();
              isHorizontalSwipe = false;
            }
            touchStartX = 0;
            touchStartY = 0;
          });

          // 尝试在捕获阶段也监听
          const captureHandlerTouchStart = function (e) {
            const $target = $(e.target);
            const isInMvuPanel = $target.closest('.acu-mvu-panel').length > 0;
            if (isInMvuPanel && e.touches && e.touches.length === 1) {
              touchStartX = e.touches[0].clientX;
              touchStartY = e.touches[0].clientY;
            }
          };
          const captureHandlerTouchMove = function (e) {
            const $target = $(e.target);
            const isInMvuPanel = $target.closest('.acu-mvu-panel').length > 0;
            if (isInMvuPanel && e.touches && e.touches.length === 1 && touchStartX && touchStartY) {
              const touch = e.touches[0];
              const deltaX = Math.abs(touch.clientX - touchStartX);
              const deltaY = Math.abs(touch.clientY - touchStartY);
              // 使用与冒泡阶段相同的判断逻辑
              const isHorizontal =
                deltaY < 5 ? deltaX > 5 && deltaX > deltaY * 2 : deltaX > deltaY * 1.5 && deltaX > 10;
              if (isHorizontal) {
                e.stopImmediatePropagation();
                e.stopPropagation();
                e.preventDefault();
              }
            }
          };
          const captureHandlerTouchEnd = function (e) {
            const $target = $(e.target);
            const isInMvuPanel = $target.closest('.acu-mvu-panel').length > 0;
            if (isInMvuPanel && isHorizontalSwipe) {
              e.stopImmediatePropagation();
              e.stopPropagation();
              e.preventDefault();
            }
          };
          // 在捕获阶段也监听
          targetDoc.addEventListener('touchstart', captureHandlerTouchStart, true);
          targetDoc.addEventListener('touchmove', captureHandlerTouchMove, true);
          targetDoc.addEventListener('touchend', captureHandlerTouchEnd, true);
        })();

        // 关闭按钮
        $panel.on('click.mvu', '.acu-close-btn', function (e) {
          e.stopPropagation();
          const $input = $panel.find('.acu-search-input');

          // 如果搜索框有内容，清空搜索框
          if ($input.length && $input.val()) {
            $input.val('').trigger('input').focus();
            return;
          }

          // 变量面板状态：关闭变量面板，重新渲染到默认状态
          if (typeof saveActiveTabState === 'function') {
            saveActiveTabState(null);
          }
          if (typeof renderInterface === 'function') {
            renderInterface();
          }
        });

        // 高度拖拽
        $panel.on('pointerdown.mvu', '.acu-height-drag-handle', function (e) {
          if (e.button !== 0) return;
          e.preventDefault();
          e.stopPropagation();
          const handle = this;
          handle.setPointerCapture(e.pointerId);
          $(handle).add($(handle).closest('.acu-height-control')).addClass('active');
          const startHeight = getPanelDragStartHeight($panel);
          let requestedHeight = startHeight;
          const startY = e.clientY;
          const tableName = $(handle).data('table');

          handle.onpointermove = function (moveE) {
            const dy = moveE.clientY - startY;
            requestedHeight = setPanelRequestedHeight($panel, startHeight - dy) || requestedHeight;
          };
          handle.onpointerup = function (upE) {
            $(handle).add($(handle).closest('.acu-height-control')).removeClass('active');
            handle.releasePointerCapture(upE.pointerId);
            handle.onpointermove = null;
            handle.onpointerup = null;
            if (tableName && typeof getTableHeights === 'function' && typeof saveTableHeights === 'function') {
              savePanelRequestedHeight(tableName, requestedHeight);
            }
          };
        });

        // 双击重置高度
        $panel.on('dblclick.mvu', '.acu-height-drag-handle', function (e) {
          e.preventDefault();
          e.stopPropagation();
          const tableName = $(this).data('table');
          if (tableName && typeof getTableHeights === 'function' && typeof saveTableHeights === 'function') {
            resetPanelRequestedHeight($panel, tableName);
          }
        });

        // 双击头部任意位置也可重置高度
        $panel.on('dblclick.mvu', '.acu-panel-header', function (e) {
          if ($(e.target).closest('.acu-search-input, .acu-close-btn, .mvu-header-btn').length) return;
          e.preventDefault();
          e.stopPropagation();
          const tableName = MvuModule.MODULE_ID;
          if (tableName && typeof getTableHeights === 'function' && typeof saveTableHeights === 'function') {
            resetPanelRequestedHeight($panel, tableName);
          }
        });
      },

      showEditDialog: function (path, currentValue, onSave) {
        // 使用主页面的 jQuery 和 document
        const $ = window.parent?.jQuery || window.jQuery;
        const targetDoc = window.parent?.document || document;
        if (!$) return;

        // 移除已有弹窗
        $(targetDoc).find('.mvu-edit-overlay').remove();

        const currentTheme = (typeof getConfig === 'function' ? getConfig().theme : null) || 'retro';

        const html = `
                    <div class="mvu-edit-overlay acu-edit-overlay acu-theme-${currentTheme}">
                        <div class="mvu-edit-dialog acu-edit-dialog">
                            <div class="acu-edit-title">
                                <i class="fa-solid fa-edit acu-edit-icon-muted"></i>
                                <span>编辑变量</span>
                            </div>
                            <div class="mvu-edit-path">${escapeHtml(path)}</div>
                            <textarea class="mvu-edit-textarea acu-edit-textarea">${escapeHtml(currentValue)}</textarea>
                            <div class="mvu-edit-hint">Ctrl+Enter 保存 | Esc 取消</div>
                            <div class="acu-dialog-btns">
                                <button type="button" class="acu-dialog-btn mvu-btn-cancel">
                                    <i class="fa-solid fa-times"></i> 取消
                                </button>
                                <button type="button" class="acu-dialog-btn acu-btn-confirm mvu-btn-save">
                                    <i class="fa-solid fa-check"></i> 保存
                                </button>
                            </div>
                        </div>
                    </div>
                `;

        $(targetDoc.body).append(html);
        const $overlay = $(targetDoc).find('.mvu-edit-overlay');
        const $input = $overlay.find('.mvu-edit-textarea');

        setTimeout(() => $input.focus().select(), 50);

        // 取消按钮
        $overlay.on('click', '.mvu-btn-cancel', function (e) {
          e.preventDefault();
          e.stopPropagation();
          $overlay.remove();
          onSave(null);
        });

        // 保存按钮
        $overlay.on('click', '.mvu-btn-save', function (e) {
          e.preventDefault();
          e.stopPropagation();
          const newValue = $input.val();
          $overlay.remove();
          onSave(newValue);
        });

        // 点击遮罩关闭
        setupOverlayClose($overlay, 'mvu-edit-overlay', () => {
          $overlay.remove();
          onSave(null);
        });

        // 键盘快捷键
        $input.on('keydown', function (e) {
          if (e.key === 'Escape') {
            e.preventDefault();
            $overlay.remove();
            onSave(null);
          } else if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            const newValue = $input.val();
            $overlay.remove();
            onSave(newValue);
          }
        });
      },

      // ===== LWB 路径解析和写入函数 =====
      // 解析路径，支持 "根变量.子路径" 和 "根变量[0].子路径" 格式
      parsePath: function (path: string): { rootName: string; subPath: string } {
        const match = path.match(/^([^.\[]+)/);
        const rootName = match ? match[1] : path;

        let subPath = path.slice(rootName.length);
        if (subPath.startsWith('.')) subPath = subPath.slice(1);

        return { rootName, subPath };
      },

      // LWB 变量写入函数
      setLwbValue: function (path: string, value: unknown) {
        try {
          const ST = window.SillyTavern || window.parent?.SillyTavern;
          if (!ST?.chatMetadata) {
            console.error('[DICE]无法访问 chatMetadata');
            return;
          }

          if (!ST.chatMetadata.variables) {
            ST.chatMetadata.variables = {};
          }

          const { rootName, subPath } = this.parsePath(path);

          if (!subPath) {
            // 直接设置根变量
            ST.chatMetadata.variables[rootName] =
              typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value ?? '');
          } else {
            // 设置嵌套路径
            const currentRaw = ST.chatMetadata.variables[rootName];
            let current = parseJsonSafe(currentRaw);

            if (typeof current !== 'object' || current === null) {
              current = {};
            }

            // lodash _.set 原生支持 "a[0].b" 格式
            _.set(current as object, subPath, value);

            ST.chatMetadata.variables[rootName] = JSON.stringify(current);
          }

          // 保存元数据
          ST.saveMetadata?.();

          // 刷新缓存
          cachedEraData = null;
          cachedEraDataChatId = null;

          console.log('[DICE]LWB 变量已更新:', path, '=', value);
        } catch (e) {
          console.error('[DICE]LWB 变量写入失败:', e);
        }
      },

      setValue: async function (path, newValue) {
        if (!isAvailable()) return false;

        const mode = detectMode();

        try {
          let parsedValue = newValue;
          if (newValue === 'true') parsedValue = true;
          else if (newValue === 'false') parsedValue = false;
          else if (!isNaN(Number(newValue)) && String(newValue).trim() !== '') {
            parsedValue = Number(newValue);
          }

          if (mode === 'era') {
            return await setEraValue(path, parsedValue);
          } else if (mode === 'lwb') {
            // [新增] LWB 模式：写入到 chatMetadata.variables
            this.setLwbValue(path, parsedValue);
            return true;
          } else {
            const mvuData = window.Mvu.getMvuData({ type: 'message', message_id: 'latest' });
            if (!mvuData) {
              console.error('[DICE]MvuModule 无法获取 MVU 数据');
              return false;
            }

            const success = await window.Mvu.setMvuVariable(mvuData, path, parsedValue, {
              reason: '手动编辑',
              is_recursive: false,
            });

            if (success) {
              await window.Mvu.replaceMvuData(mvuData, { type: 'message', message_id: 'latest' });
            } else {
              console.warn('[DICE]MvuModule setMvuVariable 返回 false');
            }

            return success;
          }
        } catch (e) {
          console.error('[DICE]MvuModule setValue error:', e);
          return false;
        }
      },

      isModuleTab: function (tableName) {
        return tableName === MODULE_ID;
      },

      // 清除 ERA 缓存（当 ERA 变量更新时调用）
      clearCache: function () {
        cachedEraData = null;
        cachedEraDataChatId = null;
        console.log('[DICE]MvuModule 已清除 ERA 缓存');
      },

      // 检测当前使用的变量框架模式
      detectMode: function () {
        return detectMode();
      },

      refresh: function ($container) {
        // 清除缓存，强制重新获取数据
        this.clearCache();

        if (!$container || !$container.length) {
          const $panel = $('#acu-data-area');
          if (!$panel.length) return;
          $container = $panel;
        }
        // 显示加载状态（带刷新动画）
        const $refreshBtn = $container.find('.mvu-btn-refresh');
        if ($refreshBtn.length) {
          $refreshBtn.find('i').addClass('fa-spin');
        }

        // 使用重试机制获取最新变量数据（增加重试次数和延迟，让用户可以反复尝试）
        // 最多重试 10 次，每次延迟 1 秒，总共最多等待 10 秒
        this.getDataWithRetry(10, 1000)
          .then(mvuData => {
            // 移除加载动画
            if ($refreshBtn.length) {
              $refreshBtn.find('i').removeClass('fa-spin');
            }

            // [修复] 如果用户已切走到其它面板，不要用异步回调覆盖当前内容
            if (!canWriteMvuPanel()) return;

            // 无论成功失败，都重新渲染面板（简化后的 renderPanel 会处理所有状态）
            $container.html('<div class="acu-mvu-panel">' + this.renderPanel() + '</div>');
            this.bindEvents($container);

            // [修复] 使用 toastr 提示结果：检查 renderPanel 实际使用的数据（缓存）
            // 而不是仅依赖 getDataWithRetry 的返回值
            const toastr = window.parent?.toastr || window.toastr;
            const actualData = this.getData();
            if (toastr && !actualData) {
              toastr.warning('找不到变量框架数据，请点击右上角刷新，或关闭变量面板后重新打开');
            }
          })
          .catch(err => {
            console.error('[DICE]MvuModule Error refreshing data:', err);

            // 移除加载动画
            if ($refreshBtn.length) {
              $refreshBtn.find('i').removeClass('fa-spin');
            }

            // [修复] 如果用户已切走到其它面板，不要用异步回调覆盖当前内容
            if (!canWriteMvuPanel()) return;

            // 显示错误状态（简化后的 renderPanel 会处理）
            $container.html('<div class="acu-mvu-panel">' + this.renderPanel() + '</div>');
            this.bindEvents($container);

            // [修复] 只有当实际没有数据时才显示错误
            const toastr = window.parent?.toastr || window.toastr;
            const actualData = this.getData();
            if (toastr && !actualData) {
              showActionableErrorToast('获取变量数据时出错，变量面板无法读取当前 MVU 数据。', {
                suggestion: '请点击右上角刷新，或关闭变量面板后重新打开；如果仍为空，请检查角色卡变量框架是否已加载。',
              });
            }
          });
      },
    };
  })();
  // MVU 变量可视化模块结束
  // 默认骰子配置（COC规则）
  const DEFAULT_DICE_CONFIG = {
    critSuccessMax: 5,
    hardSuccessDiv: 5,
    difficultSuccessDiv: 2,
    critFailMin: 96,
    ruleType: 'high_good',
    lastDiceType: '1d100',
    // DND 专用配置
    dndCritSuccess: 20,
    dndCritFail: 1,
    // 对抗平手规则: initiator_lose | tie | initiator_win
    contestTieRule: 'initiator_lose',
    // 多次投骰时覆盖上一次检定结果；关闭后追加到旧结果后面
    overwriteLastDiceResult: true,
    // 隐藏输入栏中的检定结果
    hideDiceResultFromUser: false,
    // 隐藏聊天记录中的检定结果
    hideDiceResultInChat: false,
    autoMergeProtagonist: true,
  };

  const getDiceConfig = () => Store.get(STORAGE_KEY_DICE_CONFIG, DEFAULT_DICE_CONFIG);
  const saveDiceConfig = cfg => {
    const oldCfg = getDiceConfig();
    const newCfg = { ...oldCfg, ...cfg };
    Store.set(STORAGE_KEY_DICE_CONFIG, newCfg);
    // 记录配置变更
    const changedKeys = Object.keys(cfg).filter(k => oldCfg[k] !== newCfg[k]);
    if (changedKeys.length > 0) {
      console.info(`[DICE]投骰配置已更新: ${changedKeys.join(', ')}`);
    }
  };

  // [新增] 隐藏用户消息中的投骰结果（也处理输入栏）
  const hideDiceResultsInUserMessages = () => {
    try {
      const diceCfg = getDiceConfig();
      const hideInput = diceCfg.hideDiceResultFromUser !== undefined ? diceCfg.hideDiceResultFromUser : false;
      const hideChat = diceCfg.hideDiceResultInChat !== undefined ? diceCfg.hideDiceResultInChat : false;

      // 统一检定结果标签正则（匹配 <meta:检定结果>...</meta:检定结果>）
      const metaCheckResultRegex = /<meta:检定结果>[\s\S]*?<\/meta:检定结果>/g;

      // ========== 第一部分：处理输入栏（由 hideInput 控制） ==========
      try {
        const $ta = $('#send_textarea');
        if ($ta.length) {
          const textarea = $ta[0] as AcuDiceTextareaElement;
          const visibleTextareaVal = readTextareaVisibleValue(textarea);
          let textareaVal = syncTextareaDiceCacheFromVisibleText(textarea, visibleTextareaVal);
          let modifiedText = textareaVal;

          if (hideInput) {
            // 隐藏模式：替换为占位符
            if (metaCheckResultRegex.test(modifiedText)) {
              storeTextareaDiceCache(textarea, modifiedText);
              modifiedText = modifiedText.replace(createMetaCheckResultRegex(), DICE_RESULT_PLACEHOLDER);
            }
          } else {
            // 显示模式：如果有保存的原始文本，恢复它
            if (visibleTextareaVal.includes(DICE_RESULT_PLACEHOLDER)) {
              modifiedText = textareaVal;
              clearTextareaDiceCache(textarea);
            }
          }

          if (modifiedText !== visibleTextareaVal) {
            setTextareaValueAndNotify($ta[0] as HTMLTextAreaElement, modifiedText);
          }
        }
      } catch (e) {
        console.warn('[DICE]ACU 处理输入栏投骰结果失败:', e);
      }

      // ========== 第二部分：处理聊天记录（由 hideChat 控制，独立于输入栏） ==========
      // 先检查聊天是否已加载，避免在首次启动时显示不必要的错误
      let lastMessageId;
      try {
        lastMessageId = getLastMessageId();
      } catch (e) {
        // 如果获取 lastMessageId 失败，说明聊天未加载，静默返回
        return;
      }

      // 如果聊天未加载或没有消息，直接返回，不显示错误
      if (lastMessageId < 0) {
        return;
      }

      try {
        const userMessages = getChatMessages(`0-${lastMessageId}`, { role: 'user' });
        // 如果没有用户消息，直接返回
        if (!userMessages || userMessages.length === 0) {
          return;
        }

        if (hideChat) {
          // 隐藏模式：处理已存在的消息
          let hiddenCount = 0;
          userMessages.forEach(msg => {
            try {
              const getMessageElement = (messageId: number | string) => {
                if (typeof retrieveDisplayedMessage === 'function') {
                  try {
                    const $el = retrieveDisplayedMessage(messageId);
                    if ($el && $el.length) return $el;
                  } catch (e) {
                    // fallback to DOM selector
                  }
                }
                const idText = String(messageId);
                const $chat = $('#chat');
                if (!$chat.length) return $();
                const $byMesId = $chat.find(
                  `.mes[mesid="${idText}"], .mes[data-message-id="${idText}"], .mes#mes_${idText}, .message-body[data-message-id="${idText}"]`,
                );
                return $byMesId.first();
              };

              const $msgElement = getMessageElement(msg.message_id);
              if (!$msgElement || !$msgElement.length) {
                return;
              }

              // 尝试多种可能的选择器
              let $mesText = $msgElement.find('.mes_text');
              if (!$mesText || !$mesText.length) {
                // 尝试其他可能的选择器
                $mesText = $msgElement.find('.message-text, .text, [class*="text"], [class*="message"]').first();
                if (!$mesText || !$mesText.length) {
                  // 如果都找不到，直接使用消息元素本身
                  $mesText = $msgElement;
                }
              }

              // 获取当前DOM显示的文本
              const currentDomText = $mesText.text();
              // 如果已经是占位符，跳过
              if (currentDomText.includes('[投骰结果已隐藏]')) {
                return;
              }

              // 使用消息数据中的原始文本作为源进行匹配（这是发送给AI的完整文本）
              const originalText = msg.message || '';
              if (!originalText) {
                return;
              }

              // 优先在HTML中直接替换，避免依赖消息数据
              const currentHtml = $mesText.html() || '';
              let modifiedHtml = currentHtml;

              // 使用统一的 <meta:检定结果> 标签正则（需要转义HTML实体）
              // 注意：HTML中可能已经被转义，所以匹配时需要考虑两种情况
              modifiedHtml = modifiedHtml.replace(
                /(&lt;|<)meta:检定结果(&gt;|>)[\s\S]*?(&lt;|<)\/meta:检定结果(&gt;|>)/g,
                '[投骰结果已隐藏]',
              );
              if (modifiedHtml === currentHtml) {
                modifiedHtml = modifiedHtml.replace(/<meta:检定结果>[\s\S]*?<\/meta:检定结果>/g, '[投骰结果已隐藏]');
              }

              if (modifiedHtml !== currentHtml) {
                $mesText.html(modifiedHtml);
                hiddenCount++;
                return;
              }

              // HTML 未命中时，回退到文本替换（可能是纯文本渲染）
              const metaRegex = /<meta:检定结果>[\s\S]*?<\/meta:检定结果>/g;
              const replacedText = currentDomText.replace(metaRegex, '[投骰结果已隐藏]');
              if (replacedText !== currentDomText) {
                $mesText.text(replacedText);
                hiddenCount++;
                return;
              }

              // DOM 中没有标签时，根据原始消息内容强制替换并重新渲染
              const replacedFromOriginal = originalText.replace(metaRegex, '[投骰结果已隐藏]');
              if (replacedFromOriginal !== originalText && replacedFromOriginal !== currentDomText) {
                if (typeof formatAsDisplayedMessage === 'function') {
                  $mesText.html(formatAsDisplayedMessage(replacedFromOriginal));
                } else {
                  $mesText.text(replacedFromOriginal);
                }
                hiddenCount++;
              }
            } catch (e) {
              console.warn(`[DICE]ACU 隐藏第 ${msg.message_id} 楼投骰结果失败:`, e);
            }
          });
          if (hiddenCount === 0) {
            const $chat = $('#chat');
            if ($chat.length) {
              $chat.find('.mes, .message-body').each((_, elem) => {
                const $elem = $(elem);
                const $target = $elem.find('.mes_text').length ? $elem.find('.mes_text') : $elem;
                const html = $target.html() || '';
                let replaced = html.replace(
                  /(&lt;|<)meta:检定结果(&gt;|>)[\s\S]*?(&lt;|<)\/meta:检定结果(&gt;|>)/g,
                  '[投骰结果已隐藏]',
                );
                if (replaced === html) {
                  replaced = html.replace(/<meta:检定结果>[\s\S]*?<\/meta:检定结果>/g, '[投骰结果已隐藏]');
                }
                if (replaced !== html) {
                  $target.html(replaced);
                  hiddenCount++;
                }
              });
            }
          }
          if (hiddenCount > 0) {
            console.info(`[DICE]已隐藏 ${hiddenCount} 条消息的投骰结果`);
          }
        } else {
          // 显示模式：恢复已隐藏的消息
          let restoredCount = 0;
          userMessages.forEach(msg => {
            try {
              const getMessageElement = (messageId: number | string) => {
                if (typeof retrieveDisplayedMessage === 'function') {
                  try {
                    const $el = retrieveDisplayedMessage(messageId);
                    if ($el && $el.length) return $el;
                  } catch (e) {
                    // fallback to DOM selector
                  }
                }
                const idText = String(messageId);
                const $chat = $('#chat');
                if (!$chat.length) return $();
                const $byMesId = $chat.find(
                  `.mes[mesid="${idText}"], .mes[data-message-id="${idText}"], .mes#mes_${idText}, .message-body[data-message-id="${idText}"]`,
                );
                return $byMesId.first();
              };

              const $msgElement = getMessageElement(msg.message_id);
              if (!$msgElement || !$msgElement.length) return;

              const $mesText = $msgElement.find('.mes_text');
              if (!$mesText || !$mesText.length) return;

              // 如果显示的是占位符，从消息数据恢复原始文本
              const currentText = $mesText.text();
              if (currentText.includes('[投骰结果已隐藏]')) {
                // 从消息数据获取原始文本
                const originalText = msg.message || '';
                if (originalText) {
                  $mesText.text(originalText);
                  restoredCount++;
                }
              }
            } catch (e) {
              // 单个消息恢复失败，静默处理
            }
          });
          if (restoredCount > 0) {
            console.info(`[DICE]已恢复 ${restoredCount} 条消息的投骰结果`);
          }
        }
      } catch (e) {
        // 首次启动时聊天可能未完全加载，静默处理所有错误
        // 避免在控制台显示不必要的警告信息
        if (hideChat) {
          console.warn('[DICE]ACU 处理聊天记录投骰结果失败:', e);
        }
      }
    } catch (e) {
      // [修复] 最外层错误处理，静默处理配置获取失败等错误
      // 避免在未启用隐藏功能时显示错误
      const diceCfg = getDiceConfig();
      if (diceCfg && (diceCfg.hideDiceResultFromUser || diceCfg.hideDiceResultInChat)) {
        console.warn('[DICE]ACU 隐藏投骰结果失败:', e);
      }
    }
  };
export { MvuModule, DEFAULT_DICE_CONFIG, getDiceConfig, saveDiceConfig, hideDiceResultsInUserMessages }; // __wireMvuVisualizerDeps 已由头部 export function 导出
