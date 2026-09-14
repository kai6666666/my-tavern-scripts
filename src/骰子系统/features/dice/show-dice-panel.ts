// @ts-nocheck
/**
 * show-dice-panel.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { buildEffectMetaLines, buildEffectTraceLines, computePendingEffectVariables, parseEffectValueInput } from '../../shared/effect-math';
import { rollComplexDiceExpression } from '../../features/dice/dice-engine';
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowDicePanel(deps: any) {
  const showDicePanel = (options = {}) => {
    const { $ } = deps.getCore();
    $('.acu-dice-panel, .acu-dice-overlay').remove();

    const config = deps.getConfig();
    const diceCfg = deps.getDiceConfig();
    // 读取上次保存的骰子类型，必须是有效公式，否则默认1d100
    let savedDiceType = diceCfg.lastDiceType || '1d100';
    // 验证是否是有效公式，无效则回退到1d100
    if (Number.isNaN(rollComplexDiceExpression(savedDiceType).total)) {
      savedDiceType = '1d100';
    }
    // [新增] 构建角色和属性下拉列表
    const rawDataForList = deps.getCachedRawData() || deps.getTableData();
    const diceCharacterList = deps.getDiceQuickSelectCharacterList(rawDataForList as DiceRawData | null | undefined);
    let diceAttrList = [];

    if (rawDataForList) {
      for (const key in rawDataForList) {
        const sheet = rawDataForList[key];
        if (!sheet || !sheet.name || !sheet.content) continue;
        const headers = sheet.content[0] || [];

        if (sheet.name?.includes('主角') && sheet.content[1]) {
          const row = sheet.content[1];
          headers.forEach((h, idx) => {
            if (h && h.includes('属性')) {
              const parsed = deps.parseAttributeString(row[idx] || '');
              parsed.forEach(attr => {
                if (!diceAttrList.includes(attr.name)) diceAttrList.push(attr.name);
              });
            }
          });
        }
      }
    }
    const {
      targetValue = null, // [修复] 默认为 null，支持留空自动计算
      targetName = '', // 留空让 placeholder 显示，执行时若仍为空则使用 '自由检定'
      attrValue = null, // [新增] 属性值参数
      diceType = savedDiceType, // 使用上次保存的骰子类型
      successCriteria = 'lte', // [新增] 默认成功标准：小于等于（COC规则）
      onResult = null,
      initiatorName = '', // [修复] 接收发起者名字
      fromMvu = false, // [新增] 是否从MVU面板调用
      mvuPath = null, // [新增] MVU变量路径
      mvuParsedInfo = null, // [新增] 解析后的路径信息
    } = options;

    // [新增] 计算初始属性值和目标值/DC
    const isDND = diceType === '1d20' || successCriteria === 'gte';
    let initialAttrValue = attrValue;
    let initialTargetValue = targetValue;

    // 如果传入了attrValue但没有targetValue，根据模式自动计算
    if (attrValue !== null && targetValue === null) {
      if (isDND) {
        initialTargetValue = Math.max(0, 20 - attrValue);
      } else {
        initialTargetValue = attrValue;
      }
    }

    const overlay = $(`<div class="acu-dice-overlay"></div>`);

    // [精简] 成功标准选项：只保留 COC 和 DND
    const successCriteriaOptions = [
      { id: 'lte', name: '≤ (COC)' },
      { id: 'gte', name: '≥ (DND)' },
    ];

    // [新增] 根据骰子类型智能选择默认成功标准
    let defaultCriteria = successCriteria;
    if (diceType === '1d100') defaultCriteria = 'lte';
    else if (diceType === '1d20') defaultCriteria = 'gte';

    // [新增] 预设快捷按钮区逻辑
    const quickPresetsHtml = (() => {
      const presets = deps.AdvancedDicePresetManager.getAllPresets()
        .filter(p => p.visible !== false) // 默认显示
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      let html = `<div class="acu-dice-quick-section" id="dice-normal-presets-section" style="margin-bottom: 8px;">`;
      html += `<div class="acu-dice-section-title"><span><i class="fa-solid fa-sliders"></i> 检定规则<div id="dice-preset-quick-actions" class="acu-dice-preset-quick-actions"></div></span></div>`;

      // 1. 常规预设选择器容器
      html += `<div class="acu-dice-quick-presets" id="dice-normal-presets">`;
      // 自定义按钮（固定在最左）
      html += `<button type="button" class="acu-dice-quick-preset-btn" data-id="__custom__">自定义</button>`;

      presets.forEach(p => {
        html += `<button type="button" class="acu-dice-quick-preset-btn" data-id="${deps.escapeHtml(p.id)}">${deps.escapeHtml(p.name)}</button>`;
      });
      html += `</div>`;

      // 2. 工作流模式下的“返回”按钮容器（默认隐藏）
      html += `<div id="dice-workflow-return-container" style="display: none;">
        <button type="button" class="acu-dice-return-btn" id="dice-return-normal-btn">
            <i class="fa-solid fa-arrow-left"></i> 返回常规检定
        </button>
      </div>`;

      html += `</div>`;
      return html;
    })();

    const panel = $(`
            <div class="acu-dice-panel acu-theme-${config.theme}">
                <div class="acu-dice-panel-header">
                    <div class="acu-dice-panel-title">
                        <i class="fa-solid fa-dice-d20"></i> 普通检定
                    </div>
                    <div class="acu-dice-panel-actions">
                        ${deps.getTutorialButtonHtml('dice', '查看检定面板教程')}
                        <button type="button" id="dice-switch-contest-top" class="acu-dice-panel-action-btn" aria-label="切换到对抗检定" title="切换到对抗检定"><i class="fa-solid fa-people-arrows"></i></button>
                        <button type="button" id="dice-history-btn" class="acu-dice-panel-action-btn" aria-label="检定历史" title="检定历史"><i class="fa-solid fa-history"></i></button>
                        <button type="button" class="acu-dice-config-btn acu-dice-panel-action-btn" aria-label="检定设置" title="检定设置">
                            <i class="fa-solid fa-cog"></i>
                        </button>
                        <button type="button" class="acu-dice-close acu-dice-panel-action-btn" aria-label="关闭检定面板" title="关闭">
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="acu-dice-panel-body">
                    ${quickPresetsHtml}

                    <!-- 快捷选择角色 -->
                    <div class="acu-dice-quick-section">
                        <div class="acu-dice-section-title" id="dice-char-buttons-section"><span><i class="fa-solid fa-user"></i> 快捷选择</span><div id="dice-char-buttons" class="acu-dice-quick-inline"></div></div>
                    </div>

                    <div id="dice-normal-params-section">
                        <!-- 第1行：名字 + 属性名 -->
                        <div class="acu-dice-form-row cols-2" id="dice-row-1">
                            <div id="dice-name-wrapper">
                                <div class="acu-dice-form-label">名字</div>
                                <input type="text" id="dice-initiator-name" class="acu-dice-input" value="${deps.escapeHtml(initiatorName)}" placeholder="<user>">
                            </div>
                            <div id="dice-attr-name-wrapper">
                                <div class="acu-dice-form-label" id="dice-attr-name-label">
                                    <span class="dice-attr-name-text">属性名</span>
                                    <button type="button" class="acu-random-skill-btn" id="dice-random-skill" title="随机技能">
                                        <i class="fa-solid fa-dice"></i>
                                    </button>
                                </div>
                                <input type="text" id="dice-attr-name" class="acu-dice-input" value="${deps.escapeHtml(targetName || '')}" placeholder="自由检定">
                            </div>
                        </div>

                        <!-- 第2行：属性值 + 技能加值 + 目标值 -->
                        <div class="acu-dice-form-row cols-2" id="dice-row-2">
                            <div id="dice-attr-wrapper">
                                <div class="acu-dice-form-label" id="dice-attr-label">属性值</div>
                                <input type="text" id="dice-attr-value" class="acu-dice-input" value="${initialAttrValue !== null ? initialAttrValue : ''}" placeholder="留空=50%最大值">
                            </div>
                            <div id="dice-skill-mod-wrapper" style="display: none;">
                                <div class="acu-dice-form-label" id="dice-skill-mod-label">技能加值</div>
                                <input type="text" id="dice-skill-mod" class="acu-dice-input" placeholder="留空=0">
                            </div>
                            <div id="dice-target-wrapper">
                                <div class="acu-dice-form-label" id="dice-target-label">目标值</div>
                                <input type="text" id="dice-target" class="acu-dice-input" value="${initialTargetValue !== null ? initialTargetValue : ''}" placeholder="留空=属性值">
                            </div>
                        </div>
                    </div>

                    <!-- 第3行：成功标准 + 难度等级 + 修正值 (基础模式) -->
                    <div class="acu-dice-form-row cols-3" id="dice-row-3">
                        <div>
                            <div class="acu-dice-form-label centered">成功标准</div>
                            <select id="dice-success-criteria" class="acu-dice-select">
                                ${successCriteriaOptions
                                  .map(
                                    opt =>
                                      `<option value="${opt.id}" ${opt.id === defaultCriteria ? 'selected' : ''}>${opt.name}</option>`,
                                  )
                                  .join('')}
                            </select>
                        </div>
                        <div id="dice-difficulty-wrapper">
                            <div class="acu-dice-form-label centered">难度等级</div>
                            <select id="dice-difficulty" class="acu-dice-select">
                                <option value="normal" selected>普通</option>
                                <option value="hard">困难</option>
                                <option value="extreme">极难</option>
                                <option value="critical">大成功</option>
                            </select>
                        </div>
                        <div id="dice-mod-wrapper">
                            <div class="acu-dice-form-label" id="dice-mod-label">修正值</div>
                            <input type="text" id="dice-modifier" class="acu-dice-input" placeholder="留空=0">
                        </div>
                    </div>

                    <!-- [新增] 高级预设自定义字段区域 (在快捷属性上方) -->
                    <div id="dice-custom-fields-area"></div>

                    <!-- [新增] 自定义掷骰模式字段区 -->
                    <div id="acu-dice-custom-mode-fields" style="display: none; margin-top: 8px;">
                        <div class="acu-dice-form-row cols-3">
                            <div>
                                <div class="acu-dice-form-label">骰子语法</div>
                                <input type="text" id="custom-dice-expr" class="acu-dice-input" value="${deps.escapeHtml(diceCfg.customDiceExpr || '')}" placeholder="1d100,2d6+3...">
                            </div>
                            <div>
                                <div class="acu-dice-form-label">成功条件</div>
                                <select id="custom-judge-mode" class="acu-dice-select">
                                    <option value=">=">>=</option>
                                    <option value="<=" selected><=</option>
                                    <option value=">">&gt;</option>
                                    <option value="<">&lt;</option>
                                    <option value="none">无判定</option>
                                </select>
                            </div>
                            <div>
                                <div class="acu-dice-form-label">目标值</div>
                                <input type="text" id="custom-target-value" class="acu-dice-input" placeholder="留空=50%概率">
                            </div>
                        </div>
                    </div>

                    <!-- 快捷选择属性（紧凑型） -->
                    <div id="dice-attr-buttons" class="acu-dice-quick-compact"></div>

                    <!-- 隐藏的骰子公式 -->
                    <input type="hidden" id="dice-formula" value="${diceType}">

                    <button type="button" id="dice-roll-btn" class="acu-dice-roll-btn">
                        <i class="fa-solid fa-dice"></i> 掷骰！
                    </button>
                </div>
            </div>
        `);

    overlay.append(panel);
    $('body').append(overlay);
    deps.bindTutorialButtonsIn(panel);
    const effectRunCleanerTimerKey = '__acuEffectRunCleanerTimer';

    const expandedTraceRunIds = new Set<string>();
    let historyFilterStatus = 'all';
    let historyKeyword = '';
    let historyStatsScope: DiceStatsScope = 'chat';

    const renderDiceHistoryItems = (): string => {
      type HistoryItem =
        | (CheckHistoryEntry & { historyType: 'check' })
        | ((AcuDice.ContestResult & { timestamp: number; detailId?: string; detailLines?: string[] }) & {
            historyType: 'contest';
          });

      const mergedItems: HistoryItem[] = [
        ...deps.getCheckHistory().map(item => ({ ...item, historyType: 'check' as const })),
        ...deps.getContestHistory().map(item => ({ ...item, historyType: 'contest' as const })),
      ]
        .sort((a, b) => b.timestamp - a.timestamp)
        .filter(item => {
          if (historyFilterStatus !== 'all') {
            const status = String((item as Record<string, unknown>).effectStatus || '');
            if (!status || status !== historyFilterStatus) return false;
          }
          const keyword = historyKeyword.trim().toLowerCase();
          if (!keyword) return true;
          const raw = item as Record<string, unknown>;
          const haystack = [
            raw.attrName,
            raw.message,
            raw.outcomeText,
            raw.effectStatus,
            raw.initiatorName,
            raw['left'] && typeof raw['left'] === 'object' ? (raw['left'] as Record<string, unknown>).name : undefined,
            raw['right'] && typeof raw['right'] === 'object'
              ? (raw['right'] as Record<string, unknown>).name
              : undefined,
          ]
            .map(text => String(text || '').toLowerCase())
            .join(' ');
          return haystack.includes(keyword);
        })
        .slice(0, 80);

      if (mergedItems.length === 0) {
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

      return mergedItems
        .map(item => {
          const raw = item as Record<string, unknown>;
          const isContest = item.historyType === 'contest';
          const status = String(raw.effectStatus || '');
          const statusText = status ? statusTextMap[status] || status : '';
          const statusColor = status ? statusColorMap[status] || 'var(--acu-text-sub)' : 'var(--acu-text-sub)';

          const detailId = String(
            raw.detailId ||
              raw.effectRunId ||
              `${item.historyType}-${item.timestamp}-${String(raw.attrName || raw.message || '')}`,
          );
          const traceLines = Array.isArray(raw.effectTrace) ? (raw.effectTrace as string[]) : [];
          const detailLines = Array.isArray(raw.detailLines) ? (raw.detailLines as string[]) : [];
          const canExpand = detailLines.length > 0 || traceLines.length > 0;
          const isExpanded = canExpand && expandedTraceRunIds.has(detailId);

          let title = String(raw.attrName || '检定');
          let subtitle = '';
          let resultColor = raw.success ? 'var(--acu-success-text)' : 'var(--acu-error-text)';
          let rollText = `${String(raw.total ?? '-')}/${String(raw.target ?? '-')}`;
          let metaTag = isContest ? '对抗' : '普通';

          if (isContest) {
            const left = (raw.left || {}) as Record<string, unknown>;
            const right = (raw.right || {}) as Record<string, unknown>;
            title = `${String(left.name || '发起方')} vs ${String(right.name || '对抗方')}`;
            subtitle = String(raw.message || '对抗检定');
            const winner = String(raw.winner || 'tie');
            resultColor = winner === 'tie' ? 'var(--acu-text-sub)' : 'var(--acu-accent)';
            rollText = `${String(left.roll ?? '-')}:${String(right.roll ?? '-')}`;
          } else {
            const initiatorName = String(raw.initiatorName || '').trim();
            if (initiatorName) {
              title = `${initiatorName} · ${title}`;
            }
            subtitle = String(raw.outcomeText || (raw.success ? '成功' : '失败'));
          }

          const pushedBadge = raw.isPushed
            ? '<i class="fa-solid fa-skull acu-history-pushed-icon" title="孤注一掷"></i>'
            : '';
          const expandBtn = canExpand
            ? `<button type="button" class="acu-history-icon-btn acu-history-trace-toggle" data-run-id="${deps.escapeHtml(detailId)}" aria-label="${isExpanded ? '收起详情' : '展开详情'}" title="${isExpanded ? '收起详情' : '展开详情'}">${isExpanded ? '▼' : '▶'}</button>`
            : '';
          const detailHtml =
            canExpand && isExpanded
              ? `<div class="acu-history-detail">
                   ${detailLines.length > 0 ? `<strong>检定详情</strong>${detailLines.map(line => deps.escapeHtml(line)).join('<br>')}` : ''}
                   ${detailLines.length > 0 && traceLines.length > 0 ? '<hr>' : ''}
                   ${traceLines.length > 0 ? `<strong>效果链路</strong>${traceLines.map(line => deps.escapeHtml(line)).join('<br>')}` : ''}
                 </div>`
              : '';

          return `
            <div class="acu-history-item">
              <div class="acu-history-main">
                <div class="acu-history-primary">
                  <div class="acu-history-title-row">
                    <span class="acu-history-tag">${metaTag}</span>
                    <span class="acu-history-title">${deps.escapeHtml(title)}${pushedBadge}</span>
                  </div>
                  <div class="acu-history-meta">
                    <span class="acu-history-result" style="--acu-history-result-color:${resultColor};">${deps.escapeHtml(subtitle)}</span>
                    <span class="acu-history-roll">${deps.escapeHtml(rollText)}</span>
                    ${statusText ? `<span class="acu-history-status" style="--acu-history-status-color:${statusColor};">效果:${statusText}</span>` : ''}
                  </div>
                </div>
                <div class="acu-history-side">
                  <span class="acu-history-time">${new Date(item.timestamp).toLocaleTimeString('zh-CN', { hour12: false })}</span>
                  ${expandBtn}
                </div>
              </div>
              ${detailHtml}
            </div>
          `;
        })
        .join('');
    };

    const showDiceHistoryDialog = () => {
      $('.acu-dice-history-overlay').remove();
      const currentThemeClass = `acu-theme-${config.theme}`;
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
                <input id="acu-history-search" class="acu-dice-input" placeholder="搜索" value="${deps.escapeHtml(historyKeyword)}">
              </div>
            </div>
            <div id="acu-dice-history-stats" class="acu-dice-history-stats">
              <div class="acu-history-stats-scope">统计加载中...</div>
            </div>
            <div id="acu-dice-history-list" class="acu-dice-history-list">
              ${renderDiceHistoryItems()}
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
        $stats.html(deps.renderDiceHistoryStatsHtml(allStats, historyStatsScope));
      };

      const rerender = () => {
        dialog.find('#acu-dice-history-list').html(renderDiceHistoryItems());
        void renderHistoryStats();
      };
      dialog.find('#acu-history-status-filter').val(historyFilterStatus);
      dialog.find('#acu-history-scope-filter').val(historyStatsScope);

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
        historyStatsScope = val === 'character' || val === 'global' ? val : 'chat';
        void renderHistoryStats();
      });

      dialog.on('change', '#acu-history-status-filter', function () {
        historyFilterStatus = String($(this).val() || 'all');
        rerender();
      });

      dialog.on('input', '#acu-history-search', function () {
        historyKeyword = String($(this).val() || '');
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
        if (expandedTraceRunIds.has(runId)) expandedTraceRunIds.delete(runId);
        else expandedTraceRunIds.add(runId);
        rerender();
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

        deps.getCheckHistory().length = 0;
        deps.getContestHistory().length = 0;
        expandedTraceRunIds.clear();
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

    // [新增] 构建角色快捷按钮
    const buildCharButtons = () => {
      const $container = panel.find('#dice-char-buttons');
      let html = '';

      // [新增] 如果从MVU面板调用，添加从路径解析的发起者备选
      if (fromMvu && mvuParsedInfo && mvuParsedInfo.initiator) {
        const initiator = mvuParsedInfo.initiator;
        const shortName = initiator.length > 4 ? initiator.substring(0, 4) + '..' : initiator;
        html += `<button type="button" class="acu-dice-char-btn acu-dice-char-btn-mvu" data-char="${deps.escapeHtml(initiator)}" title="从变量路径提取: ${deps.escapeHtml(initiator)}">${deps.escapeHtml(shortName)}</button>`;
      }

      // 添加常规角色列表（所有名字统一处理，不再区分 <user>）
      diceCharacterList.forEach(name => {
        const resolvedName = deps.resolveCanonicalCharacterName(String(name));
        const displayName = deps.replaceUserPlaceholders(String(resolvedName));
        const shortName = displayName.length > 4 ? displayName.substring(0, 4) + '..' : displayName;
        html += `<button type="button" class="acu-dice-char-btn" data-char="${deps.escapeHtml(String(resolvedName))}" title="${deps.escapeHtml(displayName)}">${deps.escapeHtml(shortName)}</button>`;
      });

      // [新增] 如果从MVU面板调用，添加其他候选（如果有）
      if (fromMvu && mvuParsedInfo && mvuParsedInfo.candidates && mvuParsedInfo.candidates.length > 0) {
        mvuParsedInfo.candidates.forEach(candidate => {
          // 跳过已经添加的发起者
          if (mvuParsedInfo.initiator && candidate === mvuParsedInfo.initiator) return;
          const shortName = candidate.length > 4 ? candidate.substring(0, 4) + '..' : candidate;
          html += `<button type="button" class="acu-dice-char-btn acu-dice-char-btn-mvu-candidate" data-char="${deps.escapeHtml(candidate)}" title="从变量路径提取: ${deps.escapeHtml(candidate)}">${deps.escapeHtml(shortName)}</button>`;
        });
      }

      $container.html(html || `<div class="acu-dice-empty-hint">无角色数据</div>`);
      // 绑定点击事件
      $container.find('.acu-dice-char-btn').click(function () {
        const charName = $(this).data('char');
        panel.find('#dice-initiator-name').val(charName).trigger('change');
      });
    };

    // [新增] 构建属性快捷按钮
    const buildAttrButtons = charName => {
      const $container = panel.find('#dice-attr-buttons');
      const $parentSection = $container.parent(); // 获取包含标题的父容器
      const attrs = deps.getFullAttributesForCharacter(charName);

      // 始终显示区域（即使没有属性数据，也要显示生成按钮）
      $parentSection.show();

      let html = '';

      // [新增] 如果从MVU面板调用，添加从路径解析的属性名备选
      if (fromMvu && mvuParsedInfo && mvuParsedInfo.attrName) {
        const attrName = mvuParsedInfo.attrName;
        // 尝试从当前角色获取该属性的值
        const attrValue = deps.getAttributeValue(charName, attrName) || targetValue || '';
        if (attrValue) {
          html += `<button type="button" class="acu-dice-attr-btn acu-dice-attr-btn-mvu" data-name="${deps.escapeHtml(attrName)}" data-value="${attrValue}" data-source="generic" title="从变量路径提取: ${deps.escapeHtml(attrName)}">${deps.escapeHtml(attrName)}:${attrValue}</button>`;
        } else {
          // 即使没有值也显示，用户可以手动填入
          html += `<button type="button" class="acu-dice-attr-btn acu-dice-attr-btn-mvu" data-name="${deps.escapeHtml(attrName)}" data-value="" data-source="generic" title="从变量路径提取: ${deps.escapeHtml(attrName)}">${deps.escapeHtml(attrName)}</button>`;
        }
      }

      // 现有属性按钮
      attrs.forEach(attr => {
        html += `<button type="button" class="acu-dice-attr-btn" data-name="${deps.escapeHtml(attr.name)}" data-value="${attr.value}" data-source="${deps.escapeHtml(attr.source || 'generic')}">${deps.escapeHtml(attr.name)}:${attr.value}</button>`;
      });

      // 生成属性按钮（始终显示）
      html += `<button type="button" class="acu-dice-gen-attr-btn" aria-label="为当前角色生成属性" title="为当前角色生成属性"><i class="fa-solid fa-dice"></i></button>`;

      // 清空属性按钮
      html += `<button type="button" class="acu-dice-clear-attr-btn" aria-label="清空当前规则的属性" title="清空当前规则的属性（保留自定义属性）"><i class="fa-solid fa-trash-alt"></i></button>`;

      $container.html(html);

      // 绑定属性按钮点击事件
      $container.find('.acu-dice-attr-btn').click(function () {
        const attrName = $(this).data('name');
        const attrValue = $(this).data('value');
        const attrSource = String($(this).attr('data-source') || 'generic') as CharacterAttributeSource;

        // 填入属性名
        // 使用 change 触发提交态刷新，避免输入中每字符重绘导致焦点丢失
        const $attrNameInput = panel.find('#dice-attr-name');
        $attrNameInput.val(attrName).trigger('change');

        const target = deps.resolveQuickSelectTarget(attrName, attrSource, currentAdvancedPreset, 'normal');
        const targetField = deps.getNormalQuickSelectInputSelector(target);

        panel.find(targetField).val(attrValue);

        // [新增] 如果处于自定义模式,同时填入目标值
        if (panel.find('#acu-dice-custom-mode-fields').is(':visible')) {
          panel.find('#custom-target-value').val(attrValue);
        }

        // [修复] 只填入对应字段，不自动填写DC
        // DC留空时会在检定时根据预设的defaultValue处理
        // - COC模式：DC = 属性值
        // - DND模式：DC = 10（或预设的默认值）

        // 触发change事件以更新相关UI
        panel.find(targetField).trigger('change');
      });

      // 绑定生成属性按钮点击事件
      $container.find('.acu-dice-gen-attr-btn').click(async function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $btn = $(this);
        if ($btn.prop('disabled')) return;

        // 禁用按钮防止重复点击
        $btn.prop('disabled', true).css('opacity', '0.5');
        const originalHtml = $btn.html();
        $btn.html('<i class="fa-solid fa-spinner fa-spin"></i>');

        // [修复] 临时禁用更新处理器，防止闪烁
        const originalHandler = deps.UpdateController.handleUpdate;
        deps.UpdateController.handleUpdate = () => {
          console.log('[DICE]ACU 属性生成中，跳过自动刷新');
        };

        try {
          const charName = panel.find('#dice-initiator-name').val().trim() || '<user>';

          console.log('[DICE]ACU 生成属性 for:', charName);

          // 生成属性（使用激活的预设）
          const generated = deps.generateRPGAttributes();

          // 兼容旧格式和新格式
          const baseAttrs = generated.base || generated;
          const specialAttrs = generated.special || {};

          // [修复] 分别写入基础属性和特有属性到对应的列
          const result = await deps.writeAttributesToCharacter(charName, baseAttrs, false, specialAttrs);

          if (result.success) {
            // 刷新属性按钮
            buildAttrButtons(charName);
          }
        } catch (err) {
          console.error('[DICE]ACU 生成属性失败:', err);
          if (window.toastr)
            showActionableErrorToast('生成属性失败，未能把随机属性写回角色表。', {
              suggestion: '请确认当前角色存在、属性列可写，并刷新表格数据后重试。',
            });
        } finally {
          // [修复] 恢复更新处理器
          deps.UpdateController.handleUpdate = originalHandler;
          $btn.prop('disabled', false).css('opacity', '1').html(originalHtml);
        }
      });

      // 绑定清空属性按钮点击事件
      $container.find('.acu-dice-clear-attr-btn').click(async function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $btn = $(this);
        if ($btn.prop('disabled')) return;

        const charName = panel.find('#dice-initiator-name').val().trim() || '<user>';

        // 禁用按钮防止重复点击
        $btn.prop('disabled', true).css('opacity', '0.5');
        const originalHtml = $btn.html();
        $btn.html('<i class="fa-solid fa-spinner fa-spin"></i>');

        // 临时禁用更新处理器
        const originalHandler = deps.UpdateController.handleUpdate;
        deps.UpdateController.handleUpdate = () => {
          console.log('[DICE]ACU 清空属性中，跳过自动刷新');
        };

        try {
          console.log('[DICE]ACU 清空属性 for:', charName);

          const result = await deps.clearPresetAttributesForCharacter(charName);

          if (result.success) {
            // 刷新属性按钮
            buildAttrButtons(charName);
          }
        } catch (err) {
          console.error('[DICE]ACU 清空属性失败:', err);
          if (window.toastr)
            showActionableErrorToast('清空属性失败，未能把角色属性列清空。', {
              suggestion: '请确认当前角色存在、属性列可写，并刷新表格数据后重试。',
            });
        } finally {
          // 恢复更新处理器
          deps.UpdateController.handleUpdate = originalHandler;
          $btn.prop('disabled', false).css('opacity', '1').html(originalHtml);
        }
      });
    };

    // 初始化角色按钮
    buildCharButtons();
    // 初始化属性按钮（默认主角）
    buildAttrButtons(diceCharacterList[0] || '<user>');
    // [新增] 随机技能按钮点击事件
    panel.find('#dice-random-skill').click(function (e) {
      e.preventDefault();
      e.stopPropagation();
      const skillPool = deps.getRandomSkillPool();
      const randomSkill = skillPool[Math.floor(Math.random() * skillPool.length)];
      panel.find('#dice-attr-name').val(randomSkill).trigger('change');
    });

    // 初始化自定义下拉菜单
    deps.initCustomDropdown(panel.find('#dice-initiator-name'), diceCharacterList);
    deps.initCustomDropdown(panel.find('#dice-attr-name'), diceAttrList);
    // [新增] 添加清除按钮
    deps.addClearButton(
      panel,
      '#dice-initiator-name, #dice-attr-name, #dice-attr-value, #dice-skill-mod, #dice-target, #dice-modifier, #custom-dice-expr, #custom-target-value',
    );

    // [修复] 角色变化时更新属性列表和快捷按钮
    panel.find('#dice-initiator-name').on('change.acuattr input.acuattr', function () {
      const charName = $(this).val().trim() || '<user>';
      const newAttrList = deps.getAttributesForCharacter(charName);
      deps.initCustomDropdown(panel.find('#dice-attr-name'), newAttrList.length > 0 ? newAttrList : diceAttrList);

      // [新增] 更新属性快捷按钮
      buildAttrButtons(charName);
    });

    // [新增] 属性名变化时自动填入属性值
    panel.find('#dice-attr-name').on('change.acuval', function () {
      const charName = panel.find('#dice-initiator-name').val().trim() || '<user>';
      const attrName = $(this).val().trim();
      const attrEntry = deps.getAttributeEntryForCharacter(charName, attrName);
      if (attrEntry) {
        const target = deps.resolveQuickSelectTarget(attrEntry.name, attrEntry.source, currentAdvancedPreset, 'normal');
        const targetField = deps.getNormalQuickSelectInputSelector(target);
        panel.find(targetField).val(attrEntry.value).trigger('change');
        // [修复] 不自动填写DC，让检定时根据预设的defaultValue处理
      }
    });

    // [修复] 根据骰子类型自动转换目标值
    const convertTargetForDice = (currentTarget, fromDice, toDice) => {
      if (!currentTarget || currentTarget === '') return '';
      const val = parseInt(currentTarget, 10);
      if (isNaN(val)) return currentTarget;

      // 获取骰子最大值
      const getMaxRoll = dice => {
        const match = dice.match(/(\d+)d(\d+)/i);
        if (!match) return 100;
        return parseInt(match[1], 10) * parseInt(match[2], 10);
      };

      const fromMax = getMaxRoll(fromDice);
      const toMax = getMaxRoll(toDice);

      // 按比例转换
      const ratio = val / fromMax;
      const newVal = Math.round(ratio * toMax);
      return Math.max(0, Math.min(newVal, toMax));
    };

    // [重写] 成功标准切换时更新 UI（COC/DND 模式切换）
    const updateRuleMode = () => {
      const criteria = panel.find('#dice-success-criteria').val();
      const isDND = criteria === 'gte';
      const $targetInput = panel.find('#dice-target');
      const $difficultyWrapper = panel.find('#dice-difficulty-wrapper');
      const $row3 = panel.find('#dice-row-3');

      if (isDND) {
        // DND 模式
        $targetInput.attr('placeholder', '留空=10');
        panel.find('#dice-target-label').text('DC');
        $difficultyWrapper.hide();
        $row3.css('grid-template-columns', '1fr 1fr');
      } else {
        // COC 模式
        $targetInput.attr('placeholder', '留空=属性值');
        panel.find('#dice-target-label').text('目标值');
        $difficultyWrapper.show();
        $row3.css('grid-template-columns', '1fr 1fr 1fr');
      }
    };

    panel.find('#dice-success-criteria').on('change', updateRuleMode);

    // 初始化时执行一次
    updateRuleMode();

    // [新增] 高级预设选择器变更事件 (已重构为快捷按钮点击事件)
    let currentAdvancedPreset: AdvancedDicePreset | LegacyAdvancedDicePreset | null = null;
    let lastVisiblePresetId: string | null = null;
    let pendingEffectRuns: PendingEffectContext[] = [];
    let activeConfirmEffectRun: PendingEffectContext | null = null;
    let effectRunRetryTimer: ReturnType<typeof setTimeout> | null = null;
    let effectRunEventSeq = 0;
    const EFFECT_RUN_TTL_MS = 60_000;
    const EFFECT_RUN_FALLBACK_WINDOW_MS = 2_500;
    const messageMutationQueues = new Map<number, Promise<unknown>>();

    const getPresetQuickActions = (
      preset: AdvancedDicePreset | LegacyAdvancedDicePreset | null,
    ): PresetQuickAction[] => {
      if (!preset || !('quickActions' in preset) || !Array.isArray(preset.quickActions)) return [];
      return preset.quickActions.filter((action): action is PresetQuickAction =>
        Boolean(action && typeof action.id === 'string' && typeof action.kind === 'string'),
      );
    };

    const buildQuickActionContext = (): Record<string, number> => {
      const attrRaw = String(panel.find('#dice-attr-value').val() || '').trim();
      const modRaw = String(panel.find('#dice-modifier').val() || '').trim();
      const targetRaw = String(panel.find('#dice-target').val() || '').trim();
      const attr = attrRaw === '' ? 0 : parseFloat(attrRaw) || 0;
      const mod = modRaw === '' ? 0 : parseFloat(modRaw) || 0;
      const dc = targetRaw === '' ? 0 : parseFloat(targetRaw) || 0;
      return {
        $attr: attr,
        $mod: mod,
        $dc: dc,
      };
    };

    const isQuickActionVisible = (action: PresetQuickAction): boolean => {
      if (!action.condition) return true;
      const evalResult = deps.evaluateCondition(action.condition, buildQuickActionContext());
      if (!evalResult.success) return false;
      return typeof evalResult.value === 'number' ? evalResult.value !== 0 : Boolean(evalResult.value);
    };

    const renderPresetQuickActions = (preset: AdvancedDicePreset | LegacyAdvancedDicePreset | null): void => {
      const $container = panel.find('#dice-preset-quick-actions');
      if (!$container.length) return;
      const actions = getPresetQuickActions(preset).filter(isQuickActionVisible);
      if (actions.length === 0) {
        $container.empty().hide();
        return;
      }
      let html = '';
      actions.forEach(action => {
        const icon = action.icon || 'fa-bolt';
        const tooltip = action.tooltip || action.id;
        html += `<button type="button" class="acu-dice-preset-action-btn" data-action-id="${deps.escapeHtml(action.id)}" title="${deps.escapeHtml(tooltip)}"><i class="fa-solid ${deps.escapeHtml(icon)}"></i></button>`;
      });
      $container.html(html).show();
    };

    const waitMs = (ms: number): Promise<void> => {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    };

    const enqueueMessageMutation = async <T>(messageId: number, task: () => Promise<T>): Promise<T> => {
      const prev = messageMutationQueues.get(messageId) || Promise.resolve();
      const next: Promise<T> = prev.catch(() => undefined).then(task);
      messageMutationQueues.set(messageId, next);
      try {
        return await next;
      } finally {
        if (messageMutationQueues.get(messageId) === next) {
          messageMutationQueues.delete(messageId);
        }
      }
    };

    const findMetaClosingIndex = (
      text: string,
      closingCandidates: string[],
      sourceMetaText?: string,
    ): { closingIdx: number; closingTag: string } => {
      if (sourceMetaText) {
        const anchorLine = sourceMetaText
          .split('\n')
          .map(line => line.trim())
          .find(line => line && line !== '<meta:检定结果>' && line !== '</meta:检定结果>');
        if (anchorLine) {
          const anchorIdx = text.indexOf(anchorLine);
          if (anchorIdx >= 0) {
            let bestIdx = -1;
            let bestTag = '';
            for (const candidate of closingCandidates) {
              const idx = text.indexOf(candidate, anchorIdx);
              if (idx >= 0 && (bestIdx === -1 || idx < bestIdx)) {
                bestIdx = idx;
                bestTag = candidate;
              }
            }
            if (bestIdx >= 0) return { closingIdx: bestIdx, closingTag: bestTag };
          }
        }
      }

      let closingIdx = -1;
      let closingTag = '';
      for (const candidate of closingCandidates) {
        const idx = text.lastIndexOf(candidate);
        if (idx > closingIdx) {
          closingIdx = idx;
          closingTag = candidate;
        }
      }
      return { closingIdx, closingTag };
    };

    const injectEffectLinesIntoMeta = async (
      messageId: number,
      runId: string,
      lines: string[],
      sourceMetaText?: string,
    ): Promise<boolean> => {
      if (lines.length === 0) return false;
      console.info(`[DICE][META] inject start: run=${runId}, message=${messageId}, lines=${lines.length}`);
      return enqueueMessageMutation(messageId, async () => {
        const retryDelays = [0, 120, 280, 500, 900];
        for (let attempt = 0; attempt < retryDelays.length; attempt++) {
          const delay = retryDelays[attempt];
          if (delay > 0) await waitMs(delay);

          const msgs = getChatMessages(messageId);
          if (msgs.length === 0) {
            console.info(
              `[DICE][META] inject retry=${attempt + 1}/${retryDelays.length}: message not found, run=${runId}, message=${messageId}`,
            );
            continue;
          }

          const msg = msgs[0];
          const msgRole = (msg as { role?: string }).role || 'unknown';
          const extraObj: Record<string, unknown> =
            msg.extra && typeof msg.extra === 'object' ? (msg.extra as Record<string, unknown>) : {};
          const injectedRunsRaw = extraObj.acuEffectInjectedRuns;
          const injectedRuns = Array.isArray(injectedRunsRaw)
            ? injectedRunsRaw.filter((v): v is string => typeof v === 'string')
            : [];
          if (injectedRuns.includes(runId)) {
            console.info(`[DICE][META] inject skipped duplicated run: run=${runId}, message=${messageId}`);
            return true;
          }

          const original = String(msg.message || '');
          const closingCandidates = ['</meta:检定结果>', '&lt;/meta:检定结果&gt;', '&amp;lt;/meta:检定结果&amp;gt;'];
          const { closingIdx, closingTag } = findMetaClosingIndex(original, closingCandidates, sourceMetaText);
          if (closingIdx === -1) {
            const hasRawOpen = original.includes('<meta:检定结果>');
            const hasRawClose = original.includes('</meta:检定结果>');
            const hasEscapedOpen = original.includes('&lt;meta:检定结果&gt;');
            const hasEscapedClose = original.includes('&lt;/meta:检定结果&gt;');
            console.info(
              `[DICE][META] inject retry=${attempt + 1}/${retryDelays.length}: closing tag not found, run=${runId}, message=${messageId}, role=${msgRole}, length=${original.length}, rawOpen=${hasRawOpen}, rawClose=${hasRawClose}, escapedOpen=${hasEscapedOpen}, escapedClose=${hasEscapedClose}`,
            );
            continue;
          }

          const beforeClose = original.slice(0, closingIdx);
          const needsLeadingNewline = beforeClose.length > 0 && !beforeClose.endsWith('\n');
          const effectBlock = `${needsLeadingNewline ? '\n' : ''}${lines.join('\n')}`;
          const updatedMsg = beforeClose + effectBlock + '\n' + original.slice(closingIdx);
          console.info(
            `[DICE][META] inject apply: run=${runId}, message=${messageId}, role=${msgRole}, attempt=${attempt + 1}, oldLen=${original.length}, newLen=${updatedMsg.length}, closingIdx=${closingIdx}, closingTag=${closingTag}`,
          );
          await setChatMessages(
            [
              {
                message_id: messageId,
                message: updatedMsg,
                extra: {
                  ...extraObj,
                  acuEffectInjectedRuns: [...injectedRuns, runId],
                },
              },
            ],
            { refresh: 'affected' },
          );
          const verifyMsg = getChatMessages(messageId)[0];
          const verifyText = String(verifyMsg?.message || '');
          const lineHitCount = lines.filter(line => verifyText.includes(line)).length;
          console.info(
            `[DICE][META] inject done: run=${runId}, message=${messageId}, lineHit=${lineHitCount}/${lines.length}, finalLen=${verifyText.length}`,
          );
          return true;
        }

        console.warn(
          `[DICE][META] inject failed: run=${runId}, message=${messageId}, reason=message_not_ready_or_meta_missing`,
        );
        return false;
      });
    };

    const injectEffectLinesIntoTextarea = (runId: string, lines: string[], sourceMetaText?: string): boolean => {
      if (lines.length === 0) return false;
      try {
        const { $ } = deps.getCore();
        const $ta = $('#send_textarea');
        if ($ta.length === 0) return false;
        const raw = String($ta.val() || '');
        if (!raw.includes('meta:检定结果')) return false;
        const missingLines = lines.filter(line => !raw.includes(line));
        if (missingLines.length === 0) {
          console.info(`[DICE][META] textarea inject skipped duplicated run=${runId}`);
          return true;
        }

        const closingCandidates = ['</meta:检定结果>', '&lt;/meta:检定结果&gt;', '&amp;lt;/meta:检定结果&amp;gt;'];
        const { closingIdx, closingTag } = findMetaClosingIndex(raw, closingCandidates, sourceMetaText);
        if (closingIdx === -1) {
          console.warn(`[DICE][META] textarea inject failed: closing tag missing, run=${runId}`);
          return false;
        }

        const beforeClose = raw.slice(0, closingIdx);
        const needsLeadingNewline = beforeClose.length > 0 && !beforeClose.endsWith('\n');
        const effectBlock = `${needsLeadingNewline ? '\n' : ''}${missingLines.join('\n')}`;
        const updated = beforeClose + effectBlock + '\n' + raw.slice(closingIdx);
        deps.setTextareaValueAndNotify($ta[0] as HTMLTextAreaElement, updated);
        console.info(
          `[DICE][META] textarea inject done: run=${runId}, lines=${missingLines.length}, closingTag=${closingTag}`,
        );
        return true;
      } catch (e) {
        console.warn(`[DICE][META] textarea inject error: run=${runId}`, e);
        return false;
      }
    };

    const hasMetaInTextarea = (): boolean => {
      try {
        const { $ } = deps.getCore();
        const $ta = $('#send_textarea');
        if ($ta.length === 0) return false;
        const raw = String($ta.val() || '');
        return raw.includes('meta:检定结果');
      } catch {
        return false;
      }
    };

    const normalizeMessageId = (payload: unknown): string | undefined => {
      if (payload === null || payload === undefined) return undefined;
      if (typeof payload === 'string' || typeof payload === 'number') return String(payload);
      if (typeof payload === 'object') {
        const record = payload as Record<string, unknown>;
        const candidates = [record.messageId, record.message_id, record.id, record.mid];
        const hit = candidates.find(v => v !== undefined && v !== null && String(v).trim() !== '');
        if (hit !== undefined && hit !== null) return String(hit);
      }
      return undefined;
    };

    const emitEffectRun = (payload: Omit<EffectRunEventPayload, 'seq'>): number => {
      effectRunEventSeq += 1;
      const fullPayload: EffectRunEventPayload = {
        ...payload,
        seq: effectRunEventSeq,
      };
      deps.emitEvent('effect_run', fullPayload);
      return effectRunEventSeq;
    };

    const getSecondaryTriggerMode = (preset?: AdvancedDicePreset): 'first' | 'all' => {
      return preset?.secondaryTriggerMode === 'all' ? 'all' : 'first';
    };

    const findHistoryIndexByRunId = (runId?: string): number => {
      if (!runId) return -1;
      for (let index = deps.getCheckHistory().length - 1; index >= 0; index--) {
        const item = deps.getCheckHistory()[index] as CheckHistoryEntry;
        if (item.effectRunId === runId) return index;
      }
      return -1;
    };

    const isValidEffectStatusTransition = (
      fromStatus: CheckHistoryExtension['effectStatus'],
      toStatus: CheckHistoryExtension['effectStatus'],
    ): boolean => {
      if (!fromStatus || !toStatus) return true;
      if (fromStatus === toStatus) return true;
      const transitions: Record<string, string[]> = {
        planned: ['confirmed', 'cancelled', 'failed'],
        confirmed: ['committed', 'failed', 'cancelled'],
        committed: [],
        failed: [],
        cancelled: [],
      };
      const allowed = transitions[fromStatus] || [];
      return allowed.includes(toStatus);
    };

    const setHistoryEffectState = (
      historyIndex: number,
      patch: Partial<CheckHistoryExtension>,
    ): CheckHistoryEntry | null => {
      if (historyIndex < 0 || historyIndex >= deps.getCheckHistory().length) return null;
      const historyEntry = deps.getCheckHistory()[historyIndex] as CheckHistoryEntry;
      const nextPatch = { ...patch };
      if (
        nextPatch.effectStatus &&
        historyEntry.effectStatus &&
        !isValidEffectStatusTransition(historyEntry.effectStatus, nextPatch.effectStatus)
      ) {
        console.warn(
          `[DICE] Invalid effect status transition blocked: ${historyEntry.effectStatus} -> ${nextPatch.effectStatus}`,
        );
        delete nextPatch.effectStatus;
      }
      Object.assign(historyEntry, nextPatch);
      return historyEntry;
    };

    const setHistoryEffectStateByRun = (
      run: PendingEffectContext,
      patch: Partial<CheckHistoryExtension>,
    ): CheckHistoryEntry | null => {
      const byRunId = findHistoryIndexByRunId(run.runId);
      if (byRunId >= 0) return setHistoryEffectState(byRunId, patch);
      console.warn(`[DICE] setHistoryEffectStateByRun skipped: runId not found (${run.runId})`);
      return null;
    };

    const resolveLatestMetaUserMessageId = (): number | undefined => {
      try {
        const lastId = getLastMessageId();
        if (!Number.isFinite(lastId) || lastId < 0) return undefined;
        const from = Math.max(0, lastId - 12);
        const msgs = getChatMessages(`${from}-${lastId}`, { role: 'user' }) as Array<{
          message_id: number;
          message: string;
        }>;
        for (let i = msgs.length - 1; i >= 0; i--) {
          const text = String(msgs[i].message || '');
          if (text.includes('meta:检定结果')) {
            return msgs[i].message_id;
          }
        }
      } catch {
        // ignore
      }
      return undefined;
    };

    const scheduleEffectRunRetry = (): void => {
      if (effectRunRetryTimer) return;
      effectRunRetryTimer = setTimeout(() => {
        effectRunRetryTimer = null;
        void processPendingEffectRuns();
      }, 220);
    };

    const enqueueEffectRun = (run: PendingEffectContext): void => {
      if (!run.expiresAt) {
        run.expiresAt = Date.now() + EFFECT_RUN_TTL_MS;
      }
      pendingEffectRuns.push(run);
      console.info(
        `[DICE] Effect run queued: ${run.runId}, message=${run.messageId || 'pending'}, expiresAt=${run.expiresAt}, pending=${pendingEffectRuns.length}`,
      );
    };

    const processPendingEffectRuns = async (payload?: unknown): Promise<void> => {
      const incomingMessageId = normalizeMessageId(payload);
      if (incomingMessageId) {
        console.info(`[DICE][META] MESSAGE_SENT captured id=${incomingMessageId}`);
      }

      // 即使队列为空，也将 messageId 捕获到正在等待确认的 run 上
      // （确认弹窗期间 MESSAGE_SENT 可能已触发，run 还没进队列）
      if (incomingMessageId && activeConfirmEffectRun && !activeConfirmEffectRun.messageId) {
        activeConfirmEffectRun.messageId = incomingMessageId;
        console.info(
          `[DICE][META] bind activeConfirm run=${activeConfirmEffectRun.runId} message=${incomingMessageId}`,
        );
      }

      if (pendingEffectRuns.length === 0) return;

      const now = Date.now();
      const nextPending: PendingEffectContext[] = [];
      const executableRuns: PendingEffectContext[] = [];
      const consumeAllRunsForMessage = deps.getDiceConfig().overwriteLastDiceResult === false;
      let consumedByMessage = false;
      let consumedByFallback = false;

      for (const run of pendingEffectRuns) {
        const expired = Boolean(run.expiresAt && run.expiresAt < now);
        if (expired) {
          const errMsg = '效果执行已过期，已自动取消';
          setHistoryEffectStateByRun(run, {
            effectStatus: 'cancelled',
            effectError: errMsg,
            effectTrace: ['已取消：超时未提交'],
          });
          const seq = emitEffectRun({
            runId: run.runId,
            status: 'cancelled',
            characterName: run.context.characterName,
            attributeName: run.context.attributeName,
            historyIndex: run.historyIndex,
            effectResults: [],
            effectTrace: ['已取消：超时未提交'],
            chainMode: getSecondaryTriggerMode(run.preset),
            error: errMsg,
            timestamp: now,
          });
          setHistoryEffectStateByRun(run, { effectEventSeq: seq });
          continue;
        }

        if (incomingMessageId) {
          if (run.messageId && run.messageId !== incomingMessageId) {
            nextPending.push(run);
            continue;
          }

          if (!consumedByMessage || consumeAllRunsForMessage) {
            if (!run.messageId) {
              run.messageId = incomingMessageId;
              console.info(`[DICE][META] bind queued run=${run.runId} message=${incomingMessageId}`);
            }
            executableRuns.push(run);
            if (!consumeAllRunsForMessage) {
              consumedByMessage = true;
            }
          } else {
            nextPending.push(run);
          }
          continue;
        }

        // 无 messageId 事件参数时，使用短时间窗降级执行，避免队列永久卡住
        const withinFallbackWindow = now - run.timestamp <= EFFECT_RUN_FALLBACK_WINDOW_MS;
        if (withinFallbackWindow && !consumedByFallback) {
          if (!run.messageId) {
            const guessedMsgId = resolveLatestMetaUserMessageId();
            if (guessedMsgId !== undefined) {
              run.messageId = String(guessedMsgId);
              console.warn(`[DICE][META] fallback guessed messageId: run=${run.runId}, message=${run.messageId}`);
            }
          }
          if (run.messageId) {
            console.warn(`[DICE] Effect run ${run.runId}: fallback commit with bound messageId=${run.messageId}`);
            executableRuns.push(run);
            consumedByFallback = true;
          } else if (hasMetaInTextarea()) {
            console.warn(`[DICE][META] fallback commit by textarea meta presence: run=${run.runId}`);
            executableRuns.push(run);
            consumedByFallback = true;
          } else {
            console.warn(`[DICE][META] fallback skipped: run=${run.runId} has no messageId yet`);
            nextPending.push(run);
          }
        } else if (!withinFallbackWindow && !consumedByFallback) {
          console.warn(`[DICE][META] timeout fallback commit without messageId: run=${run.runId}`);
          executableRuns.push(run);
          consumedByFallback = true;
        } else {
          nextPending.push(run);
        }
      }

      if (executableRuns.length === 0) {
        pendingEffectRuns = nextPending;
        if (pendingEffectRuns.length > 0) {
          scheduleEffectRunRetry();
        }
        return;
      }

      pendingEffectRuns = nextPending;
      for (const run of executableRuns) {
        try {
          const results = await deps.executeEffects(run);
          const hasFailure = results.some(r => !r.success);
          if (!hasFailure) {
            const succeeded = results.filter(r => r.success);
            const latestAttrResult = succeeded
              .slice()
              .reverse()
              .find(r => r.target && deps.isSameAttributeAlias(r.target, run.context.attributeName));
            if (latestAttrResult) {
              panel.find('#dice-attr-value').val(String(latestAttrResult.newValue));
            }
            buildAttrButtons(run.context.characterName);
          }

          setHistoryEffectStateByRun(run, {
            effectStatus: hasFailure ? 'failed' : 'committed',
            effectResults: results,
            effectError: hasFailure ? '部分效果执行失败' : undefined,
            effectTrace: buildEffectTraceLines(results),
          });

          const seq = emitEffectRun({
            runId: run.runId,
            status: hasFailure ? 'failed' : 'committed',
            characterName: run.context.characterName,
            attributeName: run.context.attributeName,
            historyIndex: run.historyIndex,
            effectResults: results,
            effectTrace: buildEffectTraceLines(results),
            chainMode: getSecondaryTriggerMode(run.preset),
            error: hasFailure ? '部分效果执行失败' : undefined,
            timestamp: Date.now(),
          });
          setHistoryEffectStateByRun(run, { effectEventSeq: seq });

          if (hasFailure && window.toastr) {
            const firstError =
              results.find(result => !result.success && result.error)?.error ||
              deps.withTableTemplateCheckHint('请检查表格结构和字段约束');
            window.toastr.warning(`效果执行失败，已回滚本次全部效果：${firstError}`, '效果执行失败', {
              timeOut: 9000,
            });
          }

          console.info(
            `[DICE] Effect run committed: ${run.runId}, total=${results.length}, success=${results.filter(r => r.success).length}`,
          );

          // 效果结果注入：将属性变化和 outputMessage 插入到已有的 <meta:检定结果> 闭合标签前
          if (!hasFailure) {
            const metaLines = buildEffectMetaLines(results, {
              branchReasonText: run.branchReasonText,
            });
            if (metaLines.length > 0) {
              try {
                if (run.messageId) {
                  const msgId = parseInt(run.messageId, 10);
                  if (!isNaN(msgId) && msgId >= 0) {
                    const injected = await injectEffectLinesIntoMeta(msgId, run.runId, metaLines, run.sourceMetaText);
                    if (injected) {
                      console.info(
                        `[DICE] Effect results injected into meta: ${metaLines.length} line(s) in message ${msgId}`,
                      );
                    } else {
                      console.warn(
                        `[DICE][META] inject returned false: run=${run.runId}, rawMessageId=${run.messageId}, lines=${metaLines.length}`,
                      );
                    }
                  } else {
                    console.warn(
                      `[DICE][META] invalid messageId for injection: run=${run.runId}, rawMessageId=${run.messageId}`,
                    );
                  }
                } else {
                  const textareaInjected = injectEffectLinesIntoTextarea(run.runId, metaLines, run.sourceMetaText);
                  if (!textareaInjected) {
                    console.warn(`[DICE][META] no messageId and textarea inject failed: run=${run.runId}`);
                  }
                }
              } catch (injectErr) {
                console.error('[DICE] Failed to inject effect results into meta:', injectErr);
              }
            }
          }
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : String(error);
          setHistoryEffectStateByRun(run, {
            effectStatus: 'failed',
            effectError: errMsg,
            effectTrace: [`执行失败：${errMsg}`],
          });
          const seq = emitEffectRun({
            runId: run.runId,
            status: 'failed',
            characterName: run.context.characterName,
            attributeName: run.context.attributeName,
            historyIndex: run.historyIndex,
            effectResults: [],
            effectTrace: [`执行失败：${errMsg}`],
            chainMode: getSecondaryTriggerMode(run.preset),
            error: errMsg,
            timestamp: Date.now(),
          });
          setHistoryEffectStateByRun(run, { effectEventSeq: seq });
          console.error(`[DICE] Effect run failed: ${run.runId}`, error);
        }
      }
    };

    const cleanupExpiredEffectRuns = (): void => {
      if (pendingEffectRuns.length === 0) return;
      const now = Date.now();
      const nextPending: PendingEffectContext[] = [];
      for (const run of pendingEffectRuns) {
        const expired = Boolean(run.expiresAt && run.expiresAt < now);
        if (!expired) {
          nextPending.push(run);
          continue;
        }

        const errMsg = '效果执行已过期，已自动取消';
        setHistoryEffectStateByRun(run, {
          effectStatus: 'cancelled',
          effectError: errMsg,
          effectTrace: ['已取消：超时'],
        });
        const seq = emitEffectRun({
          runId: run.runId,
          status: 'cancelled',
          characterName: run.context.characterName,
          attributeName: run.context.attributeName,
          historyIndex: run.historyIndex,
          effectResults: [],
          effectTrace: ['已取消：超时'],
          chainMode: getSecondaryTriggerMode(run.preset),
          error: errMsg,
          timestamp: now,
        });
        setHistoryEffectStateByRun(run, { effectEventSeq: seq });
      }
      pendingEffectRuns = nextPending;
    };
    const existingCleaner = (window as Record<string, unknown>)[effectRunCleanerTimerKey];
    if (typeof existingCleaner === 'number') {
      window.clearInterval(existingCleaner);
    }
    (window as Record<string, unknown>)[effectRunCleanerTimerKey] = window.setInterval(() => {
      cleanupExpiredEffectRuns();
    }, 2000);

    // 辅助函数: 应用字段配置
    const applyFieldConfig = function (
      $input: JQuery,
      $label: JQuery,
      config: FieldConfig | undefined,
      defaults: { label: string; placeholder: string },
    ) {
      // 获取包含label和input的wrapper div
      // 实际DOM结构: <div> <label/> <div.acu-input-wrapper> <input/> </div> </div>
      // 所以需要找到label的父元素（同时也是input-wrapper的父元素）
      const $wrapper = $label.parent();

      if (config?.hidden) {
        $wrapper.hide();
        return;
      }

      $wrapper.show();
      $input.attr('placeholder', config?.placeholder || defaults.placeholder).prop('readonly', false);
      $label.text(config?.label || defaults.label);
    };

    /**
     * [新增] 检查属性名是否匹配 CheckSelector
     * @param attrName - 当前检定的属性名
     * @param selector - 选择器配置
     * @returns 是否匹配（true=可用，false=不可用）
     */
    const matchesCheckSelector = (attrName: string, selector?: CheckSelector): boolean => {
      // 如果没有定义 selector，默认匹配所有
      if (!selector) return true;

      const normalizedName = attrName.trim().toLowerCase();

      // 辅助函数：将通配符模式转换为正则表达式
      const wildcardToRegex = (pattern: string): RegExp => {
        const escaped = pattern
          .replace(/[.+^${}()|[\]\\]/g, '\\$&') // 转义特殊字符
          .replace(/\*/g, '.*') // * -> .*
          .replace(/\?/g, '.'); // ? -> .
        return new RegExp(`^${escaped}$`, 'i');
      };

      // 辅助函数：检查名称是否匹配任一模式
      const matchesAnyPattern = (name: string, patterns: string[]): boolean => {
        return patterns.some(pattern => {
          const regex = wildcardToRegex(pattern);
          return regex.test(name);
        });
      };

      // 1. 检查 namePatterns.exclude（优先于 include）
      if (selector.namePatterns?.exclude && selector.namePatterns.exclude.length > 0) {
        if (matchesAnyPattern(normalizedName, selector.namePatterns.exclude)) {
          return false; // 被排除
        }
      }

      // 2. 检查 namePatterns.include
      if (selector.namePatterns?.include && selector.namePatterns.include.length > 0) {
        // 如果定义了 include 且不为 ['*']，需要匹配
        const isWildcardOnly = selector.namePatterns.include.length === 1 && selector.namePatterns.include[0] === '*';
        if (!isWildcardOnly && !matchesAnyPattern(normalizedName, selector.namePatterns.include)) {
          return false; // 未被包含
        }
      }

      // 3. 检查 tags（暂时跳过，因为当前掷骰上下文可能没有 tags 元数据）
      // 未来可以扩展支持 tags.include/exclude

      return true;
    };

    // [新增] 渲染效果输入区域
    const renderEffectInputs = (preset: AdvancedDicePreset, attrName: string): string[] => {
      if (!preset.effectsConfig) return [];

      // 检查触发模式
      const isMatched = matchesCheckSelector(attrName, {
        namePatterns: { include: preset.effectsConfig.triggerPatterns },
      });

      if (!isMatched) return [];

      const items: string[] = [];

      // 从 preset.outcomes 中查找有效果的结果等级，生成输入框
      // 注意：效果定义在 preset.outcomes[].effects 中，不是 effectsConfig.outcomes
      if (preset.outcomes && Array.isArray(preset.outcomes)) {
        const outcomesWithEffects = preset.outcomes.filter(outcome => outcome.effects && outcome.effects.length > 0);

        outcomesWithEffects.forEach(outcome => {
          // 获取该结果等级的默认值（从 effectsConfig.defaultValues 或 effects[0].value）
          const defaultVal =
            preset.effectsConfig?.defaultValues?.[outcome.name] || (outcome.effects && outcome.effects[0]?.value) || '';
          const label = outcome.name; // 使用结果名作为标签

          items.push(`
            <div class="acu-effect-input-group">
              <div class="acu-effect-input-label">
                <span>${deps.escapeHtml(label)}效果</span>
                <span class="acu-effect-preview-text" id="effect-preview-${deps.escapeHtml(outcome.name)}"></span>
              </div>
              <input type="text"
                     class="acu-dice-input acu-effect-value-input"
                     data-outcome="${deps.escapeHtml(outcome.name)}"
                     value=""
                     placeholder="${deps.escapeHtml(String(defaultVal || '输入效果值 (如 1d6)'))}">
            </div>
          `);
        });
      }

      return items;
    };

    const applyAdvancedPreset = (presetId: string | null) => {
      // 获取关键DOM元素
      const $modWrapper = panel.find('#dice-mod-wrapper');
      const $row1 = panel.find('#dice-row-1');
      const $row2 = panel.find('#dice-row-2');
      const $row3 = panel.find('#dice-row-3');
      const $customArea = panel.find('#dice-custom-fields-area');
      const $attrWrapper = panel.find('#dice-attr-wrapper');
      const $targetWrapper = panel.find('#dice-target-wrapper');
      const $skillModWrapper = panel.find('#dice-skill-mod-wrapper');
      const $nameWrapper = panel.find('#dice-name-wrapper');
      const $attrNameWrapper = panel.find('#dice-attr-name-wrapper');

      // 辅助函数: 恢复 Row 1 的名字和属性名
      const restoreRow1 = () => {
        if ($nameWrapper.parent().attr('id') !== 'dice-row-1') {
          $nameWrapper.detach().prependTo($row1);
        }
        if ($attrNameWrapper.parent().attr('id') !== 'dice-row-1') {
          $attrNameWrapper.detach().appendTo($row1);
        }
        $nameWrapper.show();
        $attrNameWrapper.show();
        $row1.show();
        // 恢复为2列布局
        $row1.removeClass('cols-2 cols-3').addClass('cols-2');
      };

      // 辅助函数: 确保修正值输入框回到原来的位置
      const restoreModifier = () => {
        if ($modWrapper.parent().attr('id') !== 'dice-row-3') {
          $modWrapper.detach().appendTo($row3);
        }
        $modWrapper.show();
        panel.find('#dice-mod-label').text('修正值'); // 恢复默认标签
        panel.find('#dice-modifier').attr('placeholder', '留空=0');
      };

      // 辅助函数: 恢复 Row 2 的属性值、技能加值和目标值
      const restoreRow2 = () => {
        if ($attrWrapper.parent().attr('id') !== 'dice-row-2') {
          $attrWrapper.detach().prependTo($row2);
        }
        if ($skillModWrapper.parent().attr('id') !== 'dice-row-2') {
          $skillModWrapper.detach().insertAfter($attrWrapper);
        }
        if ($targetWrapper.parent().attr('id') !== 'dice-row-2') {
          $targetWrapper.detach().appendTo($row2);
        }
        $attrWrapper.show();
        $skillModWrapper.hide(); // 默认隐藏，由预设控制显示
        $targetWrapper.show();
        $row2.show();
      };

      if (!presetId || presetId === '__custom__') {
        // 恢复默认模式 (自定义或无预设)
        currentAdvancedPreset = null;
        lastVisiblePresetId = null;

        // [新增] 显示自定义模式字段区,隐藏预设相关字段
        panel.find('#acu-dice-custom-mode-fields').show();

        // 恢复 Row 1、Row 2 和 Row 3 但隐藏 Row 2/3 (自定义模式使用专属字段)
        restoreRow1();
        restoreRow2();
        restoreModifier();
        $row2.hide();
        $row3.hide();
        panel.find('#dice-difficulty-wrapper').hide();
        panel.find('#dice-success-criteria').closest('div').hide();

        // 清空自定义区域
        $customArea.empty();

        // 恢复"属性名"标签
        panel.find('.dice-attr-name-text').text('属性名');

        // 恢复属性值和目标值输入框
        applyFieldConfig(panel.find('#dice-attr-value'), panel.find('#dice-attr-label'), undefined, {
          label: '属性值',
          placeholder: '留空=50%最大值',
        });

        applyFieldConfig(panel.find('#dice-target'), panel.find('#dice-target-label'), undefined, {
          label: '目标值',
          placeholder: '留空=属性值',
        });

        // 更新按钮高亮
        panel.find('.acu-dice-quick-preset-btn').removeClass('active');
        panel.find('.acu-dice-quick-preset-btn[data-id="__custom__"]').addClass('active');

        panel.find('#dice-normal-presets').show();
        panel.find('#dice-workflow-return-container').hide();

        updateRuleMode();
        renderPresetQuickActions(null);
        return;
      }

      const preset = deps.AdvancedDicePresetManager.getAllPresets().find(p => p.id === presetId);
      if (!preset) {
        console.warn('[DICE] 未找到预设:', presetId);
        // 回退到自定义模式
        applyAdvancedPreset('__custom__');
        return;
      }

      currentAdvancedPreset = preset;
      if (preset.visible !== false) {
        lastVisiblePresetId = preset.id;
      }

      // 更新按钮高亮
      panel.find('.acu-dice-quick-preset-btn').removeClass('active');
      panel.find(`.acu-dice-quick-preset-btn[data-id="${deps.escapeHtml(preset.id)}"]`).addClass('active');

      // 隐藏自定义输入框
      // [新增] 隐藏自定义模式字段区
      panel.find('#acu-dice-custom-mode-fields').hide();

      // 更新骰子表达式
      panel.find('#dice-formula').val(preset.diceExpression);

      // 更新"属性名"标签（如Fate使用"技能/风格"）
      panel.find('.dice-attr-name-text').text(preset.attributeName?.label || '属性名');

      // 隐藏原始 Row 1、Row 2 和 Row 3 (所有字段将整合到 customArea 中)
      restoreRow1();
      restoreRow2();
      restoreModifier();
      $row1.hide();
      $row2.hide();
      $row3.hide();

      // 清空自定义区域
      $customArea.empty();

      // [重构] 收集所有可见字段，统一使用智能布局
      const gridItems: (JQuery | string)[] = [];

      // 0. 名字 (始终显示)
      gridItems.push($nameWrapper);

      // 0.5 属性名 (始终显示)
      gridItems.push($attrNameWrapper);

      // 1. 属性值 (如果未隐藏)
      if (!preset.attribute?.hidden) {
        applyFieldConfig(panel.find('#dice-attr-value'), panel.find('#dice-attr-label'), preset.attribute, {
          label: '属性值',
          placeholder: '留空=50%最大值',
        });
        gridItems.push($attrWrapper);
      }

      // 1.5 技能加值 (如果预设定义了 skillMod 且未隐藏)
      if (preset.skillMod && !preset.skillMod.hidden) {
        applyFieldConfig(panel.find('#dice-skill-mod'), panel.find('#dice-skill-mod-label'), preset.skillMod, {
          label: '技能加值',
          placeholder: '留空=0',
        });
        gridItems.push($skillModWrapper);
      }

      // [新增] 效果输入区域
      const attrName = panel.find('#dice-attr-name').val().trim();
      const effectInputItems = renderEffectInputs(preset, attrName);
      if (effectInputItems.length > 0) {
        gridItems.push(...effectInputItems);
      }

      // 2. 目标值/DC (如果未隐藏)
      if (!preset.dc?.hidden) {
        applyFieldConfig(panel.find('#dice-target'), panel.find('#dice-target-label'), preset.dc, {
          label: '目标值',
          placeholder: '留空=属性值',
        });
        gridItems.push($targetWrapper);
      }

      // 3. 修正值 (如果未隐藏)
      if (!preset.mod?.hidden) {
        if (preset.mod?.label) {
          panel.find('#dice-mod-label').text(preset.mod.label);
        }
        // 使用 placeholder 显示默认值
        const modDefault = preset.mod?.defaultValue;
        if (modDefault !== undefined && modDefault !== 0) {
          panel.find('#dice-modifier').attr('placeholder', `留空=${modDefault}`);
        } else {
          panel.find('#dice-modifier').attr('placeholder', '留空=0');
        }
        gridItems.push($modWrapper);
      }

      // 4. 收集自定义字段
      if ('customFields' in preset && Array.isArray(preset.customFields) && preset.customFields.length > 0) {
        const visibleFields = preset.customFields.filter(f => !f.hidden);

        visibleFields.forEach(field => {
          let html = '<div>';

          // 标签
          if (field.type !== 'toggle') {
            html += `<div class="acu-dice-form-label">${deps.escapeHtml(field.label || field.id)}</div>`;
          } else {
            html += '<div class="acu-dice-form-label">&nbsp;</div>'; // 占位
          }

          // 控件
          if (field.type === 'select' && field.options) {
            html += `<select class="acu-dice-select acu-dice-custom-field" data-id="${deps.escapeHtml(field.id)}">`;
            field.options.forEach(opt => {
              const isSelected = opt.value === field.defaultValue ? 'selected' : '';
              html += `<option value="${deps.escapeHtml(String(opt.value))}" ${isSelected}>${deps.escapeHtml(opt.label)}</option>`;
            });
            html += '</select>';
          } else if (field.type === 'toggle') {
            const isChecked = field.defaultValue ? 'checked' : '';
            html += `<label style="display: flex; align-items: center; cursor: pointer; height: 32px;">
              <input type="checkbox" class="acu-dice-custom-field" data-id="${deps.escapeHtml(field.id)}" ${isChecked} style="margin-right: 8px;">
              ${deps.escapeHtml(field.label || field.id)}
            </label>`;
          } else {
            const type = field.type === 'number' ? 'number' : 'text';
            // [修复] 使用 placeholder 而不是 value 显示默认值
            const defaultVal = field.defaultValue;
            const placeholderText =
              field.placeholder || (defaultVal !== undefined && defaultVal !== '' ? `留空=${defaultVal}` : '');
            html += `<input type="${type}" class="acu-dice-input acu-dice-custom-field" data-id="${deps.escapeHtml(field.id)}"
              placeholder="${deps.escapeHtml(placeholderText)}">`;
          }

          html += '</div>';
          gridItems.push(html);
        });
      }

      // 5. 智能排版渲染网格
      // 布局规律：最后一行优先放3个字段，前面的行放2个字段
      // - 4个字段：2+2
      // - 5个字段：2+3
      // - 6个字段：3+3
      // - 7个字段：2+2+3
      // - 8个字段：2+3+3
      // - 9个字段：3+3+3
      const appendItem = ($row: JQuery, item: JQuery | string) => {
        if (typeof item === 'string') {
          $row.append(item);
        } else {
          item.detach().appendTo($row);
          item.show();
        }
      };

      // 计算行分配：从后往前，优先用3列填充
      const computeRowLayout = (total: number): number[] => {
        if (total <= 0) return [];
        if (total <= 2) return [2]; // 最少2列，避免 cols-1
        if (total === 3) return [3];
        if (total === 4) return [2, 2];
        if (total === 5) return [2, 3];
        if (total === 6) return [3, 3];
        // 7+ 字段：递归计算，最后一行放3个，剩余的递归处理
        return [...computeRowLayout(total - 3), 3];
      };

      // 直接计算 gridItems 的行分配
      const gridRowLayout = computeRowLayout(gridItems.length);

      let itemIndex = 0;
      for (const colCount of gridRowLayout) {
        const $row = $(`<div class="acu-dice-form-row cols-${colCount}"></div>`);
        for (let j = 0; j < colCount; j++) {
          if (itemIndex < gridItems.length) {
            appendItem($row, gridItems[itemIndex]);
            itemIndex++;
          } else {
            $row.append('<div></div>');
          }
        }
        $customArea.append($row);
      }

      // [新增] 为动态生成的 customFields 输入框添加清除按钮
      deps.addClearButton($customArea, '.acu-dice-custom-field[type="text"], .acu-dice-custom-field[type="number"]');

      renderPresetQuickActions(preset);

      // [核心修复] 检测是否为“工作流模式”并切换 UI 状态
      // 这里的判定逻辑：如果预设是“非默认可见”的（visible: false），则视为特殊工作流（如技能成长）
      // 此时隐藏常规预设切换按钮，显示“返回常规检定”按钮
      const isWorkMode = preset.visible === false;
      const $normalPresets = panel.find('#dice-normal-presets');
      const $workflowReturn = panel.find('#dice-workflow-return-container');

      if (isWorkMode) {
        $normalPresets.hide();
        $workflowReturn.show();
        $workflowReturn
          .find('button')
          .html(`<i class="fa-solid fa-arrow-left"></i> 返回常规检定（退出${deps.escapeHtml(preset.name)}）`);
      } else {
        $normalPresets.show();
        $workflowReturn.hide();
      }

      console.log('[DICE] 应用高级预设:', preset.name, isWorkMode ? '(工作流模式)' : '');
    };

    // [新增] 动态监听属性名变化，更新效果输入区域
    panel.find('#dice-attr-name').on('change', function () {
      if (!currentAdvancedPreset) return;
      // 重新渲染整个面板内容可能太重，这里只更新效果区域
      // 但由于效果区域是作为 gridItems 动态插入的，直接重新调用 applyAdvancedPreset 最简单
      // 必须防止死循环
      if (panel.data('updating-preset')) return;
      panel.data('updating-preset', true);
      applyAdvancedPreset(currentAdvancedPreset.id);
      panel.data('updating-preset', false);
    });

    // 自定义模式下持久化骰子语法（仅自定义模式使用）
    panel.find('#custom-dice-expr').on('input change', function () {
      if (!panel.find('#acu-dice-custom-mode-fields').is(':visible')) return;
      const customExpr = ($(this).val() || '').toString().trim();
      deps.saveDiceConfig({ customDiceExpr: customExpr });
    });

    // 绑定快捷预设按钮点击事件：预设管理器会动态刷新按钮，必须用委托绑定新按钮
    panel.on('click', '#dice-normal-presets .acu-dice-quick-preset-btn', function () {
      const presetId = $(this).data('id') as string;

      // 保存到 last preset
      if (presetId === '__custom__') {
        deps.AdvancedDicePresetManager.setActivePreset(null);
        localStorage.setItem(deps.STORAGE_KEY_LAST_PRESET, '__custom__');
      } else {
        deps.AdvancedDicePresetManager.setActivePreset(presetId);
        localStorage.setItem(deps.STORAGE_KEY_LAST_PRESET, presetId);
      }

      applyAdvancedPreset(presetId);
    });

    // [新增] 绑定“返回常规检定”按钮点击事件
    panel.on('click', '#dice-return-normal-btn', function (e) {
      e.preventDefault();
      // 返回到最近一次可见预设；若无则回退到第一个可见预设
      let targetPresetId: string | null = lastVisiblePresetId;

      // 验证 targetPresetId 是否有效且可见
      const allPresets = deps.AdvancedDicePresetManager.getAllPresets();
      const targetPreset = allPresets.find(p => p.id === targetPresetId);
      if (!targetPreset || targetPreset.visible === false) {
        // 如果上次预设无效或不可见，则回退到第一个可见预设
        const firstVisible = allPresets.find(p => p.visible !== false);
        targetPresetId = firstVisible ? firstVisible.id : '__custom__';
      }

      // 执行切换
      if (targetPresetId === '__custom__') {
        deps.AdvancedDicePresetManager.setActivePreset(null);
      } else {
        deps.AdvancedDicePresetManager.setActivePreset(targetPresetId);
      }
      // 更新 localStorage
      localStorage.setItem(deps.STORAGE_KEY_LAST_PRESET, targetPresetId || '__custom__');

      applyAdvancedPreset(targetPresetId);
    });

    panel.on('click', '.acu-dice-preset-action-btn', async function (e) {
      e.preventDefault();
      e.stopPropagation();
      const actionId = String($(this).data('action-id') || '').trim();
      if (!actionId) return;
      const $btn = $(this);
      if ($btn.prop('disabled')) return;
      $btn.prop('disabled', true).addClass('disabled');
      try {
        await executePresetQuickAction(actionId);
      } finally {
        $btn.prop('disabled', false).removeClass('disabled');
        renderPresetQuickActions(currentAdvancedPreset);
      }
    });

    panel.find('#dice-attr-value, #dice-modifier, #dice-target').on('input change', function () {
      renderPresetQuickActions(currentAdvancedPreset);
    });

    // 初始化时应用已保存的预设
    const savedPresetId = localStorage.getItem(deps.STORAGE_KEY_LAST_PRESET);
    // 兼容旧逻辑：如果 ActivePresetManager 里有值，优先使用
    const activePreset = deps.AdvancedDicePresetManager.getActivePreset();

    if (activePreset) {
      applyAdvancedPreset(activePreset.id);
    } else if (savedPresetId && savedPresetId !== '__custom__') {
      applyAdvancedPreset(savedPresetId);
    } else {
      applyAdvancedPreset('__custom__');
    }

    // 掷骰逻辑 - 使用 rollComplexDiceExpression 支持复合表达式
    const rollDice = formula => {
      const rollResult = rollComplexDiceExpression(formula);
      const total = rollResult.total;
      if (Number.isNaN(total)) {
        return { total: 0, rolls: [], formula };
      }
      // 尝试从公式中提取基本信息用于显示
      const basicMatch = formula.match(/^(\d*)d(\d+|F)/i);
      const count = basicMatch && basicMatch[1] ? parseInt(basicMatch[1], 10) : 1;
      const sidesStr = basicMatch ? basicMatch[2] : '100';
      const sides = sidesStr.toUpperCase() === 'F' ? 3 : parseInt(sidesStr, 10);
      // 对于复杂语法，不提供单独的 rolls 数组
      return { total, rolls: [], sides, count, modifier: 0, formula };
    };

    // 解析修正值，支持纯数字和骰子表达式（如1d6, 1d6+2等）
    const parseModifier = function (modStr) {
      if (!modStr || modStr.trim() === '') return 0;
      const trimmed = modStr.trim();

      // 尝试直接解析为数字
      const numValue = parseFloat(trimmed);
      if (!isNaN(numValue) && isFinite(numValue) && trimmed.match(/^-?\d+(\.\d+)?$/)) {
        return numValue;
      }

      // 复合表达式统一走完整解析
      const rollResult = rollComplexDiceExpression(trimmed);
      if (!Number.isNaN(rollResult.total)) return rollResult.total;
      return 0;
    };

    const resolveExpressionWithContext = (expr: string, context: Record<string, string | number | boolean>): string => {
      let resolved = String(expr || '0');
      Object.entries(context).forEach(([key, value]) => {
        const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        resolved = resolved.replace(new RegExp(safeKey, 'g'), String(value));
      });
      return resolved;
    };

    const activatePresetQuickAction = (action: WorkflowQuickAction): void => {
      const presetId = String(action.config.presetId || '').trim();
      if (!presetId) {
        if (window.toastr) window.toastr.warning('快捷操作缺少目标预设');
        return;
      }
      const targetPreset = deps.AdvancedDicePresetManager.getAllPresets().find(item => item.id === presetId);
      if (!targetPreset) {
        if (window.toastr) window.toastr.warning(`未找到预设: ${presetId}`);
        return;
      }

      const carryInitiator = action.config.carryInitiator !== false;
      const carryAttrName = action.config.carryAttrName !== false;
      const carryAttrValue = action.config.carryAttrValue !== false;
      const carryTarget = action.config.carryTarget === true;
      const carryModifier = action.config.carryModifier === true;
      const carrySkillMod = action.config.carrySkillMod === true;

      const previousState = {
        initiatorName: String(panel.find('#dice-initiator-name').val() || '').trim(),
        attrName: String(panel.find('#dice-attr-name').val() || '').trim(),
        attrValue: String(panel.find('#dice-attr-value').val() || '').trim(),
        target: String(panel.find('#dice-target').val() || '').trim(),
        modifier: String(panel.find('#dice-modifier').val() || '').trim(),
        skillMod: String(panel.find('#dice-skill-mod').val() || '').trim(),
      };

      deps.AdvancedDicePresetManager.setActivePreset(presetId);
      localStorage.setItem(deps.STORAGE_KEY_LAST_PRESET, presetId);
      applyAdvancedPreset(presetId);

      if (carryInitiator) {
        panel.find('#dice-initiator-name').val(previousState.initiatorName);
      }
      if (carryAttrName) {
        panel.find('#dice-attr-name').val(previousState.attrName);
      } else if (action.config.attrName !== undefined) {
        panel.find('#dice-attr-name').val(action.config.attrName);
      }
      if (carryAttrValue) {
        panel.find('#dice-attr-value').val(previousState.attrValue);
      }
      if (carryTarget) {
        panel.find('#dice-target').val(previousState.target);
      }
      if (carryModifier) {
        panel.find('#dice-modifier').val(previousState.modifier);
      }
      if (carrySkillMod) {
        panel.find('#dice-skill-mod').val(previousState.skillMod);
      }

      if (action.config.customFieldValues) {
        Object.entries(action.config.customFieldValues).forEach(([fieldId, rawValue]) => {
          const $field = panel
            .find('.acu-dice-custom-field')
            .filter((_index, element) => String($(element).data('id') || '') === fieldId);
          if (!$field.length) return;
          if ($field.is(':checkbox')) {
            $field.prop('checked', Boolean(rawValue));
            return;
          }
          $field.val(String(rawValue));
        });
      }

      panel.find('#dice-attr-name').trigger('change');
      panel.find('#dice-attr-value, #dice-target, #dice-modifier, #dice-skill-mod').trigger('change');
    };

    const executeAttrShortcutQuickAction = (action: AttrShortcutQuickAction): void => {
      const presetId = String(action.config.presetId || '').trim();
      if (!presetId) {
        if (window.toastr) window.toastr.warning('属性快捷缺少目标预设');
        return;
      }

      const allPresets = deps.AdvancedDicePresetManager.getAllPresets();
      const configuredTargetPreset = allPresets.find(item => item.id === presetId);
      if (!configuredTargetPreset) {
        if (window.toastr) window.toastr.warning(`属性快捷目标预设不存在: ${presetId}`);
        return;
      }

      // 架构约束：属性快捷只能指向“常规可见预设”，若指向工作流预设则直接中止
      if (configuredTargetPreset.visible === false) {
        if (window.toastr) {
          window.toastr.warning(`属性快捷目标预设不可用（工作流）: ${configuredTargetPreset.name}，已中止执行`);
        }
        return;
      }

      const presetAllowedTargets = Array.isArray(configuredTargetPreset.effectsConfig?.allowedTargets)
        ? configuredTargetPreset.effectsConfig?.allowedTargets
        : [];
      const mergedCandidates = Array.from(
        new Set(
          [...(action.config.attrAliasCandidates || []), ...presetAllowedTargets]
            .map(name => String(name || '').trim())
            .filter(Boolean),
        ),
      );

      const workflowAction: WorkflowQuickAction = {
        id: action.id,
        kind: 'workflow_shortcut',
        icon: action.icon,
        tooltip: action.tooltip,
        condition: action.condition,
        config: {
          presetId,
          carryInitiator: action.config.carryInitiator,
          carryAttrName: false,
          carryAttrValue: action.config.carryAttrValue,
          carryTarget: action.config.carryTarget,
          carryModifier: action.config.carryModifier,
          carrySkillMod: action.config.carrySkillMod,
        },
      };
      activatePresetQuickAction(workflowAction);

      const charName = String(panel.find('#dice-initiator-name').val() || '').trim() || '<user>';
      const candidates = mergedCandidates;
      const fallbackName = String(action.config.fallbackAttrName || '').trim() || candidates[0] || '';
      if (!fallbackName) return;

      const resolved = deps.resolveAttributeAliasName(charName, fallbackName, candidates);
      const resolvedAttrName = resolved.name || fallbackName;
      panel.find('#dice-attr-name').val(resolvedAttrName).trigger('change');
    };

    const executePresetQuickAction = async (actionId: string): Promise<void> => {
      const preset = currentAdvancedPreset;
      if (!preset) {
        if (window.toastr) window.toastr.warning('请先选择一个检定预设');
        return;
      }
      const action = getPresetQuickActions(preset).find(item => item.id === actionId);
      if (!action) {
        if (window.toastr) window.toastr.warning('未找到快捷操作配置');
        return;
      }
      if (action.kind === 'workflow_shortcut') {
        activatePresetQuickAction(action);
        return;
      }
      if (action.kind === 'attr_shortcut') {
        executeAttrShortcutQuickAction(action);
        return;
      }
      if (window.toastr) window.toastr.warning('暂不支持的快捷操作类型');
    };

    // [新增] 资源消耗器按钮渲染辅助函数
    const renderResourceBurnerButtons = (
      preset: AdvancedDicePreset,
      context: Record<string, number>,
      matchedOutcome?: OutcomeLevel,
      attrName?: string,
    ): string => {
      if (!preset.resourceBurners || !Array.isArray(preset.resourceBurners) || preset.resourceBurners.length === 0) {
        return '';
      }

      let html = '';
      preset.resourceBurners.forEach(burner => {
        // 1. 首先检查 selector 过滤（结构性范围控制）
        if (attrName && burner.selector) {
          const selectorMatch = matchesCheckSelector(attrName, burner.selector);
          if (!selectorMatch) {
            return; // 属性名被 selector 排除
          }
        }

        // 2. 然后检查 condition（动态状态控制）
        if (burner.condition) {
          const evalResult = deps.evaluateCondition(burner.condition, context);
          if (
            !evalResult.success ||
            (typeof evalResult.value === 'number' ? evalResult.value === 0 : !evalResult.value)
          ) {
            return;
          }
        }
        const icon = burner.ui?.icon || 'fa-fire';
        const tooltip = burner.ui?.tooltip || `消耗 ${burner.resourceName}`;

        html += `<button type="button" class="acu-dice-burner-btn" data-id="${deps.escapeHtml(burner.id)}" title="${deps.escapeHtml(tooltip)}">
          <i class="fa-solid ${deps.escapeHtml(icon)}"></i>
        </button>`;
      });

      return html ? `<div class="acu-dice-burners">${html}</div>` : '';
    };

    // [新增] 资源消耗器点击处理函数
    const handleResourceBurnerClick = (burner: ResourceBurner, context: Record<string, number>) => {
      // 获取角色名：保留原始值用于数据操作，解析后的值用于显示
      const rawInitiatorName = panel.find('#dice-initiator-name').val().trim() || '<user>';
      const displayName = deps.replaceUserPlaceholders(rawInitiatorName);

      // 获取当前资源值（使用原始值，让 getAttributeValue 内部判断是否是主角）
      let currentResource = deps.getAttributeValue(rawInitiatorName, burner.resourceName);

      // 如果资源不存在，尝试初始化（仅限幸运值）
      if (currentResource === undefined || currentResource === null) {
        if (burner.resourceName === '幸运' || burner.resourceName.toLowerCase() === 'luck') {
          // CoC7 幸运值初始化：3D6 × 5
          const d1 = Math.floor(Math.random() * 6) + 1;
          const d2 = Math.floor(Math.random() * 6) + 1;
          const d3 = Math.floor(Math.random() * 6) + 1;
          const initialLuck = (d1 + d2 + d3) * 5;

          if (window.toastr) {
            window.toastr.info(`幸运值未设置，已随机生成: ${d1}+${d2}+${d3}=${d1 + d2 + d3} × 5 = ${initialLuck}`);
          }

          // 尝试写入初始值（使用原始值，让函数内部判断是否是主角）
          deps.updateSingleAttribute(rawInitiatorName, burner.resourceName, 'set', initialLuck, {
            initValue: initialLuck,
          }).then(result => {
            if (result.success) {
              // 递归调用自己，现在资源已存在
              handleResourceBurnerClick(burner, context);
            } else {
              if (window.toastr)
                showActionableErrorToast(`初始化幸运值失败: ${result.error}`, {
                  suggestion: '请确认角色表存在可写的幸运值/资源属性；如果表格结构正确仍失败，请查看控制台中的属性写入日志。',
                });
            }
          });
          return;
        } else {
          if (window.toastr)
            showActionableErrorToast(`找不到属性「${burner.resourceName}」，无法执行资源消耗。`, {
              suggestion: '请确认属性预设或角色表中存在这个资源属性；如果这是新资源，请先在属性表里创建或启用初始化。',
            });
          return;
        }
      }

      currentResource = currentResource || 0;

      // 创建自定义对话框（传递原始名字用于数据操作）
      showBurnerInputDialog(burner, rawInitiatorName, currentResource, context);
    };

    // [新增] 显示燃运输入对话框
    const showBurnerInputDialog = (
      burner: ResourceBurner,
      rawCharName: string, // 原始角色名（如 <user>），用于数据操作
      currentResource: number,
      context: Record<string, number>,
    ) => {
      const currentThemeClass = `acu-theme-${config.theme}`;

      // 移除已存在的对话框
      $('.acu-burner-overlay').remove();

      // 计算建议消耗量（如果预设定义了 suggestedAmount 表达式）
      let suggestedValue = 1; // 默认为1
      let suggestedHint = '';
      if (burner.suggestedAmount) {
        const evalResult = deps.evaluateCondition(burner.suggestedAmount, context);
        if (evalResult.success && typeof evalResult.value === 'number' && evalResult.value > 0) {
          // 向上取整（需要至少这么多资源才刚好通过），再除以ratio
          const rawNeeded = Math.ceil(evalResult.value / burner.ratio);
          if (burner.resourceOperation === 'add') {
            suggestedValue = Math.max(1, rawNeeded);
            suggestedHint = `建议: ${suggestedValue} (刚好通过)`;
          } else {
            const capped = Math.min(Math.max(1, rawNeeded), currentResource);
            suggestedValue = capped;
            if (rawNeeded > currentResource) {
              suggestedHint = `建议: ${suggestedValue} (已达上限，仍无法通过)`;
            } else {
              suggestedHint = `建议: ${suggestedValue} (刚好通过)`;
            }
          }
        }
      }

      const isAddMode = burner.resourceOperation === 'add';
      const actionVerb = isAddMode ? '增加' : '消耗';
      const maxAttr = isAddMode ? '' : `max="${currentResource}"`;

      // 从 context 提取骰子结果和目标值，用于效果预览
      const rollTotal = (context['$roll.total'] ?? context['$roll'] ?? 0) as number;
      const attrValue = (context['$attr'] ?? 0) as number;

      const dialog = $(`
        <div class="acu-edit-overlay acu-burner-overlay">
          <div class="acu-edit-dialog ${currentThemeClass}" style="max-width:350px;">
            <div class="acu-edit-title">
              <i class="fa-solid ${deps.escapeHtml(burner.ui?.icon || 'fa-fire')}" style="color:${deps.escapeHtml(burner.ui?.color || 'var(--acu-accent)')}"></i>
              ${deps.escapeHtml(actionVerb)} ${deps.escapeHtml(burner.resourceName)}
            </div>
            <div class="acu-settings-content" style="padding:15px;">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
                <div style="flex:1;">
                  <label style="display:block;font-size:11px;color:var(--acu-text-sub);margin-bottom:4px;">${deps.escapeHtml(actionVerb)}数量</label>
                  <input type="number" id="burner-amount" class="acu-input" value="${suggestedValue}" min="1" ${maxAttr} style="width:100%;">
                  ${suggestedHint ? `<div style="font-size:10px;color:var(--acu-accent);margin-top:2px;">${deps.escapeHtml(suggestedHint)}</div>` : ''}
                </div>
                <div style="flex:1;">
                  <label style="display:block;font-size:11px;color:var(--acu-text-sub);margin-bottom:4px;">当前${isAddMode ? '数值' : '可用'}</label>
                  <div style="font-size:18px;font-weight:bold;color:var(--acu-success-text);">${currentResource}</div>
                </div>
              </div>
              <div id="burner-preview" style="padding:10px;background:var(--acu-card-bg);border-radius:6px;font-size:12px;">
                <div id="burner-before" style="color:var(--acu-text-sub);margin-bottom:6px;"></div>
                <div id="burner-after" style="font-weight:bold;"></div>
              </div>
            </div>
            <div class="acu-dialog-btns">
              <button class="acu-dialog-btn" id="burner-cancel"><i class="fa-solid fa-times"></i> 取消</button>
              <button class="acu-dialog-btn acu-btn-confirm" id="burner-confirm"><i class="fa-solid fa-check"></i> 确认${deps.escapeHtml(actionVerb)}</button>
            </div>
          </div>
        </div>
      `);

      $('body').append(dialog);

      // 更新效果预览：显示燃运前后的骰子结果对比
      const updatePreview = () => {
        const amount = parseInt(dialog.find('#burner-amount').val() as string, 10) || 0;
        const effectValue = amount * burner.ratio;
        // 计算燃运后的目标值变化
        let newRoll = rollTotal;
        let newAttr = attrValue;
        if (burner.target === 'roll') {
          newRoll = burner.direction === 'decrease' ? rollTotal - effectValue : rollTotal + effectValue;
        } else if (burner.target === 'attribute') {
          newAttr = burner.direction === 'increase' ? attrValue + effectValue : attrValue - effectValue;
        }
        const beforePass = rollTotal <= attrValue;
        const afterPass = newRoll <= newAttr;
        const beforeColor = beforePass ? 'var(--acu-success-text)' : 'var(--acu-error-text)';
        const afterColor = afterPass ? 'var(--acu-success-text)' : 'var(--acu-error-text)';
        dialog
          .find('#burner-before')
          .html(
            `当前: <span style="color:${beforeColor};font-weight:bold;">${rollTotal} &lt;= ${attrValue} → ${beforePass ? '成功' : '失败'}</span>`,
          );
        dialog
          .find('#burner-after')
          .html(
            `燃运后: <span style="color:${afterColor}">${newRoll} &lt;= ${newAttr} → ${afterPass ? '成功' : '失败'}</span>` +
              `<span style="color:var(--acu-text-sub);font-weight:normal;margin-left:8px;">(${actionVerb} ${amount} 点${burner.resourceName})</span>`,
          );
      };
      updatePreview();

      dialog.find('#burner-amount').on('input', updatePreview);

      // 取消按钮
      dialog.on('click', '#burner-cancel', () => {
        dialog.remove();
      });

      // 点击遮罩关闭
      dialog.on('click', '.acu-burner-overlay', e => {
        if ($(e.target).hasClass('acu-burner-overlay')) {
          dialog.remove();
        }
      });

      // 确认按钮
      dialog.on('click', '#burner-confirm', () => {
        const amount = parseInt(dialog.find('#burner-amount').val() as string, 10);

        if (isNaN(amount) || amount <= 0) {
          if (window.toastr) window.toastr.warning('请输入有效的正整数');
          return;
        }

        // subtract 模式检查资源上限，add 模式不限
        if (!isAddMode && amount > currentResource) {
          if (window.toastr)
            showActionableErrorToast(`资源不足: 需要 ${amount}，当前只有 ${currentResource}。`, {
              suggestion: 'resource',
            });
          return;
        }

        dialog.remove();

        const op: 'add' | 'subtract' = isAddMode ? 'add' : 'subtract';
        // 执行资源变更（使用原始角色名，让函数内部判断是否是主角）
        deps.updateSingleAttribute(rawCharName, burner.resourceName, op, amount).then(result => {
          if (!result.success) {
            if (window.toastr)
              showActionableErrorToast(`${actionVerb}资源失败: ${result.error}`, {
                suggestion: '请确认角色表中的资源属性可写，并刷新属性数据后重试；如果仍失败，请查看控制台中的属性写入日志。',
              });
            return;
          }

          if (window.toastr) window.toastr.success(`已${actionVerb} ${amount} 点 ${burner.resourceName}`);

          // 刷新属性显示（使用原始角色名）
          buildAttrButtons(rawCharName);

          // 应用效果并重新计算结果
          applyBurnerEffect(burner, amount);
        });
      });

      // 聚焦输入框
      dialog.find('#burner-amount').trigger('focus').trigger('select');
    };

    // [新增] 显示效果确认对话框
    const showEffectConfirmDialog = (options: {
      preset: AdvancedDicePreset;
      outcomeLabel: string;
      branchReasonText?: string;
      effects: ComputedEffect[];
      onConfirm: () => void;
      onCancel: () => void;
    }) => {
      const { preset, outcomeLabel, branchReasonText, effects, onConfirm, onCancel } = options;
      const currentThemeClass = `acu-theme-${config.theme}`;
      const uiCfg = preset.effectConfirmUi || {};
      const dialogTitle = uiCfg.title || '确认效果执行';
      const effectListTitle = uiCfg.effectListTitle || '即将应用以下效果:';
      const branchReasonLabel = uiCfg.branchReasonLabel || '分支依据';

      // 移除已存在的对话框
      $('.acu-confirm-overlay').remove();

      const dialog = $(`
        <div class="acu-edit-overlay acu-confirm-overlay">
          <div class="acu-edit-dialog ${currentThemeClass}" style="max-width:350px;">
            <div class="acu-edit-title">
              <i class="fa-solid fa-clipboard-check" style="color:var(--acu-accent)"></i>
              ${deps.escapeHtml(dialogTitle)}
            </div>
            <div class="acu-settings-content" style="padding:15px;">
              <div style="margin-bottom:12px;font-weight:bold;font-size:14px;text-align:center;color:var(--acu-text-main);">
                ${deps.escapeHtml(outcomeLabel)}
              </div>
              ${
                branchReasonText
                  ? `<div style="margin-bottom:12px;padding:8px 10px;background:var(--acu-card-bg);border-radius:6px;font-size:12px;line-height:1.45;color:var(--acu-text-sub);"><span style="color:var(--acu-text-main);font-weight:bold;">${deps.escapeHtml(branchReasonLabel)}:</span> ${deps.escapeHtml(branchReasonText)}</div>`
                  : ''
              }

              <div style="background:var(--acu-card-bg);border-radius:6px;padding:10px;margin-bottom:15px;max-height:200px;overflow-y:auto;">
                <div style="font-size:12px;color:var(--acu-text-sub);margin-bottom:8px;">${deps.escapeHtml(effectListTitle)}</div>
                ${effects
                  .map(
                    e => `
                  <div style="padding:8px 0;border-bottom:1px solid var(--acu-border);font-size:13px;display:grid;grid-template-columns:1fr auto;gap:6px 10px;align-items:start;">
                    <div style="font-weight:bold;color:var(--acu-text-main);min-width:0;">${deps.escapeHtml(e.resolvedTarget || e.target)}</div>
                    <div style="color:${e.computedValue >= 0 ? 'var(--acu-success-text)' : 'var(--acu-error-text)'};font-weight:bold;text-align:right;white-space:nowrap;">
                      ${e.computedValue > 0 ? '+' : ''}${e.computedValue}
                    </div>
                    <div style="grid-column:1 / -1;font-size:11px;color:var(--acu-text-sub);line-height:1.45;">
                      算式: ${deps.escapeHtml(e.formula)} ｜ 掷值: ${deps.escapeHtml(String(e.rolledValue))}<br>
                      数值: ${e.beforeValue === null || e.beforeValue === undefined ? '未知' : deps.escapeHtml(String(e.beforeValue))}
                      →
                      ${e.afterValue === null || e.afterValue === undefined ? '未知' : deps.escapeHtml(String(e.afterValue))}
                      ${e.conditionSummary ? `<br>条件: ${deps.escapeHtml(e.conditionSummary)}` : ''}
                    </div>
                  </div>
                `,
                  )
                  .join('')}
              </div>
            </div>
            <div class="acu-dialog-btns">
              <button class="acu-dialog-btn" id="confirm-cancel"><i class="fa-solid fa-times"></i> 取消</button>
              <button class="acu-dialog-btn acu-btn-confirm" id="confirm-ok"><i class="fa-solid fa-check"></i> 确认执行</button>
            </div>
          </div>
        </div>
      `);

      $('body').append(dialog);

      // 取消按钮
      dialog.on('click', '#confirm-cancel', () => {
        dialog.remove();
        onCancel();
      });

      // 点击遮罩关闭 (视为取消)
      dialog.on('click', '.acu-confirm-overlay', e => {
        if ($(e.target).hasClass('acu-confirm-overlay')) {
          dialog.remove();
          onCancel();
        }
      });

      // 确认按钮
      dialog.on('click', '#confirm-ok', () => {
        dialog.remove();
        onConfirm();
      });

      // 自动聚焦确认按钮,方便键盘操作
      dialog.find('#confirm-ok').focus();
    };

    /**
     * [新增] 从效果输入框读取并计算效果值
     * @param outcomeName 结果等级名称 (用于匹配输入框)
     * @param defaultFormula 默认公式
     * @returns ComputedEffect 数组
     */
    const resolveEffectConditionPreview = (
      effect: Effect,
      effectContext: PendingEffectContext['context'],
      outcomeName: string,
    ): Pick<ComputedEffect, 'conditionExpr' | 'resolvedConditionExpr' | 'conditionPassed' | 'conditionSummary'> => {
      if (!effect.condition || effect.condition.trim() === '') {
        return {
          conditionExpr: '',
          resolvedConditionExpr: '',
          conditionPassed: true,
          conditionSummary: `命中【${outcomeName}】分支后直接生效`,
        };
      }

      const rawExpr = effect.condition.trim();
      const condContext: Record<string, number> = {
        $roll: effectContext.roll,
        '$roll.total': effectContext.roll,
        $attr: effectContext.attributeValue,
        $mod: effectContext.modifier,
        $dc: effectContext.dc,
      };
      const condResult = deps.evaluateCondition(rawExpr, condContext);
      const passed =
        condResult.success &&
        (typeof condResult.value === 'number' ? condResult.value !== 0 : Boolean(condResult.value));

      const resolvedExpr = rawExpr
        .replace(/\$roll\.total/g, String(effectContext.roll))
        .replace(/\$roll/g, String(effectContext.roll))
        .replace(/\$attr/g, String(effectContext.attributeValue))
        .replace(/\$mod/g, String(effectContext.modifier))
        .replace(/\$dc/g, String(effectContext.dc));

      const summary = `命中【${outcomeName}】分支，条件 ${resolvedExpr}（原式:${rawExpr}）${passed ? '成立' : '不成立'}`;
      return {
        conditionExpr: rawExpr,
        resolvedConditionExpr: resolvedExpr,
        conditionPassed: passed,
        conditionSummary: summary,
      };
    };

    const computeEffectsFromInputs = (
      outcomeName: string,
      effects: Effect[],
      effectContext: PendingEffectContext['context'],
    ): ComputedEffect[] => {
      const results: ComputedEffect[] = [];

      // 查找对应结果等级的效果输入框
      const $inputGroup = panel.find(`.acu-effect-value-input[data-outcome="${outcomeName}"]`);
      const inputValue = $inputGroup.val()?.toString().trim() || '';

      for (const effect of effects) {
        // 如果用户输入了值,使用用户输入;否则使用效果定义的默认值
        const formula = inputValue || String(effect.value || '0');
        const parsedValue = parseEffectValueInput(formula, `Confirm ${outcomeName}/${effect.id}`);
        let computedValue = parsedValue.finalValue;
        const rolledValue = parsedValue.rolledValue;
        const displayText = parsedValue.valid
          ? `${parsedValue.formulaText} → ${rolledValue}`
          : `${parsedValue.formulaText} → 解析失败(按0处理)`;

        // 根据操作类型调整符号
        if (effect.operation === 'subtract') {
          computedValue = -Math.abs(computedValue);
        }

        const conditionPreview = resolveEffectConditionPreview(effect, effectContext, outcomeName);

        results.push({
          effectId: effect.id,
          target: effect.target,
          computedValue,
          rolledValue,
          formula: parsedValue.formulaText,
          displayText,
          ...conditionPreview,
        });
      }

      return results;
    };

    /**
     * [新增] 处理效果确认流程
     * 检查是否有需要确认的效果,显示弹窗并在确认后执行
     */
    const handleEffectConfirmation = async (pendingCtx: PendingEffectContext): Promise<void> => {
      const { preset, matchedOutcome, context: effectContext } = pendingCtx;
      if (!matchedOutcome.effects || matchedOutcome.effects.length === 0) {
        return;
      }

      if (activeConfirmEffectRun && activeConfirmEffectRun.runId !== pendingCtx.runId) {
        const staleRun = activeConfirmEffectRun;
        setHistoryEffectStateByRun(staleRun, {
          effectStatus: 'cancelled',
          effectError: '确认弹窗被新的检定覆盖，自动取消',
          effectTrace: ['已取消：被新操作覆盖'],
        });
        const seq = emitEffectRun({
          runId: staleRun.runId,
          status: 'cancelled',
          characterName: staleRun.context.characterName,
          attributeName: staleRun.context.attributeName,
          historyIndex: staleRun.historyIndex,
          effectResults: [],
          effectTrace: ['已取消：被新操作覆盖'],
          chainMode: getSecondaryTriggerMode(staleRun.preset),
          error: '确认弹窗被新的检定覆盖，自动取消',
          timestamp: Date.now(),
        });
        setHistoryEffectStateByRun(staleRun, { effectEventSeq: seq });
      }
      activeConfirmEffectRun = pendingCtx;

      // 检查是否有需要确认的效果 (默认 needsConfirm=true)
      const needsConfirmEffects = matchedOutcome.effects.filter(e => e.needsConfirm !== false);
      if (needsConfirmEffects.length === 0) {
        // 所有效果都不需要确认,直接暂存等待 MESSAGE_SENT 执行
        return;
      }

      // 计算效果值
      const aliasCandidates = [...(preset.effectsConfig?.allowedTargets || []), effectContext.attributeName].filter(
        (name, idx, arr) => Boolean(name) && arr.indexOf(name) === idx,
      );
      const computedEffects = computeEffectsFromInputs(matchedOutcome.name, needsConfirmEffects, effectContext).map(
        eff => {
          const resolvedTarget = deps.resolveAttributeAliasName(
            effectContext.characterName,
            eff.target,
            aliasCandidates,
          ).name;
          const beforeValue = deps.getAttributeValue(effectContext.characterName, eff.target, aliasCandidates);
          const afterValue = beforeValue === null || beforeValue === undefined ? null : beforeValue + eff.computedValue;
          return {
            ...eff,
            resolvedTarget: resolvedTarget || undefined,
            beforeValue,
            afterValue,
          };
        },
      );
      if (computedEffects.length === 0) {
        return;
      }

      // 显示确认弹窗
      showEffectConfirmDialog({
        preset,
        outcomeLabel: `${effectContext.attributeName} 检定: ${matchedOutcome.name}`,
        branchReasonText: pendingCtx.branchReasonText,
        effects: computedEffects,
        onConfirm: async () => {
          const confirmedRun: PendingEffectContext = {
            ...pendingCtx,
            effectOverrides: computedEffects,
            timestamp: Date.now(),
          };

          enqueueEffectRun(confirmedRun);
          setHistoryEffectStateByRun(pendingCtx, {
            effectStatus: 'confirmed',
          });
          const seq = emitEffectRun({
            runId: pendingCtx.runId,
            status: 'confirmed',
            characterName: effectContext.characterName,
            attributeName: effectContext.attributeName,
            historyIndex: pendingCtx.historyIndex,
            effectResults: [],
            effectTrace: ['已确认，等待提交'],
            chainMode: getSecondaryTriggerMode(pendingCtx.preset),
            timestamp: Date.now(),
          });
          setHistoryEffectStateByRun(pendingCtx, { effectEventSeq: seq });
          if (activeConfirmEffectRun?.runId === pendingCtx.runId) {
            activeConfirmEffectRun = null;
          }
          console.info(`[DICE] Effect run confirmed: ${pendingCtx.runId}`);

          // 确认后立即尝试执行（MESSAGE_SENT 可能已在弹窗显示前触发过，不会再次触发）
          if (confirmedRun.messageId) {
            await processPendingEffectRuns(confirmedRun.messageId);
          } else {
            console.info(`[DICE][META] confirm waiting MESSAGE_SENT for run=${confirmedRun.runId}`);
            await processPendingEffectRuns();
          }
        },
        onCancel: () => {
          setHistoryEffectStateByRun(pendingCtx, { effectStatus: 'cancelled' });
          const seq = emitEffectRun({
            runId: pendingCtx.runId,
            status: 'cancelled',
            characterName: effectContext.characterName,
            attributeName: effectContext.attributeName,
            historyIndex: pendingCtx.historyIndex,
            effectResults: [],
            effectTrace: ['已取消'],
            chainMode: getSecondaryTriggerMode(pendingCtx.preset),
            timestamp: Date.now(),
          });
          setHistoryEffectStateByRun(pendingCtx, { effectEventSeq: seq });
          if (activeConfirmEffectRun?.runId === pendingCtx.runId) {
            activeConfirmEffectRun = null;
          }
          console.info('[DICE] Effect execution cancelled by user');
        },
      });
    };

    /**
     * [新增] 二级效果触发点检测
     * 在效果执行完成后检查是否触发二级效果
     */
    const checkSecondaryEffects = async (
      preset: AdvancedDicePreset,
      effectResults: EffectResult[],
      context: { characterName: string; attributeName: string; attributeValue: number },
    ): Promise<EffectResult[]> => {
      return deps.executeSecondaryEffectsChain(preset, effectResults, context);
    };

    // [新增] 应用消耗效果并更新 UI
    const applyBurnerEffect = (burner: ResourceBurner, amount: number) => {
      const effectValue = amount * burner.ratio;
      const sign = burner.direction === 'increase' ? 1 : -1;
      const totalChange = effectValue * sign;

      // 修改相应的输入框值或预设值
      // 注意: 这会改变下一次投骰的基础值，或者如果是 roll 修正则需要特殊处理
      // 这里我们选择直接修改输入框的值，并触发重新计算
      // 对于 target (roll), 我们无法直接修改已投出的结果，除非重新 evaluateOutcomes
      // 但 evaluateOutcomes 接受的是 outcomes 数组，不直接接受 rollTotal
      // 简单的做法是：修改 modifier 输入框 (对于 mod 修正) 或 target 输入框 (对于 dc 修正)
      // 对于 roll 修正，我们可以添加一个临时的 modifier

      // 为了简单可靠，我们先支持 mod 和 dc 的修改，因为它们对应输入框
      if (burner.target === 'mod') {
        const $modInput = panel.find('#dice-modifier');
        const currentMod = parseModifier($modInput.val().trim());
        const newMod = currentMod + totalChange;
        $modInput.val(newMod >= 0 ? `+${newMod}` : String(newMod));
        // 重新执行高级检定 (会重新投骰吗? 是的，performAdvancedCheck 会重新投骰)
        // 如果不想重新投骰，我们需要拆分 performAdvancedCheck
        // 但目前的架构是整体执行的。
        // 为了"改变结果"而不"重投"，我们需要一种机制来只更新结果判定逻辑
        // 这是一个架构限制。
        // 妥协方案: 消耗资源后，自动触发一次带修正的"重投" (即改变了修正值后的投骰)
        // 这符合"燃运"通常的逻辑：付出代价来获得更有利的结果
        performAdvancedCheck();
      } else if (burner.target === 'dc') {
        const $dcInput = panel.find('#dice-target');
        const currentDc = parseInt($dcInput.val().trim() || '0', 10);
        const newDc = currentDc + totalChange;
        $dcInput.val(newDc);
        performAdvancedCheck();
      } else if (burner.target === 'attribute') {
        // 修改属性值输入框
        const $attrInput = panel.find('#dice-attr-value');
        const currentAttr = parseInt($attrInput.val().trim() || '0', 10);
        const newAttr = currentAttr + totalChange;
        $attrInput.val(newAttr);
        performAdvancedCheck();
      } else if (burner.target === 'roll') {
        // 修改 roll 值通常意味着作为 modifier 加在最终结果上
        // 因为我们不能修改骰子本身的随机结果
        const $modInput = panel.find('#dice-modifier');
        const currentMod = parseModifier($modInput.val().trim());
        const newMod = currentMod + totalChange;
        $modInput.val(newMod >= 0 ? `+${newMod}` : String(newMod));
        performAdvancedCheck();
      }
    };

    // [新增] 高级检定执行函数
    const performAdvancedCheck = async function (options?: { isPushed?: boolean }) {
      if (!currentAdvancedPreset) return;

      const preset = currentAdvancedPreset;
      const initiatorName = deps.resolveCanonicalCharacterName(panel.find('#dice-initiator-name').val().trim() || '<user>');
      const attrName = panel.find('#dice-attr-name').val().trim() || '自由检定';

      // [辅助函数] 解析 defaultValue (支持表达式)
      const resolveDefaultValue = function (
        defaultValue: number | string | undefined,
        context: Record<string, number>,
      ): number {
        if (defaultValue === undefined) return 0;
        if (typeof defaultValue === 'number') return defaultValue;
        // 字符串表达式,使用 evaluateFormula 解析
        const result = deps.evaluateFormula(defaultValue, context);
        if (result === 0 && defaultValue !== '0' && String(defaultValue) !== '0') {
          if (window.toastr) {
            window.toastr.warning(`表达式 "${defaultValue}" 求值失败,使用默认值 0`);
          }
        }
        return result || 0;
      };

      // 1. 解析属性值 (用户输入优先,留空用 defaultValue)
      let attrValue = 0;
      const attrInputVal = panel.find('#dice-attr-value').val().trim();
      if (attrInputVal !== '') {
        attrValue = parseInt(attrInputVal, 10) || 0;
      } else if (preset.attribute?.mode === 'fixed' && preset.attribute?.key) {
        // 从表格读取
        attrValue = deps.getAttributeValue(initiatorName, preset.attribute.key) || 0;
      } else {
        attrValue = resolveDefaultValue(preset.attribute?.defaultValue, {});
      }

      // 2. 解析DC：显示字段用户输入优先；隐藏字段仍可用 defaultValue 作为固定常量
      let dc =
        preset.dc?.mode === 'fixed' && preset.dc?.value !== undefined
          ? preset.dc.value
          : resolveDefaultValue(preset.dc?.defaultValue, { $attr: attrValue });
      if (!preset.dc?.hidden) {
        const dcInputVal = panel.find('#dice-target').val().trim();
        if (dcInputVal !== '') {
          dc = parseInt(dcInputVal, 10) || 0;
        } else if (preset.dc?.mode === 'fixed' && preset.dc?.value !== undefined) {
          dc = preset.dc.value;
        } else {
          dc = resolveDefaultValue(preset.dc?.defaultValue, { $attr: attrValue });
        }
      }

      // 3. 解析修正值：显示字段用户输入优先；隐藏字段仍可用 defaultValue 作为固定常量
      let mod = resolveDefaultValue(preset.mod?.defaultValue, { $attr: attrValue });
      if (!preset.mod?.hidden) {
        const modStr = panel.find('#dice-modifier').val().trim();
        if (modStr !== '') {
          mod = parseModifier(modStr);
        } else {
          mod = resolveDefaultValue(preset.mod?.defaultValue, { $attr: attrValue });
        }
      }

      // 3.3 解析技能加值：显示字段用户输入优先；隐藏字段仍可用 defaultValue 作为固定常量
      let skillMod = preset.skillMod ? resolveDefaultValue(preset.skillMod?.defaultValue, { $attr: attrValue }) : 0;
      if (preset.skillMod && !preset.skillMod.hidden) {
        const skillModStr = panel.find('#dice-skill-mod').val().trim();
        if (skillModStr !== '') {
          skillMod = parseModifier(skillModStr);
        } else {
          skillMod = resolveDefaultValue(preset.skillMod?.defaultValue, { $attr: attrValue });
        }
      }

      // 3.5 计算属性调整值 (DND5e等规则使用)
      let attrMod = 0;
      if ('attribute' in preset && preset.attribute?.computeModifier) {
        attrMod = deps.evaluateConditionNumber(preset.attribute.computeModifier, { $attr: attrValue }, 0);
      }

      // [新增] 收集自定义字段值
      const customValues: Record<string, number | string | boolean> = {};
      if ('customFields' in preset && Array.isArray(preset.customFields) && preset.customFields.length > 0) {
        const $customFields = panel.find('.acu-dice-custom-field');
        $customFields.each(function () {
          const $el = $(this);
          const id = $el.data('id');
          // 找到配置
          const fieldConfig = preset.customFields.find(f => f.id === id);
          if (!fieldConfig) return;

          let val: string | number | boolean;
          if (fieldConfig.type === 'toggle') {
            val = $el.prop('checked');
          } else if (fieldConfig.type === 'number') {
            const num = parseFloat($el.val() as string);
            val = isNaN(num) ? (fieldConfig.defaultValue as number) : num;
          } else if (fieldConfig.type === 'select') {
            // [修复] select 类型的值需要转换为数字（如果是数字字符串）
            const rawVal = $el.val() as string;
            const num = parseFloat(rawVal);
            val = isNaN(num) ? rawVal : num;
          } else {
            const rawVal = String($el.val() ?? '').trim();
            if (rawVal === '' && fieldConfig.defaultValue !== undefined && fieldConfig.defaultValue !== '') {
              val = fieldConfig.defaultValue as string | number | boolean;
            } else {
              val = rawVal;
            }
          }
          customValues['$' + id] = val; // 添加 $ 前缀以便在表达式中使用
        });
      }

      // [新增] 计算派生变量 (投骰前)
      const baseContext = {
        $attr: attrValue,
        $attrMod: attrMod,
        $skillMod: skillMod,
        $dc: dc,
        $mod: mod,
        ...customValues,
      };
      const derivedValues: Record<string, number> = {};
      if ('derivedVars' in preset && Array.isArray(preset.derivedVars) && preset.derivedVars.length > 0) {
        preset.derivedVars.forEach(spec => {
          const id = spec?.id?.trim();
          if (!id) return;
          const varName = id.startsWith('$') ? id : `$${id}`;
          const evalResult = deps.evaluateCondition(spec.expr, { ...baseContext, ...derivedValues });
          if (!evalResult.success) {
            console.warn(`[DICE] 派生变量 ${varName} 计算失败:`, evalResult.error);
            derivedValues[varName] = 0;
            return;
          }
          const rawValue = evalResult.value;
          const numericValue = typeof rawValue === 'number' && Number.isFinite(rawValue) ? rawValue : rawValue ? 1 : 0;
          derivedValues[varName] = numericValue;
        });
      }
      const extraValues = { ...customValues, ...derivedValues };

      let diceExpression = preset.diceExpression;
      if ('dicePatches' in preset && Array.isArray(preset.dicePatches) && preset.dicePatches.length > 0) {
        const patchContext = { ...baseContext, ...derivedValues };
        const replacePatchTemplate = (template: string): string => {
          const varPattern = /\$[a-zA-Z_]\w*/g;
          return template.replace(varPattern, match => {
            const value = patchContext[match];
            return typeof value === 'number' && Number.isFinite(value) ? String(value) : '0';
          });
        };

        preset.dicePatches.forEach(patch => {
          if (!patch) return;
          if (patch.when) {
            const conditionResult = deps.evaluateCondition(patch.when, patchContext);
            if (!conditionResult.success) {
              console.warn('[DICE] dicePatches 条件评估失败:', conditionResult.error);
              return;
            }
            const shouldApply =
              typeof conditionResult.value === 'number' ? conditionResult.value !== 0 : Boolean(conditionResult.value);
            if (!shouldApply) return;
          }

          const resolvedTemplate = replacePatchTemplate(patch.template ?? '');
          switch (patch.op) {
            case 'append':
              diceExpression = `${diceExpression}${resolvedTemplate}`;
              break;
            case 'prepend':
              diceExpression = `${resolvedTemplate}${diceExpression}`;
              break;
            case 'replace':
              diceExpression = resolvedTemplate;
              break;
          }
        });
      }

      // 4. 投骰
      const rollResult = rollComplexDiceExpression(diceExpression);
      const rollTotal = rollResult.total;
      if (Number.isNaN(rollTotal)) {
        console.warn('[DICE] 高级预设骰子语法错误:', diceExpression);
        if (window.toastr)
          showActionableErrorToast(`骰子语法错误: ${diceExpression}`, {
            suggestion: '请检查高级预设中的骰子表达式，只使用形如 1d100、2d6+3 的合法写法。',
          });
        return;
      }

      // [新增] 投骰后重新计算派生变量（支持依赖 $roll.total 的派生变量，如 chaos = 6 - $roll.total）
      const postRollDerivedValues: Record<string, number> = {};
      if ('derivedVars' in preset && Array.isArray(preset.derivedVars) && preset.derivedVars.length > 0) {
        const postRollContext = {
          $roll: rollResult,
          '$roll.total': rollTotal, // 显式添加 $roll.total 作为独立变量
          ...baseContext,
          ...customValues,
        };
        preset.derivedVars.forEach(spec => {
          const id = spec?.id?.trim();
          if (!id) return;
          const varName = id.startsWith('$') ? id : `$${id}`;
          const evalResult = deps.evaluateCondition(spec.expr, { ...postRollContext, ...postRollDerivedValues });
          if (!evalResult.success) {
            console.warn(`[DICE] 派生变量 ${varName} (投骰后) 计算失败:`, evalResult.error);
            postRollDerivedValues[varName] = 0;
            return;
          }
          const rawValue = evalResult.value;
          const numericValue = typeof rawValue === 'number' && Number.isFinite(rawValue) ? rawValue : rawValue ? 1 : 0;
          postRollDerivedValues[varName] = numericValue;
        });
      }

      // 5. 判定成功
      const isPushed = options?.isPushed ?? false;
      const context = {
        $roll: rollResult, // 传递整个对象
        '$roll.total': rollTotal, // 显式添加 $roll.total
        $isPushed: isPushed ? 1 : 0, // 孤注一掷标记 (1=是,0=否)
        ...baseContext,
        ...postRollDerivedValues, // 使用投骰后计算的派生变量
      };

      // 判定结果: 使用 outcomes 系统
      let outcomeText: string;
      let resultType: string;
      let isSuccess = false;
      let matchedOutcome: OutcomeLevel | undefined;
      let conditionExpr = '';
      let displayExprResult = true; // displayExpr 的计算结果，用于判断"成立/不成立"
      let displayExprValue: string | number = '';
      let branchReasonText = '';

      if ('outcomes' in preset && Array.isArray(preset.outcomes) && preset.outcomes.length > 0) {
        // 新系统: 使用 evaluateOutcomes
        matchedOutcome = deps.evaluateOutcomes(preset.outcomes, context);
        const policyResult = deps.applyAdvancedPresetOutcomePolicy(preset, matchedOutcome, context);
        matchedOutcome = policyResult.outcome;

        outcomeText = matchedOutcome.name || '判定完成';
        // 使用 displayExpr（如果有）或 condition 作为显示表达式
        // [修复] 当触发 unmet 时，显示用户要求的等级的条件（如"极难成功"的条件）
        // 这样用户能看到"你需要达到这个条件才算成功"
        const displaySourceOutcome = deps.getAdvancedPresetDisplayOutcome(policyResult);
        const displayExpr = displaySourceOutcome.displayExpr ?? displaySourceOutcome.condition;

        // [修改] 替换所有上下文变量 (包括自定义变量)
        conditionExpr = displayExpr;
        // 先替换 $roll.hasTag() 方法调用 (必须在 $roll 之前)
        if (context.$roll && typeof context.$roll === 'object') {
          const roll = context.$roll as RollResult;
          conditionExpr = conditionExpr.replace(/\$roll\.hasTag\s*\(\s*['"]([^'"]+)['"]\s*\)/gi, (_match, tag) => {
            return (roll.tags ?? []).includes(tag) ? '成立' : '不成立';
          });
        }
        // 再替换标准变量 (注意: $roll.total 必须在 $roll 之前替换)
        conditionExpr = conditionExpr
          .replace(/\$roll\.total/g, String(rollTotal))
          .replace(/\$roll/g, String(rollTotal))
          .replace(/\$attrMod/g, String(attrMod))
          .replace(/\$skillMod/g, String(skillMod))
          .replace(/\$attr/g, String(attrValue))
          .replace(/\$dc/g, String(dc))
          .replace(/\$mod/g, String(mod));

        // 再替换自定义变量
        Object.keys(extraValues).forEach(key => {
          // 使用正则替换所有出现的变量 (注意转义 $ 符号)
          const safeKey = key.replace('$', '\\$');
          const regex = new RegExp(safeKey, 'g');
          conditionExpr = conditionExpr.replace(regex, String(extraValues[key]));
        });

        // [新增] 清理零值显示：隐藏 "+ 0" 模式，使公式更简洁
        // 例如 "3 + 2 + 13 + 0 >= 10" -> "3 + 2 + 13 >= 10"
        conditionExpr = conditionExpr
          .replace(/\s*\+\s*0(?=\s*[+\->=<]|\s*$)/g, '') // 移除 "+ 0" (后面跟运算符或结尾)
          .replace(/^\s*0\s*\+\s*/g, ''); // 移除开头的 "0 +"

        // 计算 displayExpr 的布尔值（用于判断"成立/不成立"）
        const displayExprEvalResult = deps.evaluateCondition(displayExpr, context);
        const rawDisplayExprValue = displayExprEvalResult.value;
        displayExprValue =
          typeof rawDisplayExprValue === 'number' && Number.isFinite(rawDisplayExprValue)
            ? rawDisplayExprValue
            : conditionExpr;
        displayExprResult =
          displayExprEvalResult.success &&
          (typeof displayExprEvalResult.value === 'number'
            ? displayExprEvalResult.value !== 0
            : Boolean(displayExprEvalResult.value));
        branchReasonText = `命中【${matchedOutcome.name}】分支，分支判定式 ${conditionExpr || displayExpr}，结果${displayExprResult ? '成立' : '不成立'}`;
        // 根据 priority 推断 resultType 和 isSuccess (用于 CSS 类名兼容)
        if (matchedOutcome.priority <= 10) {
          resultType = 'critSuccess';
          isSuccess = true;
        } else if (matchedOutcome.priority <= 30) {
          resultType = 'extremeSuccess';
          isSuccess = true;
        } else if (matchedOutcome.priority < 50) {
          resultType = 'success';
          isSuccess = true;
        } else if (matchedOutcome.priority === 50) {
          resultType = 'warning';
          isSuccess = false;
        } else if (matchedOutcome.priority < 90) {
          resultType = 'failure';
          isSuccess = false;
        } else {
          resultType = 'critFailure';
          isSuccess = false;
        }
      } else {
        // 兜底: 无法判定
        outcomeText = '未知';
        resultType = 'warning';
        branchReasonText = '未命中可识别分支，按默认路径处理';
        console.warn('[DICE] 预设缺少 outcomes');
      }

      // 5. 格式化输出
      const finalValue = rollTotal + attrValue + skillMod + mod;

      // 生成徽章样式 (优先使用 outcome.style.color,否则使用 CSS 类名)
      const badgeClass = deps.getResultBadgeClass(resultType);
      const diceCfg = deps.getDiceConfig();
      const hideDiceResultFromUser =
        diceCfg.hideDiceResultFromUser !== undefined ? diceCfg.hideDiceResultFromUser : false;
      const displayValue = hideDiceResultFromUser ? '？？' : rollTotal;
      const displayOutcomeText = hideDiceResultFromUser ? '' : outcomeText;

      // 构建显示表达式
      // 简单条件: 显示 conditionExpr (如 21 <= 64)
      // 复杂条件: 显示空字符串
      // 隐藏检定结果时: 显示空字符串
      const exprDisplay = deps.isComplexCondition(conditionExpr) ? '' : conditionExpr;
      const displayExpr = hideDiceResultFromUser ? '' : exprDisplay;

      // 将按钮内容替换为结果显示
      const $rollBtn = panel.find('#dice-roll-btn');
      $rollBtn.html(`
        <div class="acu-dice-result-display">
          <span class="acu-dice-result-value">${displayValue}</span>
          <span class="acu-dice-result-target" style="font-size: 11px;">${deps.escapeHtml(displayExpr)}</span>
          ${displayOutcomeText ? `<span class="${badgeClass}">${displayOutcomeText}</span>` : ''}
          <button type="button" class="dice-retry-btn acu-dice-retry-btn" aria-label="重新投骰" title="重新投骰">
            <i class="fa-solid fa-rotate-right"></i>
          </button>
        </div>
      `);

      // 绑定重投按钮点击事件
      $rollBtn.off('click', '.dice-retry-btn').on('click', '.dice-retry-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        performAdvancedCheck();
      });

      // [新增] 渲染资源消耗器按钮 (燃运等)
      if (preset.resourceBurners && preset.resourceBurners.length > 0) {
        // 构建上下文：包含基础属性、派生变量、投骰结果
        const burnerContext = {
          ...context, // 复用已构建的 context (包含 $roll, $roll.total, $attr 等)
        };

        const burnersHtml = renderResourceBurnerButtons(preset, burnerContext, matchedOutcome, attrName);
        if (burnersHtml) {
          // 插入到结果显示区域
          const $burners = $(burnersHtml);
          $rollBtn.find('.acu-dice-result-display').append($burners);

          // 绑定资源消耗按钮点击事件
          $burners.find('.acu-dice-burner-btn').on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            const burnerId = $(this).data('id');
            const burner = preset.resourceBurners?.find(b => b.id === burnerId);
            if (burner) {
              handleResourceBurnerClick(burner, burnerContext);
            }
          });
        }
      }

      // [新增] 渲染孤注一掷按钮 (Pushed Roll) — 基于 outcome ID 而非 isSuccess 二元值
      if (
        preset.pushedRoll?.enabled &&
        !isPushed && // 已经是孤注一掷则不可再push
        matchedOutcome &&
        !matchesCheckSelector(attrName, {
          namePatterns: { include: preset.pushedRoll.excludePatterns ?? [] },
        }) // 排除特定属性名
      ) {
        const outcomeId = matchedOutcome.id;
        // 判定优先级: blockedOutcomes > pushableOutcomes > legacy fallback (!isSuccess)
        const blockedOutcomes =
          preset.pushedRoll.blockedOutcomes ?? (preset.pushedRoll.blockOnCritFailure !== false ? ['crit_failure'] : []);
        const isBlocked = blockedOutcomes.includes(outcomeId);
        const isPushable = preset.pushedRoll.pushableOutcomes
          ? preset.pushedRoll.pushableOutcomes.includes(outcomeId)
          : !isSuccess; // legacy fallback
        if (isPushable && !isBlocked) {
          const $pushBtn = $(`
           <button type="button" class="acu-dice-burner-btn" aria-label="孤注一掷" title="孤注一掷：重掷一次，失败后果更严重">
             <i class="fa-solid fa-skull"></i>
           </button>
         `);
          // 优先插入到 burners 容器中（与燃运按钮并排），否则创建一个
          let $burnersContainer = $rollBtn.find('.acu-dice-burners');
          if (!$burnersContainer.length) {
            $burnersContainer = $('<span class="acu-dice-burners"></span>');
            $rollBtn.find('.acu-dice-result-display').append($burnersContainer);
          }
          $burnersContainer.append($pushBtn);
          $pushBtn.on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            performAdvancedCheck({ isPushed: true });
          });
        }
      }

      // 生成输出文本 (使用模板系统)
      // judgeResultText 基于 displayExpr 的计算结果，表示显示的算式是否在数学上成立
      const judgeResultText = displayExprResult ? '成立' : '不成立';
      const template =
        'outputTemplate' in preset && preset.outputTemplate ? preset.outputTemplate : deps.DEFAULT_OUTPUT_TEMPLATE;
      // 计算pushed标注: 按 outcome ID 查找 outcomeLabels，fallback 到 '*' 默认值
      const pushedLabel =
        isPushed && matchedOutcome
          ? (preset.pushedRoll?.outcomeLabels?.[matchedOutcome.id] ?? preset.pushedRoll?.outcomeLabels?.['*'] ?? '')
          : '';
      const outcomeTextRaw = (pushedLabel ? pushedLabel + '\n' : '') + (matchedOutcome?.outputText ?? '');
      // 格式化attrMod为带符号字符串 (如 +3 或 -1)
      const attrModStr = attrMod >= 0 ? `+${attrMod}` : String(attrMod);
      // 格式化skillMod为带符号字符串
      const skillModStr = skillMod >= 0 ? `+${skillMod}` : String(skillMod);

      // [新增] 条件文本变量：当值为0时隐藏整个片段（包括标签）
      // skillModText: 当skillMod非0时显示 "+技能加值+N"，否则为空
      const skillModText = skillMod !== 0 ? `+技能加值${skillModStr}` : '';
      // modText: 当mod非0时显示 "+额外加值+N"，否则为空
      const modText = mod !== 0 ? `+额外加值${mod >= 0 ? '+' + mod : mod}` : '';
      // attrModText: 当attrMod非0时显示 "(调整值+N)"，否则为空
      const attrModText = attrMod !== 0 ? `(调整值${attrModStr})` : '';
      const checkValueText = deps.buildCheckValueText({
        preset,
        characterName: initiatorName,
        actionName: attrName,
        attrValue,
        attrMod,
        skillMod,
        mode: 'normal',
      });

      // [新增] 将派生变量转换为 outputContext 格式（去掉 $ 前缀）
      const derivedOutputVars: Record<string, number> = {};
      Object.entries(postRollDerivedValues).forEach(([key, value]) => {
        const cleanKey = key.startsWith('$') ? key.slice(1) : key;
        derivedOutputVars[cleanKey] = value;
      });
      const customOutputVars: Record<string, string | number | boolean> = {};
      Object.entries(customValues).forEach(([key, value]) => {
        const cleanKey = key.startsWith('$') ? key.slice(1) : key;
        customOutputVars[cleanKey] = value;
      });

      // [新增] 计算后果效果变量
      const effectVars = computePendingEffectVariables(matchedOutcome?.effects);

      const outputContext = {
        initiator: initiatorName,
        attrName: `【${attrName}】`,
        attrValue: attrValue,
        attrMod: attrModStr,
        displayValue: displayExprValue,
        skillMod: skillModStr,
        // [新增] 条件文本变量（零值时隐藏整个片段）
        skillModText: skillModText,
        modText: modText,
        attrModText: attrModText,
        checkValueText,
        formula: diceExpression,
        roll: rollTotal,
        'roll.total': rollTotal, // [新增] 支持 $roll.total 语法
        dc: dc,
        mod: mod,
        attr: attrValue,
        conditionExpr: conditionExpr,
        judgeResult: judgeResultText,
        outcomeName: outcomeText,
        outcomeText: outcomeTextRaw,
        ...customOutputVars,
        ...derivedOutputVars, // [新增] 添加派生变量（如 chaos）
        ...effectVars, // [新增] 添加后果效果变量
      };
      // [修复] 先独立渲染 outcomeText，避免其中变量（如 $growthGain）残留
      outputContext.outcomeText = deps.formatOutputTemplate(String(outputContext.outcomeText || ''), outputContext);
      const diceResultText = deps.formatOutputTemplate(template, outputContext);
      deps.smartInsertToTextarea(diceResultText, 'dice');

      // 构建检定结果对象
      const checkResult: AcuDice.CheckResult = {
        success: isSuccess,
        total: rollTotal,
        target: dc,
        outcomeText,
        attrName,
        criteria: 'advanced',
        isAutoTarget: false,
        formula: diceExpression,
      };

      // 添加到历史记录
      const detailId = `check_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const checkResultWithTimestamp = {
        ...checkResult,
        timestamp: Date.now(),
        detailId,
        initiatorName,
        historyType: 'check' as const,
        detailLines: [
          `发起者: ${initiatorName}`,
          `属性: ${attrName} (值=${attrValue})`,
          `公式: ${diceExpression}`,
          `掷骰: ${rollTotal}`,
          `目标: ${dc}`,
          `修正: attrMod=${attrModStr}, skillMod=${skillModStr}, mod=${mod >= 0 ? '+' + mod : mod}`,
          `判定: ${judgeResultText || outcomeText}`,
          `结果: ${outcomeText}`,
        ],
        ...(isPushed ? { isPushed: true } : {}),
      };
      deps.getCheckHistory().push(checkResultWithTimestamp);
      if (deps.getCheckHistory().length > deps.getMAX_HISTORY()) {
        deps.getCheckHistory().shift();
      }

      // 触发事件
      deps.emitEvent('check', checkResultWithTimestamp);

      // 暂存后果
      // [修复] 检查属性名是否匹配 effectsConfig.triggerPatterns
      const shouldTriggerEffects =
        preset.effectsConfig &&
        matchedOutcome &&
        matchedOutcome.effects &&
        matchedOutcome.effects.length > 0 &&
        matchesCheckSelector(attrName, {
          namePatterns: { include: preset.effectsConfig.triggerPatterns },
        });

      if (shouldTriggerEffects) {
        const historyIndex = deps.getCheckHistory().length - 1;
        const runId = `effect_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const effectContext = {
          characterName: initiatorName,
          attributeName: attrName,
          attributeValue: attrValue,
          roll: rollResult.total,
          modifier: mod,
          dc,
        };

        const pendingCtx: PendingEffectContext = {
          runId,
          historyIndex,
          preset,
          matchedOutcome,
          context: effectContext,
          branchReasonText,
          sourceMetaText: diceResultText,
          timestamp: Date.now(),
        };

        setHistoryEffectState(historyIndex, {
          effectStatus: 'planned',
          effectRunId: runId,
          effectResults: [],
          effectError: undefined,
          effectTrace: undefined,
        });
        const plannedSeq = emitEffectRun({
          runId,
          status: 'planned',
          characterName: initiatorName,
          attributeName: attrName,
          historyIndex,
          effectResults: [],
          effectTrace: ['等待确认'],
          chainMode: getSecondaryTriggerMode(preset),
          timestamp: Date.now(),
        });
        setHistoryEffectState(historyIndex, { effectEventSeq: plannedSeq });

        // [新增] 检查是否有需要确认的效果
        const hasConfirmableEffects = matchedOutcome.effects.some(e => e.needsConfirm !== false);

        if (hasConfirmableEffects) {
          // 有需要确认的效果,显示确认弹窗 (异步处理)
          handleEffectConfirmation(pendingCtx);
          console.info(
            `[DICE] ${matchedOutcome.effects.length} effects pending user confirmation for ${initiatorName}`,
          );
        } else {
          // 所有效果都不需要确认,直接进入待执行队列
          enqueueEffectRun(pendingCtx);
          setHistoryEffectState(historyIndex, {
            effectStatus: 'confirmed',
          });
          const confirmedSeq = emitEffectRun({
            runId,
            status: 'confirmed',
            characterName: initiatorName,
            attributeName: attrName,
            historyIndex,
            effectResults: [],
            effectTrace: ['自动确认，等待提交'],
            chainMode: getSecondaryTriggerMode(preset),
            timestamp: Date.now(),
          });
          setHistoryEffectState(historyIndex, { effectEventSeq: confirmedSeq });
          console.info(`[DICE] Queued ${matchedOutcome.effects.length} auto-execute effects for ${initiatorName}`);
        }
      }

      if (preset.currentAttrAutoUpdate && preset.currentAttrAutoUpdate.enabled !== false) {
        const autoUpdate = preset.currentAttrAutoUpdate;
        const when = autoUpdate.when || 'always';
        const shouldApply =
          when === 'always' || (when === 'success' && isSuccess) || (when === 'failure' && !isSuccess);
        if (shouldApply) {
          const autoContext: Record<string, string | number | boolean> = {
            $roll: rollTotal,
            '$roll.total': rollTotal,
            $attr: attrValue,
            $dc: dc,
            $mod: mod,
            $success: isSuccess ? 1 : 0,
            ...customValues,
          };
          const resolvedExpr = resolveExpressionWithContext(autoUpdate.valueExpr, autoContext);
          const changeValue = parseModifier(resolvedExpr);
          const aliasCandidates = autoUpdate.aliasCandidates || [];
          const resolvedAlias = deps.resolveAttributeAliasName(initiatorName, attrName, aliasCandidates).name;
          const targetAttr = resolvedAlias || attrName;
          const beforeValueRaw = deps.getAttributeValue(initiatorName, attrName, aliasCandidates);
          const beforeValue =
            beforeValueRaw === null || beforeValueRaw === undefined ? (autoUpdate.initValue ?? 0) : beforeValueRaw;

          let previewAfterValue = beforeValue;
          if (autoUpdate.operation === 'add') {
            previewAfterValue = beforeValue + changeValue;
          } else if (autoUpdate.operation === 'subtract') {
            previewAfterValue = beforeValue - changeValue;
          } else {
            previewAfterValue = changeValue;
          }
          const minValue = autoUpdate.min ?? 0;
          const maxValue = autoUpdate.max ?? Infinity;
          previewAfterValue = Math.max(minValue, Math.min(maxValue, previewAfterValue));
          const previewDelta = previewAfterValue - beforeValue;

          const computedAutoEffect: ComputedEffect = {
            effectId: `auto_${autoUpdate.operation}`,
            target: attrName,
            resolvedTarget: targetAttr,
            computedValue: previewDelta,
            rolledValue: changeValue,
            formula: resolvedExpr || '0',
            displayText: `${resolvedExpr || '0'} → ${changeValue}`,
            beforeValue,
            afterValue: previewAfterValue,
            conditionSummary: `命中【${matchedOutcome?.name || outcomeText}】分支后触发自动填表`,
          };

          const confirmed = await new Promise<boolean>(resolve => {
            showEffectConfirmDialog({
              preset,
              outcomeLabel: `${attrName} 检定: ${matchedOutcome?.name || outcomeText}`,
              branchReasonText,
              effects: [computedAutoEffect],
              onConfirm: () => resolve(true),
              onCancel: () => resolve(false),
            });
          });

          if (confirmed) {
            const updateResult = await deps.updateSingleAttribute(
              initiatorName,
              attrName,
              autoUpdate.operation,
              changeValue,
              {
                initValue: autoUpdate.initValue,
                min: autoUpdate.min,
                max: autoUpdate.max,
                aliasCandidates,
              },
            );
            if (updateResult.success) {
              const finalAttr = updateResult.resolvedAttrName || attrName;
              const delta = updateResult.newValue - updateResult.oldValue;
              const changeLabel =
                String(autoUpdate.changeLabel || '').trim() ||
                (autoUpdate.operation === 'add' ? '增加' : autoUpdate.operation === 'subtract' ? '减少' : '设为');
              const exprRaw = String(resolvedExpr || '').trim();
              const rolledText = String(changeValue);
              const exprNormalized = exprRaw.replace(/\s+/g, '');
              const exprWithRoll =
                exprRaw && exprNormalized !== rolledText ? `${exprRaw}=${rolledText}` : exprRaw || rolledText;

              const settledContext: Record<string, string | number | undefined> = {
                attr: `【${finalAttr}】`,
                attrPlain: finalAttr,
                old: updateResult.oldValue,
                new: updateResult.newValue,
                delta,
                expr: exprRaw || rolledText,
                rolled: changeValue,
                operation: autoUpdate.operation,
                changeLabel,
              };

              const settledTemplate = String(autoUpdate.outputTextTemplate || '').trim();
              const settledLine =
                settledTemplate !== ''
                  ? deps.formatOutputTemplate(settledTemplate, settledContext).trim()
                  : `已填表：${finalAttr}从${updateResult.oldValue}变为${updateResult.newValue}，变化${changeLabel}${exprWithRoll}`;

              const autoRunId = `autoupdate_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
              const injected = injectEffectLinesIntoTextarea(autoRunId, [settledLine]);
              if (!injected) {
                deps.smartInsertToTextarea(settledLine, 'dice');
              }

              // 同步更新当前面板显示（属性输入框 + 快捷属性按钮）
              const currentAttrName = String(panel.find('#dice-attr-name').val() || '').trim();
              if (currentAttrName === attrName || currentAttrName === finalAttr) {
                panel.find('#dice-attr-value').val(String(updateResult.newValue)).trigger('change');
              }
              buildAttrButtons(initiatorName);

              if (window.toastr) {
                window.toastr.success(
                  `已完成填表更新 ${finalAttr}: ${updateResult.oldValue} -> ${updateResult.newValue}`,
                );
              }
            } else if (window.toastr) {
              window.toastr.warning(`自动更新属性失败: ${updateResult.error || '未知错误'}`);
            }
          } else if (window.toastr) {
            window.toastr.info('已取消本次自动填表');
          }
        }
      }

      if (onResult) {
        onResult(checkResult);
      }
    };

    // [新增] 自定义模式掷骰逻辑
    const performCustomRoll = function () {
      const $btn = panel.find('#dice-roll-btn');

      // 读取自定义模式字段
      const diceExpr = panel.find('#custom-dice-expr').val().trim() || '1d100';
      const judgeMode = panel.find('#custom-judge-mode').val() as string;
      const targetValueStr = panel.find('#custom-target-value').val().trim();
      const initiatorName = deps.resolveCanonicalCharacterName(panel.find('#dice-initiator-name').val().trim() || '<user>');
      const attrName = panel.find('#dice-attr-name').val().trim() || '自由检定';

      // 解析目标值
      const expectedValue = calculateDiceExpectedValue(diceExpr);
      const autoTargetValue = Number.isFinite(expectedValue) ? Math.floor(expectedValue) : null;
      const targetValue = targetValueStr !== '' ? parseInt(targetValueStr, 10) : autoTargetValue;
      const hasJudgement = judgeMode !== 'none' && targetValue !== null && !isNaN(targetValue);

      // 执行掷骰 - 使用 rollComplexDiceExpression 支持复合表达式如 2d6+33
      const rollResult = rollComplexDiceExpression(diceExpr);
      if (isNaN(rollResult.total)) {
        if (window.toastr)
          showActionableErrorToast(`骰子语法错误: ${diceExpr}`, {
            suggestion: '请检查骰子输入框或当前预设公式，只使用形如 1d100、2d6+3 的合法写法。',
          });
        return;
      }

      const rollTotal = rollResult.total;

      // 判定结果
      let isSuccess = false;
      let judgeResultText = '';

      if (hasJudgement) {
        switch (judgeMode) {
          case '>=':
            isSuccess = rollTotal >= targetValue;
            judgeResultText = isSuccess ? '成功' : '失败';
            break;
          case '<=':
            isSuccess = rollTotal <= targetValue;
            judgeResultText = isSuccess ? '成功' : '失败';
            break;
          case '>':
            isSuccess = rollTotal > targetValue;
            judgeResultText = isSuccess ? '成功' : '失败';
            break;
          case '<':
            isSuccess = rollTotal < targetValue;
            judgeResultText = isSuccess ? '成功' : '失败';
            break;
          default:
            judgeResultText = '';
        }
      }

      // 生成输出文本 - 使用与内置预设一致的 meta 标签格式
      const displayInitiator = deps.replaceUserPlaceholders(initiatorName);
      const displayAttrName = attrName || '自由检定';
      let outputText: string;

      if (hasJudgement) {
        const conditionExpr = `${rollTotal} ${judgeMode} ${targetValue}`;
        const judgeResultCN = isSuccess ? '成立' : '不成立';
        outputText = `<meta:检定结果>\n元叙事：${displayInitiator} 发起了 【${displayAttrName}】 检定，${diceExpr}=${rollTotal}，判定 ${conditionExpr}？${judgeResultCN}，判定为【${judgeResultText}】\n</meta:检定结果>`;
      } else {
        // 无判定模式
        outputText = `<meta:检定结果>\n元叙事：${displayInitiator} 发起了 【${displayAttrName}】 检定，${diceExpr}=${rollTotal}\n</meta:检定结果>`;
      }

      // 插入到输入框
      deps.smartInsertToTextarea(outputText, 'dice');

      // 生成结果显示
      const badgeClass = hasJudgement
        ? isSuccess
          ? 'acu-dice-result-badge success'
          : 'acu-dice-result-badge failure'
        : '';
      const diceCfg = deps.getDiceConfig();
      const hideDiceResultFromUser =
        diceCfg.hideDiceResultFromUser !== undefined ? diceCfg.hideDiceResultFromUser : false;
      const displayValue = hideDiceResultFromUser ? '？？' : rollTotal;
      const displayOutcome = hideDiceResultFromUser ? '' : judgeResultText;

      // 更新按钮显示结果
      $btn.html(`
        <div class="acu-dice-result-display">
          <span class="acu-dice-result-value">${displayValue}</span>
          ${hasJudgement && displayOutcome ? `<span class="${badgeClass}">${displayOutcome}</span>` : ''}
          <button type="button" class="dice-retry-btn acu-dice-retry-btn" aria-label="重新投骰" title="重新投骰">
            <i class="fa-solid fa-rotate-right"></i>
          </button>
        </div>
      `);

      // 绑定重投按钮
      $btn.off('click', '.dice-retry-btn').on('click', '.dice-retry-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        performCustomRoll();
      });

      // 构建检定结果对象
      const checkResult: AcuDice.CheckResult = {
        success: isSuccess,
        total: rollTotal,
        target: targetValue ?? 0,
        outcomeText: judgeResultText,
        attrName,
        criteria: 'custom',
        isAutoTarget: false,
        formula: diceExpr,
      };

      // 添加到历史记录
      const detailId = `check_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const checkResultWithTimestamp = {
        ...checkResult,
        timestamp: Date.now(),
        detailId,
        initiatorName,
        historyType: 'check' as const,
        detailLines: [
          `发起者: ${initiatorName}`,
          `属性: ${attrName}`,
          `公式: ${diceExpr}`,
          `掷骰: ${rollTotal}`,
          hasJudgement ? `判定: ${rollTotal} ${judgeMode} ${targetValue}` : '判定: 无',
          hasJudgement ? `结果: ${judgeResultText}` : '结果: 仅掷骰',
        ],
      };
      deps.getCheckHistory().push(checkResultWithTimestamp);
      if (deps.getCheckHistory().length > deps.getMAX_HISTORY()) {
        deps.getCheckHistory().shift();
      }

      // 触发事件
      deps.emitEvent('check', checkResultWithTimestamp);

      if (onResult) {
        onResult(checkResult);
      }
    };

    let lastDiceRollAt = 0;
    // 投骰逻辑函数（可被按钮点击和重投按钮调用）
    const performDiceRoll = function () {
      const $btn = panel.find('#dice-roll-btn');
      const now = Date.now();
      if (now - lastDiceRollAt < 100) return;
      lastDiceRollAt = now;
      if ($btn.prop('disabled')) return;

      // 锁定按钮防止连点
      $btn.prop('disabled', true).addClass('disabled');
      setTimeout(() => {
        $btn.prop('disabled', false).removeClass('disabled');
      }, 100);

      // [新增] 如果使用高级预设,调用专用检定函数
      if (currentAdvancedPreset) {
        performAdvancedCheck();
        return;
      }

      // [新增] 如果处于自定义模式,使用自定义掷骰逻辑
      if (panel.find('#acu-dice-custom-mode-fields').is(':visible')) {
        performCustomRoll();
        return;
      }

      const formula = panel.find('#dice-formula').val().trim() || '1d100';
      const modStr = panel.find('#dice-modifier').val().trim() || '0';
      const mod = parseModifier(modStr);
      const attrName = panel.find('#dice-attr-name').val().trim() || '自由检定';
      const criteria = panel.find('#dice-success-criteria').val() || 'lte';
      const difficulty = panel.find('#dice-difficulty').val() || 'normal';

      // 判断规则类型
      const isDND = criteria === 'gte';

      // 获取骰子配置（根据规则类型读取不同配置）
      const diceCfg = deps.getDiceConfig();
      const hardDiv = diceCfg.difficultSuccessDiv || 2;
      const extremeDiv = diceCfg.hardSuccessDiv || 5;
      // COC: 大成功 ≤ critSuccessMax, 大失败 ≥ critFailMin
      // DND: 大成功 ≥ dndCritSuccess, 大失败 ≤ dndCritFail
      const critSuccessMax = isDND ? diceCfg.dndCritFail || 1 : diceCfg.critSuccessMax || 5;
      const critFailMin = isDND ? diceCfg.dndCritSuccess || 20 : diceCfg.critFailMin || 96;

      // 目标值计算（COC 和 DND 不同）
      let targetInputVal = panel.find('#dice-target').val().trim();
      let attrInputVal = panel.find('#dice-attr-value').val().trim();
      let attrValue = attrInputVal !== '' ? parseInt(attrInputVal, 10) : 0;
      let target;
      let isAutoTarget = false;

      // 辅助函数：根据骰子公式计算最大值的一半
      const getDefaultTarget = formulaStr => {
        const match = formulaStr.match(/(\d+)d(\d+)/i);
        if (match) {
          const maxRoll = parseInt(match[1], 10) * parseInt(match[2], 10);
          return Math.round(maxRoll / 2);
        }
        return 50;
      };

      if (targetInputVal !== '') {
        // 用户手动输入了目标值/DC
        const parsedTarget = parseInt(targetInputVal, 10);
        target = !Number.isNaN(parsedTarget) ? parsedTarget : getDefaultTarget(formula);
      } else if (isDND) {
        // DND 模式：留空时 DC = 10（中等难度）
        target = 10;
        isAutoTarget = true;
      } else {
        // COC 模式：留空时目标值 = 属性值，若属性值也空则取骰子最大值的一半
        if (attrValue > 0) {
          target = attrValue;
          isAutoTarget = true;
        } else {
          target = getDefaultTarget(formula);
          isAutoTarget = true;
        }
      }

      const result = rollDice(formula);
      const finalValue = result.total + mod;

      // 根据规则和难度等级计算
      let requiredTarget = target;
      let difficultyLabel = '';
      let difficultyDiv = 1;

      // DND 模式忽略难度等级
      if (!isDND) {
        switch (difficulty) {
          case 'hard':
            requiredTarget = Math.floor(target / hardDiv);
            difficultyLabel = '困难';
            difficultyDiv = hardDiv;
            break;
          case 'extreme':
            requiredTarget = Math.floor(target / extremeDiv);
            difficultyLabel = '极难';
            difficultyDiv = extremeDiv;
            break;
          case 'critical':
            requiredTarget = critSuccessMax;
            difficultyLabel = '大成功';
            break;
          default:
            difficultyLabel = '';
            break;
        }
      }

      // 判定结果
      let isCritSuccess = false;
      let isCritFailure = false;
      let isSuccess = false;
      let outcomeText = '';
      let outcomeClass = '';

      // 大成功/大失败判定（最高优先级）
      if (isDND) {
        // DND: 大成功 ≥ 20，大失败 ≤ 1
        isCritSuccess = finalValue >= critFailMin; // 复用 critFailMin 作为 DND 大成功阈值
        isCritFailure = finalValue <= critSuccessMax; // 复用 critSuccessMax 作为 DND 大失败阈值
      } else {
        // COC: 大成功 ≤ 5，大失败 ≥ 96
        isCritSuccess = finalValue <= critSuccessMax;
        isCritFailure = finalValue >= critFailMin;
      }

      // 根据规则判断成功/失败
      if (isDND) {
        isSuccess = finalValue >= requiredTarget;
      } else {
        isSuccess = finalValue <= requiredTarget;
      }

      // 确定最终结果文本
      if (isCritSuccess) {
        outcomeText = '大成功！';
        outcomeClass = 'success';
        isSuccess = true;
      } else if (isCritFailure) {
        outcomeText = '大失败！';
        outcomeClass = 'failure';
        isSuccess = false;
      } else if (isSuccess) {
        if (isDND) {
          outcomeText = '成功';
        } else if (difficulty === 'hard') {
          outcomeText = '困难成功';
        } else if (difficulty === 'extreme') {
          outcomeText = '极难成功';
        } else {
          // 普通难度下，检查是否达成更高成就
          const extremeTarget = Math.floor(target / extremeDiv);
          const hardTarget = Math.floor(target / hardDiv);
          if (finalValue <= extremeTarget) {
            outcomeText = '极难成功';
          } else if (finalValue <= hardTarget) {
            outcomeText = '困难成功';
          } else {
            outcomeText = '成功';
          }
        }
        outcomeClass = 'success';
      } else {
        outcomeText = '失败';
        outcomeClass = 'failure';
      }

      const criteriaSymbol = isDND ? '≥' : '≤';
      const hideDiceResultFromUser =
        diceCfg.hideDiceResultFromUser !== undefined ? diceCfg.hideDiceResultFromUser : false;
      const displayValue = hideDiceResultFromUser ? '？？' : finalValue;
      const displayOutcomeText = hideDiceResultFromUser ? '' : outcomeText;

      // 确定结果类型和样式
      let resultType;
      if (isCritSuccess) {
        resultType = 'critSuccess';
      } else if (isCritFailure) {
        resultType = 'critFailure';
      } else if (isSuccess) {
        if (difficulty === 'extreme' || (difficulty === 'normal' && finalValue <= Math.floor(target / extremeDiv))) {
          resultType = 'extremeSuccess';
        } else if (difficulty === 'hard' || (difficulty === 'normal' && finalValue <= Math.floor(target / hardDiv))) {
          resultType = 'success';
        } else {
          resultType = 'warning';
        }
      } else {
        resultType = 'failure';
      }

      const badgeClass = deps.getResultBadgeClass(resultType);

      // 构建显示用的条件表达式（隐藏时为空）
      const displayConditionExpr = hideDiceResultFromUser ? '' : conditionExpr;

      // 将按钮内容替换为结果显示（居中布局，旋转箭头在结果后面）
      const $rollBtn = panel.find('#dice-roll-btn');
      $rollBtn.html(`
        <div class="acu-dice-result-display">
          <span class="acu-dice-result-value">${displayValue}</span>
          ${displayConditionExpr ? `<span class="acu-dice-result-target">${displayConditionExpr}</span>` : ''}
          ${displayOutcomeText ? `<span class="${badgeClass}">${displayOutcomeText}</span>` : ''}
          <button type="button" class="dice-retry-btn acu-dice-retry-btn" aria-label="重新投骰" title="重新投骰">
            <i class="fa-solid fa-rotate-right"></i>
          </button>
        </div>
      `);

      // 绑定重投按钮点击事件（使用事件委托，因为按钮内容会动态更新）
      $rollBtn.off('click', '.dice-retry-btn').on('click', '.dice-retry-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        // 直接调用投骰逻辑函数
        performDiceRoll();
      });

      // 生成 Prompt 文本
      const initiatorName = deps.resolveCanonicalCharacterName(panel.find('#dice-initiator-name').val().trim() || '<user>');

      // 构建简单条件表达式（用于界面显示）
      let conditionExpr = '';
      if (isCritSuccess) {
        if (isDND) {
          conditionExpr = `${finalValue}≥${critFailMin}`;
        } else {
          conditionExpr = `${finalValue}≤${critSuccessMax}`;
        }
      } else if (isCritFailure) {
        if (isDND) {
          conditionExpr = `${finalValue}≤${critSuccessMax}`;
        } else {
          conditionExpr = `${finalValue}≥${critFailMin}`;
        }
      } else if (isDND) {
        conditionExpr = `${finalValue}≥${requiredTarget}`;
      } else {
        conditionExpr = `${finalValue}≤${requiredTarget}`;
      }

      // 构建详细判定表达式（用于输出文本）
      let judgeExpr = '';
      if (isCritSuccess) {
        if (isDND) {
          judgeExpr = `${finalValue}≥${critFailMin}`;
        } else {
          judgeExpr = `${finalValue}≤${critSuccessMax}`;
        }
      } else if (isCritFailure) {
        if (isDND) {
          judgeExpr = `${finalValue}≤${critSuccessMax}`;
        } else {
          judgeExpr = `${finalValue}≥${critFailMin}`;
        }
      } else if (isDND) {
        // DND 模式
        if (isSuccess) {
          judgeExpr = `需${criteriaSymbol}${requiredTarget}，${finalValue}≥${requiredTarget}`;
        } else {
          judgeExpr = `需${criteriaSymbol}${requiredTarget}，${finalValue}<${requiredTarget}`;
        }
      } else if (difficulty === 'critical') {
        // COC 难度设为大成功但没达成
        judgeExpr = `需≤${critSuccessMax}，${finalValue}>${critSuccessMax}`;
      } else if (difficulty !== 'normal') {
        // COC 困难或极难
        if (isSuccess) {
          judgeExpr = `需≤${target}/${difficultyDiv}，${finalValue}≤${requiredTarget}`;
        } else {
          judgeExpr = `需≤${target}/${difficultyDiv}，${finalValue}>${requiredTarget}`;
        }
      } else {
        // COC 普通难度
        if (isSuccess) {
          const extremeTarget = Math.floor(target / extremeDiv);
          const hardTarget = Math.floor(target / hardDiv);
          if (finalValue <= extremeTarget) {
            judgeExpr = `需≤${target}，${finalValue}≤${target}/${extremeDiv}`;
          } else if (finalValue <= hardTarget) {
            judgeExpr = `需≤${target}，${finalValue}≤${target}/${hardDiv}`;
          } else {
            judgeExpr = `需≤${target}，${finalValue}≤${target}`;
          }
        } else {
          judgeExpr = `需≤${target}，${finalValue}>${target}`;
        }
      }

      // 构建统一格式的检定结果文本
      const metaContent = `元叙事：${initiatorName}发起了【${attrName}】检定，掷出${finalValue}，${judgeExpr}，【${outcomeText}】`;
      const diceResultText = `<meta:检定结果>\n${metaContent}\n</meta:检定结果>`;
      deps.smartInsertToTextarea(diceResultText, 'dice');

      // 构建检定结果对象
      const checkResult: AcuDice.CheckResult = {
        success: isSuccess,
        total: finalValue,
        target,
        outcomeText,
        attrName,
        criteria,
        isAutoTarget,
        formula,
      };

      // 添加到历史记录
      const detailId = `check_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const checkResultWithTimestamp = {
        ...checkResult,
        timestamp: Date.now(),
        detailId,
        initiatorName,
        historyType: 'check' as const,
        detailLines: [
          `发起者: ${initiatorName}`,
          `属性: ${attrName}`,
          `公式: ${formula}`,
          `掷骰+修正: ${result.total} ${mod >= 0 ? '+' : ''}${mod} = ${finalValue}`,
          `目标: ${requiredTarget} (${isAutoTarget ? '自动计算' : '手动输入'})`,
          `成功标准: ${criteria === 'gte' ? '>=' : '<='}${requiredTarget}`,
          difficultyLabel ? `难度: ${difficultyLabel}` : '难度: 普通',
          `判定详情: ${judgeExpr}`,
          `结果: ${outcomeText}`,
        ],
      };
      deps.getCheckHistory().push(checkResultWithTimestamp);
      if (deps.getCheckHistory().length > deps.getMAX_HISTORY()) {
        deps.getCheckHistory().shift();
      }

      // 触发事件
      deps.emitEvent('check', checkResultWithTimestamp);

      if (onResult) {
        onResult(checkResult);
      }
    };

    // 绑定按钮点击事件
    panel.find('#dice-roll-btn').click(function () {
      performDiceRoll();
    });

    // 切换到对抗检定（标题栏图标）
    panel.find('#dice-switch-contest-top').click(function () {
      const targetInput = panel.find('#dice-target').val().trim();
      const attrValueInput = panel.find('#dice-attr-value').val().trim();
      const currentDice = panel.find('#dice-formula').val() || '1d100';
      const initiatorNameVal = panel.find('#dice-initiator-name').val().trim();
      closePanel();
      deps.showContestPanel({
        // 只有用户实际输入了非默认值才传递，否则留空让 placeholder 生效
        initiatorName: initiatorNameVal && initiatorNameVal !== '<user>' ? initiatorNameVal : '',
        initiatorValue: attrValueInput !== '' ? parseInt(attrValueInput, 10) : undefined,
        diceType: currentDice,
      });
    });
    panel.find('#dice-history-btn').click(function (e) {
      e.stopPropagation();
      deps.showGlobalDiceHistoryDialog();
    });
    // 关闭
    const closePanel = () => {
      overlay.remove();
      panel.remove();
    };
    panel.on('click', e => {
      e.stopPropagation();
    });
    overlay.click(closePanel);
    panel.find('.acu-dice-close').click(closePanel);
    // 齿轮设置按钮点击 - 调用高级检定管理
    panel.find('.acu-dice-config-btn').click(function (e) {
      e.stopPropagation();
      deps.showAdvancedPresetManager({ fromDicePanel: true });
    });
  };
  return showDicePanel;
}
