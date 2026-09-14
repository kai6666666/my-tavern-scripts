// @ts-nocheck
/**
 * get-database-manual-update-error-message.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDatabaseManualUpdateErrorMessage(deps: any) {
  const getDatabaseManualUpdateErrorMessage = (error: unknown, fallback: string): string => {
    if (error instanceof Error && error.message) return error.message;
    if (typeof error === 'string' && error.trim()) return error;
    return fallback;
  };
  return getDatabaseManualUpdateErrorMessage;
}
