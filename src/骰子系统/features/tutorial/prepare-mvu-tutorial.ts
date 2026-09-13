// @ts-nocheck
/**
 * prepare-mvu-tutorial.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createPrepareMvuTutorial(deps: any) {
  const prepareMvuTutorial = (): boolean => {
    console.info('[tut-debug] prepareMvu entry');
    const { $ } = deps.getCore();
    const doc = deps.getTavernHostDocument();
    const $panel = $(doc).find('#acu-data-area .acu-mvu-panel').first();
    if (!$panel.length) return false;

    const isNumericMode = $panel.find('.mvu-numeric-mode').length > 0;
    console.info('[tut-debug] prepareMvu panel=', $panel.length, 'numeric=', isNumericMode);
    if (!isNumericMode) {
      try {
        localStorage.setItem('acu_mvu_numeric_mode', 'true');
        deps.renderInterface();
      } catch (error) {
        console.warn('[DICE] MVU 教程切换数值模式失败:', error);
      }
      return false;
    }

    const $levelControls = $panel.find('.mvu-level-controls-collapsible').first();
    if (!$levelControls.length) return false;
    $levelControls.removeClass('collapsed');
    $levelControls[0].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    return true;
  };
  return prepareMvuTutorial;
}
