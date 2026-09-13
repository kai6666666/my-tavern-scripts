// @ts-nocheck
/**
 * collect-accessible-runtime-windows.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCollectAccessibleRuntimeWindows(deps: any) {
  const collectAccessibleRuntimeWindows = (): Window[] => {
    const windows: Window[] = [];
    const queuedWindows: Window[] = [];
    const visitedWindows = new Set<Window>();

    const addWindow = (targetWindow: Window | null | undefined) => {
      if (!targetWindow || visitedWindows.has(targetWindow)) return;
      if (!deps.getAccessibleDocument(targetWindow)) return;
      visitedWindows.add(targetWindow);
      windows.push(targetWindow);
      queuedWindows.push(targetWindow);
    };

    addWindow(window);
    try {
      addWindow(deps.getTavernHostWindow());
    } catch {
      // ignore host lookup failures
    }

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

    for (let index = 0; index < queuedWindows.length; index++) {
      const targetWindow = queuedWindows[index];

      try {
        for (let frameIndex = 0; frameIndex < targetWindow.frames.length; frameIndex++) {
          addWindow(targetWindow.frames[frameIndex]);
        }
      } catch {
        // ignore inaccessible child frames
      }

      const targetDocument = deps.getAccessibleDocument(targetWindow);
      targetDocument?.querySelectorAll<HTMLIFrameElement>('iframe').forEach(frame => {
        try {
          addWindow(frame.contentWindow);
        } catch {
          // ignore inaccessible iframe content windows
        }
      });
    }

    return windows;
  };
  return collectAccessibleRuntimeWindows;
}
