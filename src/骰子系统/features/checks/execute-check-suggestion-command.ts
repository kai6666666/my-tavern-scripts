// @ts-nocheck
/**
 * execute-check-suggestion-command.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createExecuteCheckSuggestionCommand(deps: any) {
  const executeCheckSuggestionCommand = (displayText: string, commandText: string): boolean => {
    const parsed = deps.parseCheckSuggestionCommand(commandText);
    if (parsed.kind === 'invalid') {
      if (window.toastr) showActionableErrorToast(deps.buildCheckSuggestionInvalidCommandMessage(parsed.reason));
      console.warn('[DICE] 检定建议命令解析失败:', commandText, parsed.reason);
      return false;
    }

    try {
      const actionText = deps.normalizeCheckSuggestionActionText(displayText);
      const insertActionText = () => {
        if (actionText) {
          deps.smartInsertToTextarea(actionText, 'action');
        }
      };

      if (parsed.kind === 'none') {
        insertActionText();
        return true;
      }
      if (parsed.kind === 'fixed') {
        deps.executeFixedCheckSuggestion(parsed.success);
        insertActionText();
        return true;
      }
      if (parsed.kind === 'check') {
        try {
          deps.executeAdvancedCheckSuggestion(parsed);
        } catch (advancedError) {
          if (!parsed.hasExplicitDice && parsed.targetValue === null) throw advancedError;
          console.warn('[DICE] 检定建议高级预设执行失败，回退旧式检定:', advancedError);
          deps.executeNormalCheckSuggestion(parsed);
        }
        insertActionText();
        return true;
      }
      try {
        deps.executeAdvancedContestCheckSuggestion(parsed);
      } catch (advancedError) {
        if (!parsed.hasExplicitDice) throw advancedError;
        console.warn('[DICE] 检定建议高级预设对抗执行失败，回退旧式对抗:', advancedError);
        deps.executeContestCheckSuggestion(parsed);
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
  return executeCheckSuggestionCommand;
}
