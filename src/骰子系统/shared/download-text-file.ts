// @ts-nocheck
/**
 * download-text-file.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createDownloadTextFile(deps: any) {
  const downloadTextFile = ({ content, filename, mimeType }: DownloadTextFileOptions): void => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    try {
      anchor.click();
    } finally {
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    }
  };
  return downloadTextFile;
}
