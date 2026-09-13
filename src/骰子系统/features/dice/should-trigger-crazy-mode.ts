// @ts-nocheck
/**
 * should-trigger-crazy-mode.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShouldTriggerCrazyMode(deps: any) {
  const shouldTriggerCrazyMode = () => {
    const config = deps.getCrazyModeConfig();
    if (!config.enabled) return false;
    // crazyLevel 作为触发概率百分比
    const roll = Math.random() * 100;
    return roll < config.crazyLevel;
  };
  return shouldTriggerCrazyMode;
}
