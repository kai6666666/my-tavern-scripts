// @ts-nocheck
/**
 * refresh-regex-rules-list.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRefreshRegexRulesList(deps: any) {
  const refreshRegexRulesList = () => {
    const { $ } = deps.getCore();
    const dialog = $('.acu-settings-dialog');
    if (!dialog.length) return;

    const $rulesList = dialog.find('#regex-rules-list');
    if (!$rulesList.length) return;

    // 生成新的规则列表HTML
    const rules = deps.RegexTransformationManager.getAllRules();
    const html = rules
      .map(rule => {
        const scopeIcon =
          rule.scope.type === 'global' ? 'fa-globe' : rule.scope.type === 'table' ? 'fa-table' : 'fa-columns';
        const scopeText =
          rule.scope.type === 'global'
            ? '全局'
            : rule.scope.type === 'table'
              ? rule.scope.tableNames?.join(',')
              : `${rule.scope.tableNames?.join(',')}.${rule.scope.columnNames?.join(',')}`;
        return `
          <div class="acu-validation-rule-item ${rule.enabled ? '' : 'disabled'}" data-rule-id="${deps.escapeHtml(rule.id)}">
              <div class="acu-rule-type-icon" title="作用域: ${deps.escapeHtml(rule.scope.type)}">
                  <i class="fa-solid ${scopeIcon}"></i>
              </div>
              <div class="acu-rule-info">
                  <div class="acu-rule-name">${deps.escapeHtml(rule.name)}</div>
                  <div class="acu-rule-target" style="font-size:10px;">${deps.escapeHtml(scopeText)} | ${deps.escapeHtml(rule.operation)}</div>
              </div>
              <button type="button" class="acu-rule-action acu-rule-edit" data-rule-id="${deps.escapeHtml(rule.id)}" title="编辑此规则" aria-label="编辑此规则"><i class="fa-solid fa-pen"></i></button>
              <div class="acu-rule-toggle ${rule.enabled ? 'active' : ''}" title="点击切换启用/禁用">
                  <i class="fa-solid ${rule.enabled ? 'fa-toggle-on' : 'fa-toggle-off'}"></i>
              </div>
              <button type="button" class="acu-rule-action acu-rule-delete" data-rule-id="${deps.escapeHtml(rule.id)}" title="删除此规则" aria-label="删除此规则"><i class="fa-solid fa-trash"></i></button>
          </div>
      `;
      })
      .join('');

    // 局部替换HTML,不影响其他面板
    $rulesList.html(html);
  };
  return refreshRegexRulesList;
}
