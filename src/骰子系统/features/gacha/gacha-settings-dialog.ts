// @ts-nocheck
/**
 * gacha-settings-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ALL_POOL_TAG, GACHA_CUSTOM_ONLY_POOL_TAG, normalizeGachaPoolId } from './gacha-helpers';
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowGachaSettingsDialog(deps: any) {
  const showGachaSettingsDialog = async () => {
    const { $ } = deps.getCore();
    const rawData = deps.getCachedRawData() || deps.getTableData();
    await deps.ensureGachaCatalogLoaded(rawData);
    $('.acu-gacha-settings-overlay').remove();

    const config = deps.getConfig();
    const selectedSettingsPoolId = deps.getStoredGachaSettingsPoolTag(rawData);
    const overlay = $(`
      <div class="acu-edit-overlay acu-gacha-settings-overlay acu-theme-${config.theme} ${config.showHorizontalScrollbar === true ? 'acu-show-horizontal-scrollbar' : ''}">
        <div class="acu-edit-dialog acu-gacha-settings-dialog">
          <div class="acu-gacha-settings-header">
            <div class="acu-gacha-settings-title"><i class="fa-solid fa-sliders"></i> 骰子商城设置</div>
            <div class="acu-gacha-settings-header-actions">
              ${deps.getTutorialButtonHtml('gachaSettings', '查看骰子商城设置教程', 'acu-help-btn')}
              <button class="acu-close-btn acu-gacha-settings-close" type="button" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>
          <div class="acu-gacha-settings-body">
            <section class="acu-gacha-settings-section">
              <div class="acu-gacha-settings-section-head">
                <div>
                  <strong>卡池管理</strong>
                </div>
              </div>
              <div class="acu-gacha-settings-pool-list" id="acu-gacha-settings-pool-list">
                ${deps.renderGachaPoolSettingsListHtml(rawData)}
              </div>
            </section>
            ${deps.renderGachaSettingsPoolViewerHtml(rawData, selectedSettingsPoolId)}
          </div>
          <div class="acu-gacha-settings-footer">
            <button class="acu-dialog-btn acu-btn-confirm acu-gacha-pool-new" type="button"><i class="fa-solid fa-plus"></i> 新建卡池</button>
            <button class="acu-dialog-btn acu-gacha-item-new" type="button"><i class="fa-solid fa-plus"></i> 新建物品</button>
            <button class="acu-dialog-btn acu-gacha-settings-prompt" type="button" title="下载给 AI 生成骰子商店物品 JSON 的提示词"><i class="fa-solid fa-file-arrow-down"></i> 下载 AI 提示词</button>
            <button class="acu-dialog-btn acu-gacha-settings-import" type="button"><i class="fa-solid fa-file-import"></i> 导入 JSON</button>
            <button class="acu-dialog-btn acu-gacha-settings-export" type="button"><i class="fa-solid fa-file-export"></i> 导出 JSON</button>
            <button class="acu-dialog-btn acu-gacha-settings-clear danger" type="button"><i class="fa-solid fa-broom"></i> 清空自定义</button>
          </div>
        </div>
      </div>
    `);

    $('body').append(overlay);
    deps.hydrateCustomTableNameIconsIn(overlay);
    deps.bindTutorialButtonsIn(overlay);

    const closeSettings = () => {
      overlay.remove();
      deps.refreshGachaVisualization(rawData);
      deps.refreshGachaShardShop();
    };
    const settingsItemFilters: GachaSettingsItemFilterState = { ...deps.DEFAULT_GACHA_SETTINGS_ITEM_FILTERS };
    const getCurrentSettingsItemFiltersActive = () =>
      Boolean(
        settingsItemFilters.search ||
        settingsItemFilters.source !== 'all' ||
        settingsItemFilters.status !== 'all' ||
        settingsItemFilters.sort !== 'default',
      );
    const toSettingsSourceFilter = (value: unknown): GachaSettingsItemSourceFilter => {
      const text = String(value || '');
      return text === 'custom' || text === 'builtin' ? text : 'all';
    };
    const toSettingsStatusFilter = (value: unknown): GachaSettingsItemStatusFilter => {
      const text = String(value || '');
      return text === 'enabled' || text === 'disabled' ? text : 'all';
    };
    const toSettingsSortMode = (value: unknown): GachaSettingsItemSortMode => {
      const text = String(value || '');
      return text === 'nameAsc' ||
        text === 'nameDesc' ||
        text === 'createdDesc' ||
        text === 'createdAsc' ||
        text === 'qualityDesc' ||
        text === 'weightDesc'
        ? text
        : 'default';
    };
    const readNumberDataset = (element: HTMLElement, key: string): number => {
      const value = Number(element.dataset[key] || 0);
      return Number.isFinite(value) ? value : 0;
    };
    const filterInputSelectors: Record<GachaSettingsFilterField, string> = {
      source: '.acu-gacha-settings-source-filter',
      status: '.acu-gacha-settings-status-filter',
      sort: '.acu-gacha-settings-sort-filter',
    };
    const normalizeGachaSettingsFilterField = (value: unknown): GachaSettingsFilterField | null => {
      const text = String(value || '');
      return text === 'source' || text === 'status' || text === 'sort' ? text : null;
    };
    const closeSettingsFilterMenus = (except?: HTMLElement) => {
      overlay.find('.acu-gacha-settings-filter-menu.is-open').each(function () {
        if (except && this === except) return;
        this.classList.remove('is-open');
        $(this).find('.acu-gacha-settings-filter-trigger').attr('aria-expanded', 'false');
      });
    };
    const syncSettingsFilterMenuLabels = ($section: JQuery<HTMLElement>) => {
      const syncMenu = (field: GachaSettingsFilterField, value: string, defaultValue: string) => {
        const $menu = $section.find(`.acu-gacha-settings-filter-menu[data-filter-field="${field}"]`);
        if (!$menu.length) return;
        $menu.toggleClass('is-active', value !== defaultValue);
        $menu.find('.acu-gacha-settings-filter-menu-label').text(deps.getGachaSettingsFilterLabel(field, value));
        $menu.find('.acu-gacha-settings-filter-option').each(function () {
          const active = String($(this).data('filter-value') || '') === value;
          $(this)
            .toggleClass('active', active)
            .attr('aria-checked', active ? 'true' : 'false');
        });
      };
      syncMenu('source', settingsItemFilters.source, deps.DEFAULT_GACHA_SETTINGS_ITEM_FILTERS.source);
      syncMenu('status', settingsItemFilters.status, deps.DEFAULT_GACHA_SETTINGS_ITEM_FILTERS.status);
      syncMenu('sort', settingsItemFilters.sort, deps.DEFAULT_GACHA_SETTINGS_ITEM_FILTERS.sort);
    };
    const syncSettingsItemFilterControls = () => {
      const $section = overlay.find('.acu-gacha-settings-items-section').first();
      if (!$section.length) return;
      $section.find('.acu-gacha-settings-item-search').val(settingsItemFilters.search);
      $section.find('.acu-gacha-settings-source-filter').val(settingsItemFilters.source);
      $section.find('.acu-gacha-settings-status-filter').val(settingsItemFilters.status);
      $section.find('.acu-gacha-settings-sort-filter').val(settingsItemFilters.sort);
      syncSettingsFilterMenuLabels($section as JQuery<HTMLElement>);
    };
    const applySettingsItemFilters = () => {
      const $section = overlay.find('.acu-gacha-settings-items-section').first();
      if (!$section.length) return;
      settingsItemFilters.search = String($section.find('.acu-gacha-settings-item-search').val() || '')
        .trim()
        .toLowerCase();
      settingsItemFilters.source = toSettingsSourceFilter($section.find('.acu-gacha-settings-source-filter').val());
      settingsItemFilters.status = toSettingsStatusFilter($section.find('.acu-gacha-settings-status-filter').val());
      settingsItemFilters.sort = toSettingsSortMode($section.find('.acu-gacha-settings-sort-filter').val());

      const items = $section.find('.acu-gacha-settings-item').toArray() as HTMLElement[];
      let visibleCount = 0;
      items.forEach(item => {
        const searchMatched =
          !settingsItemFilters.search || String(item.dataset.search || '').includes(settingsItemFilters.search);
        const sourceMatched =
          settingsItemFilters.source === 'all' || String(item.dataset.source || '') === settingsItemFilters.source;
        const statusMatched =
          settingsItemFilters.status === 'all' ||
          (settingsItemFilters.status === 'enabled' && item.dataset.enabled === 'true') ||
          (settingsItemFilters.status === 'disabled' && item.dataset.enabled === 'false');
        const matched = searchMatched && sourceMatched && statusMatched;
        item.style.display = matched ? '' : 'none';
        item.classList.toggle('is-filtered-out', !matched);
        if (matched) visibleCount += 1;
      });

      const sortedItems = [...items].sort((left, right) => {
        if (settingsItemFilters.sort === 'nameAsc') {
          return String(left.dataset.name || '').localeCompare(String(right.dataset.name || ''), 'zh-CN');
        }
        if (settingsItemFilters.sort === 'nameDesc') {
          return String(right.dataset.name || '').localeCompare(String(left.dataset.name || ''), 'zh-CN');
        }
        if (settingsItemFilters.sort === 'createdDesc') {
          return readNumberDataset(right, 'createdAt') - readNumberDataset(left, 'createdAt');
        }
        if (settingsItemFilters.sort === 'createdAsc') {
          return readNumberDataset(left, 'createdAt') - readNumberDataset(right, 'createdAt');
        }
        if (settingsItemFilters.sort === 'qualityDesc') {
          return readNumberDataset(right, 'qualityRank') - readNumberDataset(left, 'qualityRank');
        }
        if (settingsItemFilters.sort === 'weightDesc') {
          return readNumberDataset(right, 'weight') - readNumberDataset(left, 'weight');
        }
        return readNumberDataset(left, 'defaultIndex') - readNumberDataset(right, 'defaultIndex');
      });

      const list = $section.find('.acu-gacha-settings-item-list')[0];
      if (list) sortedItems.forEach(item => list.appendChild(item));
      $section.find('.acu-gacha-settings-count').text(`当前 ${visibleCount} / ${items.length} 个`);
      $section.find('.acu-gacha-settings-filter-empty').prop('hidden', !(visibleCount === 0 && items.length > 0));
      $section.toggleClass('is-searching', getCurrentSettingsItemFiltersActive());
      syncSettingsFilterMenuLabels($section as JQuery<HTMLElement>);
    };
    const bindSettingsItemSortable = () => {
      const $list = overlay.find('.acu-gacha-settings-item-list').first();
      if (!$list.length) return;
      deps.createSortableList({
        container: $list,
        itemSelector: '.acu-gacha-settings-item',
        handleSelector: '.acu-gacha-item-handle',
        cancelSelector: 'button, input, textarea, select, label, summary, .acu-gacha-settings-more',
        canStartDrag: () => {
          if (!getCurrentSettingsItemFiltersActive()) return true;
          if (window.toastr) window.toastr.info('筛选或排序时暂不允许拖拽排序，请恢复默认条件后再调整顺序');
          return false;
        },
        getItemId: item => {
          const id = item.dataset.itemId;
          return id ? String(id) : null;
        },
        onOrderChange: newOrderIds => {
          void deps.runInSaveQueue(async () => {
            newOrderIds.forEach((id, index) => deps.setGachaItemOrder(id, (index + 1) * 10));
          })
            .then(() => {
              const currentPoolId = normalizeGachaPoolId(overlay.find('.acu-gacha-settings-items-section').data('pool-id'));
              refreshSettingsPoolViewer(currentPoolId || GACHA_ALL_POOL_TAG);
              deps.refreshGachaVisualization(rawData);
              deps.refreshGachaShardShop();
            })
            .catch(error => {
              if (window.toastr) showActionableErrorToast(`物品排序保存失败: ${deps.getJsonLikeErrorMessage(error)}`, { suggestion: 'importExport' });
            });
        },
      });
    };
    const refreshSettingsPoolViewer = (poolId: GachaPoolTag) => {
      const normalizedPoolId = normalizeGachaPoolId(poolId);
      const safePoolId = deps.getVisibleGachaPoolConfigDefinitions(rawData).some(pool => pool.id === normalizedPoolId)
        ? normalizedPoolId
        : GACHA_ALL_POOL_TAG;
      deps.saveStoredGachaSettingsPoolTag(safePoolId);
      overlay
        .find('.acu-gacha-settings-items-section')
        .replaceWith(deps.renderGachaSettingsPoolViewerHtml(rawData, safePoolId));
      deps.hydrateCustomTableNameIconsIn(overlay);
      syncSettingsItemFilterControls();
      applySettingsItemFilters();
      bindSettingsItemSortable();
    };

    overlay.on('click', '.acu-gacha-settings-close', closeSettings);
    deps.setupOverlayClose(overlay, 'acu-gacha-settings-overlay', closeSettings);

    overlay.on('click', '.acu-gacha-pool-new', () => {
      void (async () => {
        const name = await deps.showGachaPoolNameDialog({
          title: '新建卡池',
          label: '卡池显示名',
          initialValue: '新卡池',
          confirmText: '创建',
        });
        const poolId = normalizeGachaPoolId(name);
        if (!poolId) return;
        await deps.runInSaveQueue(async () => {
          if (deps.getConfiguredGachaPoolDefinitions().some(pool => pool.id === poolId)) {
            if (window.toastr) window.toastr.warning('这个卡池已经存在');
            return;
          }
          deps.ensureGachaPoolsForTags([poolId]);
          deps.saveStoredGachaSettingsPoolTag(poolId);
        });
        void showGachaSettingsDialog();
      })().catch(error => {
        if (window.toastr) showActionableErrorToast(`卡池创建失败: ${deps.getJsonLikeErrorMessage(error)}`, { suggestion: 'importExport' });
      });
    });

    overlay.on('click', '.acu-gacha-settings-pool-tab', function () {
      const poolId = normalizeGachaPoolId($(this).data('pool-id'));
      if (!poolId) return;
      refreshSettingsPoolViewer(poolId);
    });

    overlay.on('change', '.acu-gacha-pool-all-check', function () {
      const poolId = normalizeGachaPoolId($(this).closest('.acu-gacha-settings-pool-item').data('pool-id'));
      void deps.runInSaveQueue(async () => {
        const pool = deps.getConfiguredGachaPoolDefinitions().find(candidate => candidate.id === poolId);
        if (!pool || pool.id === GACHA_ALL_POOL_TAG) return;
        const enabled = pool.includeInAll !== true;
        deps.updateGachaPoolConfig(poolId, { includeInAll: enabled, visibleInTabs: enabled });
      })
        .then(() => showGachaSettingsDialog())
        .catch(error => {
          if (window.toastr) showActionableErrorToast(`卡池设置保存失败: ${deps.getJsonLikeErrorMessage(error)}`, { suggestion: 'importExport' });
        });
    });

    overlay.on('click', '.acu-gacha-pool-rename', function () {
      void (async () => {
        const poolId = normalizeGachaPoolId($(this).closest('.acu-gacha-settings-pool-item').data('pool-id'));
        const pool = deps.getConfiguredGachaPoolDefinitions().find(candidate => candidate.id === poolId);
        if (!pool || pool.id === GACHA_ALL_POOL_TAG) return;
        const name = await deps.showGachaPoolNameDialog({
          title: '重命名卡池',
          label: '卡池显示名',
          initialValue: pool.name,
          confirmText: '保存',
        });
        if (name === null) return;
        await deps.runInSaveQueue(async () => {
          const latestPool = deps.getConfiguredGachaPoolDefinitions().find(candidate => candidate.id === poolId);
          if (!latestPool || latestPool.id === GACHA_ALL_POOL_TAG) return;
          deps.updateGachaPoolConfig(poolId, { name });
        });
        void showGachaSettingsDialog();
      })().catch(error => {
        if (window.toastr) showActionableErrorToast(`卡池重命名失败: ${deps.getJsonLikeErrorMessage(error)}`, { suggestion: 'importExport' });
      });
    });

    overlay.on('click', '.acu-gacha-pool-export', function () {
      const poolId = normalizeGachaPoolId($(this).closest('.acu-gacha-settings-pool-item').data('pool-id'));
      if (!poolId) return;
      void deps.downloadGachaCatalogJson(poolId);
    });

    overlay.on('click', '.acu-gacha-pool-delete', function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      const poolId = normalizeGachaPoolId($(this).closest('.acu-gacha-settings-pool-item').data('pool-id'));
      const pool = deps.getConfiguredGachaPoolDefinitions().find(candidate => candidate.id === poolId);
      if (!pool || !deps.canDeleteGachaPoolDefinition(pool)) return;
      void (async () => {
        const confirmed = await deps.showGachaConfirmDialog({
          title: '删除卡池',
          message: `确定删除卡池「${pool.name}」吗？`,
          detail:
            pool.id === GACHA_CUSTOM_ONLY_POOL_TAG
              ? '仅属于该卡池的自定义物品会一并删除；已经写入目标表的奖励不会被删除。'
              : '仅属于该卡池的自定义物品会转入“自定义”卡池；已经写入目标表的奖励不会被删除。',
          iconClass: 'fa-trash',
          confirmText: '删除',
          danger: true,
        });
        if (!confirmed) return;
        const deleted = await deps.runInSaveQueue(() => deps.deleteGachaPoolConfig(poolId, rawData));
        if (!deleted) throw new Error('卡池删除失败');
        void showGachaSettingsDialog();
      })().catch(error => {
        console.error('[DICE][GACHA]删除卡池失败:', error);
        if (window.toastr) showActionableErrorToast(`删除卡池失败: ${deps.getJsonLikeErrorMessage(error)}`, { suggestion: 'importExport' });
      });
    });

    overlay.on('click', '.acu-gacha-settings-filter-trigger', function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      const menu = $(this).closest('.acu-gacha-settings-filter-menu')[0] as HTMLElement | undefined;
      if (!menu) return;
      const nextOpen = !menu.classList.contains('is-open');
      closeSettingsFilterMenus(menu);
      menu.classList.toggle('is-open', nextOpen);
      $(this).attr('aria-expanded', nextOpen ? 'true' : 'false');
    });

    overlay.on('click', '.acu-gacha-settings-filter-option', function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      const $menu = $(this).closest('.acu-gacha-settings-filter-menu');
      const field = normalizeGachaSettingsFilterField($menu.data('filter-field'));
      if (!field) return;
      const value = String($(this).data('filter-value') || '');
      const $section = $(this).closest('.acu-gacha-settings-items-section');
      $section.find(filterInputSelectors[field]).val(value);
      closeSettingsFilterMenus();
      applySettingsItemFilters();
    });

    overlay.on('click', function (event) {
      const target = event.target;
      if (target instanceof Element && target.closest('.acu-gacha-settings-filter-menu')) return;
      closeSettingsFilterMenus();
    });

    overlay.on('input', '.acu-gacha-settings-item-search', function () {
      applySettingsItemFilters();
    });

    overlay.on(
      'change',
      '.acu-gacha-settings-source-filter, .acu-gacha-settings-status-filter, .acu-gacha-settings-sort-filter',
      function () {
        applySettingsItemFilters();
      },
    );

    overlay.on('keydown', '.acu-gacha-settings-item-search', function (event) {
      const key = event.originalEvent?.key || '';
      if (key !== 'Escape') return;
      $(this).val('');
      applySettingsItemFilters();
    });

    const shouldIgnoreGachaSettingsItemRowClick = (target: EventTarget | null): boolean => {
      if (!(target instanceof Element)) return false;
      return Boolean(
        target.closest(
          '.acu-gacha-settings-actions, .acu-gacha-settings-more, .acu-gacha-settings-filter-menu, .acu-gacha-item-handle, button, input, label, select, textarea, a, summary',
        ),
      );
    };

    const showSettingsItemDetailFromRow = (row: HTMLElement) => {
      const itemId = String($(row).data('item-id') || '').trim();
      if (itemId) deps.showGachaPickupItemDetail(itemId);
    };

    overlay.on('click', '.acu-gacha-settings-item', function (event) {
      if (shouldIgnoreGachaSettingsItemRowClick(event.target)) return;
      showSettingsItemDetailFromRow(this);
    });

    overlay.on('keydown', '.acu-gacha-settings-item', function (event) {
      const key = event.originalEvent?.key || '';
      if (key !== 'Enter' && key !== ' ') return;
      if (shouldIgnoreGachaSettingsItemRowClick(event.target)) return;
      event.preventDefault();
      showSettingsItemDetailFromRow(this);
    });

    overlay.on('change', '.acu-gacha-item-enabled-check', function (event) {
      event.preventDefault();
      event.stopPropagation();
      const itemId = String($(this).closest('.acu-gacha-settings-item').data('item-id') || '').trim();
      if (!itemId) return;
      const currentPoolId = normalizeGachaPoolId($(this).closest('.acu-gacha-settings-items-section').data('pool-id'));
      const nextEnabled = $(this).prop('checked') === true;
      void deps.runInSaveQueue(async () => {
        deps.updateGachaItemSetting(itemId, { enabled: nextEnabled });
      })
        .then(() => {
          refreshSettingsPoolViewer(currentPoolId || GACHA_ALL_POOL_TAG);
          deps.refreshGachaVisualization(rawData);
          deps.refreshGachaShardShop();
        })
        .catch(error => {
          if (window.toastr) showActionableErrorToast(`物品启用状态保存失败: ${deps.getJsonLikeErrorMessage(error)}`, { suggestion: 'importExport' });
          refreshSettingsPoolViewer(currentPoolId || GACHA_ALL_POOL_TAG);
        });
    });

    overlay.on('click', '.acu-gacha-item-toggle-menu', function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      const $row = $(this).closest('.acu-gacha-settings-item');
      const itemId = String($row.data('item-id') || '').trim();
      if (!itemId) return;
      const currentPoolId = normalizeGachaPoolId($(this).closest('.acu-gacha-settings-items-section').data('pool-id'));
      void deps.runInSaveQueue(async () => {
        const latestItem = deps.getAllGachaItemDefinitions(rawData).find(candidate => candidate.id === itemId);
        const storedItem = deps.getStoredGachaItemSettings().items[itemId];
        let currentEnabled = String($row.attr('data-enabled') || '') === 'true';
        if (latestItem) currentEnabled = deps.isGachaItemEnabled(latestItem);
        if (storedItem) currentEnabled = storedItem.enabled;
        const nextEnabled = !currentEnabled;
        deps.updateGachaItemSetting(itemId, { enabled: nextEnabled });
      })
        .then(() => {
          refreshSettingsPoolViewer(currentPoolId || GACHA_ALL_POOL_TAG);
          deps.refreshGachaVisualization(rawData);
          deps.refreshGachaShardShop();
        })
        .catch(error => {
          if (window.toastr) showActionableErrorToast(`物品启用状态保存失败: ${deps.getJsonLikeErrorMessage(error)}`, { suggestion: 'importExport' });
          refreshSettingsPoolViewer(currentPoolId || GACHA_ALL_POOL_TAG);
        });
    });

    overlay.on('click', '.acu-gacha-item-new', function (event) {
      event.preventDefault();
      event.stopPropagation();
      const $itemSection = $(this).closest('.acu-gacha-settings-items-section').length
        ? $(this).closest('.acu-gacha-settings-items-section')
        : overlay.find('.acu-gacha-settings-items-section').first();
      const selectedPoolId = normalizeGachaPoolId($itemSection.data('pool-id'));
      const initialPoolId =
        selectedPoolId && selectedPoolId !== GACHA_ALL_POOL_TAG ? selectedPoolId : GACHA_CUSTOM_ONLY_POOL_TAG;
      void deps.showGachaItemEditorDialog(null, initialPoolId);
    });

    overlay.on('click', '.acu-gacha-item-edit', function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      const itemId = String($(this).closest('.acu-gacha-settings-item').data('item-id') || '').trim();
      if (itemId) void deps.showGachaItemEditorDialog(itemId);
    });

    overlay.on('click', '.acu-gacha-item-delete', function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      const itemId = String($(this).closest('.acu-gacha-settings-item').data('item-id') || '').trim();
      if (!itemId) return;
      const item = deps.getCustomGachaItemDefinitions(rawData).find(candidate => candidate.id === itemId);
      if (!item) return;
      void (async () => {
        const confirmed = await deps.showGachaConfirmDialog({
          title: '删除自定义物品',
          message: `确定删除「${item.name}」吗？`,
          detail: '只会从骰子商店自定义卡池中删除，不会删除已经写入目标表的奖励。',
          iconClass: 'fa-trash',
          confirmText: '删除',
          danger: true,
        });
        if (!confirmed) return;
        await deps.runInSaveQueue(async () => {
          deps.setGachaCatalogCache(null);
          deps.setGachaCatalogLoadTask(null);
          await deps.ensureGachaCatalogLoaded(rawData);
          const localStorageSnapshot = deps.collectGachaLocalStorageSnapshot([deps.STORAGE_KEY_GACHA_ITEM_SETTINGS]);
          const latestCustomItems = deps.getCustomGachaItemDefinitions(rawData);
          const latestOriginalItems = deps.cloneGachaCatalogItems(latestCustomItems);
          const latestNextItems = latestCustomItems.filter(candidate => candidate.id !== itemId);
          if (latestNextItems.length === latestCustomItems.length) throw new Error('这个自定义物品已被删除');
          const savedCatalog = await deps.saveStoredGachaCatalog(latestNextItems);
          if (!savedCatalog) throw new Error('自定义物品删除失败');
          try {
            deps.deleteGachaItemSetting(itemId);
          } catch (error) {
            const rolledBackCatalog = await deps.saveStoredGachaCatalog(latestOriginalItems);
            const rollbackWarnings = deps.restoreGachaLocalStorageSnapshot(localStorageSnapshot);
            const message = deps.getRuntimeErrorMessage(error) || '删除自定义物品设置失败';
            const rollbackMessage = [
              !rolledBackCatalog ? '自定义物品目录回滚失败' : '',
              ...rollbackWarnings,
            ].filter(Boolean).join('；');
            if (rollbackMessage) throw new Error(`${message}；${rollbackMessage}`);
            throw error;
          }
        });
        deps.refreshGachaVisualization(rawData);
        deps.refreshGachaShardShop();
        void showGachaSettingsDialog();
      })().catch(error => {
        console.error('[DICE][GACHA]删除自定义物品失败:', error);
        if (window.toastr) showActionableErrorToast(`删除失败: ${deps.getJsonLikeErrorMessage(error)}`, { suggestion: 'importExport' });
      });
    });

    overlay.on('click', '.acu-gacha-settings-prompt', () => {
      const selectedPoolId = normalizeGachaPoolId(overlay.find('.acu-gacha-settings-items-section').data('pool-id'));
      const promptName = deps.getGachaPoolDisplayName(selectedPoolId || GACHA_CUSTOM_ONLY_POOL_TAG, rawData);
      deps.downloadAiPromptFile(deps.buildGachaCatalogAgentPrompt(), deps.buildGachaCatalogAgentPromptFilename(promptName));
      if (window.toastr) window.toastr.success('已下载 AI 提示词');
    });
    overlay.on('click', '.acu-gacha-settings-import', () => deps.importGachaCatalogJsonFromFile());
    overlay.on('click', '.acu-gacha-settings-export', () => void deps.downloadGachaCatalogJson());
    overlay.on('click', '.acu-gacha-settings-clear', () => void deps.showGachaCatalogClearDialog());

    deps.createSortableList({
      container: overlay.find('#acu-gacha-settings-pool-list'),
      itemSelector: '.acu-gacha-settings-pool-item',
      handleSelector: '.acu-gacha-pool-handle',
      cancelSelector: 'button, input, textarea, select',
      getItemId: item => {
        const id = $(item).data('pool-id');
        if (typeof id === 'string') return id;
        if (id !== undefined && id !== null) return String(id);
        return null;
      },
      onOrderChange: newOrderIds => {
        void deps.runInSaveQueue(async () => {
          newOrderIds
            .filter(id => id !== GACHA_ALL_POOL_TAG)
            .forEach((id, index) => deps.setGachaPoolOrder(id, (index + 1) * 10));
        })
          .then(() => showGachaSettingsDialog())
          .catch(error => {
            if (window.toastr) showActionableErrorToast(`卡池排序保存失败: ${deps.getJsonLikeErrorMessage(error)}`, { suggestion: 'importExport' });
          });
      },
    });
    applySettingsItemFilters();
    bindSettingsItemSortable();
  };
  return showGachaSettingsDialog;
}
