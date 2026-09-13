// @ts-nocheck
/**
 * set-active-table-nav-button.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSetActiveTableNavButton(deps: any) {
  const setActiveTableNavButton = (tableName: string) => {
    const { $ } = deps.getCore();
    $('.acu-nav-btn').removeClass('active');
    $('.acu-nav-btn[data-table]')
      .filter(function (this: HTMLElement) {
        return String($(this).data('table') ?? '') === tableName;
      })
      .addClass('active');
  };
  return setActiveTableNavButton;
}
