// @ts-nocheck
/**
 * get-success-level.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetSuccessLevel(deps: any) {
  const getSuccessLevel = function (roll: number, target: number, sides: number) {
    if (sides === 100) {
      if (roll <= 5) return { level: 3, name: '大成功', color: 'var(--acu-crit-success-text)' };
      if (roll >= 96) return { level: -1, name: '大失败', color: 'var(--acu-crit-failure-text)' };
      if (roll <= Math.floor(target / 5))
        return { level: 2, name: '极难成功', color: 'var(--acu-extreme-success-text)' };
      if (roll <= Math.floor(target / 2)) return { level: 1, name: '困难成功', color: 'var(--acu-success-text)' };
      if (roll <= target) return { level: 0, name: '普通成功', color: 'var(--acu-warning-text)' };
      return { level: -1, name: '失败', color: 'var(--acu-failure-text)' };
    } else {
      if (roll === 20) return { level: 3, name: '大成功', color: 'var(--acu-crit-success-text)' };
      if (roll === 1) return { level: -1, name: '大失败', color: 'var(--acu-crit-failure-text)' };
      if (roll >= target) return { level: 0, name: '成功', color: 'var(--acu-success-text)' };
      return { level: -1, name: '失败', color: 'var(--acu-failure-text)' };
    }
  };
  return getSuccessLevel;
}
