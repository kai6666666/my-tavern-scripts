// @ts-nocheck
/**
 * maybe-prompt-character-dice-profile.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createMaybePromptCharacterDiceProfile(deps: any) {
  const maybePromptCharacterDiceProfile = async (): Promise<void> => {
    try {
      const detection = await deps.detectCharacterDiceProfile();
      if (!detection) return;
      const context = deps.getDiceProfileCharacterContext();
      const action = await deps.showDiceCharacterProfilePrompt(detection);
      if (action === 'skip') {
        deps.setDiceProfilePromptState(context.chatId, detection.profile.fingerprint, 'skipped');
        return;
      }
      if (action === 'save') {
        deps.setDiceProfilePromptState(context.chatId, detection.profile.fingerprint, 'saved');
        window.toastr?.success('已保存角色卡配置方案，可在配置方案与备份中手动应用');
        return;
      }
      await deps.applyDiceProfile(detection.profile.id, { createSnapshot: true, confirm: true });
      deps.setDiceProfilePromptState(context.chatId, detection.profile.fingerprint, 'applied');
      window.toastr?.success(`已应用配置方案：${detection.profile.name}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message !== '已取消应用配置方案') {
        console.warn('[DICE][PROFILE]角色卡配置方案检测或应用失败:', error);
        if (window.toastr) showActionableErrorToast(`角色卡配置方案处理失败: ${message}`, { suggestion: 'importExport' });
      }
    }
  };
  return maybePromptCharacterDiceProfile;
}
