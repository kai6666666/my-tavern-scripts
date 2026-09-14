// @ts-nocheck
/**
 * fixed-wrapper-bounds.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DICE_ROOT_SELECTOR } from '../../shared/constants';
export function createUpdateFixedWrapperBounds(deps: any) {
  const updateFixedWrapperBounds = () => {
    const config = deps.getConfig();
    if (deps.isFloatingCollapseActive(config)) {
      deps.updateFloatingCollapseBounds();
      return;
    }
    if (config.positionMode !== 'fixed') return;

    const targetWindow = deps.getTavernHostWindow();
    const targetDocument = deps.getTavernHostDocument();
    const wrapper =
      targetDocument.querySelector<HTMLElement>(`${DICE_ROOT_SELECTOR}.acu-mode-fixed`) ||
      document.querySelector<HTMLElement>(`${DICE_ROOT_SELECTOR}.acu-mode-fixed`);
    if (!wrapper) return;

    const chat = targetDocument.querySelector<HTMLElement>('#chat');
    if (chat && wrapper.ownerDocument === targetDocument && wrapper.parentElement !== chat) {
      chat.appendChild(wrapper);
    }
    if (chat && wrapper.parentElement === chat && chat.lastElementChild !== wrapper) {
      chat.appendChild(wrapper);
    }

    const visualViewport = targetWindow.visualViewport;
    const viewportLeft = visualViewport?.offsetLeft || 0;
    const viewportWidth =
      visualViewport?.width ||
      targetWindow.innerWidth ||
      targetDocument.documentElement.clientWidth ||
      window.innerWidth ||
      0;
    const layoutViewportWidth =
      targetWindow.innerWidth || targetDocument.documentElement.clientWidth || window.innerWidth || viewportWidth;

    const parent = wrapper.parentElement;
    const parentMetrics = deps.getFixedWrapperParentMetrics(
      parent,
      targetWindow,
      viewportWidth || targetDocument.documentElement.clientWidth || layoutViewportWidth,
      viewportLeft,
    );
    if (!parentMetrics) return;
    const parentWidth = parentMetrics.contentWidth;
    const parentLeft = parentMetrics.contentLeft;
    if (parentWidth <= 0) return;

    const applyFixedWrapperLayout = (width: number, marginLeft: number) => {
      wrapper.style.setProperty('box-sizing', 'border-box');
      wrapper.style.setProperty('width', `${width}px`);
      wrapper.style.setProperty('max-width', `${width}px`);
      wrapper.style.setProperty('margin-left', `${marginLeft}px`);
      wrapper.style.setProperty('margin-top', 'auto');
      wrapper.style.setProperty('margin-right', '0');
      wrapper.style.removeProperty('left');
      wrapper.style.removeProperty('right');
      wrapper.style.removeProperty('bottom');
      wrapper.style.removeProperty('transform');
      wrapper.style.removeProperty('--acu-viewport-panel-max-height');
      wrapper.style.removeProperty('--acu-viewport-nav-height');
    };

    if (layoutViewportWidth > 0 && layoutViewportWidth <= deps.TABLET_FIXED_NAV_FULL_WIDTH_MAX) {
      applyFixedWrapperLayout(Math.round(parentWidth), 0);
      return;
    }

    const anchorRect = deps.getFixedModeAnchorRect();
    if (!anchorRect || anchorRect.width <= 0) return;

    const viewportRight = viewportWidth > 0 ? viewportLeft + viewportWidth : anchorRect.right;
    const visibleAnchorLeft = Math.max(viewportLeft, anchorRect.left);
    const visibleAnchorRight = Math.min(viewportRight, anchorRect.right);
    const rawAnchorWidth = Math.max(0, visibleAnchorRight - visibleAnchorLeft);

    const preferredWidth = Math.max(280, Math.round(rawAnchorWidth || anchorRect.width));
    const maxMarginLeft = Math.max(0, parentWidth - Math.min(preferredWidth, parentWidth));
    const marginLeft = Math.min(maxMarginLeft, Math.max(0, Math.round(visibleAnchorLeft - parentLeft)));
    const width = Math.max(0, Math.min(preferredWidth, parentWidth - marginLeft));
    if (width <= 0) return;

    applyFixedWrapperLayout(width, marginLeft);
  };
  return updateFixedWrapperBounds;
}
