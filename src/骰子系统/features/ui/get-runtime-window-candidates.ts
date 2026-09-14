// @ts-nocheck
/**
 * get-runtime-window-candidates.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetRuntimeWindowCandidates(deps: any) {
  const getRuntimeWindowCandidates = () => {
    const candidates: Window[] = [];
    const addWindow = (targetWindow: Window | null | undefined) => {
      if (!targetWindow || candidates.includes(targetWindow)) return;
      candidates.push(targetWindow);
    };

    try {
      addWindow(deps.getTavernHostWindow());
    } catch (_error) {
      // 宿主窗口可能还没准备好，继续检查本窗口和父窗口。
    }
    addWindow(window);
    try {
      addWindow(window.parent);
    } catch (_error) {
      // ignore inaccessible parent
    }
    try {
      addWindow(window.top);
    } catch (_error) {
      // ignore inaccessible top
    }

    return candidates;
  };
  return getRuntimeWindowCandidates;
}
