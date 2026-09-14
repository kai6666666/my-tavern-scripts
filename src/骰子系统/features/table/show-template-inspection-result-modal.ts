// @ts-nocheck
/**
 * show-template-inspection-result-modal.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShowTemplateInspectionResultModal(deps: any) {
  const showTemplateInspectionResultModal = (result: TemplateInspectionResult): void => {
    const { $ } = deps.getCore();
    const config = deps.getConfig();
    $('.acu-template-inspection-overlay').remove();

    const errorCount = result.issues.filter(issue => issue.severity === 'error').length;
    const warningCount = result.issues.filter(issue => issue.severity === 'warning').length;
    const infoCount = result.issues.filter(issue => issue.severity === 'info').length;
    const statusText =
      result.issues.length === 0
        ? '当前聊天模板满足当前模板检验预设的最低要求。'
        : `发现 ${result.issues.length} 项需要关注的模板问题。`;
    const severityRank: Record<TemplateInspectionSeverity, number> = { error: 3, warning: 2, info: 1 };
    const groupedIssues = result.issues.reduce<TemplateInspectionIssueGroup[]>((groups, issue) => {
      const groupName = issue.groupName || '其他问题';
      let group = groups.find(item => item.name === groupName);
      if (!group) {
        group = { name: groupName, severity: issue.severity, issues: [] };
        groups.push(group);
      }
      group.issues.push(issue);
      if (severityRank[issue.severity] > severityRank[group.severity]) {
        group.severity = issue.severity;
      }
      return groups;
    }, []);

    groupedIssues.sort((a, b) => severityRank[b.severity] - severityRank[a.severity] || a.name.localeCompare(b.name));
    const isClean = groupedIssues.length === 0;
    const summarySeverity = errorCount > 0 ? 'error' : warningCount > 0 ? 'warning' : 'info';
    const summaryMeta = deps.getTemplateInspectionSeverityMeta(summarySeverity);
    const presetLabel = result.presetName || '当前模板检验预设';
    const issueSummaryTitle = isClean ? '模板结构完整' : `发现 ${result.issues.length} 项模板问题`;
    const repairButtonHtml =
      result.fixableCount > 0
        ? `<button class="acu-dialog-btn acu-btn-confirm" id="template-inspection-repair" title="追加修复当前聊天模板" aria-label="追加修复当前聊天模板">
             <i class="fa-solid fa-wrench"></i> 修复
           </button>`
        : '';

    const tabHtml =
      isClean
        ? ''
        : groupedIssues
            .map((group, index) => {
              const meta = deps.getTemplateInspectionSeverityMeta(group.severity);
              return `
                <button class="acu-template-inspection-tab ${index === 0 ? 'active' : ''}" data-group-index="${index}" style="--acu-template-inspection-color:${meta.color};">
                  <i class="fa-solid ${meta.icon} acu-template-inspection-tab-icon"></i>
                  <span class="acu-template-inspection-tab-label">${deps.escapeHtml(group.name)}</span>
                  <span class="acu-changes-count acu-template-inspection-tab-count" style="background:${meta.color};">${group.issues.length}</span>
                </button>`;
            })
            .join('');

    const panelHtml = groupedIssues
      .map((group, groupIndex) => {
        const issueCards = group.issues
          .map((issue, issueIndex) => {
            const meta = deps.getTemplateInspectionSeverityMeta(issue.severity);
            const missingHtml = issue.missing.map(item => `<li>${deps.escapeHtml(item)}</li>`).join('');
            const isFixable = !!issue.fixActions && issue.fixActions.length > 0;
            const resolutionHtml = isFixable
              ? `<div style="font-weight:700;color:var(--acu-text-main);margin-bottom:4px;">智能修复</div>
                 <ul style="margin:0 0 8px 18px;padding:0;color:var(--acu-text-main);">${issue.fixActions
                   .map(action => `<li>${deps.escapeHtml(action)}</li>`)
                   .join('')}</ul>`
              : `<div style="font-weight:700;color:var(--acu-text-main);margin-bottom:4px;">建议做法</div>
                 <div style="color:var(--acu-text-main);">${deps.escapeHtml(issue.suggestion)}</div>`;
            const collapsed = issueIndex > 0;
            return `
              <div class="acu-changes-group acu-template-inspection-card ${collapsed ? 'collapsed' : ''}" style="--acu-template-inspection-color:${meta.color};">
                <div class="acu-changes-group-header acu-template-inspection-card-header" style="cursor:pointer;">
                  <i class="fa-solid fa-chevron-${collapsed ? 'right' : 'down'} acu-collapse-icon" style="font-size:10px;width:12px;transition:transform 0.2s;"></i>
                  <i class="fa-solid ${meta.icon}" style="color:${meta.color};"></i>
                  <span style="flex:1;">${deps.escapeHtml(issue.title)}</span>
                  <span class="acu-changes-count" style="background:${meta.color};">${meta.label}</span>
                </div>
                <div class="acu-changes-group-body" style="${collapsed ? 'display:none;' : ''}">
                  <div class="acu-change-item" style="display:block;line-height:1.65;">
                    <div style="font-weight:700;color:var(--acu-text-main);margin-bottom:4px;">缺失内容</div>
                    <ul style="margin:0 0 8px 18px;padding:0;color:var(--acu-text-main);">${missingHtml}</ul>
                    <div style="font-weight:700;color:var(--acu-text-main);margin-bottom:4px;">影响功能</div>
                    <div style="margin-bottom:8px;color:var(--acu-text-main);">${deps.escapeHtml(issue.impact)}</div>
                    ${resolutionHtml}
                  </div>
                </div>
              </div>`;
          })
          .join('');
        return `
          <div class="acu-template-inspection-panel" data-group-index="${groupIndex}" style="${groupIndex === 0 ? '' : 'display:none;'}">
            <div class="acu-changes-list acu-template-inspection-card-list">${issueCards}</div>
          </div>`;
      })
      .join('');

    const cleanBodyHtml = `
      <div class="acu-template-inspection-clean-card">
        <div class="acu-template-inspection-clean-result">
          <div class="acu-template-inspection-clean-icon"><i class="fa-solid fa-check"></i></div>
          <div class="acu-template-inspection-clean-copy">
            <div class="acu-template-inspection-clean-title">模板关键结构完整</div>
            <div class="acu-template-inspection-clean-desc">${deps.escapeHtml(statusText)}</div>
          </div>
        </div>
        <div class="acu-template-inspection-clean-meta">
          <div><span>预设</span><strong>${deps.escapeHtml(presetLabel)}</strong></div>
          <div><span>模板</span><strong>${result.sheets.length} 张表</strong></div>
          <div><span>检查时间</span><strong>${deps.escapeHtml(result.checkedAt)}</strong></div>
        </div>
        <div class="acu-template-inspection-clean-stats">
          <span><b>${errorCount}</b> 严重</span>
          <span><b>${warningCount}</b> 警告</span>
          <span><b>${infoCount}</b> 提示</span>
          <span><b>${result.fixableCount || 0}</b> 可修复</span>
          <span><b>${result.manualCount || 0}</b> 手动</span>
        </div>
      </div>`;

    const issueBodyHtml = `
      <div class="acu-template-inspection-summary" style="--acu-template-inspection-summary-color:${summaryMeta.color};">
        <div class="acu-template-inspection-summary-head">
          <span class="acu-template-inspection-summary-icon" aria-hidden="true">
            <i class="fa-solid ${summaryMeta.icon}"></i>
          </span>
          <div class="acu-template-inspection-summary-copy">
            <div class="acu-template-inspection-summary-title">${deps.escapeHtml(issueSummaryTitle)}</div>
          </div>
        </div>
        <div class="acu-template-inspection-stats" aria-label="问题统计">
          <span class="acu-template-inspection-stat acu-template-inspection-stat-error"><b>${errorCount}</b> 严重</span>
          <span class="acu-template-inspection-stat acu-template-inspection-stat-warning"><b>${warningCount}</b> 警告</span>
          <span class="acu-template-inspection-stat acu-template-inspection-stat-info"><b>${infoCount}</b> 提示</span>
          <span class="acu-template-inspection-stat"><b>${result.fixableCount || 0}</b> 智能修复</span>
          <span class="acu-template-inspection-stat"><b>${result.manualCount || 0}</b> 需手动处理</span>
        </div>
      </div>
      <div class="acu-template-inspection-layout" style="display:grid;grid-template-columns:220px minmax(0,1fr);gap:12px;align-items:start;">
        <div class="acu-template-inspection-tabs" style="display:flex;flex-direction:column;gap:8px;max-height:54vh;overflow:auto;padding-right:2px;">
          ${tabHtml}
        </div>
        <div class="acu-template-inspection-panels" style="min-width:0;max-height:54vh;overflow:auto;padding-right:2px;">
          ${panelHtml}
        </div>
      </div>`;

    const overlay = $(`
      <div class="acu-edit-overlay acu-template-inspection-overlay">
        <div class="acu-edit-dialog acu-template-inspection-dialog ${isClean ? 'acu-template-inspection-dialog-clean' : ''} acu-theme-${config.theme}" style="width: 900px; max-width: 96vw; max-height: 88vh;">
          <div class="acu-template-inspection-header" style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding-bottom:12px;border-bottom:1px solid var(--acu-border);">
            <div class="acu-template-inspection-title" style="font-size:16px;font-weight:bold;color:var(--acu-text-main);min-width:0;display:flex;align-items:center;gap:6px;">
              <i class="fa-solid fa-stethoscope"></i> 检验表格模板
            </div>
            <div class="acu-template-inspection-header-actions">
              ${deps.getTutorialButtonHtml('templateInspection', '查看检验表格模板教程', 'acu-template-inspection-tutorial-btn')}
              <button class="acu-close-btn acu-template-inspection-close" title="关闭" aria-label="关闭检验表格模板结果"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>
          <div class="acu-settings-content acu-settings-content-scroll acu-template-inspection-body" style="padding:12px 0;">
            ${isClean ? cleanBodyHtml : issueBodyHtml}
          </div>
          <div class="acu-dialog-btns acu-template-inspection-actions" style="justify-content:space-between;align-items:center;gap:10px;">
            <button class="acu-dialog-btn acu-template-inspection-download" id="template-inspection-download" title="下载最新表格模板" aria-label="下载最新表格模板" style="background:var(--acu-card-bg);color:var(--acu-text-main);border:1px solid var(--acu-border);">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> 最新模板
            </button>
            <div class="acu-template-inspection-primary-actions" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;">
              ${repairButtonHtml}
            </div>
          </div>
        </div>
      </div>`);

    $('body').append(overlay);
    deps.bindTutorialButtonsIn(overlay);
    overlay.find('.acu-template-inspection-close').on('click', () => overlay.remove());
    overlay.find('#template-inspection-download').on('click', () => {
      window.open(deps.LATEST_TABLE_TEMPLATE_URL, '_blank', 'noopener,noreferrer');
    });
    overlay.find('#template-inspection-repair').on('click', () => {
      void deps.repairCurrentTableTemplateFromPreset(result.presetId, overlay);
    });
    overlay.find('.acu-template-inspection-tab').on('click', function () {
      const groupIndex = $(this).data('group-index');
      overlay
        .find('.acu-template-inspection-tab')
        .removeClass('active');
      $(this).addClass('active');
      overlay.find('.acu-template-inspection-panel').hide();
      overlay.find(`.acu-template-inspection-panel[data-group-index="${groupIndex}"]`).show();
    });
    overlay.find('.acu-template-inspection-card-header').on('click', function () {
      const $group = $(this).closest('.acu-template-inspection-card');
      const $body = $group.find('.acu-changes-group-body').first();
      const $icon = $(this).find('.acu-collapse-icon');
      if ($group.hasClass('collapsed')) {
        $group.removeClass('collapsed');
        $body.slideDown(160);
        $icon.removeClass('fa-chevron-right').addClass('fa-chevron-down');
      } else {
        $group.addClass('collapsed');
        $body.slideUp(160);
        $icon.removeClass('fa-chevron-down').addClass('fa-chevron-right');
      }
    });
    deps.setupOverlayClose(overlay, 'acu-template-inspection-overlay', () => overlay.remove());
  };
  return showTemplateInspectionResultModal;
}
