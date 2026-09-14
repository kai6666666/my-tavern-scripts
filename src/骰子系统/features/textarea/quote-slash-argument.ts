// @ts-nocheck
/**
 * quote-slash-argument.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createQuoteSlashArgument(deps: any) {
  const quoteSlashArgument = (text: string): string =>
    `"${String(text ?? '')
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')}"`;

    return quoteSlashArgument;
}
