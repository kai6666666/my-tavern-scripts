// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=44「AcuDice 公共 API - 供其他插件和角色卡调用」
// 原行范围：48432-50703（含 banner 48428-50703）；拆分批次 10；外部 closure 依赖：26（getConfig/getTableData/processJsonData/DashboardDataParser/applyDiceProfile/bindTutorialButtonsIn/buildCheckValueText/detectCharacterDiceProfile/exportDiceProfile/getAttributeEntryForCharacter/getAttributeValue/getDiceProfileCharacterContext/getDiceProfilePromptState/getFullAttributesForCharacter/getNamedCheckParamText/getSuccessLevel/getTutorialButtonHtml/importDiceProfile/refreshDiceProfileIndex/resolveQuickSelectTarget/saveCurrentDiceProfile/settleGachaFortuneForDiceEvent/showDiceSystemConfirmDialog/toDiceProfileSummary/cachedRawData）
// 接线说明：showActionableErrorToast 来自 ./ui/actionable-error-toast；escapeHtml/setupOverlayClose/smartInsertToTextarea 已拆至 favorites/bookmark-manager.ts、
//   DiceHistoryStatsDB 已拆至 favorites/favorites-db.ts、renderDiceHistoryStatsHtml/replaceUserPlaceholders 已拆至 favorites/favorites-manager.ts、
//   NameAliasRegistry/resolveCanonicalCharacterName 已拆至 engine/character-name-resolver.ts、
//   rollComplexDiceExpression/evaluateFormula/evaluateCondition/evaluateConditionNumber/evaluateOutcomes/formatOutputTemplate/DEFAULT_OUTPUT_TEMPLATE/DEFAULT_CONTEST_OUTPUT_TEMPLATE 已拆至 engine/formula-parser.ts、
//   AdvancedDicePresetManager/applyAdvancedPresetOutcomePolicy/getAdvancedPresetDisplayOutcome 已拆至 presets/advanced-dice-preset-manager.ts、
//   getCheckSuggestionPresetById 已拆至 presets/preset-switch-table-template.ts、computePendingEffectVariables 已拆至 infra/db-adapter.ts、
//   getDiceConfig 已拆至 engine/mvu-visualizer.ts、ActionPresetManager 已拆至 presets/interaction-rule-preset.ts、getAcuDiceProfilePromptKey 来自 engine/profile-packages（均不引用本文件，无循环）直接 import；
//   getConfig/getTableData/processJsonData/DashboardDataParser/applyDiceProfile/bindTutorialButtonsIn/buildCheckValueText/detectCharacterDiceProfile/exportDiceProfile/getAttributeEntryForCharacter/getAttributeValue/getDiceProfileCharacterContext/getDiceProfilePromptState/getFullAttributesForCharacter/getNamedCheckParamText/getSuccessLevel/getTutorialButtonHtml/importDiceProfile/refreshDiceProfileIndex/resolveQuickSelectTarget/saveCurrentDiceProfile/settleGachaFortuneForDiceEvent/showDiceSystemConfirmDialog/toDiceProfileSummary 定义于 index.ts IIFE 内无法 export，采用运行时注入：
//   index.ts IIFE 末尾调用 __wireAcuDiceApiDeps({...}) 注入；未注入时模块级引用为 null（全部仅在运行时函数内调用，注入先于任何调用，与 IIFE 内原时序等价）。
// 注：cachedRawData 为 IIFE 内运行时可变 let（index.ts 剩余代码多处重赋值），注入读取回调 getCachedRawData: () => cachedRawData 实时取值；
//   正文 3 处 `cachedRawData || getTableData()` 相应改为 `getCachedRawData() || getTableData()`（批次10 唯一正文差异，其余逐字一致）。
// 注：window.AcuDice 暴露语义不变——AcuDiceAPI.gacha 挂载/defineAcuDiceOnWindow/notifyReady/dispatchReadyEvent/init 调度仍留在 index.ts IIFE 收尾段，经 import 绑定解析。

import { showActionableErrorToast } from './ui/actionable-error-toast';
import { escapeHtml, setupOverlayClose, smartInsertToTextarea } from './favorites/bookmark-manager';
import { DiceHistoryStatsDB } from './favorites/favorites-db';
import { renderDiceHistoryStatsHtml, replaceUserPlaceholders } from './favorites/favorites-manager';
import { NameAliasRegistry, resolveCanonicalCharacterName } from './engine/character-name-resolver';
import { rollComplexDiceExpression, evaluateFormula, evaluateCondition, evaluateConditionNumber, evaluateOutcomes, formatOutputTemplate, DEFAULT_OUTPUT_TEMPLATE, DEFAULT_CONTEST_OUTPUT_TEMPLATE } from './engine/formula-parser';
import { AdvancedDicePresetManager, applyAdvancedPresetOutcomePolicy, getAdvancedPresetDisplayOutcome } from './presets/advanced-dice-preset-manager';
import { getCheckSuggestionPresetById } from './presets/preset-switch-table-template';
import { computePendingEffectVariables } from './infra/db-adapter';
import { getDiceConfig } from './engine/mvu-visualizer';
import { ActionPresetManager } from './presets/interaction-rule-preset';
import { getAcuDiceProfilePromptKey } from './engine/profile-packages';
import type { OutcomeLevel, AdvancedDicePreset, CheckHistoryExtension } from './presets/advanced-dice-preset';
import type { AdvancedPresetOutcomePolicyResult } from './presets/advanced-dice-preset-manager';
import type { DiceStatsScope } from './favorites/favorites-manager';
import type { RollResult, CustomFieldConfig } from './engine/types';
import type { AttributeQuickSelectTarget, CharacterAttributeSource } from './presets/attribute-rule-preset';

let DashboardDataParser = null;
let applyDiceProfile = null;
let bindTutorialButtonsIn = null;
let buildCheckValueText = null;
let detectCharacterDiceProfile = null;
let exportDiceProfile = null;
let getAttributeEntryForCharacter = null;
let getAttributeValue = null;
let getCachedRawData = null;
let getConfig = null;
let getDiceProfileCharacterContext = null;
let getDiceProfilePromptState = null;
let getFullAttributesForCharacter = null;
let getNamedCheckParamText = null;
let getSuccessLevel = null;
let getTableData = null;
let getTutorialButtonHtml = null;
let importDiceProfile = null;
let processJsonData = null;
let refreshDiceProfileIndex = null;
let resolveQuickSelectTarget = null;
let saveCurrentDiceProfile = null;
let settleGachaFortuneForDiceEvent = null;
let showDiceSystemConfirmDialog = null;
let toDiceProfileSummary = null;

export function __wireAcuDiceApiDeps(deps) {
  DashboardDataParser = deps.DashboardDataParser;
  applyDiceProfile = deps.applyDiceProfile;
  bindTutorialButtonsIn = deps.bindTutorialButtonsIn;
  buildCheckValueText = deps.buildCheckValueText;
  detectCharacterDiceProfile = deps.detectCharacterDiceProfile;
  exportDiceProfile = deps.exportDiceProfile;
  getAttributeEntryForCharacter = deps.getAttributeEntryForCharacter;
  getAttributeValue = deps.getAttributeValue;
  getCachedRawData = deps.getCachedRawData;
  getConfig = deps.getConfig;
  getDiceProfileCharacterContext = deps.getDiceProfileCharacterContext;
  getDiceProfilePromptState = deps.getDiceProfilePromptState;
  getFullAttributesForCharacter = deps.getFullAttributesForCharacter;
  getNamedCheckParamText = deps.getNamedCheckParamText;
  getSuccessLevel = deps.getSuccessLevel;
  getTableData = deps.getTableData;
  getTutorialButtonHtml = deps.getTutorialButtonHtml;
  importDiceProfile = deps.importDiceProfile;
  processJsonData = deps.processJsonData;
  refreshDiceProfileIndex = deps.refreshDiceProfileIndex;
  resolveQuickSelectTarget = deps.resolveQuickSelectTarget;
  saveCurrentDiceProfile = deps.saveCurrentDiceProfile;
  settleGachaFortuneForDiceEvent = deps.settleGachaFortuneForDiceEvent;
  showDiceSystemConfirmDialog = deps.showDiceSystemConfirmDialog;
  toDiceProfileSummary = deps.toDiceProfileSummary;
}
  // ========================================
  // AcuDice 公共 API - 供其他插件和角色卡调用
  // ========================================

  const ACUDICE_READY_EVENT = 'acudice:ready';

  const resolveRootWindow = (): Window => {
    try {
      return window.top ?? window;
    } catch (error) {
      return window;
    }
  };

  const rootWindow = resolveRootWindow();
  const readyCallbacks: Array<() => void> = [];
  let isAcuDiceReady = false;

  const runReadyCallback = (callback: () => void) => {
    try {
      callback();
    } catch (error) {
      console.error('[AcuDice] onReady 回调出错', error);
    }
  };

  const notifyReady = () => {
    if (isAcuDiceReady) return;
    isAcuDiceReady = true;
    for (const callback of readyCallbacks) {
      runReadyCallback(callback);
    }
    readyCallbacks.length = 0;
  };

  const defineAcuDiceOnWindow = (target: Window) => {
    if ('AcuDice' in target) return;
    Object.defineProperty(target, 'AcuDice', {
      value: AcuDiceAPI,
      writable: false,
      configurable: false,
    });
  };

  const dispatchReadyEvent = (target: Window) => {
    try {
      target.dispatchEvent(new CustomEvent(ACUDICE_READY_EVENT));
    } catch (error) {
      console.warn('[AcuDice] ready 事件触发失败', error);
    }
  };

  // 事件系统
  const eventHandlers: Map<string, Set<Function>> = new Map();
  type CheckHistoryEntry = AcuDice.CheckResult & CheckHistoryExtension & { timestamp: number };
  type ContestHistoryEntry = AcuDice.ContestResult & { timestamp: number; detailId?: string; detailLines?: string[] };
  type AcuDiceSharedHistoryStore = {
    checkHistory: CheckHistoryEntry[];
    contestHistory: ContestHistoryEntry[];
    maxHistory: number;
  };
  type RootWindowWithAcuDiceHistory = Window & {
    __AcuDiceHistoryStore__?: AcuDiceSharedHistoryStore;
  };
  const rootWindowWithHistory = rootWindow as RootWindowWithAcuDiceHistory;
  if (!rootWindowWithHistory.__AcuDiceHistoryStore__) {
    rootWindowWithHistory.__AcuDiceHistoryStore__ = {
      checkHistory: [],
      contestHistory: [],
      maxHistory: 100,
    };
  }
  const sharedHistoryStore = rootWindowWithHistory.__AcuDiceHistoryStore__;
  const checkHistory: CheckHistoryEntry[] = sharedHistoryStore.checkHistory;
  const contestHistory: ContestHistoryEntry[] = sharedHistoryStore.contestHistory;
  const MAX_HISTORY = sharedHistoryStore.maxHistory;

  const globalExpandedHistoryIds = new Set<string>();
  let globalHistoryFilterStatus = 'all';
  let globalHistoryKeyword = '';
  let globalHistoryStatsScope: DiceStatsScope = 'chat';

  const copyTextWithTavernApi = async (text: string): Promise<boolean> => {
    try {
      if (window.TavernHelper && window.TavernHelper.triggerSlash) {
        const safeContent = text
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"')
          .replace(/\n/g, '\\n')
          .replace(/\{/g, '\\{')
          .replace(/\}/g, '\\}');
        await window.TavernHelper.triggerSlash(`/clipboard-set "${safeContent}"`);
        return true;
      }
    } catch (error) {
      console.warn('[DICE] history copy via TavernHelper failed:', error);
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (error) {
      console.warn('[DICE] history copy via navigator.clipboard failed:', error);
    }

    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '0';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);
      textArea.select();
      textArea.setSelectionRange(0, 99999);
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (error) {
      console.error('[DICE] history copy fallback failed:', error);
      return false;
    }
  };

  const showGlobalDiceHistoryDialog = () => {
    $('.acu-dice-history-overlay').remove();
    const config = getConfig();
    const currentThemeClass = `acu-theme-${config.theme}`;
    const detailCopyTextMap = new Map<string, string>();

    const renderHistoryItems = (): string => {
      type UnifiedItem =
        | (CheckHistoryEntry & { historyType: 'check' })
        | (ContestHistoryEntry & { historyType: 'contest' });

      detailCopyTextMap.clear();

      const items: UnifiedItem[] = [
        ...checkHistory.map(item => ({ ...item, historyType: 'check' as const })),
        ...contestHistory.map(item => ({ ...item, historyType: 'contest' as const })),
      ]
        .sort((a, b) => b.timestamp - a.timestamp)
        .filter(item => {
          if (globalHistoryFilterStatus !== 'all') {
            const status = String((item as Record<string, unknown>).effectStatus || '');
            if (!status || status !== globalHistoryFilterStatus) return false;
          }
          const keyword = globalHistoryKeyword.trim().toLowerCase();
          if (!keyword) return true;
          const raw = item as Record<string, unknown>;
          const left = (raw.left || {}) as Record<string, unknown>;
          const right = (raw.right || {}) as Record<string, unknown>;
          const haystack = [
            raw.attrName,
            raw.message,
            raw.outcomeText,
            raw.initiatorName,
            left.name,
            right.name,
            raw.effectStatus,
          ]
            .map(text => String(text || '').toLowerCase())
            .join(' ');
          return haystack.includes(keyword);
        })
        .slice(0, 80);

      if (items.length === 0) {
        return `<div class="acu-empty-state"><i class="fa-solid fa-dice-d20"></i><span>暂无检定历史</span></div>`;
      }

      const statusTextMap: Record<string, string> = {
        planned: '待执行',
        confirmed: '已确认',
        committed: '已提交',
        failed: '失败',
        cancelled: '已取消',
      };
      const statusColorMap: Record<string, string> = {
        planned: 'var(--acu-text-sub)',
        confirmed: 'var(--acu-accent)',
        committed: 'var(--acu-success-text)',
        failed: 'var(--acu-error-text)',
        cancelled: 'var(--acu-text-sub)',
      };

      return items
        .map(item => {
          const raw = item as Record<string, unknown>;
          const isContest = item.historyType === 'contest';
          const left = (raw.left || {}) as Record<string, unknown>;
          const right = (raw.right || {}) as Record<string, unknown>;
          const status = String(raw.effectStatus || '');
          const statusText = status ? statusTextMap[status] || status : '';
          const statusColor = status ? statusColorMap[status] || 'var(--acu-text-sub)' : 'var(--acu-text-sub)';

          const detailId = String(raw.detailId || raw.effectRunId || `${item.historyType}-${item.timestamp}`);
          const detailLinesRaw = Array.isArray(raw.detailLines) ? (raw.detailLines as unknown[]) : [];
          const traceLinesRaw = Array.isArray(raw.effectTrace) ? (raw.effectTrace as unknown[]) : [];
          const detailLines = detailLinesRaw.map(line => String(line || '').trim()).filter(Boolean);
          const traceLines = traceLinesRaw.map(line => String(line || '').trim()).filter(Boolean);
          const canExpand = detailLines.length > 0 || traceLines.length > 0;
          const isExpanded = canExpand && globalExpandedHistoryIds.has(detailId);

          let title = String(raw.attrName || '检定');
          let subtitle = String(raw.outcomeText || (raw.success ? '成功' : '失败'));
          let resultColor = raw.success ? 'var(--acu-success-text)' : 'var(--acu-error-text)';
          let rollText = `${String(raw.total ?? '-')}/${String(raw.target ?? '-')}`;
          let typeTag = '普通';

          if (isContest) {
            typeTag = '对抗';
            title = `${String(left.name || '发起方')} vs ${String(right.name || '对抗方')}`;
            subtitle = String(raw.message || '对抗检定');
            const winner = String(raw.winner || 'tie');
            resultColor = winner === 'tie' ? 'var(--acu-text-sub)' : 'var(--acu-accent)';
            rollText = `${String(left.roll ?? '-')} : ${String(right.roll ?? '-')}`;
          } else {
            const initiator = String(raw.initiatorName || '').trim();
            if (initiator) title = `${initiator} · ${title}`;
          }

          const pushedBadge = raw.isPushed
            ? '<i class="fa-solid fa-skull acu-history-pushed-icon" title="孤注一掷"></i>'
            : '';

          const sections: string[] = [];
          if (detailLines.length > 0) {
            sections.push(
              `<div><strong>检定详情</strong>${detailLines.map(line => escapeHtml(line)).join('<br>')}</div>`,
            );
          }
          if (traceLines.length > 0) {
            sections.push(
              `<div><strong>效果链路</strong>${traceLines.map(line => escapeHtml(line)).join('<br>')}</div>`,
            );
          }

          if (canExpand) {
            const copyParts: string[] = [
              `[${typeTag}] ${title}`,
              `时间: ${new Date(item.timestamp).toLocaleString('zh-CN')}`,
            ];
            if (subtitle) copyParts.push(`结果: ${subtitle}`);
            if (rollText) copyParts.push(`数值: ${rollText}`);
            if (detailLines.length > 0) copyParts.push('--- 检定详情 ---', ...detailLines);
            if (traceLines.length > 0) copyParts.push('--- 效果链路 ---', ...traceLines);
            detailCopyTextMap.set(detailId, copyParts.join('\n'));
          }

          const detailHtml =
            canExpand && isExpanded ? `<div class="acu-history-detail">${sections.join('<hr>')}</div>` : '';

          return `
            <div class="acu-history-item">
              <div class="acu-history-main">
                <div class="acu-history-primary">
                  <div class="acu-history-title-row">
                    <span class="acu-history-tag">${typeTag}</span>
                    <span class="acu-history-title">${escapeHtml(title)}${pushedBadge}</span>
                    ${canExpand ? `<button type="button" class="acu-history-icon-btn acu-history-detail-copy" data-detail-id="${escapeHtml(detailId)}" aria-label="复制详情" title="复制详情"><i class="fa-solid fa-copy"></i></button>` : ''}
                  </div>
                  <div class="acu-history-meta">
                    <span class="acu-history-result" style="--acu-history-result-color:${resultColor};">${escapeHtml(subtitle)}</span>
                    <span class="acu-history-roll">${escapeHtml(rollText)}</span>
                    ${statusText ? `<span class="acu-history-status" style="--acu-history-status-color:${statusColor};">效果:${statusText}</span>` : ''}
                  </div>
                </div>
                <div class="acu-history-side">
                  <span class="acu-history-time">${new Date(item.timestamp).toLocaleTimeString('zh-CN', { hour12: false })}</span>
                  ${canExpand ? `<button type="button" class="acu-history-icon-btn acu-history-trace-toggle" data-run-id="${escapeHtml(detailId)}" aria-label="${isExpanded ? '收起详情' : '展开详情'}" title="${isExpanded ? '收起详情' : '展开详情'}">${isExpanded ? '▼' : '▶'}</button>` : ''}
                </div>
              </div>
              ${detailHtml}
            </div>
          `;
        })
        .join('');
    };

    const dialog = $(`
      <div class="acu-edit-overlay acu-dice-history-overlay">
        <div class="acu-edit-dialog acu-dice-history-dialog ${currentThemeClass}">
          <div class="acu-dice-history-header">
            <h3><i class="fa-solid fa-clock-rotate-left"></i> 检定历史</h3>
            <div class="acu-dice-history-actions">
              ${getTutorialButtonHtml('diceHistory', '查看检定历史教程', 'acu-help-btn')}
              <button type="button" class="acu-close-btn acu-history-close" aria-label="关闭检定历史" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>
          <div class="acu-dice-history-filters">
            <select id="acu-history-scope-filter" class="acu-dice-select">
              <option value="chat">本聊天</option>
              <option value="character">本角色卡</option>
              <option value="global">全局</option>
            </select>
            <select id="acu-history-status-filter" class="acu-dice-select">
              <option value="all">全部状态</option>
              <option value="planned">待执行</option>
              <option value="confirmed">已确认</option>
              <option value="committed">已提交</option>
              <option value="failed">失败</option>
              <option value="cancelled">已取消</option>
            </select>
            <div class="acu-dice-history-search">
              <i class="fa-solid fa-search"></i>
              <input id="acu-history-search" class="acu-dice-input" placeholder="搜索" value="${escapeHtml(globalHistoryKeyword)}">
            </div>
          </div>
          <div id="acu-dice-history-stats" class="acu-dice-history-stats"></div>
          <div id="acu-dice-history-list" class="acu-dice-history-list">
            ${renderHistoryItems()}
          </div>
          <div class="acu-history-footer">
            <button type="button" class="acu-dialog-btn" id="acu-history-clear"><i class="fa-solid fa-trash"></i> 清理历史</button>
            <button type="button" class="acu-dialog-btn acu-history-close"><i class="fa-solid fa-times"></i> 关闭</button>
          </div>
        </div>
      </div>
    `);
    $('body').append(dialog);
    bindTutorialButtonsIn(dialog);

    const renderHistoryStats = async () => {
      const $stats = dialog.find('#acu-dice-history-stats');
      if ($stats.length === 0) return;
      const allStats = await DiceHistoryStatsDB.getDashboardStats();
      $stats.html(renderDiceHistoryStatsHtml(allStats, globalHistoryStatsScope));
    };

    const rerender = () => {
      dialog.find('#acu-dice-history-list').html(renderHistoryItems());
      void renderHistoryStats();
    };

    dialog.find('#acu-history-status-filter').val(globalHistoryFilterStatus);
    dialog.find('#acu-history-scope-filter').val(globalHistoryStatsScope);

    const refreshByEvent = () => rerender();
    const canListen = Boolean(window.AcuDice && typeof window.AcuDice.on === 'function');
    if (canListen) {
      window.AcuDice.on('check', refreshByEvent);
      window.AcuDice.on('contest', refreshByEvent);
      window.AcuDice.on('effect_run', refreshByEvent);
    }

    void renderHistoryStats();

    dialog.on('change', '#acu-history-scope-filter', function () {
      const val = String($(this).val() || 'chat') as DiceStatsScope;
      globalHistoryStatsScope = val === 'character' || val === 'global' ? val : 'chat';
      void renderHistoryStats();
    });

    dialog.on('change', '#acu-history-status-filter', function () {
      globalHistoryFilterStatus = String($(this).val() || 'all');
      rerender();
    });

    dialog.on('input', '#acu-history-search', function () {
      globalHistoryKeyword = String($(this).val() || '');
      rerender();
    });

    dialog.on('touchstart touchmove', '#acu-dice-history-list', function (e) {
      e.stopPropagation();
    });

    dialog.on('click', '.acu-history-trace-toggle', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const runId = String($(this).data('run-id') || '');
      if (!runId) return;
      if (globalExpandedHistoryIds.has(runId)) globalExpandedHistoryIds.delete(runId);
      else globalExpandedHistoryIds.add(runId);
      rerender();
    });

    dialog.on('click', '.acu-history-detail-copy', async function (e) {
      e.preventDefault();
      e.stopPropagation();
      const detailId = String($(this).data('detail-id') || '');
      const detailText = (detailCopyTextMap.get(detailId) || '').trim();
      if (!detailText) {
        if (window.toastr) window.toastr.warning('没有可复制的详情');
        return;
      }
      const ok = await copyTextWithTavernApi(detailText);
      if (window.toastr) {
        if (ok) window.toastr.success('详情已复制');
        else showActionableErrorToast('复制失败', { suggestion: '请手动选中详情文本复制，或检查浏览器剪贴板权限。' });
      }
    });

    dialog.on('click', '#acu-history-clear', async function (e) {
      e.preventDefault();
      e.stopPropagation();
      const ok = await showDiceSystemConfirmDialog({
        title: '清理检定历史',
        message: '确定要清理检定历史吗？',
        detail: '此操作会清空当前会话内历史和统计库记录。',
        iconClass: 'fa-trash',
        confirmText: '清理历史',
        cancelText: '取消',
        tone: 'danger',
      });
      if (!ok) return;
      checkHistory.length = 0;
      contestHistory.length = 0;
      globalExpandedHistoryIds.clear();
      await DiceHistoryStatsDB.clear();
      rerender();
      if (window.toastr) window.toastr.success('检定历史已清理');
    });

    const closeDialog = () => {
      if (canListen) {
        window.AcuDice.off('check', refreshByEvent);
        window.AcuDice.off('contest', refreshByEvent);
        window.AcuDice.off('effect_run', refreshByEvent);
      }
      dialog.remove();
    };
    dialog.on('click', '.acu-history-close', closeDialog);
    setupOverlayClose(dialog, 'acu-dice-history-overlay', closeDialog);
  };

  function emitEvent(event: string, data: unknown) {
    if (event === 'check' || event === 'contest') {
      void DiceHistoryStatsDB.recordEvent(event, data);
      void settleGachaFortuneForDiceEvent(event, data);
    }
    const handlers = eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (e) {
          console.error('[AcuDice] Event handler error:', e);
        }
      });
    }
  }

  type CheckSuggestionTieRule = 'initiator_win' | 'initiator_lose' | 'tie';
  type CheckSuggestionCriteria = 'lte' | 'gte';
  type CheckSuggestionRawParams = Record<string, string>;
  type CheckSuggestionParamValue = string | number | boolean;
  type CheckSuggestionParams = Record<string, CheckSuggestionParamValue>;
  type CheckSuggestionParsedCommand =
    | {
        kind: 'check';
        characterName: string;
        attributeName: string;
        diceType: string;
        hasExplicitDice: boolean;
        targetValue: number | null;
        criteria: CheckSuggestionCriteria;
        rawParams: CheckSuggestionRawParams;
      }
    | {
        kind: 'contest';
        leftName: string;
        leftAttribute: string;
        rightName: string;
        rightAttribute: string;
        diceType: string;
        hasExplicitDice: boolean;
        tieRule: CheckSuggestionTieRule;
        hasExplicitTieRule: boolean;
        rawParams: CheckSuggestionRawParams;
      }
    | { kind: 'fixed'; success: boolean }
    | { kind: 'none' }
    | { kind: 'invalid'; reason: string };

  const extractCheckSuggestionParams = (text: string): { rest: string; rawParams: CheckSuggestionRawParams } => {
    const rawParams: CheckSuggestionRawParams = {};
    const tokens = String(text || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    const restTokens: string[] = [];
    tokens.forEach(token => {
      const match = token.match(/^([^=\s]+)=([^\s]+)$/);
      if (!match) {
        restTokens.push(token);
        return;
      }
      rawParams[match[1]] = match[2];
    });
    return {
      rest: restTokens.join(' '),
      rawParams,
    };
  };

  const normalizeCheckSuggestionDiceFormula = (rawFormula: string): string => {
    const cleaned = String(rawFormula || '')
      .trim()
      .replace(/^[.。]/, '')
      .replace(/^r(?=\d*d)/i, '');
    return cleaned || '1d100';
  };

  const extractCheckSuggestionDiceFormula = (
    text: string,
  ): { rest: string; diceType: string; hasExplicitDice: boolean } => {
    const match = text.match(/(^|\s)([.。]?r?(?:\d*)d(?:\d+|F)(?:[a-z]+\d+)?)(?=$|\s)/i);
    if (!match || match.index === undefined) return { rest: text, diceType: '1d100', hasExplicitDice: false };
    const before = text.slice(0, match.index);
    const after = text.slice(match.index + match[0].length);
    return {
      rest: `${before} ${after}`.replace(/\s+/g, ' ').trim(),
      diceType: normalizeCheckSuggestionDiceFormula(match[2]),
      hasExplicitDice: true,
    };
  };

  const extractCheckSuggestionTarget = (
    text: string,
  ): { rest: string; targetValue: number | null; criteria: CheckSuggestionCriteria } => {
    const match = text.match(/(<=|≤|>=|≥|<|>|=)\s*(\d{1,4})/);
    if (!match || match.index === undefined) return { rest: text, targetValue: null, criteria: 'lte' };
    const operator = match[1];
    const targetValue = parseInt(match[2], 10);
    const criteria: CheckSuggestionCriteria = operator === '>=' || operator === '≥' || operator === '>' ? 'gte' : 'lte';
    return {
      rest: `${text.slice(0, match.index)} ${text.slice(match.index + match[0].length)}`.replace(/\s+/g, ' ').trim(),
      targetValue: Number.isNaN(targetValue) ? null : targetValue,
      criteria,
    };
  };

  const parseCheckSuggestionTieRule = (rawRule: string): CheckSuggestionTieRule => {
    const rule = rawRule.trim().toLowerCase();
    if (/(发起方|左方|initiator|left).*(成功|胜|赢|win)/.test(rule) || rule === '发起方成功') {
      return 'initiator_win';
    }
    if (/^(平局|平手|tie|保留平局)$/.test(rule)) {
      return 'tie';
    }
    return 'initiator_lose';
  };

  const extractCheckSuggestionTieRule = (
    text: string,
  ): { rest: string; tieRule: CheckSuggestionTieRule; hasExplicitTieRule: boolean } => {
    const match = text.match(/平局\s*=\s*([^\s，,。；;]+)/);
    if (!match || match.index === undefined)
      return { rest: text, tieRule: 'initiator_lose', hasExplicitTieRule: false };
    return {
      rest: `${text.slice(0, match.index)} ${text.slice(match.index + match[0].length)}`.replace(/\s+/g, ' ').trim(),
      tieRule: parseCheckSuggestionTieRule(match[1]),
      hasExplicitTieRule: true,
    };
  };

  const parseCheckSuggestionSide = (text: string): { name: string; attribute: string } | null => {
    const parts = text.trim().split(/\s+/).filter(Boolean);
    if (parts.length < 2) return null;
    return {
      name: parts[0],
      attribute: parts.slice(1).join(' '),
    };
  };

  const normalizeCheckSuggestionSideShorthand = (text: string): string => {
    const trimmed = String(text || '').trim();
    const match = trimmed.match(/^([^=\s]+)[.。:：/]([^=\s]+)$/);
    if (!match) return trimmed;
    return `${match[1]} ${match[2]}`;
  };

  const normalizeLeadingCheckSuggestionSideShorthand = (text: string): string => {
    const parts = String(text || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (!parts.length) return '';
    return [normalizeCheckSuggestionSideShorthand(parts[0]), ...parts.slice(1)].join(' ');
  };

  const normalizeCheckSuggestionCommandInput = (rawCommand: string): string => {
    let command = String(rawCommand || '')
      .replace(/^[\s"'`“”‘’「」『』]+|[\s"'`“”‘’「」『』]+$/g, '')
      .replace(/[，,；;]\s*/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    command = command
      .replace(/^对抗(?:检定)?\s*[:：]\s*/, '对抗 ')
      .replace(/^对抗检定\s+/, '对抗 ')
      .replace(/^普通检定\s*[:：]\s*/, '检定 ')
      .replace(/^普通检定\s+/, '检定 ')
      .replace(/^检定\s*[:：]\s*/, '检定 ');

    if (command.startsWith('检定 ')) {
      return `检定 ${normalizeLeadingCheckSuggestionSideShorthand(command.replace(/^检定\s+/, ''))}`.trim();
    }

    if (command.startsWith('对抗 ')) {
      const contestBody = command
        .replace(/^对抗\s+/, '')
        .replace(/\s*[VvＶｖ][SsＳｓ]\s*/g, ' vs ')
        .replace(/\s+(?:对|对抗)\s+/g, ' vs ')
        .replace(/\s+/g, ' ')
        .trim();
      const normalizedSides = contestBody
        .split(/\s+vs\s+/i)
        .map(normalizeLeadingCheckSuggestionSideShorthand)
        .join(' vs ');
      return `对抗 ${normalizedSides}`.trim();
    }

    return command;
  };

  const buildCheckSuggestionInvalidCommandMessage = (reason: string): string => {
    const normalizedReason = String(reason || '骰子命令解析失败').trim();
    const separator = /[。！？!?]$/.test(normalizedReason) ? '' : '。';
    return `${normalizedReason}${separator}解决方法：请重新填写“检定建议表”，或检查表格模板中的提示词；骰子命令应写成“检定 角色 属性”或“对抗 角色 属性 vs 角色 属性”。`;
  };

  const parseCheckSuggestionCommand = (rawCommand: string): CheckSuggestionParsedCommand => {
    const command = normalizeCheckSuggestionCommandInput(rawCommand);
    if (!command) return { kind: 'invalid', reason: '骰子命令为空' };
    if (/^(必成|必定成功|自动成功)(?:\s|$)/.test(command)) return { kind: 'fixed', success: true };
    if (/^(必败|必定失败|自动失败)(?:\s|$)/.test(command)) return { kind: 'fixed', success: false };
    if (/^(无|无需检定|不检定|无检定)(?:\s|$)/.test(command)) return { kind: 'none' };

    if (command.startsWith('检定 ')) {
      const withoutPrefix = command.replace(/^检定\s+/, '').trim();
      const paramsExtracted = extractCheckSuggestionParams(withoutPrefix);
      const targetExtracted = extractCheckSuggestionTarget(paramsExtracted.rest);
      const diceExtracted = extractCheckSuggestionDiceFormula(targetExtracted.rest);
      const side = parseCheckSuggestionSide(diceExtracted.rest);
      if (!side) return { kind: 'invalid', reason: '普通检定命令格式应为：检定 <角色> <属性> [key=value ...]' };
      return {
        kind: 'check',
        characterName: side.name,
        attributeName: side.attribute,
        diceType: diceExtracted.diceType,
        hasExplicitDice: diceExtracted.hasExplicitDice,
        targetValue: targetExtracted.targetValue,
        criteria: targetExtracted.criteria,
        rawParams: paramsExtracted.rawParams,
      };
    }

    if (command.startsWith('对抗 ')) {
      const withoutPrefix = command.replace(/^对抗\s+/, '').trim();
      const tieExtracted = extractCheckSuggestionTieRule(withoutPrefix);
      const diceExtracted = extractCheckSuggestionDiceFormula(tieExtracted.rest);
      const paramsExtracted = extractCheckSuggestionParams(diceExtracted.rest);
      const sides = paramsExtracted.rest.split(/\s+vs\s+/i);
      if (sides.length !== 2) {
        return { kind: 'invalid', reason: '对抗检定命令格式应为：对抗 <角色> <属性> vs <角色> <属性> [key=value ...]' };
      }
      const left = parseCheckSuggestionSide(sides[0]);
      const right = parseCheckSuggestionSide(sides[1]);
      if (!left || !right) {
        return { kind: 'invalid', reason: '对抗检定需要双方角色和属性' };
      }
      return {
        kind: 'contest',
        leftName: left.name,
        leftAttribute: left.attribute,
        rightName: right.name,
        rightAttribute: right.attribute,
        diceType: diceExtracted.diceType,
        hasExplicitDice: diceExtracted.hasExplicitDice,
        tieRule: tieExtracted.tieRule,
        hasExplicitTieRule: tieExtracted.hasExplicitTieRule,
        rawParams: paramsExtracted.rawParams,
      };
    }

    return { kind: 'invalid', reason: `无法识别的骰子命令：${command}` };
  };

  const normalizeCheckSuggestionActionText = (displayText: string): string => {
    const text = String(displayText || '').trim();
    if (!text) return '';
    return `${text}${/[。！？!?…]$/.test(text) ? '' : '。'}`;
  };

  const refreshNameAliasesForCheckSuggestion = () => {
    try {
      const rawDataForAlias = getCachedRawData() || getTableData();
      if (rawDataForAlias) {
        NameAliasRegistry.rebuild(processJsonData(rawDataForAlias || {}));
      }
    } catch (error) {
      console.warn('[DICE] 检定建议刷新角色别名失败', error);
    }
  };

  const resolveCheckSuggestionCharacterName = (name: string): string => {
    const trimmed = String(name || '').trim();
    return resolveCanonicalCharacterName(trimmed);
  };

  const getCheckSuggestionDiceSides = (formula: string): number => {
    const match = String(formula || '').match(/\d*d(\d+)/i);
    if (!match) return 100;
    const sides = parseInt(match[1], 10);
    return Number.isNaN(sides) ? 100 : sides;
  };

  const buildCheckSuggestionMetaBlock = (line: string): string => `<meta:检定结果>\n${line}\n</meta:检定结果>`;

  const parseCheckSuggestionPrimitiveValue = (value: string): CheckSuggestionParamValue => {
    const trimmed = String(value || '').trim();
    if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed);
    if (/^(true|是|启用|开启)$/i.test(trimmed)) return true;
    if (/^(false|否|禁用|关闭)$/i.test(trimmed)) return false;
    return trimmed;
  };

  const normalizeCheckSuggestionParams = (
    rawParams: CheckSuggestionRawParams,
    preset: AdvancedDicePreset,
  ): CheckSuggestionParams => {
    const normalized: CheckSuggestionParams = {};
    const aliases = preset.checkSuggestionAliases;
    const normalizeSidePrefixedKey = (rawKey: string): { key: string; valueAliasKey: string } => {
      const lowerKey = rawKey.toLowerCase();
      const sidePrefix = lowerKey.startsWith('left') ? 'left' : lowerKey.startsWith('right') ? 'right' : '';
      if (!sidePrefix) {
        const canonicalKey = aliases?.params?.[rawKey] || rawKey;
        return { key: canonicalKey, valueAliasKey: canonicalKey };
      }
      const prefixLength = sidePrefix.length;
      const stripped = rawKey.slice(prefixLength);
      if (!stripped) return { key: rawKey, valueAliasKey: rawKey };
      const normalizedStripped = stripped.charAt(0).toLowerCase() + stripped.slice(1);
      const canonicalStripped = aliases?.params?.[stripped] || aliases?.params?.[normalizedStripped] || normalizedStripped;
      const sideKey = `${sidePrefix}${canonicalStripped.charAt(0).toUpperCase()}${canonicalStripped.slice(1)}`;
      return { key: sideKey, valueAliasKey: canonicalStripped };
    };
    Object.entries(rawParams).forEach(([rawKey, rawValue]) => {
      if (rawKey === 'preset') return;
      const { key: canonicalKey, valueAliasKey } = normalizeSidePrefixedKey(rawKey);
      const valueAliases = aliases?.values?.[canonicalKey] || aliases?.values?.[valueAliasKey] || {};
      const aliasedValue = valueAliases[rawValue];
      normalized[canonicalKey] =
        aliasedValue !== undefined ? aliasedValue : parseCheckSuggestionPrimitiveValue(rawValue);
    });
    return normalized;
  };

  const parseCheckSuggestionModifierValue = (value: string): number => {
    const trimmed = String(value || '').trim();
    if (!trimmed) return 0;
    if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed);
    const rollResult = rollComplexDiceExpression(trimmed);
    if (!Number.isNaN(rollResult.total)) return rollResult.total;
    const formulaValue = evaluateFormula(trimmed, {});
    return Number.isFinite(formulaValue) ? formulaValue : 0;
  };

  const resolveCheckSuggestionDefaultValue = (
    defaultValue: number | string | boolean | undefined,
    context: Record<string, number>,
  ): number => {
    if (defaultValue === undefined || defaultValue === '') return 0;
    if (typeof defaultValue === 'number') return defaultValue;
    if (typeof defaultValue === 'boolean') return defaultValue ? 1 : 0;
    const result = evaluateFormula(String(defaultValue), context);
    return Number.isFinite(result) ? result : 0;
  };

  const resolveCheckSuggestionNumberParam = (
    value: CheckSuggestionParamValue | undefined,
    characterName: string,
    fallback: number,
    options?: { preferAttribute?: boolean },
  ): number => {
    if (value === undefined || value === '') return fallback;
    if (typeof value === 'number') return value;
    if (typeof value === 'boolean') return value ? 1 : 0;
    const text = String(value).trim();
    if (!text) return fallback;
    if (options?.preferAttribute !== false) {
      const attrValue = getAttributeValue(characterName, text);
      if (attrValue !== null) return attrValue;
    }
    const parsed = parseCheckSuggestionModifierValue(text);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const getCheckSuggestionMappedTarget = (
    preset: AdvancedDicePreset,
    attrName: string,
    attrSource?: CharacterAttributeSource,
  ): AttributeQuickSelectTarget => {
    return resolveQuickSelectTarget(attrName, attrSource, preset, 'normal');
  };

  const getCheckSuggestionOutcomeResultType = (outcome: OutcomeLevel): string => {
    if (outcome.priority <= 10) return 'critSuccess';
    if (outcome.priority <= 30) return 'extremeSuccess';
    if (outcome.priority < 50) return 'success';
    if (outcome.priority === 50) return 'warning';
    if (outcome.priority < 90) return 'failure';
    return 'critFailure';
  };

  const isCheckSuggestionOutcomeSuccess = (outcome: OutcomeLevel): boolean => {
    return (
      getCheckSuggestionOutcomeResultType(outcome) === 'critSuccess' ||
      getCheckSuggestionOutcomeResultType(outcome) === 'extremeSuccess' ||
      getCheckSuggestionOutcomeResultType(outcome) === 'success'
    );
  };

  const resolveCheckSuggestionFieldValue = (
    field: CustomFieldConfig,
    params: CheckSuggestionParams,
    characterName: string,
  ): string | number | boolean => {
    const rawValue = params[field.id];
    if (rawValue === undefined || rawValue === '') return field.defaultValue;
    if (field.type === 'number') {
      return resolveCheckSuggestionNumberParam(rawValue, characterName, Number(field.defaultValue) || 0);
    }
    if (field.type === 'toggle') {
      if (typeof rawValue === 'boolean') return rawValue;
      return /^(true|是|启用|开启|1)$/i.test(String(rawValue));
    }
    if (field.type === 'select') {
      if (typeof rawValue === 'number' || typeof rawValue === 'boolean') return rawValue;
      const parsed = parseCheckSuggestionPrimitiveValue(String(rawValue));
      return parsed;
    }
    return rawValue;
  };

  interface CheckSuggestionPresetSideResult {
    characterName: string;
    attributeName: string;
    attrValue: number;
    attrMod: number;
    dc: number;
    mod: number;
    skillMod: number;
    customValues: Record<string, string | number | boolean>;
    derivedValues: Record<string, number>;
    diceExpression: string;
    rollResult: RollResult;
    rollTotal: number;
    context: Record<string, string | number | boolean | RollResult>;
    outcome: OutcomeLevel;
    conditionExpr: string;
    judgeResultText: string;
    displayValue: string | number;
    outputVars: Record<string, string | number | boolean>;
  }

  const replaceCheckSuggestionConditionVars = (
    expression: string,
    context: Record<string, string | number | boolean | RollResult>,
    rollResult: RollResult,
  ): string => {
    let result = expression.replace(/\$roll\.hasTag\s*\(\s*['"]([^'"]+)['"]\s*\)/gi, (_match, tag) => {
      return (rollResult.tags ?? []).includes(tag) ? '成立' : '不成立';
    });
    result = result.replace(/\$roll\.total/g, String(rollResult.total)).replace(/\$roll/g, String(rollResult.total));
    const keys = Object.keys(context)
      .filter(key => key !== '$roll' && key !== '$roll.total')
      .sort((a, b) => b.length - a.length);
    keys.forEach(key => {
      const value = context[key];
      if (typeof value === 'object') return;
      const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      result = result.replace(new RegExp(safeKey, 'g'), String(value));
    });
    return result.replace(/\s*\+\s*0(?=\s*[+\->=<]|\s*$)/g, '').replace(/^\s*0\s*\+\s*/g, '');
  };

  const evaluateCheckSuggestionOutcome = (
    preset: AdvancedDicePreset,
    context: Record<string, string | number | boolean | RollResult>,
  ): AdvancedPresetOutcomePolicyResult => {
    const matchedOutcome = evaluateOutcomes(preset.outcomes, context as Record<string, number>);
    return applyAdvancedPresetOutcomePolicy(preset, matchedOutcome, context);
  };

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
    const defaultAttr = resolveCheckSuggestionDefaultValue(preset.attribute?.defaultValue, {});
    const rawAttrEntry = getAttributeEntryForCharacter(input.characterName, input.attributeName);
    const mappedTarget = getCheckSuggestionMappedTarget(preset, input.attributeName, rawAttrEntry?.source);
    const rawAttrValue = rawAttrEntry?.value ?? null;
    let attrValue = defaultAttr;
    if (input.params.attr !== undefined) {
      attrValue = resolveCheckSuggestionNumberParam(input.params.attr, input.characterName, defaultAttr);
    } else if (input.targetValue !== undefined && input.targetValue !== null) {
      attrValue = input.targetValue;
    } else if (mappedTarget !== 'skillMod' && rawAttrValue !== null) {
      attrValue = rawAttrValue;
    }

    const dc = resolveCheckSuggestionNumberParam(
      input.params.dc,
      input.characterName,
      resolveCheckSuggestionDefaultValue(preset.dc?.defaultValue, { $attr: attrValue }),
    );
    const mod = resolveCheckSuggestionNumberParam(
      input.params.mod,
      input.characterName,
      preset.mod?.hidden && input.params.mod === undefined
        ? 0
        : resolveCheckSuggestionDefaultValue(preset.mod?.defaultValue, { $attr: attrValue }),
      { preferAttribute: false },
    );
    let skillMod = resolveCheckSuggestionNumberParam(
      input.params.skillMod,
      input.characterName,
      resolveCheckSuggestionDefaultValue(preset.skillMod?.defaultValue, { $attr: attrValue }),
    );
    if (input.params.skillMod === undefined && mappedTarget === 'skillMod' && rawAttrValue !== null) {
      skillMod = rawAttrValue;
    }

    let attrMod = 0;
    if (preset.attribute?.computeModifier) {
      attrMod = evaluateConditionNumber(preset.attribute.computeModifier, { $attr: attrValue }, 0);
    }

    const customValues: Record<string, string | number | boolean> = {};
    if (Array.isArray(preset.customFields)) {
      preset.customFields.forEach(field => {
        customValues[`$${field.id}`] = resolveCheckSuggestionFieldValue(field, input.params, input.characterName);
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
        const evalResult = evaluateCondition(spec.expr, { ...baseContext, ...derivedValues } as Record<string, number>);
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
          const conditionResult = evaluateCondition(patch.when, patchContext as Record<string, number>);
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
        const evalResult = evaluateCondition(spec.expr, { ...postRollContext, ...postRollDerivedValues } as Record<
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
    const outcomeResult = evaluateCheckSuggestionOutcome(preset, context);
    const outcome = outcomeResult.outcome;
    const displayOutcome = getAdvancedPresetDisplayOutcome(outcomeResult);
    const displayExpr = displayOutcome.displayExpr ?? displayOutcome.condition;
    const conditionExpr = replaceCheckSuggestionConditionVars(displayExpr, context, rollResult);
    const displayExprResult = evaluateCondition(displayExpr, context as Record<string, number>);
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

  const buildCheckSuggestionSideParams = (
    params: CheckSuggestionParams,
    side: 'left' | 'right',
  ): CheckSuggestionParams => {
    const result: CheckSuggestionParams = {};
    Object.entries(params).forEach(([key, value]) => {
      if (key === 'preset') return;
      const lowerKey = key.toLowerCase();
      const isLeft = lowerKey.startsWith('left');
      const isRight = lowerKey.startsWith('right');
      if (!isLeft && !isRight) {
        result[key] = value;
        return;
      }
      if ((side === 'left' && isLeft) || (side === 'right' && isRight)) {
        const prefixLength = side === 'left' ? 4 : 5;
        const stripped = key.slice(prefixLength);
        const normalizedKey = stripped ? stripped.charAt(0).toLowerCase() + stripped.slice(1) : key;
        result[normalizedKey] = value;
      }
    });
    return result;
  };

  const resolveCheckSuggestionContestWinner = (
    preset: AdvancedDicePreset,
    left: CheckSuggestionPresetSideResult,
    right: CheckSuggestionPresetSideResult,
    command: Extract<CheckSuggestionParsedCommand, { kind: 'contest' }>,
  ): 'initiator' | 'opponent' | 'tie' => {
    const contestRule = preset.contestRule;
    let winner: 'initiator' | 'opponent' | 'tie' = 'tie';
    const leftTotal = left.rollTotal + left.attrMod + left.skillMod + left.mod;
    const rightTotal = right.rollTotal + right.attrMod + right.skillMod + right.mod;

    switch (contestRule?.mode ?? 'rank') {
      case 'rank': {
        const leftRank = left.outcome.contestRank ?? 50;
        const rightRank = right.outcome.contestRank ?? 50;
        if (leftRank > rightRank) winner = 'initiator';
        else if (rightRank > leftRank) winner = 'opponent';
        break;
      }
      case 'value':
      case 'margin': {
        if (leftTotal > rightTotal) winner = 'initiator';
        else if (rightTotal > leftTotal) winner = 'opponent';
        break;
      }
      case 'custom': {
        if (contestRule?.customExpr) {
          const conditionResult = evaluateCondition(contestRule.customExpr, {
            $initValue: leftTotal,
            $oppValue: rightTotal,
            $initRank: left.outcome.contestRank ?? 50,
            $oppRank: right.outcome.contestRank ?? 50,
          });
          if (conditionResult.success) {
            const matched =
              typeof conditionResult.value === 'number' ? conditionResult.value !== 0 : Boolean(conditionResult.value);
            winner = matched ? 'initiator' : 'opponent';
          }
        }
        break;
      }
    }

    if (winner === 'tie' && command.hasExplicitTieRule) {
      if (command.tieRule === 'initiator_win') return 'initiator';
      if (command.tieRule === 'initiator_lose') return 'opponent';
      return 'tie';
    }

    const tieBreakers =
      Array.isArray(contestRule?.tieBreakers) && contestRule.tieBreakers.length > 0
        ? contestRule.tieBreakers
        : contestRule?.tieBreaker
          ? [contestRule.tieBreaker]
          : [];
    if (winner === 'tie') {
      for (const tieBreaker of tieBreakers) {
        if (tieBreaker === 'higher_attr') {
          if (left.attrValue > right.attrValue) winner = 'initiator';
          else if (right.attrValue > left.attrValue) winner = 'opponent';
        } else if (tieBreaker === 'higher_roll') {
          if (left.rollTotal > right.rollTotal) winner = 'initiator';
          else if (right.rollTotal > left.rollTotal) winner = 'opponent';
        } else if (tieBreaker === 'initiator_wins') {
          winner = 'initiator';
        } else if (tieBreaker === 'status_quo') {
          winner = 'tie';
        }
        if (winner !== 'tie') break;
      }
    }
    return winner;
  };

  const executeAdvancedCheckSuggestion = (command: Extract<CheckSuggestionParsedCommand, { kind: 'check' }>) => {
    refreshNameAliasesForCheckSuggestion();
    const presetId = command.rawParams.preset || null;
    const preset = getCheckSuggestionPresetById(presetId);
    if (!preset) throw new Error('未找到可用检定预设');
    const params = normalizeCheckSuggestionParams(command.rawParams, preset);
    const characterName = resolveCheckSuggestionCharacterName(command.characterName);
    const side = buildCheckSuggestionPresetSide(preset, {
      characterName,
      attributeName: command.attributeName,
      params,
      targetValue: command.targetValue,
      diceExpression: command.hasExplicitDice ? command.diceType : undefined,
    });
    const outcomeText = side.outcome.name || '判定完成';
    const outcomeTextRaw = side.outcome.outputText || '';
    const attrModStr = side.attrMod >= 0 ? `+${side.attrMod}` : String(side.attrMod);
    const skillModStr = side.skillMod >= 0 ? `+${side.skillMod}` : String(side.skillMod);
    const skillModText = side.skillMod !== 0 ? `+技能加值${skillModStr}` : '';
    const modText = side.mod !== 0 ? `+额外加值${side.mod >= 0 ? '+' + side.mod : side.mod}` : '';
    const attrModText = side.attrMod !== 0 ? `(调整值${attrModStr})` : '';
    const effectVars = computePendingEffectVariables(side.outcome.effects);
    const checkValueText = buildCheckValueText({
      preset,
      characterName,
      actionName: command.attributeName,
      attrValue: side.attrValue,
      attrMod: side.attrMod,
      skillMod: side.skillMod,
      mode: 'normal',
      attrNameOverride: getNamedCheckParamText(params.attr),
      skillNameOverride: getNamedCheckParamText(params.skillMod),
    });
    const outputContext: Record<string, string | number | undefined> = {
      initiator: characterName,
      attrName: `【${command.attributeName}】`,
      attrValue: side.attrValue,
      attrMod: attrModStr,
      displayValue: side.displayValue,
      skillMod: skillModStr,
      skillModText,
      modText,
      attrModText,
      checkValueText,
      formula: side.diceExpression,
      roll: side.rollTotal,
      'roll.total': side.rollTotal,
      dc: side.dc,
      mod: side.mod,
      attr: side.attrValue,
      conditionExpr: side.conditionExpr,
      judgeResult: side.judgeResultText,
      outcomeName: outcomeText,
      outcomeText: outcomeTextRaw,
      ...(side.outputVars as Record<string, string | number>),
      ...(effectVars as Record<string, string | number>),
    };
    outputContext.outcomeText = formatOutputTemplate(String(outputContext.outcomeText || ''), outputContext);
    const template = preset.outputTemplate || DEFAULT_OUTPUT_TEMPLATE;
    const diceResultText = formatOutputTemplate(template, outputContext);
    smartInsertToTextarea(diceResultText, 'dice');

    const isSuccess = isCheckSuggestionOutcomeSuccess(side.outcome);
    const checkResult: AcuDice.CheckResult = {
      success: isSuccess,
      total: side.rollTotal,
      target: side.dc || side.attrValue,
      outcomeText,
      attrName: command.attributeName,
      criteria: 'advanced',
      isAutoTarget: command.targetValue === null && params.attr === undefined,
      formula: side.diceExpression,
    };
    const detailId = `check_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const checkResultWithTimestamp = {
      ...checkResult,
      timestamp: Date.now(),
      detailId,
      initiatorName: characterName,
      historyType: 'check' as const,
      detailLines: [
        `发起者: ${replaceUserPlaceholders(characterName)}`,
        `属性: ${command.attributeName} (值=${side.attrValue})`,
        `预设: ${preset.name}`,
        `公式: ${side.diceExpression}`,
        `掷骰: ${side.rollTotal}`,
        `目标: ${side.dc || side.attrValue}`,
        `修正: attrMod=${attrModStr}, skillMod=${skillModStr}, mod=${side.mod >= 0 ? '+' + side.mod : side.mod}`,
        `判定: ${side.conditionExpr}`,
        `结果: ${outcomeText}`,
      ],
    };
    checkHistory.push(checkResultWithTimestamp);
    if (checkHistory.length > MAX_HISTORY) checkHistory.shift();
    emitEvent('check', checkResultWithTimestamp);
  };

  const executeAdvancedContestCheckSuggestion = (
    command: Extract<CheckSuggestionParsedCommand, { kind: 'contest' }>,
  ) => {
    refreshNameAliasesForCheckSuggestion();
    const presetId = command.rawParams.preset || null;
    const preset = getCheckSuggestionPresetById(presetId);
    if (!preset) throw new Error('未找到可用检定预设');
    if (!AdvancedDicePresetManager.supportsContest(preset)) {
      throw new Error(`当前检定预设「${preset.name}」不支持对抗检定`);
    }
    const params = normalizeCheckSuggestionParams(command.rawParams, preset);
    const leftName = resolveCheckSuggestionCharacterName(command.leftName);
    const rightName = resolveCheckSuggestionCharacterName(command.rightName);
    const leftParams = buildCheckSuggestionSideParams(params, 'left');
    const rightParams = buildCheckSuggestionSideParams(params, 'right');
    const left = buildCheckSuggestionPresetSide(preset, {
      characterName: leftName,
      attributeName: command.leftAttribute,
      params: leftParams,
      diceExpression: command.hasExplicitDice ? command.diceType : undefined,
    });
    const right = buildCheckSuggestionPresetSide(preset, {
      characterName: rightName,
      attributeName: command.rightAttribute,
      params: rightParams,
      diceExpression: command.hasExplicitDice ? command.diceType : undefined,
    });
    const winnerSide = resolveCheckSuggestionContestWinner(preset, left, right, command);
    const leftDisplayName = replaceUserPlaceholders(leftName);
    const rightDisplayName = replaceUserPlaceholders(rightName);
    const winnerText =
      winnerSide === 'initiator'
        ? `${leftDisplayName} 胜利`
        : winnerSide === 'opponent'
          ? `${rightDisplayName} 胜利`
          : '平局';
    const leftTotal = left.rollTotal + left.attrMod + left.skillMod + left.mod;
    const rightTotal = right.rollTotal + right.attrMod + right.skillMod + right.mod;
    const margin = leftTotal - rightTotal;
    const signed = (value: number): string => (value >= 0 ? `+${value}` : String(value));
    const template = preset.contestOutputTemplate || DEFAULT_CONTEST_OUTPUT_TEMPLATE;
    const initCheckValueText = buildCheckValueText({
      preset,
      characterName: leftName,
      actionName: command.leftAttribute,
      attrValue: left.attrValue,
      attrMod: left.attrMod,
      skillMod: left.skillMod,
      mode: 'contest',
      attrNameOverride: getNamedCheckParamText(leftParams.attr),
      skillNameOverride: getNamedCheckParamText(leftParams.skillMod),
    });
    const oppCheckValueText = buildCheckValueText({
      preset,
      characterName: rightName,
      actionName: command.rightAttribute,
      attrValue: right.attrValue,
      attrMod: right.attrMod,
      skillMod: right.skillMod,
      mode: 'contest',
      attrNameOverride: getNamedCheckParamText(rightParams.attr),
      skillNameOverride: getNamedCheckParamText(rightParams.skillMod),
    });
    const contestOutputContext: Record<string, string | number | undefined> = {
      initiator: leftName,
      opponent: rightName,
      initAttrName: command.leftAttribute,
      oppAttrName: command.rightAttribute,
      initRoll: left.rollTotal,
      oppRoll: right.rollTotal,
      initDisplayValue: left.displayValue,
      oppDisplayValue: right.displayValue,
      initTarget: left.dc,
      oppTarget: right.dc,
      initSuccessName: left.outcome.name,
      oppSuccessName: right.outcome.name,
      winner: winnerText,
      outcomeText: left.outcome.outputText || left.outcome.name || '判定完成',
      outcomeName: left.outcome.name,
      conditionExpr: left.conditionExpr,
      judgeResult: left.judgeResultText,
      formula: left.diceExpression,
      initFormula: left.diceExpression,
      oppFormula: right.diceExpression,
      roll: left.rollTotal,
      dc: left.dc,
      mod: left.mod,
      attr: left.attrValue,
      attrName: `【${command.leftAttribute}】`,
      initOutcomeText: left.outcome.outputText || left.outcome.name || '判定完成',
      oppOutcomeText: right.outcome.outputText || right.outcome.name || '判定完成',
      initConditionExpr: left.conditionExpr,
      oppConditionExpr: right.conditionExpr,
      initJudgeResult: left.judgeResultText,
      oppJudgeResult: right.judgeResultText,
      initAttrMod: left.attrMod,
      oppAttrMod: right.attrMod,
      initSkillMod: left.skillMod,
      oppSkillMod: right.skillMod,
      initMod: left.mod,
      oppMod: right.mod,
      initAttrModText: left.attrMod !== 0 ? `，调整值${signed(left.attrMod)}` : '',
      oppAttrModText: right.attrMod !== 0 ? `，调整值${signed(right.attrMod)}` : '',
      initSkillModText: left.skillMod !== 0 ? `+技能加值${signed(left.skillMod)}` : '',
      oppSkillModText: right.skillMod !== 0 ? `+技能加值${signed(right.skillMod)}` : '',
      initModText: left.mod !== 0 ? `+额外加值${signed(left.mod)}` : '',
      oppModText: right.mod !== 0 ? `+额外加值${signed(right.mod)}` : '',
      initCheckValueText,
      oppCheckValueText,
      initTotal: leftTotal,
      oppTotal: rightTotal,
      margin,
      shifts: margin,
      initAttr: left.attrValue,
      oppAttr: right.attrValue,
    };
    const contestResultText = formatOutputTemplate(template, contestOutputContext);
    smartInsertToTextarea(contestResultText, 'dice');

    const contestResult: AcuDice.ContestResult = {
      left: {
        name: leftName,
        attribute: command.leftAttribute,
        roll: left.rollTotal,
        target: left.dc || left.attrValue,
        successLevel: left.outcome.contestRank ?? 0,
      },
      right: {
        name: rightName,
        attribute: command.rightAttribute,
        roll: right.rollTotal,
        target: right.dc || right.attrValue,
        successLevel: right.outcome.contestRank ?? 0,
      },
      winner: winnerSide === 'initiator' ? 'left' : winnerSide === 'opponent' ? 'right' : 'tie',
      message: winnerText,
    };
    const timestamp = Date.now();
    const contestResultWithTimestamp = {
      ...contestResult,
      timestamp,
      detailId: `contest_${timestamp}_${Math.random().toString(36).slice(2, 8)}`,
      historyType: 'contest' as const,
      detailLines: [
        `发起方: ${leftDisplayName} / 对抗方: ${rightDisplayName}`,
        `属性: ${command.leftAttribute} vs ${command.rightAttribute}`,
        `预设: ${preset.name}`,
        `公式: ${left.diceExpression} vs ${right.diceExpression}`,
        `掷骰: ${left.rollTotal} vs ${right.rollTotal}`,
        `总值: ${leftTotal} vs ${rightTotal}`,
        `判定: ${left.conditionExpr} | ${right.conditionExpr}`,
        `结果: ${winnerText}`,
      ],
    };
    contestHistory.push(contestResultWithTimestamp);
    if (contestHistory.length > MAX_HISTORY) contestHistory.shift();
    emitEvent('contest', contestResultWithTimestamp);
  };

  const executeFixedCheckSuggestion = (success: boolean) => {
    const label = success ? '必定成功' : '必定失败';
    smartInsertToTextarea(buildCheckSuggestionMetaBlock(`元叙事：无需投骰，【${label}】。`), 'dice');
  };

  const executeNormalCheckSuggestion = (command: Extract<CheckSuggestionParsedCommand, { kind: 'check' }>) => {
    refreshNameAliasesForCheckSuggestion();
    const characterName = resolveCheckSuggestionCharacterName(command.characterName);
    const targetValue = command.targetValue ?? getAttributeValue(characterName, command.attributeName);
    if (targetValue === null) {
      throw new Error(`未找到 ${replaceUserPlaceholders(characterName)} 的属性「${command.attributeName}」`);
    }

    const rollResult = rollComplexDiceExpression(command.diceType);
    if (Number.isNaN(rollResult.total)) {
      throw new Error(`无效的骰子公式：${command.diceType}`);
    }

    const sides = getCheckSuggestionDiceSides(command.diceType);
    const finalRoll = rollResult.total;
    const successLevel = getSuccessLevel(finalRoll, targetValue, sides);
    const success = command.criteria === 'gte' ? finalRoll >= targetValue : successLevel.level >= 0;
    const outcomeText = command.criteria === 'gte' ? (success ? '成功' : '失败') : successLevel.name;
    const judgeExpr = command.criteria === 'gte' ? `需≥${targetValue}` : `需≤${targetValue}`;
    const displayName = replaceUserPlaceholders(characterName);
    const metaContent = `元叙事：${displayName}发起了【${command.attributeName}】检定，${command.diceType}=${finalRoll}，${judgeExpr}，【${outcomeText}】。`;
    smartInsertToTextarea(buildCheckSuggestionMetaBlock(metaContent), 'dice');

    const timestamp = Date.now();
    const detailId = `check_${timestamp}_${Math.random().toString(36).slice(2, 8)}`;
    const checkResultWithTimestamp = {
      success,
      roll: finalRoll,
      total: finalRoll,
      target: targetValue,
      margin: command.criteria === 'gte' ? finalRoll - targetValue : targetValue - finalRoll,
      criticalSuccess: sides === 100 ? finalRoll <= 5 : finalRoll === sides,
      criticalFailure: sides === 100 ? finalRoll >= 96 : finalRoll === 1,
      message: outcomeText,
      diceType: command.diceType,
      rule: command.criteria === 'gte' ? ('dnd' as const) : ('coc' as const),
      outcomeText,
      attrName: command.attributeName,
      formula: command.diceType,
      criteria: command.criteria,
      isAutoTarget: command.targetValue === null,
      timestamp,
      detailId,
      initiatorName: characterName,
      historyType: 'check' as const,
      detailLines: [
        `发起者: ${displayName}`,
        `属性: ${command.attributeName} (值=${targetValue})`,
        `公式: ${command.diceType}`,
        `掷骰: ${finalRoll}`,
        `判定: ${judgeExpr}`,
        `结果: ${outcomeText}`,
      ],
    };
    checkHistory.push(checkResultWithTimestamp);
    if (checkHistory.length > MAX_HISTORY) {
      checkHistory.shift();
    }
    emitEvent('check', checkResultWithTimestamp);
  };

  const executeContestCheckSuggestion = (command: Extract<CheckSuggestionParsedCommand, { kind: 'contest' }>) => {
    refreshNameAliasesForCheckSuggestion();
    const leftName = resolveCheckSuggestionCharacterName(command.leftName);
    const rightName = resolveCheckSuggestionCharacterName(command.rightName);
    const leftTarget = getAttributeValue(leftName, command.leftAttribute);
    const rightTarget = getAttributeValue(rightName, command.rightAttribute);
    if (leftTarget === null) {
      throw new Error(`未找到 ${replaceUserPlaceholders(leftName)} 的属性「${command.leftAttribute}」`);
    }
    if (rightTarget === null) {
      throw new Error(`未找到 ${replaceUserPlaceholders(rightName)} 的属性「${command.rightAttribute}」`);
    }

    const leftRoll = rollComplexDiceExpression(command.diceType).total;
    const rightRoll = rollComplexDiceExpression(command.diceType).total;
    if (Number.isNaN(leftRoll) || Number.isNaN(rightRoll)) {
      throw new Error(`无效的骰子公式：${command.diceType}`);
    }

    const sides = getCheckSuggestionDiceSides(command.diceType);
    const leftLevel = getSuccessLevel(leftRoll, leftTarget, sides);
    const rightLevel = getSuccessLevel(rightRoll, rightTarget, sides);
    let winner: 'left' | 'right' | 'tie';

    if (leftLevel.level > rightLevel.level) {
      winner = 'left';
    } else if (leftLevel.level < rightLevel.level) {
      winner = 'right';
    } else if (command.tieRule === 'initiator_win') {
      winner = 'left';
    } else if (command.tieRule === 'tie') {
      winner = 'tie';
    } else {
      winner = 'right';
    }

    const leftDisplayName = replaceUserPlaceholders(leftName);
    const rightDisplayName = replaceUserPlaceholders(rightName);
    const winnerText =
      winner === 'left' ? `${leftDisplayName}胜出` : winner === 'right' ? `${rightDisplayName}胜出` : '双方平局';
    const message = `${winnerText}（${leftLevel.name} vs ${rightLevel.name}）`;
    const metaContent = `元叙事：${leftDisplayName}以【${command.leftAttribute}】对抗${rightDisplayName}的【${command.rightAttribute}】，${command.diceType}=${leftRoll}/${rightRoll}，目标=${leftTarget}/${rightTarget}，结果：${message}。`;
    smartInsertToTextarea(buildCheckSuggestionMetaBlock(metaContent), 'dice');

    const contestResult: AcuDice.ContestResult = {
      left: {
        name: leftName,
        attribute: command.leftAttribute,
        roll: leftRoll,
        target: leftTarget,
        successLevel: leftLevel.level,
      },
      right: {
        name: rightName,
        attribute: command.rightAttribute,
        roll: rightRoll,
        target: rightTarget,
        successLevel: rightLevel.level,
      },
      winner,
      message,
    };
    const timestamp = Date.now();
    const contestResultWithTimestamp = {
      ...contestResult,
      timestamp,
      detailId: `contest_${timestamp}_${Math.random().toString(36).slice(2, 8)}`,
      historyType: 'contest' as const,
      detailLines: [
        `发起方: ${leftDisplayName} / 对抗方: ${rightDisplayName}`,
        `属性: ${command.leftAttribute} vs ${command.rightAttribute}`,
        `公式: ${command.diceType}`,
        `掷骰: ${leftRoll} vs ${rightRoll}`,
        `目标: ${leftTarget} vs ${rightTarget}`,
        `成功等级: ${leftLevel.name} vs ${rightLevel.name}`,
        `平手规则: ${command.tieRule}`,
        `结果: ${message}`,
      ],
    };
    contestHistory.push(contestResultWithTimestamp);
    if (contestHistory.length > MAX_HISTORY) {
      contestHistory.shift();
    }
    emitEvent('contest', contestResultWithTimestamp);
  };

  const executeCheckSuggestionCommand = (displayText: string, commandText: string): boolean => {
    const parsed = parseCheckSuggestionCommand(commandText);
    if (parsed.kind === 'invalid') {
      if (window.toastr) showActionableErrorToast(buildCheckSuggestionInvalidCommandMessage(parsed.reason));
      console.warn('[DICE] 检定建议命令解析失败:', commandText, parsed.reason);
      return false;
    }

    try {
      const actionText = normalizeCheckSuggestionActionText(displayText);
      const insertActionText = () => {
        if (actionText) {
          smartInsertToTextarea(actionText, 'action');
        }
      };

      if (parsed.kind === 'none') {
        insertActionText();
        return true;
      }
      if (parsed.kind === 'fixed') {
        executeFixedCheckSuggestion(parsed.success);
        insertActionText();
        return true;
      }
      if (parsed.kind === 'check') {
        try {
          executeAdvancedCheckSuggestion(parsed);
        } catch (advancedError) {
          if (!parsed.hasExplicitDice && parsed.targetValue === null) throw advancedError;
          console.warn('[DICE] 检定建议高级预设执行失败，回退旧式检定:', advancedError);
          executeNormalCheckSuggestion(parsed);
        }
        insertActionText();
        return true;
      }
      try {
        executeAdvancedContestCheckSuggestion(parsed);
      } catch (advancedError) {
        if (!parsed.hasExplicitDice) throw advancedError;
        console.warn('[DICE] 检定建议高级预设对抗执行失败，回退旧式对抗:', advancedError);
        executeContestCheckSuggestion(parsed);
      }
      insertActionText();
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (window.toastr) showActionableErrorToast(message);
      console.error('[DICE] 执行检定建议失败:', error);
      return false;
    }
  };

  /**
   * AcuDice 公共 API
   * 提供骰子投掷和检定功能给外部插件使用
   */
  const AcuDiceAPI = {
    /** API 版本号 */
    version: '1.3.0',

    /**
     * 骰子投掷（同步）
     * @param formula 骰子表达式，如 "2d6", "1d20+5", "4d6kh3"
     * @returns 投掷结果对象
     * @example
     * AcuDice.roll('2d6') // => { total: 7, formula: '2d6', breakdown: '2d6 = 7' }
     * AcuDice.roll('1d20+5') // => { total: 15, formula: '1d20+5', breakdown: '1d20+5 = 15' }
     */
    roll(formula: string): { total: number; formula: string; breakdown: string } {
      if (!formula || typeof formula !== 'string') {
        throw new Error('[AcuDice] roll() 需要一个有效的骰子表达式字符串');
      }
      // 校验公式：必须包含骰子表达式（如 2d6）或是纯数学运算（如 3+5）
      const hasDice = /\d*d(\d+|F)/i.test(formula);
      const isMath = /^[\d\s+\-*/().]+$/.test(formula.trim());
      if (!hasDice && !isMath) {
        throw new Error(`[AcuDice] 无效的骰子表达式: ${formula}`);
      }
      const total = evaluateFormula(formula, {});
      return {
        total,
        formula,
        breakdown: `${formula} = ${total}`,
      };
    },

    /**
     * 属性/技能检定（异步）
     * @param options 检定选项
     * @returns 检定结果对象
     * @example
     * await AcuDice.check({ attribute: '力量' })
     * await AcuDice.check({ attribute: '力量', targetValue: 50, diceType: '1d100' })
     */
    async check(
      options: {
        attribute?: string;
        skill?: string;
        targetValue?: number;
        diceType?: string;
        successCriteria?: 'lte' | 'gte';
        modifier?: number;
      } = {},
    ): Promise<{
      success: boolean;
      roll: number;
      target: number;
      margin: number;
      criticalSuccess: boolean;
      criticalFailure: boolean;
      message: string;
      diceType: string;
      rule: 'coc' | 'dnd';
    }> {
      const diceCfg = getDiceConfig();
      const diceType = options.diceType || diceCfg.lastDiceType || '1d100';
      const successCriteria = options.successCriteria || (diceType === '1d20' ? 'gte' : 'lte');
      const isDND = successCriteria === 'gte';
      const modifier = options.modifier || 0;

      // 获取目标值
      let targetValue = options.targetValue;

      // 如果指定了属性名但没有目标值，尝试从角色数据获取
      if (targetValue === undefined && (options.attribute || options.skill)) {
        const attrName = options.attribute || options.skill || '';
        const resolvedValue = getAttributeValue('<user>', attrName);
        if (resolvedValue !== null) targetValue = resolvedValue;

        if (targetValue === undefined) {
          throw new Error(`[AcuDice] 未找到属性或技能: ${attrName}`);
        }
      }

      if (targetValue === undefined) {
        throw new Error('[AcuDice] check() 需要 targetValue 或有效的 attribute/skill 名称');
      }

      // 投骰
      const rollResult = rollComplexDiceExpression(diceType);
      if (Number.isNaN(rollResult.total)) {
        throw new Error(`[AcuDice] 无效的骰子表达式: ${diceType}`);
      }

      const finalRoll = rollResult.total + modifier;
      const target = targetValue;

      // 判定结果
      let success = false;
      let criticalSuccess = false;
      let criticalFailure = false;
      let message = '';

      if (isDND) {
        // DND 规则: roll >= target 成功
        success = finalRoll >= target;
        criticalSuccess = rollResult.total === diceCfg.dndCritSuccess;
        criticalFailure = rollResult.total === diceCfg.dndCritFail;

        if (criticalSuccess) {
          success = true;
          message = `大成功！掷出 ${rollResult.total}${modifier ? ` + ${modifier}` : ''} = ${finalRoll}，DC ${target}`;
        } else if (criticalFailure) {
          success = false;
          message = `大失败！掷出 ${rollResult.total}${modifier ? ` + ${modifier}` : ''} = ${finalRoll}，DC ${target}`;
        } else if (success) {
          message = `成功！掷出 ${finalRoll} >= DC ${target}`;
        } else {
          message = `失败！掷出 ${finalRoll} < DC ${target}`;
        }
      } else {
        // COC 规则: roll <= target 成功
        success = finalRoll <= target;
        criticalSuccess = finalRoll <= diceCfg.critSuccessMax;
        criticalFailure = finalRoll >= diceCfg.critFailMin;

        if (criticalSuccess) {
          success = true;
          message = `大成功！掷出 ${finalRoll}，目标 ${target}`;
        } else if (criticalFailure) {
          success = false;
          message = `大失败！掷出 ${finalRoll}，目标 ${target}`;
        } else if (success) {
          const hardSuccess = finalRoll <= Math.floor(target / diceCfg.hardSuccessDiv);
          const extremeSuccess = finalRoll <= Math.floor(target / diceCfg.difficultSuccessDiv);
          if (extremeSuccess) {
            message = `极难成功！掷出 ${finalRoll} <= ${Math.floor(target / diceCfg.difficultSuccessDiv)}`;
          } else if (hardSuccess) {
            message = `困难成功！掷出 ${finalRoll} <= ${Math.floor(target / diceCfg.hardSuccessDiv)}`;
          } else {
            message = `成功！掷出 ${finalRoll} <= ${target}`;
          }
        } else {
          message = `失败！掷出 ${finalRoll} > ${target}`;
        }
      }

      const checkResult: AcuDice.CheckResult = {
        success,
        total: finalRoll,
        target,
        outcomeText: message,
        attrName: options.attribute || options.skill || '',
        formula: diceType,
        criteria: isDND ? 'gte' : 'lte',
        isAutoTarget: options.targetValue === undefined,
      };

      // 写入历史记录
      const detailId = `check_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const attrLabel = options.attribute || options.skill || '未指定';
      const checkResultWithTimestamp = {
        ...checkResult,
        timestamp: Date.now(),
        detailId,
        initiatorName: 'API',
        historyType: 'check' as const,
        detailLines: [
          `发起者: API`,
          `属性: ${attrLabel} (值=${target})`,
          `公式: ${diceType}`,
          `掷骰: ${finalRoll}`,
          `目标: ${target}`,
          ...(modifier ? [`修正: ${modifier >= 0 ? '+' + modifier : modifier}`] : []),
          `结果: ${message}`,
        ],
      };
      checkHistory.push(checkResultWithTimestamp);
      if (checkHistory.length > MAX_HISTORY) {
        checkHistory.shift();
      }

      // 触发事件
      emitEvent('check', checkResultWithTimestamp);

      return {
        success,
        roll: finalRoll,
        target,
        margin: isDND ? finalRoll - target : target - finalRoll,
        criticalSuccess,
        criticalFailure,
        message,
        diceType,
        rule: isDND ? 'dnd' : 'coc',
      };
    },

    /**
     * 初始化回调 - API 已就绪时调用
     * @param callback 回调函数
     */
    onReady(callback: () => void): void {
      if (typeof callback !== 'function') {
        console.warn('[AcuDice] onReady() 需要一个函数');
        return;
      }

      if (isAcuDiceReady) {
        runReadyCallback(callback);
        return;
      }

      readyCallbacks.push(callback);
    },

    /**
     * 订阅事件
     * @param event 事件类型 ('check' | 'contest')
     * @param handler 事件处理函数
     */
    on(event: string, handler: Function): void {
      if (!eventHandlers.has(event)) {
        eventHandlers.set(event, new Set());
      }
      eventHandlers.get(event)!.add(handler);
    },

    /**
     * 取消事件订阅
     * @param event 事件类型 ('check' | 'contest')
     * @param handler 事件处理函数
     */
    off(event: string, handler: Function): void {
      const handlers = eventHandlers.get(event);
      if (handlers) {
        handlers.delete(handler);
      }
    },

    /**
     * 获取最近一次普通检定结果
     */
    getLatestCheck(): (AcuDice.CheckResult & { timestamp: number }) | null {
      return checkHistory.length > 0 ? checkHistory[checkHistory.length - 1] : null;
    },

    /**
     * 获取最近一次对抗检定结果
     */
    getLatestContest(): (AcuDice.ContestResult & { timestamp: number }) | null {
      return contestHistory.length > 0 ? contestHistory[contestHistory.length - 1] : null;
    },

    /**
     * 获取历史记录
     * @param options 查询选项
     * @param options.limit 限制返回数量
     * @param options.type 筛选类型 ('check' | 'contest')
     */
    getHistory(options?: { limit?: number; type?: 'check' | 'contest' }): Array<any> {
      const limit = options?.limit;
      const type = options?.type;

      let results: Array<any> = [];

      if (!type || type === 'check') {
        results = results.concat(checkHistory.map(item => ({ ...item, _type: 'check' })));
      }
      if (!type || type === 'contest') {
        results = results.concat(contestHistory.map(item => ({ ...item, _type: 'contest' })));
      }

      // 按时间戳倒序排序
      results.sort((a, b) => b.timestamp - a.timestamp);

      // 应用 limit
      if (limit && limit > 0) {
        results = results.slice(0, limit);
      }

      return results;
    },

    /**
     * 获取所有预设列表（摘要信息）
     * @returns 预设摘要数组
     */
    listPresets(): Array<{ id: string; name: string; description?: string; builtin: boolean }> {
      const allPresets = ActionPresetManager.getAllPresets();
      return allPresets.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description || '',
        builtin: !!p.builtin,
      }));
    },

    /**
     * 获取当前激活的预设 ID
     * @returns 预设 ID 字符串，无激活预设时返回 null
     */
    getActivePresetId(): string | null {
      const id = ActionPresetManager.getActivePresetId();
      return id === '__none__' ? null : id;
    },

    /**
     * 获取指定预设的摘要信息
     * @param presetId 预设 ID
     * @returns 预设摘要，未找到时返回 null
     */
    getPresetSummary(presetId: string): { id: string; name: string; description?: string; builtin: boolean } | null {
      const preset = ActionPresetManager.getPresetById(presetId);
      if (!preset) return null;
      return {
        id: preset.id,
        name: preset.name,
        description: preset.description || '',
        builtin: !!preset.builtin,
      };
    },

    profiles: {
      async list(): Promise<DiceProfileSummary[]> {
        return await refreshDiceProfileIndex();
      },

      async saveCurrent(options: DiceProfileSaveCurrentOptions = {}): Promise<DiceProfileSummary> {
        const profile = await saveCurrentDiceProfile(options);
        return toDiceProfileSummary(profile);
      },

      async import(input: unknown, options: DiceProfileImportOptions = {}): Promise<DiceProfileSummary> {
        const profile = await importDiceProfile(input, options);
        return toDiceProfileSummary(profile);
      },

      async apply(profileId: string, options: DiceProfileApplyOptions = {}): Promise<DiceConfigBackupApplyStats> {
        return await applyDiceProfile(profileId, { createSnapshot: true, ...options });
      },

      async export(profileId: string): Promise<string> {
        return JSON.stringify(await exportDiceProfile(profileId), null, 2);
      },

      async detectCharacterProfile(
        options: { includeSkipped?: boolean } = {},
      ): Promise<{
        profile: DiceProfileSummary;
        promptKey: string;
        skipped: boolean;
        sourceTextKind: DiceCharacterProfileDetection['sourceTextKind'];
      } | null> {
        const detection = await detectCharacterDiceProfile(options);
        if (!detection) return null;
        const context = getDiceProfileCharacterContext();
        const promptState = getDiceProfilePromptState(context.chatId, detection.profile.fingerprint);
        return {
          profile: toDiceProfileSummary(detection.profile),
          promptKey: getAcuDiceProfilePromptKey(context.chatId, detection.profile.fingerprint),
          skipped: promptState === 'skipped',
          sourceTextKind: detection.sourceTextKind,
        };
      },
    },

    /**
     * 获取所有可用角色名列表
     * @returns 角色名数组，包括 '<user>' 和所有 NPC
     * @example
     * AcuDice.listCharacters() // => ['<user>', 'NPC1', 'NPC2']
     */
    listCharacters(): string[] {
      const rawData = getCachedRawData() || getTableData();
      if (!rawData) return [];

      const allTables = processJsonData(rawData || {});
      const characters: string[] = [];

      // 检查是否有主角信息
      const playerResult = DashboardDataParser.findTable(allTables, 'player');
      if (playerResult?.data?.rows?.length > 0) {
        characters.push('<user>');
      }

      // 获取所有 NPC
      const npcResult = DashboardDataParser.findTable(allTables, 'npc');
      if (npcResult) {
        const npcParsed = DashboardDataParser.parseRows(npcResult, 'npc');
        npcParsed.forEach(npc => {
          if (npc.name && typeof npc.name === 'string') {
            characters.push(npc.name);
          }
        });
      }

      return characters;
    },

    /**
     * 获取指定角色的所有属性
     * @param name 角色名，可以是 '<user>' 或 NPC 名称
     * @returns 属性数组，每个元素包含 name 和 value
     * @example
     * AcuDice.getCharacterAttributes('<user>') // => [{ name: '力量', value: 50 }, { name: '敏捷', value: 60 }]
     * AcuDice.getCharacterAttributes('张三') // => [{ name: '力量', value: 70 }]
     */
    getCharacterAttributes(name: string): Array<{ name: string; value: number }> {
      if (!name || typeof name !== 'string') {
        throw new Error('[AcuDice] getCharacterAttributes() 需要一个有效的角色名');
      }
      return getFullAttributesForCharacter(name);
    },

    /**
     * 获取指定角色的指定属性值
     * @param name 角色名
     * @param attribute 属性名
     * @returns 属性值，如果未找到则返回 null
     * @example
     * AcuDice.getAttributeValue('<user>', '力量') // => 50
     * AcuDice.getAttributeValue('张三', '敏捷') // => 60
     */
    getAttributeValue(name: string, attribute: string): number | null {
      if (!name || typeof name !== 'string') {
        throw new Error('[AcuDice] getAttributeValue() 需要一个有效的角色名');
      }
      if (!attribute || typeof attribute !== 'string') {
        throw new Error('[AcuDice] getAttributeValue() 需要一个有效的属性名');
      }
      return getAttributeValue(name, attribute);
    },

    /**
     * 按角色名和属性名进行便捷检定
     * @param options 检定选项
     * @returns 检定结果对象
     * @example
     * await AcuDice.checkByCharacter({ name: '<user>', attribute: '力量' })
     * await AcuDice.checkByCharacter({ name: 'NPC1', attribute: '敏捷', modifier: 5 })
     */
    async checkByCharacter(options: {
      name: string;
      attribute: string;
      modifier?: number;
      diceType?: string;
      successCriteria?: 'lte' | 'gte';
    }): Promise<{
      success: boolean;
      roll: number;
      target: number;
      margin: number;
      criticalSuccess: boolean;
      criticalFailure: boolean;
      message: string;
      diceType: string;
      rule: 'coc' | 'dnd';
    }> {
      if (!options || !options.name || !options.attribute) {
        throw new Error('[AcuDice] checkByCharacter() 需要 name 和 attribute 参数');
      }

      // 获取角色属性值
      const targetValue = getAttributeValue(options.name, options.attribute);
      if (targetValue === null) {
        throw new Error(`[AcuDice] 未找到角色 "${options.name}" 的属性 "${options.attribute}"`);
      }

      // 调用现有的 check 方法
      return this.check({
        attribute: options.attribute,
        targetValue,
        modifier: options.modifier,
        diceType: options.diceType,
        successCriteria: options.successCriteria,
      });
    },

    /**
     * 对抗检定
     * @param options 对抗检定选项
     * @returns 对抗检定结果
     * @example
     * await AcuDice.contest({
     *   left: { name: '<user>', attribute: '力量' },
     *   right: { name: 'NPC1', attribute: '力量' }
     * })
     */
    async contest(options: {
      left?: { name: string; attribute: string; targetValue?: number };
      right?: { name: string; attribute: string; targetValue?: number };
      /** @deprecated 使用 left 代替 */
      attacker?: { name: string; attribute: string; targetValue?: number };
      /** @deprecated 使用 right 代替 */
      defender?: { name: string; attribute: string; targetValue?: number };
      rule?: 'initiator_win' | 'initiator_lose' | 'tie';
      diceType?: string;
    }): Promise<{
      left: { name: string; attribute: string; roll: number; target: number; successLevel: number };
      right: { name: string; attribute: string; roll: number; target: number; successLevel: number };
      winner: 'left' | 'right' | 'tie';
      message: string;
    }> {
      // 兼容 attacker/defender 别名
      const left = options?.left || options?.attacker;
      const right = options?.right || options?.defender;

      if (!left?.name || !left?.attribute) {
        throw new Error('[AcuDice] contest() 需要 left.name 和 left.attribute 参数');
      }
      if (!right?.name || !right?.attribute) {
        throw new Error('[AcuDice] contest() 需要 right.name 和 right.attribute 参数');
      }

      try {
        const rawDataForAlias = getCachedRawData() || getTableData();
        if (rawDataForAlias) {
          NameAliasRegistry.rebuild(processJsonData(rawDataForAlias || {}));
        }
      } catch (error) {
        console.warn('[AcuDice] contest() 别名映射刷新失败', error);
      }

      const leftName = resolveCanonicalCharacterName(left.name);
      const rightName = resolveCanonicalCharacterName(right.name);

      // 获取双方属性值（优先使用 targetValue，否则从角色数据查找）
      let leftTarget = left.targetValue ?? null;
      if (leftTarget === null) {
        leftTarget = getAttributeValue(leftName, left.attribute);
        if (leftTarget === null) {
          throw new Error(`[AcuDice] 未找到角色 "${leftName}" 的属性 "${left.attribute}"`);
        }
      }

      let rightTarget = right.targetValue ?? null;
      if (rightTarget === null) {
        rightTarget = getAttributeValue(rightName, right.attribute);
        if (rightTarget === null) {
          throw new Error(`[AcuDice] 未找到角色 "${rightName}" 的属性 "${right.attribute}"`);
        }
      }

      // 获取骰子配置
      const diceCfg = getDiceConfig();
      const formula = normalizeCheckSuggestionDiceFormula(options.diceType || diceCfg.lastDiceType || '1d100');

      // 投骰
      const leftResult = rollComplexDiceExpression(formula).total;
      const rightResult = rollComplexDiceExpression(formula).total;
      if (Number.isNaN(leftResult) || Number.isNaN(rightResult)) {
        throw new Error(`[AcuDice] 无效的骰子公式: ${formula}`);
      }

      // 解析骰子类型获取 sides
      const sidesMatch = formula.match(/\d+d(\d+)/i);
      const sides = sidesMatch ? parseInt(sidesMatch[1], 10) : 100;

      // 计算成功等级
      const leftSuccessLevel = getSuccessLevel(leftResult, leftTarget, sides);
      const rightSuccessLevel = getSuccessLevel(rightResult, rightTarget, sides);

      // 判定胜负
      let winner: 'left' | 'right' | 'tie';
      let message: string;

      if (leftSuccessLevel.level > rightSuccessLevel.level) {
        winner = 'left';
        message = `${leftName} 胜利！(${leftSuccessLevel.name} 胜过 ${rightSuccessLevel.name})`;
      } else if (leftSuccessLevel.level < rightSuccessLevel.level) {
        winner = 'right';
        message = `${rightName} 胜利！(${rightSuccessLevel.name} 胜过 ${leftSuccessLevel.name})`;
      } else {
        // 平手情况
        const tieRule = options.rule || diceCfg.contestTieRule || 'initiator_lose';
        message = `双方平手！(均为 ${leftSuccessLevel.name})`;

        if (tieRule === 'initiator_win') {
          winner = 'left';
          message += ` - ${leftName} 判胜`;
        } else if (tieRule === 'tie') {
          winner = 'tie';
        } else {
          // initiator_lose
          winner = 'right';
          message += ` - ${leftName} 判负`;
        }
      }

      const result = {
        left: {
          name: leftName,
          attribute: left.attribute,
          roll: leftResult,
          target: leftTarget,
          successLevel: leftSuccessLevel.level,
        },
        right: {
          name: rightName,
          attribute: right.attribute,
          roll: rightResult,
          target: rightTarget,
          successLevel: rightSuccessLevel.level,
        },
        winner,
        message,
      };

      // 触发事件
      emitEvent('contest', result);

      // 记录到历史
      contestHistory.push({
        ...result,
        timestamp: Date.now(),
        detailId: `contest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        detailLines: [
          `发起方: ${result.left.name} / 对抗方: ${result.right.name}`,
          `属性: ${result.left.attribute} vs ${result.right.attribute}`,
          `掷骰: ${result.left.roll} vs ${result.right.roll}`,
          `目标: ${result.left.target} vs ${result.right.target}`,
          `胜者: ${result.winner === 'left' ? result.left.name : result.winner === 'right' ? result.right.name : '平局'}`,
          `说明: ${result.message}`,
        ],
      });
      if (contestHistory.length > MAX_HISTORY) {
        contestHistory.shift();
      }

      return result;
    },
  };
export {
  ACUDICE_READY_EVENT, resolveRootWindow, rootWindow, readyCallbacks, isAcuDiceReady,
  runReadyCallback, notifyReady, defineAcuDiceOnWindow, dispatchReadyEvent, eventHandlers,
  rootWindowWithHistory, sharedHistoryStore, checkHistory, contestHistory, MAX_HISTORY,
  globalExpandedHistoryIds, globalHistoryFilterStatus, globalHistoryKeyword, globalHistoryStatsScope, copyTextWithTavernApi,
  showGlobalDiceHistoryDialog, emitEvent, extractCheckSuggestionParams, normalizeCheckSuggestionDiceFormula, extractCheckSuggestionDiceFormula,
  extractCheckSuggestionTarget, parseCheckSuggestionTieRule, extractCheckSuggestionTieRule, parseCheckSuggestionSide, normalizeCheckSuggestionSideShorthand,
  normalizeLeadingCheckSuggestionSideShorthand, normalizeCheckSuggestionCommandInput, buildCheckSuggestionInvalidCommandMessage, parseCheckSuggestionCommand, normalizeCheckSuggestionActionText,
  refreshNameAliasesForCheckSuggestion, resolveCheckSuggestionCharacterName, getCheckSuggestionDiceSides, buildCheckSuggestionMetaBlock, parseCheckSuggestionPrimitiveValue,
  normalizeCheckSuggestionParams, parseCheckSuggestionModifierValue, resolveCheckSuggestionDefaultValue, resolveCheckSuggestionNumberParam, getCheckSuggestionMappedTarget,
  getCheckSuggestionOutcomeResultType, isCheckSuggestionOutcomeSuccess, resolveCheckSuggestionFieldValue, replaceCheckSuggestionConditionVars, evaluateCheckSuggestionOutcome,
  buildCheckSuggestionPresetSide, buildCheckSuggestionSideParams, resolveCheckSuggestionContestWinner, executeAdvancedCheckSuggestion, executeAdvancedContestCheckSuggestion,
  executeFixedCheckSuggestion, executeNormalCheckSuggestion, executeContestCheckSuggestion, executeCheckSuggestionCommand, AcuDiceAPI,
}; // __wireAcuDiceApiDeps 已由头部 export function 导出
export type { CheckHistoryEntry, ContestHistoryEntry, AcuDiceSharedHistoryStore, RootWindowWithAcuDiceHistory, CheckSuggestionTieRule, CheckSuggestionCriteria, CheckSuggestionRawParams, CheckSuggestionParamValue, CheckSuggestionParams, CheckSuggestionParsedCommand, CheckSuggestionPresetSideResult };
