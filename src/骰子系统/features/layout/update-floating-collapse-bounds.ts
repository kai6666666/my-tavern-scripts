// @ts-nocheck
/**
 * update-floating-collapse-bounds.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DICE_ROOT_SELECTOR } from '../../shared/constants';
export function createUpdateFloatingCollapseBounds(deps: any) {
  const updateFloatingCollapseBounds = (persist = false): void => {
    const config = deps.getConfig();
    if (!deps.isFloatingCollapseActive(config)) return;

    const targetWindow = deps.getTavernHostWindow();
    const targetDocument = deps.getTavernHostDocument();
    const wrapper =
      targetDocument.querySelector<HTMLElement>(`${DICE_ROOT_SELECTOR}.acu-collapse-floating`) ||
      document.querySelector<HTMLElement>(`${DICE_ROOT_SELECTOR}.acu-collapse-floating`);
    if (!wrapper) return;

    if (wrapper.ownerDocument !== targetDocument || wrapper.parentElement !== targetDocument.body) {
      targetDocument.body.appendChild(wrapper);
    }

    const nextPosition = deps.clampFloatingCollapsePosition(
      deps.getFloatingCollapsePosition(config),
      targetWindow,
      targetDocument,
    );

    wrapper.style.setProperty('position', 'fixed', 'important');
    wrapper.style.setProperty('left', `${nextPosition.left}px`, 'important');
    wrapper.style.setProperty('top', `${nextPosition.top}px`, 'important');
    wrapper.style.setProperty('right', 'auto', 'important');
    wrapper.style.setProperty('bottom', 'auto', 'important');
    wrapper.style.setProperty('width', `${deps.FLOATING_COLLAPSE_SIZE}px`, 'important');
    wrapper.style.setProperty('max-width', `${deps.FLOATING_COLLAPSE_SIZE}px`, 'important');
    wrapper.style.setProperty('height', `${deps.FLOATING_COLLAPSE_SIZE}px`, 'important');
    wrapper.style.setProperty('display', 'block', 'important');
    wrapper.style.setProperty('visibility', 'visible', 'important');
    wrapper.style.setProperty('opacity', '1', 'important');
    wrapper.style.setProperty('margin', '0', 'important');
    wrapper.style.setProperty('transform', 'none', 'important');
    wrapper.style.setProperty('overflow', 'visible', 'important');
    wrapper.style.setProperty('pointer-events', 'none', 'important');
    wrapper.style.setProperty('z-index', '1000', 'important');

    const expandTrigger = wrapper.querySelector<HTMLElement>('.acu-expand-trigger.acu-col-floating');
    if (expandTrigger) {
      expandTrigger.style.setProperty('display', 'flex', 'important');
      expandTrigger.style.setProperty('visibility', 'visible', 'important');
      expandTrigger.style.setProperty('opacity', '1', 'important');
      expandTrigger.style.setProperty('pointer-events', 'auto', 'important');
      expandTrigger.style.setProperty('width', `${deps.FLOATING_COLLAPSE_SIZE}px`, 'important');
      expandTrigger.style.setProperty('height', `${deps.FLOATING_COLLAPSE_SIZE}px`, 'important');
    }

    if (persist) {
      deps.saveConfig({ floatingCollapsePosition: nextPosition });
    }
  };
  return updateFloatingCollapseBounds;
}
