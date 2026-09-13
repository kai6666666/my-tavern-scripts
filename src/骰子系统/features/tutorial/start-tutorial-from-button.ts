// @ts-nocheck
/**
 * start-tutorial-from-button.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createStartTutorialFromButton(deps: any) {
  const startTutorialFromButton = (button: Element): void => {
    const { $ } = deps.getCore();
    const scope = String($(button).attr('data-tutorial-scope') || '');
    if (!deps.isTutorialScope(scope)) return;
    if (scope === 'avatarManager') {
      const win = deps.getTavernHostWindow();
      let attempts = 0;
      const startWhenReady = (): void => {
        attempts += 1;
        const isReady = deps.prepareAvatarManagerTutorial(button);
        if (isReady || attempts >= 6) {
          deps.getTutorialModule().start(scope, { manual: true, interrupt: true });
          return;
        }
        win.setTimeout(startWhenReady, 120);
      };
      startWhenReady();
      return;
    }
    if (scope === 'mvu') {
      const win = deps.getTavernHostWindow();
      let attempts = 0;
      const startWhenReady = (): void => {
        attempts += 1;
        const isReady = deps.prepareMvuTutorial();
        if (isReady || attempts >= 8) {
          deps.getTutorialModule().start(scope, { manual: true, interrupt: true });
          return;
        }
        win.setTimeout(startWhenReady, 140);
      };
      startWhenReady();
      return;
    }
    if (scope === 'inventory') {
      deps.prepareInventoryTutorial(button);
    }
    deps.prepareSettingsGroupTutorial(scope, button);
    deps.getTutorialModule().start(scope, { manual: true, interrupt: true });
  };
  return startTutorialFromButton;
}
