// @ts-nocheck
/**
 * get-runtime-error-message.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetRuntimeErrorMessage(deps: any) {
  const getRuntimeErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    try {
      const text = JSON.stringify(error);
      return text && text !== '{}' ? text : String(error);
    } catch {
      return String(error);
    }
  };
  return getRuntimeErrorMessage;
}
