// @ts-nocheck
/**
 * download-ai-prompt-file.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createDownloadAiPromptFile(deps: any) {
  const downloadAiPromptFile = (content: string, filename: string): void => {
    deps.downloadTextFile({ content, filename, mimeType: deps.getMARKDOWN_FILE_MIME() });
  };
  return downloadAiPromptFile;
}
