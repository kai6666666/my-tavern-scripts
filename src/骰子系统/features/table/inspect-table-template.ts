// @ts-nocheck
/**
 * inspect-table-template.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { getTemplateInspectionSheets } from '../../features/table/table-template-requirements';
export function createInspectTableTemplate(deps: any) {
  const inspectTableTemplate = (template: unknown): TemplateInspectionResult => {
    const sheets = getTemplateInspectionSheets(template);
    const issues: TemplateInspectionIssue[] = [];

    deps.TEMPLATE_TABLE_REQUIREMENTS.forEach(requirement => {
      const sheet = deps.findTemplateRequirementSheet(sheets, requirement);
      if (!sheet) {
        issues.push({
          severity: requirement.severity,
          groupName: requirement.tableLabel,
          title: `缺少${requirement.tableLabel}`,
          missing: [`表名需包含：${requirement.tableMatches.join(' / ')}`],
          impact: requirement.impact,
          suggestion: requirement.suggestion,
        });
        return;
      }

      const missingColumns = (requirement.requiredColumns || [])
        .filter(column => !sheet.headers.some(header => deps.templateTextIncludesAny(header, column.matches)))
        .map(column => `${sheet.name}.${column.label}`);
      const missingTags = (requirement.requiredNoteTags || [])
        .filter(tag => !sheet.note.includes(`<${tag}>`) || !sheet.note.includes(`</${tag}>`))
        .map(tag => `${sheet.name}.note 缺少 <${tag}>...</${tag}>`);
      const missing = [...missingColumns, ...missingTags];
      if (missing.length > 0) {
        issues.push({
          severity: requirement.severity,
          groupName: sheet.name,
          title: `${sheet.name}缺少关键内容`,
          missing,
          impact: requirement.impact,
          suggestion: requirement.suggestion,
        });
      }
    });

    const attributeRuleSheets = sheets.filter(
      sheet => sheet.note.includes('<属性规则>') && sheet.note.includes('</属性规则>'),
    );
    if (attributeRuleSheets.length === 0) {
      issues.push({
        severity: 'warning',
        groupName: '属性预设',
        title: '缺少 <属性规则> 同步标签',
        missing: ['任意相关表 note 中的 <属性规则>...</属性规则>'],
        impact: '切换属性预设时，数据库模板不会同步更新属性生成说明。',
        suggestion: '建议在主角信息和重要角色表的 note 中保留闭合的 <属性规则>...</属性规则>。',
      });
    }

    const sheetsWithoutStableFirstColumn = sheets.filter(sheet => {
      const firstHeader = sheet.headers[0] || '';
      return !deps.templateTextIncludesAny(firstHeader, ['row_id', '行号']);
    });
    if (sheetsWithoutStableFirstColumn.length > 0) {
      issues.push({
        severity: 'info',
        groupName: '行号列建议',
        title: '部分表缺少稳定行号列',
        missing: sheetsWithoutStableFirstColumn.slice(0, 8).map(sheet => `${sheet.name}.第 1 列不是 row_id/行号`),
        impact: '可视化表格仍可显示，但卡片标题、跳转、锁定、差异对比和快捷保存更容易不稳定。',
        suggestion: '建议把每张表第 1 列保留为 row_id 或行号，第 2 列放名称/标题。',
      });
    }

    return {
      sheets,
      issues,
      checkedAt: new Date().toLocaleString('zh-CN', { hour12: false }),
    };
  };
  return inspectTableTemplate;
}
