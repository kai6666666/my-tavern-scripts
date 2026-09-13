// @ts-nocheck
/**
 * bind-floating-collapse-drag.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DICE_ROOT_SELECTOR } from '../../shared/constants';
export function createBindFloatingCollapseDrag(deps: any) {
  const bindFloatingCollapseDrag = ($trigger: JQuery<HTMLElement>): void => {
    if (!$trigger.length || !$trigger.hasClass('acu-col-floating')) return;
    const { $ } = deps.getCore();

    $trigger.off('keydown.acu_floating_collapse').on('keydown.acu_floating_collapse', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      $(this).trigger('click');
    });

    $trigger.off('pointerdown.acu_floating_collapse').on('pointerdown.acu_floating_collapse', function (e) {
      const pointerEvent = e.originalEvent as PointerEvent | undefined;
      if (!pointerEvent || typeof pointerEvent.clientX !== 'number' || typeof pointerEvent.clientY !== 'number') return;
      if (pointerEvent.pointerType === 'mouse' && pointerEvent.button !== 0) return;

      const triggerElement = this;
      const wrapper = triggerElement.closest<HTMLElement>(DICE_ROOT_SELECTOR);
      if (!wrapper) return;

      const targetWindow = deps.getTavernHostWindow();
      const targetDocument = wrapper.ownerDocument || deps.getTavernHostDocument();
      const wrapperRect = wrapper.getBoundingClientRect();
      const startPosition = deps.clampFloatingCollapsePosition(
        {
          left: wrapperRect.left,
          top: wrapperRect.top,
        },
        targetWindow,
        targetDocument,
      );
      const startClientX = pointerEvent.clientX;
      const startClientY = pointerEvent.clientY;
      let latestPosition = startPosition;
      let didDrag = false;

      e.preventDefault();
      e.stopPropagation();
      triggerElement.classList.add('acu-floating-dragging');
      triggerElement.setPointerCapture?.(pointerEvent.pointerId);

      const moveFloatingButton = (moveEvent: PointerEvent): void => {
        const deltaX = moveEvent.clientX - startClientX;
        const deltaY = moveEvent.clientY - startClientY;
        if (!didDrag && Math.hypot(deltaX, deltaY) >= deps.FLOATING_COLLAPSE_DRAG_THRESHOLD) {
          didDrag = true;
        }
        latestPosition = deps.clampFloatingCollapsePosition(
          {
            left: startPosition.left + deltaX,
            top: startPosition.top + deltaY,
          },
          targetWindow,
          targetDocument,
        );
        wrapper.style.setProperty('left', `${latestPosition.left}px`, 'important');
        wrapper.style.setProperty('top', `${latestPosition.top}px`, 'important');
      };

      const finishFloatingDrag = (upEvent: PointerEvent): void => {
        triggerElement.onpointermove = null;
        triggerElement.onpointerup = null;
        triggerElement.onpointercancel = null;
        triggerElement.classList.remove('acu-floating-dragging');
        triggerElement.releasePointerCapture?.(upEvent.pointerId);

        if (!didDrag) return;

        deps.setSuppressNextFloatingCollapseClick(true);
        window.setTimeout(() => {
          deps.setSuppressNextFloatingCollapseClick(false);
        }, 250);
        deps.saveConfig({ floatingCollapsePosition: latestPosition });
      };

      triggerElement.onpointermove = moveFloatingButton;
      triggerElement.onpointerup = finishFloatingDrag;
      triggerElement.onpointercancel = finishFloatingDrag;
    });
  };
  return bindFloatingCollapseDrag;
}
