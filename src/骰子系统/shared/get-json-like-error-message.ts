// @ts-nocheck
/**
 * get-json-like-error-message.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetJsonLikeErrorMessage(deps: any) {
  const getJsonLikeErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return String(error || '未知错误');
  };
  return getJsonLikeErrorMessage;
}
