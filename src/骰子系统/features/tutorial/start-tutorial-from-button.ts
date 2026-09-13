// @ts-nocheck
/**
 * start-tutorial-from-button.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 * [DEBUG-BUILD s65d] 带有调试日志，仅用于定位教程按钮问题。
 */
export function createStartTutorialFromButton(deps: any) {
  const invokeStart = (scope: string): void => {
    console.info('[tut-debug] invoking start, scope=', scope);
    deps.getTutorialModule().start(scope, { manual: true, interrupt: true });
    console.info('[tut-debug] start returned, scope=', scope);
  };
  const startTutorialFromButton = (button: Element): void => {
    try {
      const rawAttr = (button as any)?.getAttribute?.('data-tutorial-scope');
      console.info('[tut-debug] click fired, raw scope attr =', rawAttr);
      const { $ } = deps.getCore();
      const scope = String($(button).attr('data-tutorial-scope') || '');
      const okScope = deps.isTutorialScope(scope);
      console.info('[tut-debug] normalized scope =', scope, '| isTutorialScope =', okScope);
      if (!okScope) return;
      if (scope === 'avatarManager') {
        const win = deps.getTavernHostWindow();
        let attempts = 0;
        const startWhenReady = (): void => {
          attempts += 1;
          const isReady = deps.prepareAvatarManagerTutorial(button);
          if (isReady || attempts >= 6) {
            invokeStart(scope);
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
            invokeStart(scope);
            return;
          }
          win.setTimeout(startWhenReady, 140);
        };
        startWhenReady();
        return;
      }
      if (scope === 'inventory') {
        const invReady = deps.prepareInventoryTutorial(button);
        console.info('[tut-debug] prepareInventoryTutorial =', invReady);
      }
      const sgReady = deps.prepareSettingsGroupTutorial(scope, button);
      console.info('[tut-debug] prepareSettingsGroupTutorial =', sgReady);
      invokeStart(scope);
    } catch (err) {
      console.error('[tut-debug] FAILED with error:', err);
    }
  };
  return startTutorialFromButton;
}
