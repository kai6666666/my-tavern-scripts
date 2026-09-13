// @ts-nocheck
/**
 * bind-tutorial-buttons-in.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBindTutorialButtonsIn(deps: any) {
  const bindTutorialButtonsIn = ($root: JQuery): void => {
    $root
      .find('.acu-panel-tutorial-btn')
      .off('click.acu_panel_tutorial_direct')
      .on('click.acu_panel_tutorial_direct', function (e) {
        e.stopPropagation();
        e.preventDefault();
        deps.startTutorialFromButton(this);
      });
  };
  return bindTutorialButtonsIn;
}
