// @ts-nocheck
/**
 * select-crazy-roll-type.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSelectCrazyRollType(deps: any) {
  const selectCrazyRollType = crazyLevel => {
    // crazyLevel < 50: 100% 普通检定
    // crazyLevel 50-75: 70% 普通 / 30% 对抗
    // crazyLevel > 75: 50% 普通 / 50% 对抗
    if (crazyLevel < 50) return 'normal';
    const contestChance = crazyLevel <= 75 ? 0.3 : 0.5;
    return Math.random() < contestChance ? 'contest' : 'normal';
  };
  return selectCrazyRollType;
}
