// @ts-nocheck
/**
 * find-runtime-function.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createFindRuntimeFunction(deps: any) {
  const findRuntimeFunction = (name: string) => {
    for (const runtimeWindow of deps.getRuntimeWindowCandidates()) {
      const directFn = runtimeWindow?.[name];
      if (typeof directFn === 'function') return directFn.bind(runtimeWindow);

      const tavernHelper = runtimeWindow?.TavernHelper;
      const helperFn = tavernHelper?.[name];
      if (typeof helperFn === 'function') return helperFn.bind(tavernHelper);
    }

    const globalFn = globalThis?.[name];
    return typeof globalFn === 'function' ? globalFn.bind(globalThis) : null;
  };
  return findRuntimeFunction;
}
