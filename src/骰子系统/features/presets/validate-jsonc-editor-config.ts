// @ts-nocheck
/**
 * validate-jsonc-editor-config.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createValidateJsoncEditorConfig(deps: any) {
  const validateJsoncEditorConfig = <T>(options: JsoncEditorValidationOptions<T>): T | null => {
    const text = String(options.text || '').trim();
    if (!text) {
      if (window.toastr) window.toastr.warning(options.emptyMessage || '请输入 JSONC 配置');
      return null;
    }

    try {
      const parsed = options.parse(text);
      if (window.toastr) window.toastr.success(options.successMessage(parsed));
      return parsed;
    } catch (error) {
      console.error(options.logLabel, error);
      const message = options.errorMessage
        ? options.errorMessage(error)
        : `JSONC 格式错误: ${deps.getJsonLikeErrorMessage(error)}`;
      if (window.toastr) showActionableErrorToast(message, { suggestion: 'importExport' });
      return null;
    }
  };
  return validateJsoncEditorConfig;
}
