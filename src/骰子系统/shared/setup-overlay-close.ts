// @ts-nocheck
/**
 * setup-overlay-close.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSetupOverlayClose(deps: any) {
  const setupOverlayClose = ($overlay: JQuery, overlayClass: string, onClose: () => void) => {
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isMobile) {
      // Mobile: 触摸点击遮罩即关闭
      $overlay.on('click', function (e) {
        if ($(e.target).hasClass(overlayClass)) {
          onClose();
        }
      });
    } else {
      // PC: 需要 mousedown 和 mouseup 都在遮罩上才关闭
      let mouseDownOnOverlay = false;

      $overlay.on('mousedown', function (e) {
        mouseDownOnOverlay = $(e.target).hasClass(overlayClass);
      });

      $overlay.on('mouseup', function (e) {
        if (mouseDownOnOverlay && $(e.target).hasClass(overlayClass)) {
          onClose();
        }
        mouseDownOnOverlay = false;
      });
    }
  };
  return setupOverlayClose;
}
