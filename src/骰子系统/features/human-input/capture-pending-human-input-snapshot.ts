// @ts-nocheck
/**
 * capture-pending-human-input-snapshot.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCapturePendingHumanInputSnapshot(deps: any) {
  const capturePendingHumanInputSnapshot = (rawText?: unknown, systemActionText?: unknown) => {
    const sanitized = deps.stripSystemInjectedContent(rawText, systemActionText) || deps.getLastHumanInputSnapshot();
    const now = Date.now();
    deps.markHumanInputActivity();
    deps.setLastHumanInputSnapshot(sanitized);
    if (sanitized === deps.getLastCapturedHumanInputSnapshot() && now - deps.getLastHumanInputCaptureAt() < 500) return;
    deps.setLastCapturedHumanInputSnapshot(sanitized);
    deps.setLastHumanInputCaptureAt(now);
    deps.getHumanInputSendQueue().push(sanitized);
  };
  return capturePendingHumanInputSnapshot;
}
