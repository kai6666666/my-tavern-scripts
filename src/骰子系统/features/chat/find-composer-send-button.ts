// @ts-nocheck
/**
 * find-composer-send-button.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createFindComposerSendButton(deps: any) {
  const findComposerSendButton = (): HTMLElement | null => {
    const documents = new Set<Document>();
    try {
      documents.add(deps.getTavernHostDocument());
    } catch (_error) {
      // ignore
    }
    documents.add(document);

    for (const targetDocument of documents) {
      const buttons = Array.from(targetDocument.querySelectorAll<HTMLElement>('#send_but'));
      const visibleButton = buttons.find(button => {
        if ((button as HTMLButtonElement).disabled) return false;
        const rect = button.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      if (visibleButton) return visibleButton;
      if (buttons[0] && !(buttons[0] as HTMLButtonElement).disabled) return buttons[0];
    }

    return null;
  };
  return findComposerSendButton;
}
