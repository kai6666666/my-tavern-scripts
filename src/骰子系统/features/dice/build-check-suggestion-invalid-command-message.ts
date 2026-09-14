// @ts-nocheck
/**
 * build-check-suggestion-invalid-command-message.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBuildCheckSuggestionInvalidCommandMessage(deps: any) {
  const buildCheckSuggestionInvalidCommandMessage = (reason: string): string => {
    const normalizedReason = String(reason || '骰子命令解析失败').trim();
    const separator = /[。！？!?]$/.test(normalizedReason) ? '' : '。';
    return `${normalizedReason}${separator}解决方法：请重新填写“检定建议表”，或检查表格模板中的提示词；骰子命令应写成“检定 角色 属性”或“对抗 角色 属性 vs 角色 属性”。`;
  };
  return buildCheckSuggestionInvalidCommandMessage;
}
