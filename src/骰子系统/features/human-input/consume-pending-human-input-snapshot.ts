// @ts-nocheck
/**
 * consume-pending-human-input-snapshot.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createConsumePendingHumanInputSnapshot(deps: any) {
  const consumePendingHumanInputSnapshot = (): string => {
    if (deps.getHumanInputSendQueue().length > 0) {
      return String(deps.getHumanInputSendQueue().shift() || '');
    }
    return String(deps.getLastHumanInputSnapshot() || '');
  };
  return consumePendingHumanInputSnapshot;
}
