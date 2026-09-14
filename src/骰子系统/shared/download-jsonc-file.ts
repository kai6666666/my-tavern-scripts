// @ts-nocheck
/**
 * download-jsonc-file.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createDownloadJsoncFile(deps: any) {
  const downloadJsoncFile = (content: string, filename: string): void => {
    deps.downloadTextFile({ content, filename, mimeType: deps.getJSONC_FILE_MIME() });
  };
  return downloadJsoncFile;
}
