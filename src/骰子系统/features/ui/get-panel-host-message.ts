// @ts-nocheck
/**
 * get-panel-host-message.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DICE_ROOT_SELECTOR } from '../../shared/constants';
export function createGetPanelHostMessage(deps: any) {
  const getPanelHostMessage = ($root?: JQuery<HTMLElement>): JQuery<HTMLElement> => {
    const { $ } = deps.getCore();
    const $currentRoot = $root && $root.length ? $root : $(DICE_ROOT_SELECTOR).last();
    const $rootHost = $currentRoot.closest<HTMLElement>('.mes').first();
    if ($rootHost.length) return $rootHost;

    const $panelHost = deps.getDataAreaForRoot($currentRoot).closest<HTMLElement>('.mes').first();
    if ($panelHost.length) return $panelHost;

    return deps.getLatestAssistantMessageElement();
  };
  return getPanelHostMessage;
}
