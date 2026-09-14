// @ts-nocheck
/**
 * sortable-list.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSortableListFactory(deps: any) {
  const createSortableList = (options: SortableListOptions) => {
    const containerEl = options.container instanceof HTMLElement ? options.container : options.container[0];
    if (!containerEl) return;

    const ghostClass = options.ghostClass ?? 'acu-drag-ghost';
    const dragClass = options.dragClass ?? 'acu-dragging';
    const placeholderClass = options.placeholderClass ?? 'acu-drag-placeholder';
    const indicatorClass = options.indicatorClass ?? 'acu-drag-indicator';
    const longPressDelay = options.longPressDelay ?? 350;

    const state = {
      isDragging: false,
      draggedItem: null as HTMLElement | null,
      ghost: null as HTMLElement | null,
      indicator: null as HTMLElement | null,
      timer: null as number | null,
      startX: 0,
      startY: 0,
      pointerId: null as number | null,
      offsetX: 0,
      offsetY: 0,
      startOrder: [] as string[],
    };

    const buildOrder = () => {
      const ids: string[] = [];
      const items = containerEl.querySelectorAll<HTMLElement>(options.itemSelector);
      items.forEach(item => {
        const id = options.getItemId(item);
        if (id) ids.push(id);
      });
      return ids;
    };

    const clearTimer = () => {
      if (state.timer) {
        window.clearTimeout(state.timer);
        state.timer = null;
      }
    };

    const cleanupGhost = () => {
      if (state.ghost && state.ghost.parentElement) {
        state.ghost.parentElement.removeChild(state.ghost);
      }
      state.ghost = null;
    };

    const cleanupIndicator = () => {
      if (state.indicator && state.indicator.parentElement) {
        state.indicator.parentElement.removeChild(state.indicator);
      }
      state.indicator = null;
    };

    const updateGhostPosition = (clientX: number, clientY: number) => {
      if (!state.ghost) return;
      state.ghost.style.left = `${clientX - state.offsetX}px`;
      state.ghost.style.top = `${clientY - state.offsetY}px`;
    };

    const ensureIndicator = () => {
      if (!state.indicator) {
        const indicator = document.createElement('div');
        indicator.className = indicatorClass;
        state.indicator = indicator;
      }
      return state.indicator;
    };

    const placeIndicator = (clientY: number) => {
      if (!state.draggedItem) return;
      const items = Array.from(containerEl.querySelectorAll<HTMLElement>(options.itemSelector)).filter(
        item => item !== state.draggedItem,
      );
      let target: HTMLElement | null = null;
      let insertBefore = true;

      for (const item of items) {
        const rect = item.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        if (clientY < midY) {
          target = item;
          insertBefore = true;
          break;
        }
        if (clientY >= rect.top && clientY <= rect.bottom) {
          target = item;
          insertBefore = false;
        }
      }

      const indicator = ensureIndicator();
      if (target) {
        if (insertBefore) containerEl.insertBefore(indicator, target);
        else containerEl.insertBefore(indicator, target.nextSibling);
      } else {
        containerEl.appendChild(indicator);
      }
    };

    const startDrag = (
      item: HTMLElement,
      clientX: number,
      clientY: number,
      pointerId: number,
      captureEl: HTMLElement,
    ) => {
      if (state.isDragging) return;
      state.isDragging = true;
      state.draggedItem = item;
      state.pointerId = pointerId;
      state.startOrder = buildOrder();

      const rect = item.getBoundingClientRect();
      state.offsetX = clientX - rect.left;
      state.offsetY = clientY - rect.top;

      const ghost = item.cloneNode(true) as HTMLElement;
      ghost.classList.add(ghostClass);
      ghost.style.width = `${rect.width}px`;
      ghost.style.height = `${rect.height}px`;
      ghost.style.left = `${rect.left}px`;
      ghost.style.top = `${rect.top}px`;
      ghost.style.position = 'fixed';
      ghost.style.margin = '0';
      ghost.style.pointerEvents = 'none';
      document.body.appendChild(ghost);
      state.ghost = ghost;

      item.classList.add(placeholderClass);
      item.classList.add(dragClass);

      updateGhostPosition(clientX, clientY);
      placeIndicator(clientY);

      if (captureEl.setPointerCapture) {
        captureEl.setPointerCapture(pointerId);
      }
    };

    const finishDrag = () => {
      if (!state.isDragging || !state.draggedItem) {
        clearTimer();
        cleanupIndicator();
        cleanupGhost();
        return;
      }

      if (state.indicator && state.indicator.parentElement === containerEl) {
        containerEl.replaceChild(state.draggedItem, state.indicator);
      }

      const finalRect = state.draggedItem.getBoundingClientRect();
      const draggedItem = state.draggedItem;
      const ghost = state.ghost;
      if (ghost) {
        ghost.style.transition = 'left 0.18s ease, top 0.18s ease, opacity 0.18s ease';
        ghost.style.left = `${finalRect.left}px`;
        ghost.style.top = `${finalRect.top}px`;
        ghost.style.opacity = '0';
        window.setTimeout(() => {
          if (ghost.parentElement) ghost.parentElement.removeChild(ghost);
        }, 180);
      }

      window.setTimeout(() => {
        draggedItem.classList.remove(placeholderClass);
        draggedItem.classList.remove(dragClass);
      }, 180);

      cleanupIndicator();
      if (!ghost) cleanupGhost();

      const newOrder = buildOrder();
      const orderChanged = state.startOrder.join('|') !== newOrder.join('|');

      state.isDragging = false;
      state.draggedItem = null;
      state.pointerId = null;
      state.startOrder = [];
      clearTimer();

      if (orderChanged) options.onOrderChange(newOrder);
    };

    containerEl.addEventListener(
      'pointerdown',
      e => {
        const target = e.target as HTMLElement | null;
        if (!target) return;
        if (options.cancelSelector && target.closest(options.cancelSelector)) return;
        if (options.canStartDrag && !options.canStartDrag()) return;

        const item = target.closest(options.itemSelector) as HTMLElement | null;
        if (!item) return;

        const handle = options.handleSelector ? (target.closest(options.handleSelector) as HTMLElement | null) : null;

        if (handle) {
          e.preventDefault();
          startDrag(item, e.clientX, e.clientY, e.pointerId, handle);
          return;
        }

        if (!options.handleSelector) {
          e.preventDefault();
          startDrag(item, e.clientX, e.clientY, e.pointerId, item);
          return;
        }

        state.startX = e.clientX;
        state.startY = e.clientY;
        state.pointerId = e.pointerId;
        clearTimer();
        state.timer = window.setTimeout(() => {
          startDrag(item, state.startX, state.startY, state.pointerId ?? e.pointerId, item);
        }, longPressDelay);
      },
      { passive: false },
    );

    containerEl.addEventListener(
      'pointermove',
      e => {
        if (state.timer && (Math.abs(e.clientY - state.startY) > 8 || Math.abs(e.clientX - state.startX) > 8)) {
          clearTimer();
        }

        if (!state.isDragging || !state.draggedItem) return;
        e.preventDefault();
        updateGhostPosition(e.clientX, e.clientY);
        placeIndicator(e.clientY);
      },
      { passive: false },
    );

    containerEl.addEventListener('pointerup', finishDrag);
    containerEl.addEventListener('pointercancel', finishDrag);
    containerEl.addEventListener(
      'touchmove',
      e => {
        if (state.isDragging) {
          e.preventDefault();
        }
      },
      { passive: false },
    );
  };
  return createSortableList;
}
