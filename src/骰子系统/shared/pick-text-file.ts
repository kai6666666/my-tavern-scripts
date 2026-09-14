// @ts-nocheck
/**
 * pick-text-file.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from './actionable-error-toast';
export function createPickTextFile(deps: any) {
  const pickTextFile = (accept = deps.JSONC_FILE_ACCEPT): Promise<TextFileSelection | null> =>
    new Promise(resolve => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = accept;
      input.style.display = 'none';
      const cleanup = () => {
        if (input.isConnected) input.remove();
      };
      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) {
          cleanup();
          resolve(null);
          return;
        }
        deps.readTextFile(file)
          .then(text => resolve({ file, text }))
          .catch(error => {
            console.error('[DICE]读取文件失败:', error);
            if (window.toastr)
              showActionableErrorToast('文件读取失败，浏览器没有成功读取所选文件。', { suggestion: 'importExport' });
            resolve(null);
          })
          .finally(cleanup);
      };
      input.addEventListener(
        'cancel',
        () => {
          cleanup();
          resolve(null);
        },
        { once: true },
      );
      document.body.appendChild(input);
      input.click();
    });
  return pickTextFile;
}
