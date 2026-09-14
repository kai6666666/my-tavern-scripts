// @ts-nocheck
/**
 * custom-icon-manager-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { CustomTableNameIconImageDB } from '../../shared/storage/custom-table-name-icon-image-db';
import { Store } from '../../shared/storage/store';
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowCustomTableNameIconManager(deps: any) {
  const showCustomTableNameIconManager = () => {
    const { $ } = deps.getCore();
    $('.acu-custom-table-name-icon-manager-overlay').remove();

    const config = deps.getConfig();
    let candidates = deps.getCustomTableNameIconManagerCandidates();
    let candidateByKey = new Map(candidates.map(candidate => [candidate.key, candidate]));
    let selectedKey = candidates[0]?.key || '';
    let pendingLocalFile: File | null = null;

    const moduleOptions = [...new Set(candidates.map(candidate => candidate.context.moduleId))]
      .map(
        moduleId =>
          `<option value="${deps.escapeHtml(moduleId)}">${deps.escapeHtml(deps.getCustomTableNameIconManagerModuleLabel(moduleId))}</option>`,
      )
      .join('');
    const tableOptions = [...new Set(candidates.map(candidate => candidate.context.tableName))]
      .sort((left, right) => left.localeCompare(right, 'zh-CN'))
      .map(tableName => `<option value="${deps.escapeHtml(tableName)}">${deps.escapeHtml(tableName)}</option>`)
      .join('');

    const overlay = $(`
      <div class="acu-avatar-manager-overlay acu-custom-table-name-icon-manager-overlay acu-theme-${config.theme}">
        <div class="acu-avatar-manager acu-custom-icon-manager" role="dialog" aria-modal="true" aria-labelledby="acu-custom-icon-manager-title">
          <div class="acu-custom-icon-guide-top">
            <div class="acu-panel-header">
              <div class="acu-avatar-title" id="acu-custom-icon-manager-title"><i class="fa-solid fa-icons"></i> 图标预设管理</div>
              <div class="acu-avatar-header-actions">
                ${deps.getTutorialButtonHtml('customIconManager', '查看图标预设管理教程', 'acu-btn-icon')}
                <button type="button" class="acu-custom-icon-close acu-btn-icon" title="关闭" aria-label="关闭图标预设管理"><i class="fa-solid fa-times"></i></button>
              </div>
            </div>
            <div class="acu-avatar-toolbar acu-custom-icon-toolbar">
              <div class="acu-toolbar-group left acu-avatar-filter-controls acu-custom-icon-filter-controls">
                <div class="acu-select-wrapper sort-field">
                  <select id="acu-custom-icon-module-filter" class="acu-toolbar-select" title="模块过滤" aria-label="按模块过滤">
                    <option value="">全部模块</option>
                    ${moduleOptions}
                  </select>
                </div>
                <div class="acu-select-wrapper sort-field">
                  <select id="acu-custom-icon-table-filter" class="acu-toolbar-select" title="表格过滤" aria-label="按表格过滤">
                    <option value="">全部表格</option>
                    ${tableOptions}
                  </select>
                </div>
              </div>
              <div class="acu-toolbar-group right acu-custom-icon-pack-actions">
                <button type="button" id="acu-custom-icon-import" class="acu-custom-icon-pack-btn" title="导入图标包" aria-label="导入图标包">
                  <i class="fa-solid fa-file-import"></i> <span class="acu-custom-icon-action-label">导入图标包</span>
                </button>
                <button type="button" id="acu-custom-icon-export" class="acu-custom-icon-pack-btn" title="导出图标包" aria-label="导出图标包">
                  <i class="fa-solid fa-file-export"></i> <span class="acu-custom-icon-action-label">导出图标包</span>
                </button>
              </div>
              <div class="acu-search-wrapper acu-custom-icon-search-wrapper">
                <i class="fa-solid fa-magnifying-glass acu-search-icon"></i>
                <input type="text" id="acu-custom-icon-search" class="acu-avatar-search" placeholder="搜索" autocomplete="off" aria-label="搜索图标条目">
              </div>
            </div>
          </div>
          <div class="acu-custom-icon-body">
            <div class="acu-avatar-list acu-custom-icon-list" id="acu-custom-icon-list"></div>
            <div class="acu-avatar-list acu-custom-icon-detail" id="acu-custom-icon-detail"></div>
          </div>
          <input type="file" id="acu-custom-icon-local-file" class="acu-custom-icon-file-input" accept="image/png,image/jpeg,image/webp,image/gif" />
          <input type="file" id="acu-custom-icon-import-file" class="acu-custom-icon-file-input" accept=".json,application/json" />
        </div>
      </div>
    `);

    $('body').append(overlay);
    deps.bindTutorialButtonsIn(overlay);

    const updateCandidateCache = (): void => {
      candidates = deps.getCustomTableNameIconManagerCandidates();
      candidateByKey = new Map(candidates.map(candidate => [candidate.key, candidate]));
      if (!candidates.some(candidate => candidate.key === selectedKey)) {
        selectedKey = candidates[0]?.key || '';
      }
    };

    const updateFilterOptions = (): void => {
      const moduleSelect = overlay.find('#acu-custom-icon-module-filter');
      const tableSelect = overlay.find('#acu-custom-icon-table-filter');
      const currentModule = String(moduleSelect.val() || '').trim();
      const currentTable = String(tableSelect.val() || '').trim();
      const nextModuleOptions = [...new Set(candidates.map(candidate => candidate.context.moduleId))]
        .map(
          moduleId =>
            `<option value="${deps.escapeHtml(moduleId)}">${deps.escapeHtml(deps.getCustomTableNameIconManagerModuleLabel(moduleId))}</option>`,
        )
        .join('');
      const nextTableOptions = [...new Set(candidates.map(candidate => candidate.context.tableName))]
        .sort((left, right) => left.localeCompare(right, 'zh-CN'))
        .map(tableName => `<option value="${deps.escapeHtml(tableName)}">${deps.escapeHtml(tableName)}</option>`)
        .join('');
      moduleSelect.html(`<option value="">全部模块</option>${nextModuleOptions}`);
      tableSelect.html(`<option value="">全部表格</option>${nextTableOptions}`);
      moduleSelect.val(candidates.some(candidate => candidate.context.moduleId === currentModule) ? currentModule : '');
      tableSelect.val(candidates.some(candidate => candidate.context.tableName === currentTable) ? currentTable : '');
    };

    const getFilteredCandidates = (): CustomTableNameIconManagerCandidate[] => {
      const moduleFilter = String(overlay.find('#acu-custom-icon-module-filter').val() || '').trim();
      const tableFilter = String(overlay.find('#acu-custom-icon-table-filter').val() || '').trim();
      const query = String(overlay.find('#acu-custom-icon-search').val() || '')
        .trim()
        .toLowerCase();
      return candidates.filter(candidate => {
        if (moduleFilter && candidate.context.moduleId !== moduleFilter) return false;
        if (tableFilter && candidate.context.tableName !== tableFilter) return false;
        if (query && !candidate.searchText.includes(query)) return false;
        return true;
      });
    };

    const getSelectedCandidate = (): CustomTableNameIconManagerCandidate | null =>
      selectedKey ? candidateByKey.get(selectedKey) || null : null;

    const renderList = async (): Promise<void> => {
      const filteredCandidates = getFilteredCandidates();
      if (!filteredCandidates.some(candidate => candidate.key === selectedKey)) {
        selectedKey = filteredCandidates[0]?.key || '';
        pendingLocalFile = null;
      }

      if (filteredCandidates.length === 0) {
        overlay.find('#acu-custom-icon-list').html(`
          <div class="acu-import-empty">
            <i class="fa-solid fa-ban"></i> 没有可选择的白名单上下文<br>
            <span class="acu-custom-icon-empty-note">角色、角色头像预设、全局数据表、选项表、检定建议表等非白名单上下文不会出现在这里。</span>
          </div>
        `);
        await renderDetail();
        return;
      }

      const rows = await Promise.all(
        filteredCandidates.map(async candidate => {
          const entry = deps.CustomTableNameIconStoreManager.get(candidate.context);
          const asset = await deps.getCustomTableNameIconManagerEntryAsset(entry);
          const sourceText = entry ? (entry.sourceType === 'local' ? '本地' : 'URL') : '未设置';
          const sourceClass =
            entry?.sourceType === 'local' ? 'acu-source-local' : entry?.sourceType === 'url' ? 'acu-source-url' : '';
          const isSelected = candidate.key === selectedKey;
          const previewImageUrl = deps.formatCssImageUrl(asset.assetUrl, { allowInternalObjectUrl: true });
          const previewStyle = previewImageUrl ? deps.escapeHtml(`background-image:${previewImageUrl};`) : '';
          const missingText = asset.isMissing ? '<span class="acu-custom-icon-missing-text">缺失/需重传</span>' : '';
          const itemLabel = `选择图标预设条目：${candidate.context.name}`;
          return `
            <div class="acu-avatar-item acu-custom-table-name-icon-item ${isSelected ? 'expanded is-selected' : ''}" data-key="${deps.escapeHtml(candidate.key)}" role="button" tabindex="0" aria-label="${deps.escapeHtml(itemLabel)}" aria-current="${isSelected ? 'true' : 'false'}">
              <div class="acu-avatar-row-collapsed">
                <div class="acu-avatar-preview-wrap">
                  <div class="acu-avatar-preview ${asset.assetUrl ? 'has-image' : ''}" style="${previewStyle}">
                    ${asset.assetUrl ? '' : '<span><i class="fa-solid fa-table"></i></span>'}
                  </div>
                  <span class="acu-avatar-source ${sourceClass}">${sourceText}</span>
                </div>
                <div class="acu-avatar-info acu-custom-icon-list-info">
                  <div class="acu-avatar-name acu-custom-icon-list-name">
                    <span>${deps.escapeHtml(candidate.context.name)}</span>${missingText}
                  </div>
                  <div class="acu-avatar-url-preview">
                    ${deps.escapeHtml(deps.getCustomTableNameIconManagerContextLabel(candidate.context))}
                  </div>
                </div>
              </div>
            </div>
          `;
        }),
      );
      overlay.find('#acu-custom-icon-list').html(rows.join(''));
    };

    const renderDetail = async (): Promise<void> => {
      const candidate = getSelectedCandidate();
      if (!candidate) {
        overlay.find('#acu-custom-icon-detail').html(`
          <div class="acu-import-empty">
            <i class="fa-solid fa-circle-info"></i> 请选择一个白名单条目
          </div>
        `);
        return;
      }

      const entry = deps.CustomTableNameIconStoreManager.get(candidate.context);
      const asset = await deps.getCustomTableNameIconManagerEntryAsset(entry);
      const previewImageUrl = deps.formatCssImageUrl(asset.assetUrl, { allowInternalObjectUrl: true });
      const previewStyle = previewImageUrl ? deps.escapeHtml(`background-image:${previewImageUrl};`) : '';
      const missingNotice = asset.isMissing
        ? '<div class="acu-custom-icon-warning"><i class="fa-solid fa-triangle-exclamation"></i> 本地图片缺失或 URL 无效，运行时会回退默认图标，请重新上传或保存 URL。</div>'
        : '';

      overlay.find('#acu-custom-icon-detail').html(`
        <div class="acu-custom-icon-detail-panel">
          <div class="acu-custom-icon-detail-head">
            <div class="acu-avatar-preview ${asset.assetUrl ? 'has-image' : ''}" style="${previewStyle}">
              ${asset.assetUrl ? '' : '<span><i class="fa-solid fa-table"></i></span>'}
            </div>
            <div class="acu-custom-icon-detail-title">
              <div class="acu-avatar-name">${deps.escapeHtml(candidate.context.name)}</div>
              <div class="acu-avatar-url-preview">${deps.escapeHtml(deps.getCustomTableNameIconManagerContextLabel(candidate.context))}</div>
            </div>
          </div>
          <div class="acu-custom-icon-detail-form">
            <label class="acu-custom-icon-field">
              <span class="acu-custom-icon-url-label">
                URL 图片地址
                ${
                  pendingLocalFile
                    ? `<span id="acu-custom-icon-local-status" class="acu-custom-icon-local-status">已选择：${deps.escapeHtml(pendingLocalFile.name)}</span>`
                    : ''
                }
              </span>
              <input id="acu-custom-icon-url" class="acu-input acu-custom-icon-url-input" type="url" value="${deps.escapeHtml(entry?.sourceType === 'url' ? entry.imageUrl : '')}" placeholder="https://example.com/icon.png" autocomplete="off" aria-label="URL 图片地址" />
            </label>
            ${missingNotice}
          </div>
          <div class="acu-custom-icon-detail-actions">
            <button type="button" id="acu-custom-icon-save" class="acu-custom-icon-detail-btn acu-custom-icon-primary-btn" title="保存 URL" aria-label="保存图标 URL">
              <i class="fa-solid fa-link"></i> 保存 URL
            </button>
            <button type="button" id="acu-custom-icon-pick-local" class="acu-custom-icon-detail-btn" title="上传本地图片" aria-label="上传本地图片">
              <i class="fa-solid fa-cloud-arrow-up"></i> 上传
            </button>
            <button type="button" id="acu-custom-icon-save-local" class="acu-custom-icon-detail-btn" title="保存本地图片" aria-label="保存本地图片">
              <i class="fa-solid fa-floppy-disk"></i> 保存本地
            </button>
            <button type="button" id="acu-custom-icon-clear-input" class="acu-custom-icon-detail-btn" title="清空图标输入" aria-label="清空图标输入">
              <i class="fa-solid fa-eraser"></i> 清空输入框
            </button>
            <button type="button" id="acu-custom-icon-delete" class="acu-custom-icon-detail-btn acu-custom-icon-danger-btn" title="删除图标映射" aria-label="删除图标映射">
              <i class="fa-solid fa-trash"></i> 删除
            </button>
          </div>
        </div>
      `);
      overlay.find('#acu-custom-icon-save i').removeClass('fa-link').addClass('fa-floppy-disk');
    };

    const refreshManager = async (): Promise<void> => {
      updateCandidateCache();
      updateFilterOptions();
      await renderList();
      await renderDetail();
    };

    const refreshRenderedIconConsumers = (): void => {
      const dataArea = $('#acu-data-area');
      if (!dataArea.length || !dataArea.hasClass('visible')) return;

      const rawData = deps.getCachedRawData() || deps.getTableData();
      if (Store.get(deps.STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, false)) {
        dataArea.html(deps.renderGlobalInteractionsPanel(rawData));
        deps.hydrateCustomTableNameIconsIn(dataArea as JQuery<HTMLElement>);
        deps.bindGlobalInteractionEvents(dataArea as JQuery<HTMLElement>);
        return;
      }

      if (Store.get(deps.STORAGE_KEY_DASHBOARD_ACTIVE, false)) {
        const tables = deps.processJsonData(rawData || {});
        dataArea.html(deps.renderDashboard(tables));
        deps.hydrateCustomTableNameIconsIn(dataArea as JQuery<HTMLElement>);
        deps.bindEvents(tables);
        deps.loadDashboardNpcAvatars();
        return;
      }

      deps.hydrateCustomTableNameIconsIn(dataArea as JQuery<HTMLElement>);
    };

    let renderedIconConsumersRefreshTimer: ReturnType<typeof setTimeout> | null = null;

    const cancelRenderedIconConsumersRefresh = (): void => {
      if (!renderedIconConsumersRefreshTimer) return;
      clearTimeout(renderedIconConsumersRefreshTimer);
      renderedIconConsumersRefreshTimer = null;
    };

    const scheduleRenderedIconConsumersRefresh = (): void => {
      cancelRenderedIconConsumersRefresh();
      renderedIconConsumersRefreshTimer = setTimeout(() => {
        renderedIconConsumersRefreshTimer = null;
        refreshRenderedIconConsumers();
      }, 80);
    };

    const closeCustomIconManager = (): void => {
      cancelRenderedIconConsumersRefresh();
      overlay.remove();
    };

    const removeSelectedCustomIconMapping = async (successMessage: string): Promise<boolean> => {
      const candidate = getSelectedCandidate();
      if (!candidate) return false;
      const entry = deps.CustomTableNameIconStoreManager.get(candidate.context);
      pendingLocalFile = null;
      overlay.find('#acu-custom-icon-url').val('');
      if (!entry) {
        if (window.toastr) window.toastr.info('该条目没有图标映射');
        await refreshManager();
        return false;
      }
      if (entry.sourceType === 'local' && entry.localIconKey) {
        await CustomTableNameIconImageDB.delete(entry.localIconKey);
      }
      const removed = deps.CustomTableNameIconStoreManager.delete(candidate.context);
      deps.CustomTableNameIconStoreManager.invalidate();
      if (removed) window.toastr?.success(successMessage);
      else showActionableErrorToast('删除图标映射失败，当前条目可能已被刷新或存储状态异常。', { developerHint: true });
      await refreshManager();
      scheduleRenderedIconConsumersRefresh();
      return removed;
    };

    overlay.on(
      'change input',
      '#acu-custom-icon-module-filter, #acu-custom-icon-table-filter, #acu-custom-icon-search',
      () => {
        pendingLocalFile = null;
        void refreshManager();
      },
    );

    overlay.on('click', '.acu-custom-table-name-icon-item', function () {
      selectedKey = String($(this).data('key') || '');
      pendingLocalFile = null;
      void refreshManager();
    });

    overlay.on('keydown', '.acu-custom-table-name-icon-item', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      $(this).trigger('click');
    });

    overlay.on('click', '#acu-custom-icon-save', async () => {
      const candidate = getSelectedCandidate();
      if (!candidate) return;
      const previousEntry = deps.CustomTableNameIconStoreManager.get(candidate.context);
      const now = Date.now();

      if (pendingLocalFile) {
        const validationError = deps.getCustomTableNameIconLocalFileValidationError(pendingLocalFile);
        if (validationError) {
          if (window.toastr) window.toastr.warning(deps.getCustomTableNameIconManagerInvalidSourceText(validationError));
          return;
        }

        const localIconKey = deps.getCustomTableNameIconManagerLocalKey(candidate.context);
        const savedImage = await CustomTableNameIconImageDB.save(localIconKey, pendingLocalFile);
        if (!savedImage) {
          showActionableErrorToast('本地图标保存失败，图片没有写入本地浏览器存储。', { suggestion: 'image' });
          return;
        }

        const saved = deps.CustomTableNameIconStoreManager.save({
          ...candidate.context,
          sourceType: 'local',
          imageUrl: '',
          localIconKey,
          imageMimeType: pendingLocalFile.type || null,
          imageSize: pendingLocalFile.size,
          createdAt: previousEntry?.createdAt || now,
          updatedAt: now,
        });
        deps.CustomTableNameIconStoreManager.invalidate();
        pendingLocalFile = null;
        scheduleRenderedIconConsumersRefresh();
        if (saved) window.toastr?.success('本地图标已保存');
        else showActionableErrorToast('保存本地图标映射失败，图标文件已读取但映射配置没有写入。', { developerHint: true });
        await refreshManager();
        return;
      }

      if (previousEntry?.sourceType === 'local') {
        if (window.toastr) window.toastr.info('已保留本地图标；如需改用 URL，请先清空映射。');
        await refreshManager();
        return;
      }

      const imageUrl = String(overlay.find('#acu-custom-icon-url').val() || '').trim();
      const validationError = deps.getCustomTableNameIconImageUrlValidationError(imageUrl);
      if (validationError) {
        if (window.toastr) window.toastr.warning(deps.getCustomTableNameIconManagerInvalidSourceText(validationError));
        return;
      }

      if (previousEntry?.sourceType === 'local' && previousEntry.localIconKey) {
        await CustomTableNameIconImageDB.delete(previousEntry.localIconKey);
      }

      const saved = deps.CustomTableNameIconStoreManager.save({
        ...candidate.context,
        sourceType: 'url',
        imageUrl,
        localIconKey: null,
        imageMimeType: null,
        imageSize: null,
        createdAt: previousEntry?.createdAt || now,
        updatedAt: now,
      });
      deps.CustomTableNameIconStoreManager.invalidate();
      CustomTableNameIconImageDB.clearUrlFailure(imageUrl);
      scheduleRenderedIconConsumersRefresh();
      if (saved) window.toastr?.success('图标 URL 已保存');
      else showActionableErrorToast('保存图标 URL 映射失败，配置没有写入本地存储。', { developerHint: true });
      await refreshManager();
    });

    overlay.on('click', '#acu-custom-icon-save-url', async () => {
      const candidate = getSelectedCandidate();
      if (!candidate) return;
      const imageUrl = String(overlay.find('#acu-custom-icon-url').val() || '').trim();
      const validationError = deps.getCustomTableNameIconImageUrlValidationError(imageUrl);
      if (validationError) {
        if (window.toastr) window.toastr.warning(deps.getCustomTableNameIconManagerInvalidSourceText(validationError));
        return;
      }

      const previousEntry = deps.CustomTableNameIconStoreManager.get(candidate.context);
      if (previousEntry?.sourceType === 'local' && previousEntry.localIconKey) {
        await CustomTableNameIconImageDB.delete(previousEntry.localIconKey);
      }

      const now = Date.now();
      const saved = deps.CustomTableNameIconStoreManager.save({
        ...candidate.context,
        sourceType: 'url',
        imageUrl,
        localIconKey: null,
        imageMimeType: null,
        imageSize: null,
        createdAt: previousEntry?.createdAt || now,
        updatedAt: now,
      });
      deps.CustomTableNameIconStoreManager.invalidate();
      CustomTableNameIconImageDB.clearUrlFailure(imageUrl);
      pendingLocalFile = null;
      scheduleRenderedIconConsumersRefresh();
      if (saved) window.toastr?.success('图标 URL 已保存');
      else showActionableErrorToast('保存图标 URL 映射失败，配置没有写入本地存储。', { developerHint: true });
      await refreshManager();
    });

    overlay.on('click', '#acu-custom-icon-pick-local', () => {
      overlay.find('#acu-custom-icon-local-file').trigger('click');
    });

    overlay.on('change', '#acu-custom-icon-local-file', function (event) {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0] || null;
      const validationError = deps.getCustomTableNameIconLocalFileValidationError(file);
      if (validationError) {
        pendingLocalFile = null;
        if (window.toastr) window.toastr.warning(deps.getCustomTableNameIconManagerInvalidSourceText(validationError));
        input.value = '';
        void renderDetail();
        return;
      }
      pendingLocalFile = file;
      input.value = '';
      void renderDetail();
    });

    overlay.on('click', '#acu-custom-icon-save-local', async () => {
      const candidate = getSelectedCandidate();
      if (!candidate) return;
      const validationError = deps.getCustomTableNameIconLocalFileValidationError(pendingLocalFile);
      if (validationError || !pendingLocalFile) {
        if (window.toastr) window.toastr.warning(deps.getCustomTableNameIconManagerInvalidSourceText(validationError));
        return;
      }

      const localIconKey = deps.getCustomTableNameIconManagerLocalKey(candidate.context);
      const savedImage = await CustomTableNameIconImageDB.save(localIconKey, pendingLocalFile);
      if (!savedImage) {
        showActionableErrorToast('本地图片保存失败，图片没有写入本地浏览器存储。', { suggestion: 'image' });
        return;
      }

      const previousEntry = deps.CustomTableNameIconStoreManager.get(candidate.context);
      const now = Date.now();
      const saved = deps.CustomTableNameIconStoreManager.save({
        ...candidate.context,
        sourceType: 'local',
        imageUrl: '',
        localIconKey,
        imageMimeType: pendingLocalFile.type || null,
        imageSize: pendingLocalFile.size,
        createdAt: previousEntry?.createdAt || now,
        updatedAt: now,
      });
      deps.CustomTableNameIconStoreManager.invalidate();
      pendingLocalFile = null;
      scheduleRenderedIconConsumersRefresh();
      if (saved) window.toastr?.success('本地图标已保存');
      else showActionableErrorToast('保存本地图标映射失败，图标文件已读取但映射配置没有写入。', { developerHint: true });
      await refreshManager();
    });

    overlay.on('click', '#acu-custom-icon-clear-input', async () => {
      await removeSelectedCustomIconMapping('图标映射已清空');
    });

    overlay.on('click', '#acu-custom-icon-delete', async () => {
      const candidate = getSelectedCandidate();
      if (!candidate) return;
      const entry = deps.CustomTableNameIconStoreManager.get(candidate.context);
      if (!entry) {
        if (window.toastr) window.toastr.info('该条目没有图标映射');
        return;
      }
      const confirmed = await deps.showDiceSystemConfirmDialog({
        title: '删除图标映射',
        message: `确定删除「${candidate.context.name}」的图标映射吗？`,
        detail: `${deps.getCustomTableNameIconManagerContextLabel(candidate.context)}\n删除后会回退到默认图标。`,
        iconClass: 'fa-trash',
        confirmText: '删除映射',
        tone: 'danger',
      });
      if (!confirmed) return;
      await removeSelectedCustomIconMapping('图标映射已删除');
    });

    overlay.on('click', '#acu-custom-icon-export', () => {
      const pack = deps.buildCustomTableNameIconPack();
      deps.downloadCustomTableNameIconPack(pack);
      if (window.toastr) window.toastr.success(`已导出 ${pack.entries.length} 条图标映射`);
    });

    overlay.on('click', '#acu-custom-icon-import', () => {
      overlay.find('#acu-custom-icon-import-file').trigger('click');
    });

    overlay.on('change', '#acu-custom-icon-import-file', function (event) {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0] || null;
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async loadEvent => {
        input.value = '';
        try {
          const jsonText = typeof loadEvent.target?.result === 'string' ? loadEvent.target.result : '';
          const parsed = JSON.parse(jsonText) as unknown;
          const analysis = deps.analyzeCustomTableNameIconPackImport(parsed);
          if (analysis.importedCount === 0) {
            if (window.toastr) window.toastr.warning('没有可导入的有效图标映射');
            return;
          }

          const summaryText = deps.getCustomTableNameIconPackImportSummaryText(analysis);
          const confirmed = await deps.showDiceSystemConfirmDialog({
            title: '导入图标包',
            message: '将按合并覆盖方式导入图标包。',
            detail: summaryText,
            iconClass: 'fa-file-import',
            confirmText: '继续导入',
            tone: 'warning',
          });
          if (!confirmed) return;

          let importedCount = 0;
          for (const entry of analysis.entriesToImport) {
            const previousEntry = deps.CustomTableNameIconStoreManager.get(entry);
            if (
              previousEntry?.sourceType === 'local' &&
              previousEntry.localIconKey &&
              previousEntry.localIconKey !== entry.localIconKey
            ) {
              await CustomTableNameIconImageDB.delete(previousEntry.localIconKey);
            }
            if (entry.sourceType === 'local' && entry.localIconKey) {
              await CustomTableNameIconImageDB.delete(entry.localIconKey);
            } else if (entry.sourceType === 'url') {
              CustomTableNameIconImageDB.clearUrlFailure(entry.imageUrl);
            }
            if (deps.CustomTableNameIconStoreManager.save(entry)) {
              importedCount += 1;
            }
          }

          deps.CustomTableNameIconStoreManager.invalidate();
          CustomTableNameIconImageDB.cleanup();
          pendingLocalFile = null;
          scheduleRenderedIconConsumersRefresh();
          await refreshManager();
          if (window.toastr) {
            window.toastr.success(
              `图标包导入完成：导入 ${importedCount} 条，覆盖 ${analysis.overwrittenCount} 条，跳过无效 URL ${analysis.skippedInvalidUrlCount} 条，跳过非白名单 ${analysis.skippedNonWhitelistCount} 条，本地缺失 ${analysis.localMissingCount} 条`,
            );
          }
        } catch (error) {
          console.error('[DICE][CUSTOM_ICON]导入图标包失败:', error);
          if (window.toastr) {
            showActionableErrorToast(`图标包导入失败: ${error instanceof Error ? error.message : String(error)}`, {
              suggestion: '请确认图标包是从本功能导出的 JSON 文件；如果文件无误仍失败，请打开控制台复制 [DICE][CUSTOM_ICON] 日志联系开发者。',
            });
          }
        }
      };
      reader.readAsText(file);
    });

    overlay.find('.acu-custom-icon-close').on('click', event => {
      event.preventDefault();
      event.stopPropagation();
      closeCustomIconManager();
    });
    deps.setupOverlayClose(overlay, 'acu-custom-table-name-icon-manager-overlay', closeCustomIconManager);
    void refreshManager();
  };
  return showCustomTableNameIconManager;
}
