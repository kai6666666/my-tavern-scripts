// @ts-nocheck
/**
 * get-runtime-error-log-payload.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetRuntimeErrorLogPayload(deps: any) {
  const getRuntimeErrorLogPayload = (error: unknown) => {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }
    return { message: deps.getRuntimeErrorMessage(error) };
  };
  return getRuntimeErrorLogPayload;
}
