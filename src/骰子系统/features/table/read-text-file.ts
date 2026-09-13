// @ts-nocheck
/**
 * read-text-file.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createReadTextFile(deps: any) {
  const readTextFile = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = event => resolve(String(event.target?.result || ''));
      reader.onerror = () => reject(reader.error || new Error('文件读取失败'));
      reader.readAsText(file);
    });
  return readTextFile;
}
