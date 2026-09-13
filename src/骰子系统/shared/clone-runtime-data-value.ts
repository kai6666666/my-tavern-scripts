// @ts-nocheck
/**
 * clone-runtime-data-value.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCloneRuntimeDataValue(deps: any) {
  const cloneRuntimeDataValue = <T>(value: T): T => {
    if (value === null || value === undefined) return value;
    if (typeof structuredClone === 'function') {
      return structuredClone(value);
    }
    return JSON.parse(JSON.stringify(value)) as T;
  };
  return cloneRuntimeDataValue;
}
