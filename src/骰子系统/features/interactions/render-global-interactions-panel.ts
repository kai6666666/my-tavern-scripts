// @ts-nocheck
/**
 * render-global-interactions-panel.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderGlobalInteractionsPanel(deps: any) {
  const renderGlobalInteractionsPanel = (rawData: unknown): string => {
    const groups = deps.buildGlobalInteractionGroups(rawData);
    const sections = deps.createGlobalInteractionSections(groups);
    const rowCount = groups.reduce((count, group) => count + group.rows.length, 0);
    const actionCount = groups.reduce(
      (count, group) => count + group.rows.reduce((groupCount, row) => groupCount + row.actions.length, 0),
      0,
    );
    deps.debugGlobalInteraction('renderPanel', {
      groupCount: groups.length,
      sectionCount: sections.length,
      rowCount,
      actionCount,
      sections: sections.map(section => ({ kind: section.kind, groupCount: section.groups.length })),
    });
    const contentHtml =
      groups.length > 0
        ? sections.map(section => deps.renderGlobalInteractionsSection(section)).join('')
        : `
                    <div class="acu-empty-hint acu-global-interaction-empty">
                        <i class="fa-solid fa-hand-pointer"></i>
                        <div>暂无可用交互选项</div>
                        <div>请在表格中填写“交互选项”列，或在设置里的“交互规则预设”中为表格配置默认交互。</div>
                    </div>`;

    return `
                <div class="acu-panel-header">
                    <div class="acu-panel-title">
                        <div class="acu-title-main"><i class="fa-solid fa-hand-pointer"></i> <span class="acu-title-text">交互总览</span></div>
                        <div class="acu-title-sub">${deps.escapeHtml(String(groups.length))} 个表 / ${deps.escapeHtml(String(rowCount))} 个对象 / ${deps.escapeHtml(String(actionCount))} 个交互</div>
                    </div>
                    <div class="acu-header-actions">
                        ${deps.getTutorialButtonHtml('globalInteractions', '查看交互总览教程')}
                        <button class="acu-view-btn acu-global-interaction-rules-btn" title="管理交互规则预设" aria-label="管理交互规则预设"><i class="fa-solid fa-gear"></i></button>
                        <div class="acu-height-control" data-table="交互总览">
                            <i class="fa-solid fa-arrows-up-down acu-height-drag-handle" data-table="交互总览" title="↕️ 拖动调整面板高度 | 双击恢复默认"></i>
                        </div>
                        <button class="acu-close-btn" title="关闭" aria-label="关闭交互总览"><i class="fa-solid fa-times"></i></button>
                    </div>
                </div>
                <div class="acu-panel-content acu-global-interaction-panel">
                    <div class="acu-global-interaction-toolbar">
                        <div class="acu-search-wrapper acu-global-interaction-search-wrapper"><i class="fa-solid fa-search acu-search-icon"></i><input type="search" class="acu-global-interaction-search" placeholder="搜索表名、对象或交互..." aria-label="搜索表名、对象或交互" /></div>
                    </div>
                    <div class="acu-global-interaction-content">
                        ${contentHtml}
                        <div class="acu-empty-hint acu-global-interaction-no-results" hidden>没有匹配的交互</div>
                    </div>
                </div>`;
  };
  return renderGlobalInteractionsPanel;
}
