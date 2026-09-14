// @ts-nocheck
/**
 * cleanup-global-interaction-floating-menus.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCleanupGlobalInteractionFloatingMenus(deps: any) {
  const cleanupGlobalInteractionFloatingMenus = (): void => {
    const { $ } = deps.getCore();
    deps.clearGlobalInteractionOutsideCapture();
    $('.acu-global-interaction-row.is-expanded')
      .removeClass('is-expanded')
      .find('.acu-global-interaction-row-main')
      .attr('aria-expanded', 'false');
    $('.acu-global-interaction-floating-host').remove();
    $('#acu-data-area').off('.globalInteractionEvents');
    $('body').off('.globalInteractionEvents');
    $(document).off('.globalInteractionEvents');
    $(window).off('resize.globalInteractionEvents scroll.globalInteractionEvents');
  };
  return cleanupGlobalInteractionFloatingMenus;
}
