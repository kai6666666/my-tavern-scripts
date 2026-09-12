// @ts-nocheck
/**
 * dice-history-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowGlobalDiceHistoryDialog(deps: any) {
  const showGlobalDiceHistoryDialog = () => {
    $('.acu-dice-history-overlay').remove();
    const config = deps.getConfig();
    const currentThemeClass = `acu-theme-${config.theme}`;
    const detailCopyTextMap = new Map<string, string>();

    const renderHistoryItems = (): string => {
      type UnifiedItem =
        | (CheckHistoryEntry & { historyType: 'check' })
        | (ContestHistoryEntry & { historyType: 'contest' });

      detailCopyTextMap.clear();

      const items: UnifiedItem[] = [
        ...deps.checkHistory.map(item => ({ ...item, historyType: 'check' as const })),
        ...deps.contestHistory.map(item => ({ ...item, historyType: 'contest' as const })),
      ]
        .sort((a, b) => b.timestamp - a.timestamp)
        .filter(item => {
          if (deps.getGlobalHistoryFilterStatus() !== 'all') {
            const status = String((item as Record<string, unknown>).effectStatus || '');
            if (!status || status !== deps.getGlobalHistoryFilterStatus()) return false;
          }
          const keyword = deps.getGlobalHistoryKeyword().trim().toLowerCase();
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
          const isExpanded = canExpand && deps.globalExpandedHistoryIds.has(detailId);

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
              `<div><strong>检定详情</strong>${detailLines.map(line => deps.escapeHtml(line)).join('<br>')}</div>`,
            );
          }
          if (traceLines.length > 0) {
            sections.push(
              `<div><strong>效果链路</strong>${traceLines.map(line => deps.escapeHtml(line)).join('<br>')}</div>`,
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
                    <span class="acu-history-title">${deps.escapeHtml(title)}${pushedBadge}</span>
                    ${canExpand ? `<button type="button" class="acu-history-icon-btn acu-history-detail-copy" data-detail-id="${deps.escapeHtml(detailId)}" aria-label="复制详情" title="复制详情"><i class="fa-solid fa-copy"></i></button>` : ''}
                  </div>
                  <div class="acu-history-meta">
                    <span class="acu-history-result" style="--acu-history-result-color:${resultColor};">${deps.escapeHtml(subtitle)}</span>
                    <span class="acu-history-roll">${deps.escapeHtml(rollText)}</span>
                    ${statusText ? `<span class="acu-history-status" style="--acu-history-status-color:${statusColor};">效果:${statusText}</span>` : ''}
                  </div>
                </div>
                <div class="acu-history-side">
                  <span class="acu-history-time">${new Date(item.timestamp).toLocaleTimeString('zh-CN', { hour12: false })}</span>
                  ${canExpand ? `<button type="button" class="acu-history-icon-btn acu-history-trace-toggle" data-run-id="${deps.escapeHtml(detailId)}" aria-label="${isExpanded ? '收起详情' : '展开详情'}" title="${isExpanded ? '收起详情' : '展开详情'}">${isExpanded ? '▼' : '▶'}</button>` : ''}
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
              ${deps.getTutorialButtonHtml('diceHistory', '查看检定历史教程', 'acu-help-btn')}
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
              <input id="acu-history-search" class="acu-dice-input" placeholder="搜索" value="${deps.escapeHtml(deps.getGlobalHistoryKeyword())}">
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
    deps.bindTutorialButtonsIn(dialog);

    const renderHistoryStats = async () => {
      const $stats = dialog.find('#acu-dice-history-stats');
      if ($stats.length === 0) return;
      const allStats = await deps.DiceHistoryStatsDB.getDashboardStats();
      $stats.html(deps.renderDiceHistoryStatsHtml(allStats, deps.getGlobalHistoryStatsScope()));
    };

    const rerender = () => {
      dialog.find('#acu-dice-history-list').html(renderHistoryItems());
      void renderHistoryStats();
    };

    dialog.find('#acu-history-status-filter').val(deps.getGlobalHistoryFilterStatus());
    dialog.find('#acu-history-scope-filter').val(deps.getGlobalHistoryStatsScope());

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
      deps.setGlobalHistoryStatsScope(val === 'character' || val === 'global' ? val : 'chat');
      void renderHistoryStats();
    });

    dialog.on('change', '#acu-history-status-filter', function () {
      deps.setGlobalHistoryFilterStatus(String($(this).val() || 'all'));
      rerender();
    });

    dialog.on('input', '#acu-history-search', function () {
      deps.setGlobalHistoryKeyword(String($(this).val() || ''));
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
      if (deps.globalExpandedHistoryIds.has(runId)) deps.globalExpandedHistoryIds.delete(runId);
      else deps.globalExpandedHistoryIds.add(runId);
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
      const ok = await deps.copyTextWithTavernApi(detailText);
      if (window.toastr) {
        if (ok) window.toastr.success('详情已复制');
        else showActionableErrorToast('复制失败', { suggestion: '请手动选中详情文本复制，或检查浏览器剪贴板权限。' });
      }
    });

    dialog.on('click', '#acu-history-clear', async function (e) {
      e.preventDefault();
      e.stopPropagation();
      const ok = await deps.showDiceSystemConfirmDialog({
        title: '清理检定历史',
        message: '确定要清理检定历史吗？',
        detail: '此操作会清空当前会话内历史和统计库记录。',
        iconClass: 'fa-trash',
        confirmText: '清理历史',
        cancelText: '取消',
        tone: 'danger',
      });
      if (!ok) return;
      deps.checkHistory.length = 0;
      deps.contestHistory.length = 0;
      deps.globalExpandedHistoryIds.clear();
      await deps.DiceHistoryStatsDB.clear();
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
    deps.setupOverlayClose(dialog, 'acu-dice-history-overlay', closeDialog);
  };
  return showGlobalDiceHistoryDialog;
}
