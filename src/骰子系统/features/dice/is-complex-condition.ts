// @ts-nocheck
/**
 * is-complex-condition.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsComplexCondition(deps: any) {
  const isComplexCondition = (expr: string): boolean => {
    return /(\&\&|\|\|)/.test(expr);
  };
  return isComplexCondition;
}
