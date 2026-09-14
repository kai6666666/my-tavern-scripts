// @ts-nocheck
/**
 * get-result-badge-class.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetResultBadgeClass(deps: any) {
  const getResultBadgeClass = resultType => {
    // resultType: 'critSuccess' | 'extremeSuccess' | 'success' | 'warning' | 'failure' | 'critFailure'
    const classMap = {
      critSuccess: 'acu-result-badge acu-result-badge-crit-success',
      extremeSuccess: 'acu-result-badge acu-result-badge-extreme-success',
      success: 'acu-result-badge acu-result-badge-success',
      warning: 'acu-result-badge acu-result-badge-warning',
      failure: 'acu-result-badge acu-result-badge-failure',
      critFailure: 'acu-result-badge acu-result-badge-crit-failure',
    };
    return classMap[resultType] || classMap.failure;
  };
  return getResultBadgeClass;
}
