// @ts-nocheck
/**
 * bind-human-input-tracking.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBindHumanInputTracking(deps: any) {
  const bindHumanInputTracking = () => {
    const textarea = document.getElementById('send_textarea') as AcuDiceTextareaElement | null;
    if (!textarea || textarea._acuHumanInputTrackingBound) return;

    const updateSnapshot = (target: HTMLTextAreaElement) => {
      const acuTextarea = target as AcuDiceTextareaElement;
      const visibleValue = deps.readTextareaVisibleValue(target);
      const resolvedValue = deps.syncTextareaDiceCacheFromVisibleText(acuTextarea, visibleValue);
      if (acuTextarea._acuOriginalActionText && !resolvedValue.includes(acuTextarea._acuOriginalActionText)) {
        acuTextarea._acuOriginalActionText = null;
        const { $ } = deps.getCore();
        $(target).removeData('acu-original-action-text');
      }
      deps.setLastHumanInputSnapshot(deps.stripSystemInjectedContent(resolvedValue, acuTextarea._acuOriginalActionText));
      deps.markHumanInputActivity();
    };

    const handleTrustedInput = (event: Event) => {
      if (!event.isTrusted) return;
      updateSnapshot(textarea);
    };

    textarea.addEventListener('input', handleTrustedInput, true);
    textarea.addEventListener('paste', handleTrustedInput, true);
    textarea.addEventListener('compositionend', handleTrustedInput, true);
    textarea._acuHumanInputTrackingBound = true;
    updateSnapshot(textarea);
  };
  return bindHumanInputTracking;
}
