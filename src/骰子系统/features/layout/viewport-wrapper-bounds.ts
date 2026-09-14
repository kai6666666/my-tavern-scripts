// @ts-nocheck
/**
 * viewport-wrapper-bounds.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DICE_ROOT_SELECTOR } from '../../shared/constants';
export function createUpdateViewportWrapperBounds(deps: any) {
  const updateViewportWrapperBounds = () => {
    const config = deps.getConfig();
    if (deps.isFloatingCollapseActive(config)) {
      deps.updateFloatingCollapseBounds();
      return;
    }
    if (config.positionMode !== 'viewport') return;

    const targetWindow = deps.getTavernHostWindow();
    const targetDocument = deps.getTavernHostDocument();
    const wrapper =
      targetDocument.querySelector<HTMLElement>(`${DICE_ROOT_SELECTOR}.acu-mode-viewport`) ||
      document.querySelector<HTMLElement>(`${DICE_ROOT_SELECTOR}.acu-mode-viewport`);
    if (!wrapper) return;

    if (wrapper.ownerDocument !== targetDocument || wrapper.parentElement !== targetDocument.body) {
      targetDocument.body.appendChild(wrapper);
    }

    wrapper.style.setProperty('position', 'fixed', 'important');
    wrapper.style.setProperty('display', 'flex', 'important');
    wrapper.style.setProperty('flex-direction', 'column-reverse', 'important');
    wrapper.style.setProperty('visibility', 'visible', 'important');
    wrapper.style.setProperty('opacity', '1', 'important');
    const isCompactCollapsed = deps.getCollapsedState() && deps.normalizeCollapseStyle(config.collapseStyle) === 'pill';
    wrapper.style.setProperty('pointer-events', isCompactCollapsed ? 'none' : 'auto', 'important');
    wrapper.style.setProperty('top', 'auto', 'important');
    wrapper.style.setProperty('margin', '0', 'important');
    wrapper.style.setProperty('box-sizing', 'border-box', 'important');
    wrapper.style.setProperty('z-index', '1000', 'important');

    const navContainer = wrapper.querySelector<HTMLElement>('.acu-nav-container');
    if (navContainer) {
      navContainer.style.setProperty('visibility', 'visible', 'important');
      navContainer.style.setProperty('opacity', '1', 'important');
      navContainer.style.setProperty('pointer-events', 'auto', 'important');
    }

    const expandTrigger = wrapper.querySelector<HTMLElement>('.acu-expand-trigger');
    if (expandTrigger) {
      expandTrigger.style.setProperty('display', 'flex', 'important');
      expandTrigger.style.setProperty('visibility', 'visible', 'important');
      expandTrigger.style.setProperty('opacity', '1', 'important');
      expandTrigger.style.setProperty('pointer-events', 'auto', 'important');
    }

    const visualViewport = targetWindow.visualViewport;
    const getViewportHeight = () =>
      visualViewport?.height || targetWindow.innerHeight || targetDocument.documentElement.clientHeight || 0;
    const updateViewportNavigationSafety = (navigationAnchor: HTMLElement, bottomOffset: number) => {
      const viewportTop = visualViewport?.offsetTop || 0;
      const viewportHeight = getViewportHeight();
      const navigationRect = navigationAnchor.getBoundingClientRect();
      const navigationHeight = Math.max(0, Math.ceil(navigationRect.height || navigationAnchor.offsetHeight || 0));
      if (viewportHeight > 0) {
        const panelMaxHeight = Math.max(180, Math.floor(viewportHeight - bottomOffset - navigationHeight - 24));
        wrapper.style.setProperty('--acu-viewport-panel-max-height', `${panelMaxHeight}px`);
        wrapper.style.setProperty('--acu-viewport-nav-height', `${navigationHeight}px`);
      }

      // SillyTavern 移动/平板布局可能会移动宿主滚动根，fixed 子元素要按导航盘实际位置校正。
      const rawRect = navigationAnchor.getBoundingClientRect();
      if (viewportHeight > 0 && rawRect.height > 0) {
        const desiredBottom = viewportTop + viewportHeight - bottomOffset;
        const correctionY = desiredBottom - rawRect.bottom;
        if (Number.isFinite(correctionY) && Math.abs(correctionY) > 1) {
          wrapper.style.setProperty('transform', `translate3d(0, ${Math.round(correctionY)}px, 0)`, 'important');
        }
      }
    };
    const viewportWidth =
      visualViewport?.width ||
      targetWindow.innerWidth ||
      targetDocument.documentElement.clientWidth ||
      window.innerWidth ||
      0;
    if (viewportWidth > 0 && viewportWidth <= 768) {
      const left = visualViewport?.offsetLeft || 0;
      const bottomOffset = deps.getViewportBottomOffset();
      const navigationAnchor = navContainer || expandTrigger || wrapper;
      wrapper.style.setProperty('left', `${left}px`, 'important');
      wrapper.style.setProperty('right', 'auto', 'important');
      wrapper.style.setProperty('width', `${Math.max(280, Math.round(viewportWidth))}px`, 'important');
      wrapper.style.setProperty('max-width', `${Math.max(280, Math.round(viewportWidth))}px`, 'important');
      wrapper.style.setProperty('transform', 'none', 'important');
      wrapper.style.setProperty('bottom', `${bottomOffset}px`, 'important');
      updateViewportNavigationSafety(navigationAnchor, bottomOffset);
      return;
    }

    const rect = deps.getViewportAnchorRect();
    if (!rect) return;
    if (rect.width <= 0) return;

    const left = Math.max(0, rect.left);
    const right = Math.min(viewportWidth, rect.right);
    const width = Math.max(280, right - left);
    const bottomOffset = deps.getViewportBottomOffset();

    wrapper.style.setProperty('left', `${left}px`, 'important');
    wrapper.style.setProperty('right', 'auto', 'important');
    wrapper.style.setProperty('width', `${width}px`, 'important');
    wrapper.style.setProperty('max-width', `${width}px`, 'important');
    wrapper.style.setProperty('transform', 'none', 'important');
    wrapper.style.setProperty('bottom', `${bottomOffset}px`, 'important');
    updateViewportNavigationSafety(navContainer || expandTrigger || wrapper, bottomOffset);
  };
  return updateViewportWrapperBounds;
}
