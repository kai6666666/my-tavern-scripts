// @ts-nocheck
/**
 * download-json-file.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createDownloadJsonFile(deps: any) {
  const downloadJsonFile = (content: string, filename: string): void => {
    deps.downloadTextFile({ content, filename, mimeType: deps.getJSON_FILE_MIME() });
  };
  return downloadJsonFile;
}
