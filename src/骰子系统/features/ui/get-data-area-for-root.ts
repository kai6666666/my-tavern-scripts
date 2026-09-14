// @ts-nocheck
/**
 * get-data-area-for-root.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DICE_ROOT_SELECTOR } from '../../shared/constants';
export function createGetDataAreaForRoot(deps: any) {
  const getDataAreaForRoot = ($root?: JQuery<HTMLElement>): JQuery<HTMLElement> => {
    const { $ } = deps.getCore();

    if ($root && $root.length) {
      const $rootPanel = $root.find<HTMLElement>('#acu-data-area').first();
      if ($rootPanel.length) return $rootPanel;
    }

    const $latestRoot = $(DICE_ROOT_SELECTOR).last();
    const $latestPanel = $latestRoot.find<HTMLElement>('#acu-data-area').first();
    if ($latestPanel.length) return $latestPanel;

    return $('#acu-data-area').first();
  };
  return getDataAreaForRoot;
}
