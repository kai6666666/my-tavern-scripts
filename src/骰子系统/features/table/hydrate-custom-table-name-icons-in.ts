// @ts-nocheck
/**
 * hydrate-custom-table-name-icons-in.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { CustomTableNameIconImageDB } from '../../shared/storage/custom-table-name-icon-image-db';
export function createHydrateCustomTableNameIconsIn(deps: any) {
  const hydrateCustomTableNameIconsIn = (root: HTMLElement | JQuery<HTMLElement> | Document = document) => {
    const rootEl = root instanceof HTMLElement || root instanceof Document ? root : root[0];
    if (!rootEl) return;
    rootEl
      .querySelectorAll<HTMLElement>('.acu-custom-table-name-url-icon[data-custom-table-name-icon-url]')
      .forEach(element => {
        const url = String(element.dataset.customTableNameIconUrl || '').trim();
        if (!url || !deps.isCustomTableNameIconImageUrlValid(url) || CustomTableNameIconImageDB.hasUrlFailed(url)) return;
        deps.applyAsyncImageUrlToElement(element, url, 'customTableNameIconResolvedUrl', {
          onError: () => {
            CustomTableNameIconImageDB.markUrlFailed(url);
          },
        });
      });
    rootEl
      .querySelectorAll<HTMLElement>('.acu-custom-table-name-local-icon[data-custom-table-name-icon-local-key]')
      .forEach(element => {
        const localKey = String(element.dataset.customTableNameIconLocalKey || '').trim();
        if (!localKey || CustomTableNameIconImageDB.hasLocalKeyFailed(localKey)) return;
        void CustomTableNameIconImageDB.get(localKey)
          .then(url => {
            if (!url) {
              CustomTableNameIconImageDB.markLocalKeyFailed(localKey);
              return;
            }
            if (!element.isConnected) return;
            deps.applyAsyncImageUrlToElement(element, url, 'customTableNameIconResolvedUrl', {
              onError: () => {
                CustomTableNameIconImageDB.markLocalKeyFailed(localKey);
              },
            });
          })
          .catch(() => {
            CustomTableNameIconImageDB.markLocalKeyFailed(localKey);
          });
      });
  };
  return hydrateCustomTableNameIconsIn;
}
