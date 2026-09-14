// @ts-nocheck
/**
 * tavern-host.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetTavernHostWindow(deps: any) {
  const getTavernHostWindow = (): Window => {
    const windows: Window[] = [];
    const addWindow = (targetWindow: Window | null | undefined) => {
      if (!targetWindow || windows.includes(targetWindow)) return;
      if (!deps.getAccessibleDocument(targetWindow)) return;
      windows.push(targetWindow);
    };

    addWindow(window);

    try {
      let cursor = window;
      while (cursor.parent && cursor.parent !== cursor) {
        const parentWindow = cursor.parent;
        if (!deps.getAccessibleDocument(parentWindow)) break;
        addWindow(parentWindow);
        cursor = parentWindow;
      }
    } catch {
      // 跨域或宿主限制时保留已收集的窗口
    }

    try {
      addWindow(window.top);
    } catch {
      // ignore
    }

    const hasVisibleHostAnchor = (targetWindow: Window): boolean => {
      const doc = deps.getAccessibleDocument(targetWindow);
      if (!doc) return false;

      const viewportWidth = targetWindow.innerWidth || doc.documentElement.clientWidth || 0;
      const viewportHeight = targetWindow.innerHeight || doc.documentElement.clientHeight || 0;
      const anchors = Array.from(doc.querySelectorAll<HTMLElement>(deps.HOST_SELECTOR));

      return anchors.some(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return false;
        if (viewportWidth > 0 && (rect.right <= 0 || rect.left >= viewportWidth)) return false;
        if (viewportHeight > 0 && (rect.bottom <= 0 || rect.top >= viewportHeight)) return false;
        return true;
      });
    };

    for (let i = windows.length - 1; i >= 0; i--) {
      if (hasVisibleHostAnchor(windows[i])) {
        return windows[i];
      }
    }

    for (let i = windows.length - 1; i >= 0; i--) {
      const doc = deps.getAccessibleDocument(windows[i]);
      if (doc?.querySelector(deps.HOST_SELECTOR)) {
        return windows[i];
      }
    }

    return windows[windows.length - 1] || window;
  };
  return getTavernHostWindow;
}
