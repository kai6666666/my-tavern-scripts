// @ts-nocheck
/**
 * copy-text-with-tavern-api.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCopyTextWithTavernApi(deps: any) {
  const copyTextWithTavernApi = async (text: string): Promise<boolean> => {
    try {
      if (window.TavernHelper && window.TavernHelper.triggerSlash) {
        const safeContent = text
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"')
          .replace(/\n/g, '\\n')
          .replace(/\{/g, '\\{')
          .replace(/\}/g, '\\}');
        await window.TavernHelper.triggerSlash(`/clipboard-set "${safeContent}"`);
        return true;
      }
    } catch (error) {
      console.warn('[DICE] history copy via TavernHelper failed:', error);
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (error) {
      console.warn('[DICE] history copy via navigator.clipboard failed:', error);
    }

    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '0';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);
      textArea.select();
      textArea.setSelectionRange(0, 99999);
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (error) {
      console.error('[DICE] history copy fallback failed:', error);
      return false;
    }
  };
  return copyTextWithTavernApi;
}
