// @ts-nocheck
/**
 * get-interact-options-for-row.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetInteractOptionsForRow(deps: any) {
  const getInteractOptionsForRow = (tableName: string, headers: unknown[], rowData: unknown[]) => {
    // 1. 获取基于表格类型的默认动作（返回副本避免变异）
    const defaultActions = [...deps.getActionsForTable(tableName)];

    // 2. 查找"交互选项"列索引
    const interactColIdx = headers.findIndex(h => h && String(h).includes('交互'));
    if (interactColIdx < 0 || !rowData[interactColIdx]) {
      return defaultActions;
    }

    // 3. 过滤无效值
    const invalidValues = ['-', 'null', 'none', '无', '空', 'n/a', 'undefined', '/'];
    const cellValue = String(rowData[interactColIdx]).trim();
    if (!cellValue || invalidValues.includes(cellValue.toLowerCase())) {
      return defaultActions;
    }

    // 4. 解析分隔的选项
    const interactOptions = cellValue
      .split(/[,，、;；]/)
      .map(s => s.trim())
      .filter(s => s && !invalidValues.includes(s.toLowerCase()));

    if (interactOptions.length === 0) {
      return defaultActions;
    }

    // 5. 获取默认动作的标签列表，用于去重
    const existingLabels = defaultActions.map(a => a.label.toLowerCase());

    // 6. 只追加不在默认动作中的自定义选项
    const newActions = interactOptions
      .filter(opt => !existingLabels.includes(opt.toLowerCase()))
      .map(opt => ({
        label: opt,
        icon: deps.getACTION_ICON_MAP()[opt] || 'fa-hand-pointer',
        type: 'prompt',
        template: `<user>对{Name}执行互动:${opt}。`,
        auto_send: true,
      }));

    // 7. 返回合并后的数组：默认动作 + 自定义动作
    return [...defaultActions, ...newActions];
  };
  return getInteractOptionsForRow;
}
