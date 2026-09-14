// @ts-nocheck
/**
 * ensure-gacha-heartbeat.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ACTIVE_HEARTBEAT_MS } from '../../entities/gacha-items';
export function createEnsureGachaHeartbeat(deps: any) {
  const ensureGachaHeartbeat = () => {
    if (deps.getGachaHeartbeatTimer()) return;
    deps.setGachaHeartbeatTimer(setInterval(() => {
      void deps.flushGachaHeartbeatProgress(false);
    }, GACHA_ACTIVE_HEARTBEAT_MS));
  };
  return ensureGachaHeartbeat;
}
