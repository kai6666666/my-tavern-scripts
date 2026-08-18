// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=32「[新增] 正则规则列表局部刷新函数 - 避免全量重渲染」
// 原行范围：42792-42833（含 banner 42789-42833）；拆分批次 4；外部 closure 依赖：3（getCore@29 / RegexTransformationManager@13 / escapeHtml@3）
// 接线说明：RegexTransformationManager 来自同批拆出的 regex-transformation-manager.ts（不引用本文件，无循环），直接 import；
//   getCore@29、escapeHtml@3 定义于 index.ts IIFE 内无法 export，采用运行时注入：
//   index.ts IIFE 末尾调用 __wireRefreshRegexRulesListDeps({ getCore, escapeHtml }) 注入；
//   未注入时模块级引用为 null（函数仅在运行时调用，注入先于任何调用，与 IIFE 内原时序等价）。

import { RegexTransformationManager } from './regex-transformation-manager';

let getCore = null;
let escapeHtml = null;

export function __wireRefreshRegexRulesListDeps(deps) {
  getCore = deps.getCore;
  escapeHtml = deps.escapeHtml;
}
  // ========================================
  // [新增] 正则规则列表局部刷新函数 - 避免全量重渲染
  // ========================================
  const refreshRegexRulesList = () => {
    const { $ } = getCore();
    const dialog = $('.acu-settings-dialog');
    if (!dialog.length) return;

    const $rulesList = dialog.find('#regex-rules-list');
    if (!$rulesList.length) return;

    // 生成新的规则列表HTML
    const rules = RegexTransformationManager.getAllRules();
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
          <div class="acu-validation-rule-item ${rule.enabled ? '' : 'disabled'}" data-rule-id="${escapeHtml(rule.id)}">
              <div class="acu-rule-type-icon" title="作用域: ${escapeHtml(rule.scope.type)}">
                  <i class="fa-solid ${scopeIcon}"></i>
              </div>
              <div class="acu-rule-info">
                  <div class="acu-rule-name">${escapeHtml(rule.name)}</div>
                  <div class="acu-rule-target" style="font-size:10px;">${escapeHtml(scopeText)} | ${escapeHtml(rule.operation)}</div>
              </div>
              <button type="button" class="acu-rule-action acu-rule-edit" data-rule-id="${escapeHtml(rule.id)}" title="编辑此规则" aria-label="编辑此规则"><i class="fa-solid fa-pen"></i></button>
              <div class="acu-rule-toggle ${rule.enabled ? 'active' : ''}" title="点击切换启用/禁用">
                  <i class="fa-solid ${rule.enabled ? 'fa-toggle-on' : 'fa-toggle-off'}"></i>
              </div>
              <button type="button" class="acu-rule-action acu-rule-delete" data-rule-id="${escapeHtml(rule.id)}" title="删除此规则" aria-label="删除此规则"><i class="fa-solid fa-trash"></i></button>
          </div>
      `;
      })
      .join('');

    // 局部替换HTML,不影响其他面板
    $rulesList.html(html);
  };
export { refreshRegexRulesList }; // __wireRefreshRegexRulesListDeps 已由头部 export function 导出
