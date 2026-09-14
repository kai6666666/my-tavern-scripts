// @ts-nocheck
/**
 * bind-global-interaction-events.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DICE_ROOT_SELECTOR } from '../../shared/constants';
import { Store } from '../../shared/storage/store';
export function createBindGlobalInteractionEvents(deps: any) {
  const bindGlobalInteractionEvents = ($panel: JQuery<HTMLElement>): void => {
    const { $ } = deps.getCore();
    const panelDocument = $panel[0]?.ownerDocument || document;
    const panelWindow = panelDocument.defaultView || window;

    deps.clearGlobalInteractionOutsideCapture();
    $panel.off('.globalInteractionEvents');
    $('body').off('click.globalInteractionEvents', '.acu-global-interaction-row-title.acu-dash-preview-trigger');
    $(window).off('resize.globalInteractionEvents scroll.globalInteractionEvents');
    if (panelWindow !== window) $(panelWindow).off('resize.globalInteractionEvents scroll.globalInteractionEvents');
    $(panelDocument).off('click.globalInteractionEvents');
    $(panelDocument).find('.acu-global-interaction-floating-host').remove();
    deps.hydrateGlobalInteractionAvatars($panel);

    const $noResults = $panel.find('.acu-global-interaction-no-results');
    $noResults.prop('hidden', true);
    deps.debugGlobalInteraction('bind-events', {
      panelFound: $panel.length > 0,
      rowCount: $panel.find('.acu-global-interaction-row').length,
      buttonCount: $panel.find('.acu-global-interaction-row-main').length,
      actionButtonCount: $panel.find('.acu-global-interaction-action').length,
      groupCount: $panel.find('.acu-global-interaction-group').length,
      noResultsHidden: Boolean($noResults.prop('hidden')),
      noResultsDisplay: $noResults[0] ? getComputedStyle($noResults[0]).display : null,
      searchValue: String($panel.find('.acu-global-interaction-search').val() || ''),
    });

    const logNoResultsState = (event: string): void => {
      const noResults = $panel.find<HTMLElement>('.acu-global-interaction-no-results')[0];
      const noResultsStyle = noResults ? getComputedStyle(noResults) : null;
      deps.debugGlobalInteraction(event, {
        rowCount: $panel.find('.acu-global-interaction-row').length,
        visibleRowCount: $panel
          .find('.acu-global-interaction-row')
          .toArray()
          .filter(row => $(row).css('display') !== 'none').length,
        groupCount: $panel.find('.acu-global-interaction-group').length,
        iconButtonCount: $panel.find('.acu-global-interaction-row-main').length,
        actionButtonCount: $panel.find('.acu-global-interaction-action').length,
        searchValue: String($panel.find<HTMLInputElement>('.acu-global-interaction-search').val() || ''),
        noResultsHidden: noResults?.hidden ?? null,
        noResultsDisplay: noResultsStyle?.display ?? null,
        noResultsText: noResults?.textContent?.trim() || '',
      });
    };

    logNoResultsState('bind:start');
    $panel.find('.acu-global-interaction-no-results').prop('hidden', true);

    $panel.on(
      'pointerdown.globalInteractionEvents',
      '.acu-height-control',
      function (this: HTMLElement, e: JQuery.Event) {
        const pointerEvent = e.originalEvent as PointerEvent | undefined;
        if (!pointerEvent || typeof pointerEvent.pointerId !== 'number' || pointerEvent.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();

        const controlEl = this;
        const $control = $(controlEl);
        const $handle = $control.find('.acu-height-drag-handle').first();
        const tableName = String($control.attr('data-table') || $handle.attr('data-table') || '交互总览').trim();
        controlEl.setPointerCapture(pointerEvent.pointerId);
        $control.add($handle).addClass('active');

        const startHeight = deps.getPanelDragStartHeight($panel);
        let requestedHeight = startHeight;
        const startY = pointerEvent.clientY;

        controlEl.onpointermove = (moveEvent: PointerEvent): void => {
          const dy = moveEvent.clientY - startY;
          requestedHeight = deps.setPanelRequestedHeight($panel, startHeight - dy) || requestedHeight;
        };
        controlEl.onpointerup = (upEvent: PointerEvent): void => {
          $control.add($handle).removeClass('active');
          controlEl.releasePointerCapture(upEvent.pointerId);
          controlEl.onpointermove = null;
          controlEl.onpointerup = null;
          deps.savePanelRequestedHeight(tableName, requestedHeight);
        };
      },
    );

    $panel.on('dblclick.globalInteractionEvents', '.acu-height-control', function (this: HTMLElement, e: JQuery.Event) {
      e.preventDefault();
      e.stopPropagation();

      const $control = $(this);
      const $handle = $control.find('.acu-height-drag-handle').first();
      const tableName = String($control.attr('data-table') || $handle.attr('data-table') || '交互总览').trim();
      deps.resetPanelRequestedHeight($panel, tableName);
    });

    const describeTarget = (target: EventTarget | null): Record<string, unknown> => {
      const element = target instanceof Element ? target : null;
      const row = element?.closest<HTMLElement>('.acu-global-interaction-row') || null;
      const button = element?.closest<HTMLElement>('.acu-global-interaction-row-main') || null;
      return {
        tag: element?.tagName || '',
        className: element?.className ? String(element.className) : '',
        rowIndex: row ? deps.safeDecodeURIComponent(row.getAttribute('data-row-index') || '') : '',
        rowExpanded: row?.classList.contains('is-expanded') ?? null,
        iconButtonFound: Boolean(button),
        buttonAriaExpanded: button?.getAttribute('aria-expanded') || '',
      };
    };

    const debugPanelPointerEvent = (event: PointerEvent | MouseEvent): void => {
      const targetInfo = describeTarget(event.target);
      if (!targetInfo.iconButtonFound && !targetInfo.rowIndex) return;
      deps.debugGlobalInteraction(`capture:${event.type}`, {
        ...targetInfo,
        clientX: event.clientX,
        clientY: event.clientY,
        defaultPrevented: event.defaultPrevented,
      });
    };

    const panelElForDebug = $panel[0];
    if (panelElForDebug) {
      panelElForDebug.addEventListener('pointerdown', debugPanelPointerEvent, true);
      panelElForDebug.addEventListener('click', debugPanelPointerEvent, true);
      $(window).on('pagehide.globalInteractionDebug', () => {
        panelElForDebug.removeEventListener('pointerdown', debugPanelPointerEvent, true);
        panelElForDebug.removeEventListener('click', debugPanelPointerEvent, true);
      });
    }

    const showInvalidInteractionWarning = (): void => {
      if (window.toastr) window.toastr.warning('交互目标已失效，请刷新数据后重试');
    };

    const resolveFreshInteractionTarget = (
      $button: JQuery,
    ): { action: GlobalInteractionAction; headers: unknown[]; rowData: unknown[] } | null => {
      const tableKey = deps.safeDecodeURIComponent($button.attr('data-table-key') || '').trim();
      const rowIndex = Number.parseInt(deps.safeDecodeURIComponent($button.attr('data-row-index') || ''), 10);
      const actionLabel = deps.safeDecodeURIComponent($button.attr('data-action-label') || '').trim();
      const actionIndex = Number.parseInt(deps.safeDecodeURIComponent($button.attr('data-action-index') || ''), 10);
      if (!tableKey || !Number.isInteger(rowIndex) || rowIndex < 0) return null;

      const rawData = deps.getCachedRawData() || deps.getTableData();
      if (!deps.isRecord(rawData)) return null;

      const sheet = rawData[tableKey];
      if (!deps.isRecord(sheet) || typeof sheet.name !== 'string' || !deps.isTwoDimensionalArray(sheet.content)) return null;

      const headers = sheet.content[0] || [];
      const rowData = sheet.content[rowIndex + 1];
      if (!Array.isArray(headers) || !Array.isArray(rowData)) return null;

      const actions = deps.dedupeInteractionActions(deps.getInteractOptionsForRow(sheet.name, headers, rowData));
      const normalizedLabel = deps.normalizeInteractionLabel(actionLabel);
      const actionByLabel = normalizedLabel
        ? actions.find(action => deps.normalizeInteractionLabel(action.label) === normalizedLabel)
        : undefined;
      const actionByIndex = Number.isInteger(actionIndex) && actionIndex >= 0 ? actions[actionIndex] : undefined;
      const action = actionByLabel || actionByIndex;
      return action ? { action, headers, rowData } : null;
    };

    (function () {
      const panelEl = $panel[0] as (HTMLElement & { _globalInteractionSwipeFixApplied?: boolean }) | undefined;
      if (!panelEl || panelEl._globalInteractionSwipeFixApplied) return;
      panelEl._globalInteractionSwipeFixApplied = true;

      let touchStartX = 0;
      let touchStartY = 0;
      let isHorizontalSwipe = false;

      const onTouchStart = (e: TouchEvent): void => {
        if (e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          isHorizontalSwipe = false;
        }
      };

      const onTouchMove = (e: TouchEvent): void => {
        if (e.touches.length !== 1) return;

        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - touchStartX);
        const deltaY = Math.abs(touch.clientY - touchStartY);
        const isHorizontal = deltaY < 5 ? deltaX > 5 && deltaX > deltaY * 2 : deltaX > deltaY * 1.5 && deltaX > 10;

        if (isHorizontal) {
          isHorizontalSwipe = true;
          e.stopImmediatePropagation();
          e.stopPropagation();
        }
      };

      const onTouchEnd = (e: TouchEvent): void => {
        if (isHorizontalSwipe) {
          e.stopImmediatePropagation();
          e.stopPropagation();
          isHorizontalSwipe = false;
        }
        touchStartX = 0;
        touchStartY = 0;
      };

      panelEl.addEventListener('touchstart', onTouchStart, true);
      panelEl.addEventListener('touchmove', onTouchMove, true);
      panelEl.addEventListener('touchend', onTouchEnd, true);

      $(window).on('pagehide.globalInteractionSwipeFix', () => {
        panelEl.removeEventListener('touchstart', onTouchStart, true);
        panelEl.removeEventListener('touchmove', onTouchMove, true);
        panelEl.removeEventListener('touchend', onTouchEnd, true);
      });
    })();

    $panel.on('click.globalInteractionEvents', '.acu-close-btn', function (e) {
      e.stopPropagation();
      e.preventDefault();
      collapseExpandedGlobalInteractionRows();
      $(panelDocument).find('.acu-global-interaction-floating-host').remove();
      deps.closePanel($panel.closest<HTMLElement>(DICE_ROOT_SELECTOR));
    });

    deps.bindCompositionSafeSearchInput(
      { root: $panel, selector: '.acu-global-interaction-search', namespace: 'globalInteractionEvents' },
      {
        delay: 120,
        onCommit: ({ value }) => {
          const query = value.trim().toLowerCase();
          let visibleRowCount = 0;

          $panel.find('.acu-global-interaction-row').each(function () {
            const $row = $(this);
            const searchText = deps.safeDecodeURIComponent($row.attr('data-search-text') || '').toLowerCase();
            const isVisible = !query || searchText.includes(query);
            $row.toggle(isVisible);
            if (!isVisible) {
              clearGlobalInteractionDetailsPlacement($row);
              $row.removeClass('is-expanded').find('.acu-global-interaction-row-main').attr('aria-expanded', 'false');
            }
            if (isVisible) visibleRowCount += 1;
          });

          $panel.find('.acu-global-interaction-group').each(function () {
            const $group = $(this);
            const hasVisibleRows = $group
              .find('.acu-global-interaction-row')
              .toArray()
              .some(row => $(row).css('display') !== 'none');
            $group.toggle(hasVisibleRows);
          });

          $panel.find('.acu-global-interaction-section').each(function () {
            const $section = $(this);
            const hasVisibleGroups = $section
              .find('.acu-global-interaction-group')
              .toArray()
              .some(group => $(group).css('display') !== 'none');
            $section.toggle(hasVisibleGroups);
          });

          $panel.find('.acu-global-interaction-no-results').prop('hidden', !query || visibleRowCount > 0);
          const $currentNoResults = $panel.find('.acu-global-interaction-no-results');
          deps.debugGlobalInteraction('search-commit', {
            query,
            totalRowCount: $panel.find('.acu-global-interaction-row').length,
            visibleRowCount,
            visibleGroupCount: $panel
              .find('.acu-global-interaction-group')
              .toArray()
              .filter(group => $(group).css('display') !== 'none').length,
            noResultsHidden: Boolean($currentNoResults.prop('hidden')),
            noResultsDisplay: $currentNoResults[0] ? getComputedStyle($currentNoResults[0]).display : null,
          });
        },
      },
    );

    let globalInteractionFloatingMenuCounter = 0;

    const getGlobalInteractionFloatingHost = (): HTMLElement => {
      const root = $panel.closest<HTMLElement>(DICE_ROOT_SELECTOR)[0];
      let host = panelDocument.querySelector<HTMLElement>('.acu-global-interaction-floating-host');
      if (!host) {
        host = panelDocument.createElement('div');
        (panelDocument.body || panelDocument.documentElement).appendChild(host);
      }

      const themeClasses = root
        ? Array.from(root.classList).filter(className => className.startsWith('acu-theme-'))
        : [];
      host.className = ['acu-global-interaction-floating-host', ...themeClasses].join(' ');
      host.style.position = 'fixed';
      host.style.inset = '0';
      host.style.zIndex = '31420';
      host.style.pointerEvents = 'none';

      const sourceStyle = panelWindow.getComputedStyle(root || $panel[0] || panelDocument.documentElement);
      [
        '--acu-bg-panel',
        '--acu-card-bg',
        '--acu-border',
        '--acu-accent',
        '--acu-text-main',
        '--acu-text-sub',
        '--acu-btn-active-text',
        '--acu-button-text-on-accent',
      ].forEach(propertyName => {
        const propertyValue = sourceStyle.getPropertyValue(propertyName);
        if (propertyValue) host.style.setProperty(propertyName, propertyValue);
      });

      return host;
    };

    const ensureGlobalInteractionFloatingMenuId = ($row: JQuery<HTMLElement>): string => {
      const currentId = String($row.attr('data-floating-menu-id') || '');
      if (currentId) return currentId;
      globalInteractionFloatingMenuCounter += 1;
      const nextId = `global-interaction-menu-${Date.now()}-${globalInteractionFloatingMenuCounter}`;
      $row.attr('data-floating-menu-id', nextId);
      return nextId;
    };

    const findGlobalInteractionDetails = ($row: JQuery<HTMLElement>): HTMLElement | null => {
      const localDetails = $row.find<HTMLElement>('.acu-global-interaction-details')[0];
      if (localDetails) return localDetails;
      const menuId = String($row.attr('data-floating-menu-id') || '');
      if (!menuId) return null;
      return ($row[0]?.ownerDocument || panelDocument).querySelector<HTMLElement>(
        `.acu-global-interaction-details[data-floating-menu-id="${menuId}"]`,
      );
    };

    const restoreGlobalInteractionDetails = ($row: JQuery<HTMLElement>, details: HTMLElement): void => {
      if (details.parentElement?.classList.contains('acu-global-interaction-floating-host')) {
        $row[0]?.appendChild(details);
      }
      details.classList.remove('is-floating');
      details.removeAttribute('data-floating-menu-id');
    };

    const clearGlobalInteractionDetailsPlacement = ($row: JQuery<HTMLElement>): void => {
      const details = findGlobalInteractionDetails($row);
      if (!details) return;
      restoreGlobalInteractionDetails($row, details);
      details.style.removeProperty('position');
      details.style.removeProperty('left');
      details.style.removeProperty('top');
      details.style.removeProperty('right');
      details.style.removeProperty('bottom');
      details.style.removeProperty('min-width');
      details.style.removeProperty('max-width');
      details.style.removeProperty('max-height');
      details.style.removeProperty('overflow-y');
      details.style.removeProperty('transform');
      details.style.removeProperty('visibility');
      details.style.removeProperty('display');
      details.style.removeProperty('flex-direction');
      details.style.removeProperty('gap');
      details.style.removeProperty('pointer-events');
      details.style.removeProperty('z-index');
    };

    const collapseExpandedGlobalInteractionRows = (): void => {
      $panel
        .find<HTMLElement>('.acu-global-interaction-row.is-expanded')
        .each(function () {
          clearGlobalInteractionDetailsPlacement($(this));
        })
        .removeClass('is-expanded')
        .find('.acu-global-interaction-row-main')
        .attr('aria-expanded', 'false');
    };

    $panel.on('click.globalInteractionEvents', '.acu-global-interaction-section-header', function (event) {
      event.stopPropagation();
      event.preventDefault();
      collapseExpandedGlobalInteractionRows();

      const $header = $(this);
      const $section = $header.closest<HTMLElement>('.acu-global-interaction-section');
      const $body = $section.find<HTMLElement>('.acu-global-interaction-section-body').first();
      const $icon = $header.find('.acu-collapse-icon');
      const sectionKind = String($header.attr('data-section-kind') || '').trim();
      const collapsedSections = deps.getGlobalInteractionCollapsedSections();

      if ($section.hasClass('collapsed')) {
        $section.removeClass('collapsed');
        $header.attr('aria-expanded', 'true');
        $body.slideDown(200);
        $icon.removeClass('fa-chevron-right').addClass('fa-chevron-down');
        Store.set(
          deps.STORAGE_KEY_GLOBAL_INTERACTION_COLLAPSED_SECTIONS,
          collapsedSections.filter(kind => kind !== sectionKind),
        );
        return;
      }

      $section.addClass('collapsed');
      $header.attr('aria-expanded', 'false');
      $body.slideUp(200);
      $icon.removeClass('fa-chevron-down').addClass('fa-chevron-right');
      if (sectionKind && !collapsedSections.includes(sectionKind)) {
        Store.set(deps.STORAGE_KEY_GLOBAL_INTERACTION_COLLAPSED_SECTIONS, [...collapsedSections, sectionKind]);
      }
    });

    const applyGlobalInteractionDetailsPlacement = ($row: JQuery<HTMLElement>): void => {
      const rowElement = $row[0];
      const details = findGlobalInteractionDetails($row);
      const iconButton = $row.find<HTMLElement>('.acu-global-interaction-row-main')[0];
      if (!rowElement || !details || !iconButton || !$row.hasClass('is-expanded')) return;

      clearGlobalInteractionDetailsPlacement($row);

      try {
        const menuId = ensureGlobalInteractionFloatingMenuId($row);
        const floatingHost = getGlobalInteractionFloatingHost();
        details.setAttribute('data-floating-menu-id', menuId);
        details.classList.add('is-floating');
        floatingHost.appendChild(details);
        details.style.display = 'flex';
        details.style.flexDirection = 'column';
        details.style.gap = '4px';
        details.style.pointerEvents = 'auto';
        details.style.zIndex = '31421';

        const detailsDocument = rowElement.ownerDocument || panelDocument;
        const detailsWindow = detailsDocument.defaultView || panelWindow;
        const viewportWidth = detailsWindow.innerWidth || detailsDocument.documentElement.clientWidth;
        const viewportHeight = detailsWindow.innerHeight || detailsDocument.documentElement.clientHeight;
        const contentPanel = rowElement.closest<HTMLElement>('.acu-global-interaction-panel');
        const panelRect = (contentPanel || $panel[0])?.getBoundingClientRect();
        const anchorRect = iconButton.getBoundingClientRect();
        const margin = 8;
        const gap = 8;
        const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);
        const boundaryLeft = Math.max(panelRect?.left ?? 0, 0) + margin;
        const boundaryTop = Math.max(panelRect?.top ?? 0, 0) + margin;
        const boundaryRight = Math.min(panelRect?.right ?? viewportWidth, viewportWidth) - margin;
        const boundaryBottom = Math.min(panelRect?.bottom ?? viewportHeight, viewportHeight) - margin;
        const availableWidth = Math.max(120, boundaryRight - boundaryLeft);

        details.style.position = 'fixed';
        details.style.left = '0px';
        details.style.top = '0px';
        details.style.minWidth = `${Math.min(188, availableWidth)}px`;
        details.style.maxWidth = `${Math.min(260, availableWidth)}px`;
        details.style.removeProperty('max-height');
        details.style.removeProperty('overflow-y');
        details.style.visibility = 'hidden';

        const naturalRect = details.getBoundingClientRect();
        const downSpace = Math.max(0, boundaryBottom - anchorRect.bottom - gap);
        const upSpace = Math.max(0, anchorRect.top - boundaryTop - gap);
        const shouldOpenUp = naturalRect.height > downSpace && upSpace > downSpace;
        const availableHeight = shouldOpenUp ? upSpace : downSpace;
        const constrainedHeight = Math.floor(availableHeight);

        if (constrainedHeight > 0 && naturalRect.height > constrainedHeight) {
          details.style.maxHeight = `${constrainedHeight}px`;
          details.style.overflowY = 'auto';
        }

        const detailsRect = details.getBoundingClientRect();
        const popupWidth = Math.min(detailsRect.width, availableWidth);
        const popupHeight = Math.min(
          detailsRect.height,
          constrainedHeight > 0 ? constrainedHeight : detailsRect.height,
        );
        const left = clamp(
          anchorRect.left + anchorRect.width / 2 - popupWidth / 2,
          boundaryLeft,
          Math.max(boundaryLeft, boundaryRight - popupWidth),
        );
        const preferredTop = shouldOpenUp ? anchorRect.top - popupHeight - gap : anchorRect.bottom + gap;
        const top = clamp(preferredTop, boundaryTop, Math.max(boundaryTop, boundaryBottom - popupHeight));

        details.style.left = `${Math.round(left)}px`;
        details.style.top = `${Math.round(top)}px`;
        details.style.visibility = 'visible';
      } catch {
        clearGlobalInteractionDetailsPlacement($row);
      }
    };

    const updateExpandedGlobalInteractionDetailsPlacement = (): void => {
      const $expandedRow = $panel.find<HTMLElement>('.acu-global-interaction-row.is-expanded').first();
      if ($expandedRow.length === 0) return;
      applyGlobalInteractionDetailsPlacement($expandedRow);
    };

    const $contentPanel = $panel.find('.acu-global-interaction-panel');
    $contentPanel
      .off('scroll.globalInteractionEvents')
      .on('scroll.globalInteractionEvents', updateExpandedGlobalInteractionDetailsPlacement);
    $(panelWindow).on(
      'resize.globalInteractionEvents scroll.globalInteractionEvents',
      updateExpandedGlobalInteractionDetailsPlacement,
    );

    const toggleGlobalInteractionRow = ($row: JQuery<HTMLElement>): void => {
      const detailsBefore = $row.find<HTMLElement>('.acu-global-interaction-details')[0];
      const iconButton = $row.find<HTMLElement>('.acu-global-interaction-row-main')[0];
      const shouldExpand = !$row.hasClass('is-expanded');
      deps.debugGlobalInteraction('toggle:before', {
        shouldExpand,
        rowIndex: deps.safeDecodeURIComponent($row.attr('data-row-index') || ''),
        tableKey: deps.safeDecodeURIComponent($row.attr('data-table-key') || ''),
        rowClass: String($row.attr('class') || ''),
        buttonAriaExpanded: iconButton?.getAttribute('aria-expanded') || '',
        detailsDisplay: detailsBefore ? panelWindow.getComputedStyle(detailsBefore).display : null,
        detailsRect: detailsBefore ? detailsBefore.getBoundingClientRect().toJSON() : null,
      });
      collapseExpandedGlobalInteractionRows();
      if (shouldExpand) {
        $row.addClass('is-expanded').find('.acu-global-interaction-row-main').attr('aria-expanded', 'true');
        applyGlobalInteractionDetailsPlacement($row);
      }
      const detailsAfter = $row.find<HTMLElement>('.acu-global-interaction-details')[0];
      const rowElement = $row[0];
      const rowStyle = rowElement ? panelWindow.getComputedStyle(rowElement) : null;
      deps.debugGlobalInteraction('toggle:after', {
        rowExpanded: $row.hasClass('is-expanded'),
        buttonAriaExpanded: iconButton?.getAttribute('aria-expanded') || '',
        detailsDisplay: detailsAfter ? panelWindow.getComputedStyle(detailsAfter).display : null,
        detailsRect: detailsAfter ? detailsAfter.getBoundingClientRect().toJSON() : null,
        rowBackground: rowStyle?.backgroundColor ?? null,
        rowBorderWidth: rowStyle?.borderWidth ?? null,
        rowBoxShadow: rowStyle?.boxShadow ?? null,
      });
    };

    const handleGlobalInteractionPreviewTitleClick = function (): void {
      collapseExpandedGlobalInteractionRows();
    };

    $('body').on(
      'click.globalInteractionEvents',
      '.acu-global-interaction-row-title.acu-dash-preview-trigger',
      handleGlobalInteractionPreviewTitleClick,
    );

    const getEventElement = (target: EventTarget | null): Element | null => {
      if (!target) return null;
      const node = target as Node;
      if (typeof node.nodeType !== 'number') return null;
      return node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
    };

    const handleGlobalInteractionOutsideCapture = (event: Event): void => {
      const target = getEventElement(event.target);
      if (!target || $panel.find('.acu-global-interaction-row.is-expanded').length === 0) return;
      if (target.closest('.acu-global-interaction-row-main')) return;
      if (target.closest('.acu-global-interaction-details')) return;
      collapseExpandedGlobalInteractionRows();
    };

    panelDocument.addEventListener('pointerdown', handleGlobalInteractionOutsideCapture, true);
    panelDocument.addEventListener('mousedown', handleGlobalInteractionOutsideCapture, true);
    panelDocument.addEventListener('touchstart', handleGlobalInteractionOutsideCapture, true);
    deps.setCleanupGlobalInteractionOutsideCapture(() => {
      panelDocument.removeEventListener('pointerdown', handleGlobalInteractionOutsideCapture, true);
      panelDocument.removeEventListener('mousedown', handleGlobalInteractionOutsideCapture, true);
      panelDocument.removeEventListener('touchstart', handleGlobalInteractionOutsideCapture, true);
    });

    $(panelDocument).on('click.globalInteractionEvents', function (event) {
      const target = event.target instanceof Element ? event.target : null;
      if (!target || $panel.find('.acu-global-interaction-row.is-expanded').length === 0) return;
      if (target.closest('.acu-global-interaction-row-main')) return;
      if (target.closest('.acu-global-interaction-details')) return;
      collapseExpandedGlobalInteractionRows();
    });

    $panel.on('click.globalInteractionEvents', '.acu-global-interaction-row-main', function (event) {
      deps.debugGlobalInteraction('icon:onclick', {
        rowIndex: deps.safeDecodeURIComponent($(this).closest('.acu-global-interaction-row').attr('data-row-index') || ''),
        targetTag: event.target instanceof Element ? event.target.tagName : '',
        targetClass: event.target instanceof Element ? String(event.target.className || '') : '',
        defaultPreventedBefore: event.isDefaultPrevented(),
      });
      event.stopPropagation();
      event.preventDefault();
      toggleGlobalInteractionRow($(this).closest<HTMLElement>('.acu-global-interaction-row'));
    });

    const handleGlobalInteractionActionClick = function (this: HTMLElement, e: JQuery.ClickEvent): void {
      e.stopPropagation();
      e.preventDefault();

      const target = resolveFreshInteractionTarget($(this));
      if (!target) {
        showInvalidInteractionWarning();
        return;
      }

      deps.executeTableInteractionAction(target.action, target.headers, target.rowData);
    };

    $panel.on('click.globalInteractionEvents', '.acu-global-interaction-action', handleGlobalInteractionActionClick);
    $(panelDocument).on(
      'click.globalInteractionEvents',
      '.acu-global-interaction-floating-host .acu-global-interaction-action',
      handleGlobalInteractionActionClick,
    );

    $panel.on(
      'click.globalInteractionEvents',
      '.acu-panel-tutorial-btn[data-tutorial-scope="globalInteractions"]',
      function (e) {
        e.stopPropagation();
        e.preventDefault();
        deps.startTutorialFromButton(this);
      },
    );

    $panel.on('click.globalInteractionEvents', '.acu-global-interaction-rules-btn', function (e) {
      e.stopPropagation();
      e.preventDefault();
      deps.showActionPresetManager();
    });

    deps.bindTutorialButtonsIn($panel);
  };
  return bindGlobalInteractionEvents;
}
