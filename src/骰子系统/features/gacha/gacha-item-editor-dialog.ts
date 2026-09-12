// @ts-nocheck
/**
 * gacha-item-editor-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ALL_POOL_TAG, GACHA_CUSTOM_ONLY_POOL_TAG, normalizeGachaPoolId } from './gacha-helpers';
import { GACHA_RARITY_ORDER, GACHA_REWARD_TARGETS, GACHA_UNIQUE_RARITY } from '../../entities/gacha-items';
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowGachaItemEditorDialog(deps: any) {
  const showGachaItemEditorDialog = async (itemId: string | null, initialPoolTag?: GachaPoolTag) => {
    const { $ } = deps.getCore();
    const rawData = deps.getCachedRawData() || deps.getTableData();
    await deps.ensureGachaCatalogLoaded(rawData);
    const customItems = deps.getCustomGachaItemDefinitions(rawData);
    const existingItem = itemId ? customItems.find(item => item.id === itemId) || null : null;
    if (itemId && !existingItem) {
      if (window.toastr) window.toastr.warning('内置物品不能编辑定义，只能调整启用状态和顺序');
      return;
    }
    const existingResolvedItem = existingItem
      ? deps.getAllGachaItemDefinitions(rawData).find(item => item.id === existingItem.id) || existingItem
      : null;
    const storedPools = deps.getAllGachaPoolConfigDefinitions(rawData).filter(pool => pool.id !== GACHA_ALL_POOL_TAG);
    const normalizedInitialPoolTag = normalizeGachaPoolId(initialPoolTag);
    const needsDefaultCustomPool =
      !existingItem &&
      (!normalizedInitialPoolTag ||
        normalizedInitialPoolTag === GACHA_ALL_POOL_TAG ||
        !storedPools.some(pool => pool.id === normalizedInitialPoolTag));
    const pools =
      needsDefaultCustomPool && !storedPools.some(pool => pool.id === GACHA_CUSTOM_ONLY_POOL_TAG)
        ? [
            ...storedPools,
            deps.buildDefaultGachaPoolDefinition(GACHA_CUSTOM_ONLY_POOL_TAG, {
              name: GACHA_CUSTOM_ONLY_POOL_TAG,
              builtin: false,
              visibleInTabs: false,
              includeInAll: false,
              order: storedPools.reduce((max, pool) => Math.max(max, Number(pool.order) || 0), 0) + 10,
            }),
          ]
        : storedPools;
    const editorCreatablePoolIds = new Set<GachaPoolTag>(
      !existingItem && needsDefaultCustomPool ? [GACHA_CUSTOM_ONLY_POOL_TAG] : [],
    );
    const initialPoolExists = pools.some(pool => pool.id === normalizedInitialPoolTag);
    const baseItem: GachaItemDefinition = existingResolvedItem || {
      id: '',
      name: '',
      type: '道具',
      quality: '普通' as GachaRarity,
      description: '',
      poolTags: [initialPoolExists ? normalizedInitialPoolTag : GACHA_CUSTOM_ONLY_POOL_TAG],
      enabled: true,
      order: undefined,
      weight: 1,
      stackable: false,
      unique: false,
      grantQuantity: 1,
      rewardTarget: 'inventory' as GachaRewardTarget,
    };
    const item: GachaItemDefinition =
      baseItem.rewardTarget === 'equipment'
        ? { ...baseItem, type: deps.inferEquipmentTableTypeForGachaItem(baseItem) }
        : baseItem;
    const fieldLimits = deps.getGachaRewardFieldLimits(item.rewardTarget);
    const config = deps.getConfig();
    const poolOptionsHtml = pools
      .map(pool => {
        const checked = item.poolTags.includes(pool.id);
        return `
          <label class="acu-gacha-item-pool-option">
            <input class="acu-gacha-item-pool-check" type="checkbox" value="${deps.escapeHtml(pool.id)}" ${checked ? 'checked' : ''} />
            <span>${deps.escapeHtml(pool.name)}</span>
          </label>
        `;
      })
      .join('');
    const rarityOptionsHtml = GACHA_RARITY_ORDER.map(
      rarity =>
        `<option value="${deps.escapeHtml(rarity)}" ${item.quality === rarity ? 'selected' : ''}>${deps.escapeHtml(rarity)}</option>`,
    ).join('');
    const targetOptionsHtml = GACHA_REWARD_TARGETS.map(
      target =>
        `<option value="${deps.escapeHtml(target)}" ${item.rewardTarget === target ? 'selected' : ''}>${target === 'equipment' ? '装备' : '物品'}</option>`,
    ).join('');
    const targetTableValue = deps.normalizeGachaTargetTable(item.targetTable) || '';
    const targetColumns = deps.normalizeGachaTargetColumns(item.targetColumns);
    const renderTargetColumnInputHtml = (key: GachaRewardTargetColumnKey, placeholder: string) => `
      <label class="acu-gacha-target-column-field" data-column-key="${deps.escapeHtml(key)}">
        <span>${deps.escapeHtml(deps.GACHA_TARGET_COLUMN_LABELS[key])}</span>
        <input class="acu-gacha-target-column-input" type="text" data-column-key="${deps.escapeHtml(key)}" value="${deps.escapeHtml(targetColumns?.[key] || '')}" maxlength="${deps.GACHA_TARGET_COLUMN_VALUE_MAX_LENGTH}" placeholder="${deps.escapeHtml(placeholder)}" />
      </label>
    `;
    const targetColumnsHtml = [
      renderTargetColumnInputHtml('name', '物品名称 / 装扮名称'),
      renderTargetColumnInputHtml('type', '类型'),
      renderTargetColumnInputHtml('quantity', '数量'),
      renderTargetColumnInputHtml('quality', '品质'),
      renderTargetColumnInputHtml('tags', '标签'),
      renderTargetColumnInputHtml('effect', '效果'),
      renderTargetColumnInputHtml('description', '描述 / 外观描述'),
      renderTargetColumnInputHtml('part', '部位 / 适用场景'),
      renderTargetColumnInputHtml('status', '状态 / 当前状态'),
    ].join('');
    const renderCustomFieldRowHtml = (key = '', value = '') => `
      <div class="acu-gacha-custom-field-row">
        <div class="acu-gacha-custom-field-key-line">
          <label class="acu-gacha-custom-field-key-cell">
            <input class="acu-gacha-custom-field-key" type="text" value="${deps.escapeHtml(key)}" maxlength="${deps.GACHA_CUSTOM_FIELD_KEY_MAX_LENGTH}" placeholder="自定义字段名" />
          </label>
          <button class="acu-gacha-custom-field-remove" type="button" title="移除此字段" aria-label="移除此字段"><i class="fa-solid fa-minus"></i></button>
        </div>
        <label class="acu-gacha-custom-field-value-cell">
          <textarea class="acu-gacha-custom-field-value" rows="2" maxlength="${deps.GACHA_CUSTOM_FIELD_VALUE_MAX_LENGTH}" placeholder="对应值">${deps.escapeHtml(value)}</textarea>
        </label>
      </div>
    `;
    const storedTags = String(item.tags || deps.getGachaNamedCustomField(item, deps.GACHA_TAG_FIELD_ALIASES) || '').trim();
    const storedEffect = String(item.effect || deps.getGachaNamedCustomField(item, deps.GACHA_EFFECT_FIELD_ALIASES) || '').trim();
    const customFieldEntries: [string, string][] = [
      ...(storedTags ? ([['标签', storedTags]] as [string, string][]) : []),
      ...(storedEffect ? ([['效果', storedEffect]] as [string, string][]) : []),
      ...deps.getGachaCustomFieldEntries(item).filter(
        ([key]) =>
          !deps.isGachaFieldAlias(key, deps.GACHA_TAG_FIELD_ALIASES) &&
          !deps.isGachaFieldAlias(key, deps.GACHA_EFFECT_FIELD_ALIASES),
      ),
    ];
    // 初始无任何自定义字段，只显示“新增字段➕”按钮
    const customFieldRowsHtml = customFieldEntries
      .map(([key, value]) => renderCustomFieldRowHtml(key, value))
      .join('');
    const openedItemFingerprint = existingItem ? deps.getGachaItemDefinitionFingerprint(existingItem) : '';

    $('.acu-gacha-item-editor-overlay').remove();
    if (deps.getGachaShopUiRefreshTimer()) {
      clearInterval(deps.getGachaShopUiRefreshTimer());
      deps.setGachaShopUiRefreshTimer(null);
    }
    const overlay = $(`
      <div class="acu-edit-overlay acu-gacha-item-editor-overlay acu-theme-${config.theme}">
        <form class="acu-edit-dialog acu-gacha-item-editor">
          <div class="acu-gacha-settings-header">
            <div class="acu-gacha-settings-title"><i class="fa-solid fa-box"></i> ${existingItem ? '编辑自定义物品' : '新建自定义物品'}</div>
            <div class="acu-gacha-settings-header-actions">
              ${deps.getTutorialButtonHtml('gachaItemEditor', '查看自定义物品编辑教程', 'acu-help-btn')}
              <button class="acu-close-btn acu-gacha-item-editor-close" type="button" title="关闭" aria-label="关闭自定义物品编辑器"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>
          <div class="acu-gacha-item-editor-body">
            <label class="wide acu-gacha-item-field acu-gacha-item-name-field"><span>名称</span><input class="acu-gacha-item-name" type="text" value="${deps.escapeHtml(item.name)}" maxlength="${fieldLimits.name}" required /></label>
            <div class="wide acu-gacha-item-labeled-field acu-gacha-item-type-block">
              <div class="acu-gacha-item-label-line">
                <span class="acu-gacha-item-field-label-text acu-gacha-item-type-label" data-label-value="${deps.escapeHtml(targetColumns?.type || '类型')}">${deps.escapeHtml(targetColumns?.type || '类型')}</span>
                <button class="acu-preset-btn acu-gacha-item-label-edit" type="button" data-label-key="type" title="修改类型字段名" aria-label="修改类型字段名"><i class="fa-solid fa-pen"></i></button>
              </div>
              <label class="acu-gacha-item-field acu-gacha-item-type-field"><input class="acu-gacha-item-type" type="text" value="${deps.escapeHtml(item.type)}" maxlength="40" placeholder="道具" /></label>
            </div>
            <div class="wide acu-gacha-item-labeled-field acu-gacha-item-quality-block">
              <div class="acu-gacha-item-label-line">
                <span class="acu-gacha-item-field-label-text acu-gacha-item-quality-label" data-label-value="${deps.escapeHtml(targetColumns?.quality || '品质')}">${deps.escapeHtml(targetColumns?.quality || '品质')}</span>
                <button class="acu-preset-btn acu-gacha-item-label-edit" type="button" data-label-key="quality" title="修改品质字段名" aria-label="修改品质字段名"><i class="fa-solid fa-pen"></i></button>
              </div>
              <label class="acu-gacha-item-field"><select class="acu-gacha-item-quality">${rarityOptionsHtml}</select></label>
            </div>
            <div class="wide acu-gacha-item-custom-field-block">
              <div class="acu-gacha-custom-field-rows">${customFieldRowsHtml}</div>
              <button class="acu-dialog-btn acu-gacha-custom-field-add" type="button"><i class="fa-solid fa-plus"></i> 新增字段</button>
              <div class="acu-gacha-custom-field-suggestions">
                <span>目标表头建议</span>
                <div class="acu-gacha-custom-field-suggestion-list" aria-live="polite"></div>
              </div>
            </div>
            <div class="wide acu-gacha-item-labeled-field acu-gacha-item-description-block">
              <div class="acu-gacha-item-label-line">
                <span class="acu-gacha-item-field-label-text acu-gacha-item-description-label">描述</span>
              </div>
              <label class="acu-gacha-item-field acu-gacha-item-description-field"><textarea class="acu-gacha-item-description" rows="3" maxlength="${fieldLimits.description}" placeholder="描述内容">${deps.escapeHtml(item.description || '')}</textarea></label>
            </div>
            <div class="wide acu-gacha-item-labeled-field acu-gacha-item-target-block">
              <div class="acu-gacha-item-label-line">
                <span class="acu-gacha-item-field-label-text acu-gacha-item-target-label">发放目标</span>
              </div>
              <label class="acu-gacha-item-field acu-gacha-item-target-field"><select class="acu-gacha-item-target">${targetOptionsHtml}</select></label>
            </div>
            <label class="acu-gacha-item-field acu-gacha-item-weight-field"><span>权重</span><input class="acu-gacha-item-weight" type="number" min="0.01" step="0.01" value="${deps.escapeHtml(String(item.weight || 1))}" /></label>
            <label class="acu-gacha-item-field acu-gacha-item-quantity-field"><span>发放数量</span><input class="acu-gacha-item-quantity" type="number" min="1" step="1" value="${deps.escapeHtml(String(item.grantQuantity || 1))}" /></label>
            <div class="wide acu-gacha-item-pools">
              <span>所属卡池</span>
              <div>${poolOptionsHtml}</div>
            </div>
            <div class="wide acu-gacha-icon-editor-card">
              <div class="acu-gacha-icon-editor-preview">${deps.renderGachaItemIconContent(item, deps.getGachaItemCustomTableNameIconContext(item))}</div>
              <div class="acu-gacha-icon-editor-fields">
                <label class="acu-gacha-item-field acu-gacha-item-icon-field"><span>符号图标</span><input class="acu-gacha-item-icon" type="text" value="${deps.escapeHtml(item.icon || '')}" placeholder="fa:coins / ti:wand / ✨" /></label>
                <small class="acu-gacha-icon-editor-note">图片类图标请在“图标管理预设”中按物品/装备名称统一配置。</small>
              </div>
            </div>
            <details class="wide acu-gacha-custom-fields acu-gacha-target-settings" ${targetTableValue || targetColumns ? 'open' : ''}>
              <summary>
                <span><i class="fa-solid fa-location-dot"></i> 写入目标</span>
                <small>留空则跟随当前仪表盘预设</small>
              </summary>
              <div class="acu-gacha-custom-field-panel">
                <label class="acu-gacha-item-field acu-gacha-target-table-field">
                  <span>固定目标表</span>
                  <input class="acu-gacha-item-target-table" type="text" value="${deps.escapeHtml(targetTableValue)}" maxlength="${deps.GACHA_TARGET_TABLE_MAX_LENGTH}" placeholder="例如：装扮表；留空使用仪表盘映射" />
                </label>
                <div class="acu-gacha-target-column-toolbar">
                  <strong>基础字段列映射</strong>
                  <small>只有默认关键词识别不到表头时填写；表头必须精确匹配。</small>
                </div>
                <div class="acu-gacha-target-column-grid">${targetColumnsHtml}</div>
              </div>
            </details>
            <div class="wide acu-gacha-item-flags">
              <label class="acu-gacha-item-checkbox acu-gacha-item-stackable-field"><input class="acu-gacha-item-stackable" type="checkbox" ${item.stackable ? 'checked' : ''} /> <span>可堆叠</span></label>
            </div>
          </div>
          <div class="acu-gacha-settings-footer acu-gacha-item-editor-footer">
            <button class="acu-dialog-btn acu-gacha-item-editor-close" type="button">取消</button>
            <button class="acu-dialog-btn acu-btn-confirm" type="submit"><i class="fa-solid fa-check"></i> 保存</button>
          </div>
        </form>
      </div>
    `);
    $('body').append(overlay);
    deps.hydrateCustomTableNameIconsIn(overlay);
    deps.bindTutorialButtonsIn(overlay);
    let isSubmittingItemEditor = false;
    const setItemEditorSubmitting = (submitting: boolean) => {
      isSubmittingItemEditor = submitting;
      overlay.toggleClass('is-saving', submitting);
      overlay.find('.acu-gacha-item-editor .acu-btn-confirm').prop('disabled', submitting);
    };

    const refreshEditorIconPreview = () => {
      const icon = String(overlay.find('.acu-gacha-item-icon').val() || '').trim();
      const previewItem: Pick<GachaItemDefinition, 'name' | 'type' | 'icon'> = {
        name: String(overlay.find('.acu-gacha-item-name').val() || item.name || '').trim(),
        type: String(overlay.find('.acu-gacha-item-type').val() || item.type || '').trim(),
        icon: icon || undefined,
      };
      const previewContextItem = {
        ...item,
        ...previewItem,
        rewardTarget: getEditorRewardTarget(),
        targetTable: getEditorTargetTable(),
        targetColumns: collectEditorTargetColumns(),
      };
      const $preview = overlay.find('.acu-gacha-icon-editor-preview');
      $preview.html(deps.renderGachaItemIconContent(previewItem, deps.getGachaItemCustomTableNameIconContext(previewContextItem)));
      deps.hydrateCustomTableNameIconsIn($preview);
    };
    const getEditorRewardTarget = (): GachaRewardTarget =>
      deps.normalizeGachaRewardTarget(overlay.find('.acu-gacha-item-target').val());
    const getEditorTargetTable = (): string | undefined =>
      deps.normalizeGachaTargetTable(overlay.find('.acu-gacha-item-target-table').val());
    const collectEditorTargetColumns = (): GachaRewardTargetColumns | undefined => {
      const rawColumns: Record<string, string> = {};
      overlay.find('.acu-gacha-target-column-input').each((_, element) => {
        const key = String($(element).attr('data-column-key') || '').trim();
        if (!deps.GACHA_TARGET_COLUMN_KEYS.includes(key as GachaRewardTargetColumnKey)) return;
        const value = String($(element).val() || '').trim();
        if (value) rawColumns[key] = value;
      });
      // 类型 / 品质的字段名支持通过笔图标改名，改名后按列映射写入目标表
      const typeLabelElement = overlay.find('.acu-gacha-item-type-label');
      const qualityLabelElement = overlay.find('.acu-gacha-item-quality-label');
      const typeLabel = String(typeLabelElement.attr('data-label-value') || typeLabelElement.text() || '').trim();
      const qualityLabel = String(qualityLabelElement.attr('data-label-value') || qualityLabelElement.text() || '').trim();
      if (typeLabel && typeLabel !== '类型') rawColumns.type = typeLabel;
      if (qualityLabel && qualityLabel !== '品质') rawColumns.quality = qualityLabel;
      return deps.normalizeGachaTargetColumns(rawColumns);
    };
    const getEditorTargetOptions = (): GachaRewardParseOptions => ({
      targetTable: getEditorTargetTable(),
      targetColumns: collectEditorTargetColumns(),
    });
    const getEditorTargetTableContext = (target: GachaRewardTarget, options: GachaRewardParseOptions = {}) => {
      const latestRawData = deps.getTableData({ silent: true }) || rawData;
      const parsed =
        target === 'equipment' ? deps.parseEquipmentItems(latestRawData, options) : deps.parseInventoryItems(latestRawData, options);
      const sheet = parsed.tableKey && latestRawData ? latestRawData[parsed.tableKey] : undefined;
      return { parsed, sheet };
    };
    const updateCustomFieldRowControls = () => {
      const rowCount = overlay.find('.acu-gacha-custom-field-row').length;
      overlay.find('.acu-gacha-custom-field-add').prop('disabled', rowCount >= deps.GACHA_CUSTOM_FIELD_MAX_COUNT);
    };
    const appendCustomFieldRow = (key = '', value = '') => {
      if (overlay.find('.acu-gacha-custom-field-row').length >= deps.GACHA_CUSTOM_FIELD_MAX_COUNT) {
        if (window.toastr) window.toastr.warning(`自定义字段最多只能添加 ${deps.GACHA_CUSTOM_FIELD_MAX_COUNT} 个`);
        return null;
      }
      const row = $(renderCustomFieldRowHtml(key, value));
      overlay.find('.acu-gacha-custom-field-rows').append(row);
      updateCustomFieldRowControls();
      return row;
    };
    const refreshCustomFieldHeaderSuggestions = () => {
      const target = getEditorRewardTarget();
      let parsed: GachaRewardParseResult;
      let targetOptions: GachaRewardParseOptions;
      try {
        targetOptions = getEditorTargetOptions();
        ({ parsed } = getEditorTargetTableContext(target, targetOptions));
      } catch (error) {
        const list = overlay.find('.acu-gacha-custom-field-suggestion-list').empty();
        $('<em class="acu-gacha-custom-field-suggestion-empty"></em>')
          .text(deps.getRuntimeErrorMessage(error) || '当前目标表无法解析')
          .appendTo(list);
        return;
      }
      const reservedHeaders = deps.getGachaReservedCustomFieldHeaders(target, targetOptions.targetColumns);
      const headers = Array.from(deps.buildGachaCustomFieldHeaderMap(parsed.headers).keys()).filter(headerName => {
        const isEditableStandardField =
          deps.isGachaFieldAlias(headerName, deps.GACHA_TAG_FIELD_ALIASES) ||
          deps.isGachaFieldAlias(headerName, deps.GACHA_EFFECT_FIELD_ALIASES);
        return (
          isEditableStandardField ||
          (!reservedHeaders.has(headerName) && !deps.GACHA_CUSTOM_FIELD_RESERVED_KEYS.has(headerName))
        );
      });
      const list = overlay.find('.acu-gacha-custom-field-suggestion-list').empty();
      if (!headers.length) {
        $('<em class="acu-gacha-custom-field-suggestion-empty"></em>')
          .text('当前目标表没有可写入的额外表头')
          .appendTo(list);
        return;
      }
      headers.forEach(headerName => {
        $('<button class="acu-gacha-custom-field-suggestion" type="button"></button>')
          .text(headerName)
          .attr('data-header', headerName)
          .appendTo(list);
      });
    };
    type EditorCustomFieldCollectResult = {
      tags?: string;
      effect?: string;
      customFields?: GachaCustomFields;
      message?: string;
    };
    const collectEditorCustomFields = (
      target: GachaRewardTarget,
      targetColumns?: GachaRewardTargetColumns,
    ): EditorCustomFieldCollectResult => {
      const reservedHeaders = deps.getGachaReservedCustomFieldHeaders(target, targetColumns);
      const rawFields: Record<string, string> = {};
      let tags = '';
      let effect = '';
      let message = '';

      overlay.find('.acu-gacha-custom-field-row').each((_, element) => {
        if (message) return;
        const row = $(element);
        const rawKey = String(row.find('.acu-gacha-custom-field-key').val() || '').trim();
        const rawValue = String(row.find('.acu-gacha-custom-field-value').val() || '').trim();
        if (!rawKey && !rawValue) return;
        if (!rawKey || !rawValue) {
          message = '自定义字段需要同时填写目标表头和值；如果不需要，请清空整行。';
          return;
        }
        const key = deps.truncateGachaText(rawKey, deps.GACHA_CUSTOM_FIELD_KEY_MAX_LENGTH);
        const value = deps.truncateGachaText(rawValue, deps.GACHA_CUSTOM_FIELD_VALUE_MAX_LENGTH);
        if (
          (reservedHeaders.has(key) || deps.GACHA_CUSTOM_FIELD_RESERVED_KEYS.has(key)) &&
          !deps.isGachaFieldAlias(key, deps.GACHA_TAG_FIELD_ALIASES) &&
          !deps.isGachaFieldAlias(key, deps.GACHA_EFFECT_FIELD_ALIASES)
        ) {
          message = `“${key}” 是基础字段，不能作为自定义字段；请修改字段名，或使用编辑器上方对应的基础输入项。`;
          return;
        }
        if (deps.isGachaFieldAlias(key, deps.GACHA_TAG_FIELD_ALIASES)) {
          if (tags) {
            message = '标签字段重复，请合并为一行。';
            return;
          }
          tags = value;
          return;
        }
        if (deps.isGachaFieldAlias(key, deps.GACHA_EFFECT_FIELD_ALIASES)) {
          if (effect) {
            message = '效果字段重复，请合并为一行。';
            return;
          }
          effect = value;
          return;
        }
        if (Object.prototype.hasOwnProperty.call(rawFields, key)) {
          message = `自定义字段“${key}”重复，请合并为一行。`;
          return;
        }
        if (Object.keys(rawFields).length >= deps.GACHA_CUSTOM_FIELD_MAX_COUNT) {
          message = `自定义字段最多只能保存 ${deps.GACHA_CUSTOM_FIELD_MAX_COUNT} 个。`;
          return;
        }
        rawFields[key] = value;
      });

      if (message) return { message };
      return {
        ...(tags ? { tags } : {}),
        ...(effect ? { effect } : {}),
        customFields: deps.normalizeGachaCustomFields(rawFields),
      };
    };
    const applyEditorFieldLimits = () => {
      const limits = deps.getGachaRewardFieldLimits(getEditorRewardTarget());
      const $nameInput = overlay.find('.acu-gacha-item-name');
      const $descriptionInput = overlay.find('.acu-gacha-item-description');
      const clampField = ($field: JQuery, maxLength: number) => {
        $field.attr('maxlength', String(maxLength));
        const value = String($field.val() || '');
        if (deps.countUnicodeCharacters(value) > maxLength) {
          $field.val(deps.truncateGachaText(value, maxLength));
        }
      };
      clampField($nameInput, limits.name);
      clampField($descriptionInput, limits.description);
    };
    const closeEditor = () => {
      overlay.remove();
      if (deps.getGachaShopProgressContainers().length > 0) deps.startGachaShopUiRefresh();
    };
    overlay.on('click', '.acu-gacha-item-editor-close', closeEditor);
    deps.setupOverlayClose(overlay, 'acu-gacha-item-editor-overlay', closeEditor);
    applyEditorFieldLimits();
    refreshCustomFieldHeaderSuggestions();
    updateCustomFieldRowControls();
    overlay.on('click', '.acu-gacha-custom-field-add', () => {
      const row = appendCustomFieldRow();
      row?.find('.acu-gacha-custom-field-key').trigger('focus');
    });
    overlay.on('click', '.acu-gacha-custom-field-remove', event => {
      $(event.currentTarget).closest('.acu-gacha-custom-field-row').remove();
      updateCustomFieldRowControls();
    });
    overlay.on('click', '.acu-gacha-item-label-edit', function () {
      void (async () => {
        const labelKey = String($(this).attr('data-label-key') || '').trim();
        if (labelKey !== 'type' && labelKey !== 'quality') return;
        const $labelInput = overlay.find(
          labelKey === 'type' ? '.acu-gacha-item-type-label' : '.acu-gacha-item-quality-label',
        );
        const fallbackLabel = labelKey === 'type' ? '类型' : '品质';
        const nextLabel = await deps.showGachaPoolNameDialog({
          title: `修改${fallbackLabel}字段名`,
          label: '字段名',
          initialValue: String($labelInput.attr('data-label-value') || $labelInput.text() || fallbackLabel),
          confirmText: '保存',
        });
        if (nextLabel === null) return;
        const trimmed = nextLabel.trim() || fallbackLabel;
        $labelInput.attr('data-label-value', trimmed).text(trimmed);
        refreshCustomFieldHeaderSuggestions();
        refreshEditorIconPreview();
      })();
    });
    overlay.on('click', '.acu-gacha-custom-field-suggestion', event => {
      const headerName = String($(event.currentTarget).attr('data-header') || '').trim();
      if (!headerName) return;
      let targetRow = overlay
        .find('.acu-gacha-custom-field-row')
        .filter((_, element) => !String($(element).find('.acu-gacha-custom-field-key').val() || '').trim())
        .first();
      if (!targetRow.length) {
        targetRow = appendCustomFieldRow() || $();
      }
      if (!targetRow.length) return;
      targetRow.find('.acu-gacha-custom-field-key').val(headerName);
      targetRow.find('.acu-gacha-custom-field-value').trigger('focus');
    });
    overlay.on('input change', '.acu-gacha-item-target, .acu-gacha-item-target-table, .acu-gacha-target-column-input', () => {
      refreshCustomFieldHeaderSuggestions();
    });
    let editorPreviewRaf = 0;
    const scheduleEditorPreviewRefresh = () => {
      if (editorPreviewRaf) return;
      editorPreviewRaf = window.requestAnimationFrame(() => {
        editorPreviewRaf = 0;
        if (!overlay.parent().length) return;
        applyEditorFieldLimits();
        refreshEditorIconPreview();
      });
    };
    overlay.on(
      'input change',
      '.acu-gacha-item-name, .acu-gacha-item-type, .acu-gacha-item-target, .acu-gacha-item-target-table, .acu-gacha-target-column-input, .acu-gacha-item-description, .acu-gacha-item-icon',
      () => {
        scheduleEditorPreviewRefresh();
      },
    );

    overlay.on('submit', '.acu-gacha-item-editor', function (event) {
      event.preventDefault();
      if (isSubmittingItemEditor) return;
      setItemEditorSubmitting(true);
      void (async () => {
        try {
          const name = String(overlay.find('.acu-gacha-item-name').val() || '').trim();
          const quality = String(overlay.find('.acu-gacha-item-quality').val() || '普通') as GachaRarity;
          const rewardTarget = String(overlay.find('.acu-gacha-item-target').val() || 'inventory') as GachaRewardTarget;
          const targetTable = getEditorTargetTable();
          const targetColumns = collectEditorTargetColumns();
          const description = String(overlay.find('.acu-gacha-item-description').val() || '').trim();
          const rawType = String(overlay.find('.acu-gacha-item-type').val() || '').trim();
          const type =
            rewardTarget === 'equipment'
              ? deps.inferEquipmentTableTypeForGachaItem({ id: existingItem?.id || '', name, type: rawType, description })
              : rawType || '道具';
          const icon = String(overlay.find('.acu-gacha-item-icon').val() || '').trim();
          const weight = Number(overlay.find('.acu-gacha-item-weight').val());
          const grantQuantity = Math.floor(Number(overlay.find('.acu-gacha-item-quantity').val()));
          const stackable = overlay.find('.acu-gacha-item-stackable').prop('checked') === true;
          // 唯一性由品质“唯一”派生，不再使用独立复选框
          const unique = quality === GACHA_UNIQUE_RARITY;
          const poolTags = overlay
            .find('.acu-gacha-item-pool-check:checked')
            .toArray()
            .map(element => normalizeGachaPoolId((element as HTMLInputElement).value))
            .filter(Boolean);
          const submitFieldLimits = deps.getGachaRewardFieldLimits(rewardTarget);

        if (!name) {
          if (window.toastr) window.toastr.warning('请输入物品名称');
          return;
        }
        if (deps.countUnicodeCharacters(name) > submitFieldLimits.name) {
          if (window.toastr) window.toastr.warning(`名称不能超过 ${submitFieldLimits.name} 字`);
          return;
        }
        if (deps.countUnicodeCharacters(description) > submitFieldLimits.description) {
          if (window.toastr) window.toastr.warning(`描述不能超过 ${submitFieldLimits.description} 字`);
          return;
        }
        if (!GACHA_RARITY_ORDER.includes(quality)) {
          if (window.toastr) window.toastr.warning('物品品质不合法');
          return;
        }
        if (!GACHA_REWARD_TARGETS.includes(rewardTarget)) {
          if (window.toastr) window.toastr.warning('发放目标不合法');
          return;
        }
        if (!Number.isFinite(weight) || weight <= 0) {
          if (window.toastr) window.toastr.warning('权重必须大于 0');
          return;
        }
        if (!Number.isFinite(grantQuantity) || grantQuantity <= 0) {
          if (window.toastr) window.toastr.warning('发放数量必须是正整数');
          return;
        }
        if (poolTags.length === 0) {
          if (window.toastr) window.toastr.warning('请至少选择一个卡池');
          return;
        }
        const customFieldResult = collectEditorCustomFields(rewardTarget, targetColumns);
        if (customFieldResult.message) {
          if (window.toastr) window.toastr.warning(customFieldResult.message);
          return;
        }
        const tags = customFieldResult.tags;
        const effect = customFieldResult.effect;
        const customFields = customFieldResult.customFields;
        let targetContext: ReturnType<typeof getEditorTargetTableContext>;
        try {
          targetContext = getEditorTargetTableContext(rewardTarget, {
            targetTable,
            targetColumns,
            requireNameColumn: true,
          });
        } catch (error) {
          if (window.toastr) window.toastr.warning(deps.getRuntimeErrorMessage(error) || '写入目标无法解析');
          return;
        }
        const customFieldValidation = deps.validateGachaCustomFieldsForTargetTable({
          target: rewardTarget,
          tableName: targetContext.parsed.tableName,
          headers: targetContext.parsed.headers,
          sheet: targetContext.sheet,
          item: { name, tags, effect, description, customFields, targetColumns },
          throwOnMissing: false,
        });
        if (customFieldValidation.message) {
          if (window.toastr) window.toastr.warning(customFieldValidation.message);
          return;
        }

        const draftSavedAt = Date.now();
        const draftItem: GachaItemDefinition = {
          id: existingItem?.id || deps.buildStableGachaCustomItemId({ name, quality, type }),
          name,
          type,
          quality,
          ...(tags ? { tags } : {}),
          ...(effect ? { effect } : {}),
          description,
          poolTags,
          icon: icon || undefined,
          enabled: deps.isGachaItemEnabled(item),
          order: item.order,
          createdAt: existingItem?.createdAt || draftSavedAt,
          updatedAt: draftSavedAt,
          weight,
          stackable,
          unique,
          grantQuantity,
          rewardTarget,
          ...(targetTable ? { targetTable } : {}),
          ...(targetColumns ? { targetColumns } : {}),
          ...(customFields ? { customFields } : {}),
        };

        const targetWarnings: string[] = [];
        if (!deps.validateGachaCatalogImportItemTarget(deps.getTableData({ silent: true }) || rawData, draftItem, targetWarnings)) {
          if (window.toastr) window.toastr.warning(targetWarnings[0] || '自定义物品写入目标无法通过校验');
          return;
        }

        try {
          await deps.runInSaveQueue(async () => {
            deps.setGachaCatalogCache(null);
            deps.setGachaCatalogLoadTask(null);
            await deps.ensureGachaCatalogLoaded(rawData);
            const latestCustomItems = deps.getCustomGachaItemDefinitions(rawData);
            const latestExistingItem = existingItem
              ? latestCustomItems.find(candidate => candidate.id === existingItem.id) || null
              : null;
            if (existingItem && !latestExistingItem) {
              throw new Error('这个自定义物品已被删除，请重新打开编辑器后再保存。');
            }
            if (
              existingItem &&
              latestExistingItem &&
              deps.getGachaItemDefinitionFingerprint(latestExistingItem) !== openedItemFingerprint
            ) {
              throw new Error('这个自定义物品已被其他操作更新，请重新打开编辑器后再保存。');
            }
            if (!existingItem) {
              const currentPoolIds = new Set(deps.getAllGachaPoolConfigDefinitions(rawData).map(pool => pool.id));
              const stalePoolTags = poolTags.filter(
                tag => tag !== GACHA_ALL_POOL_TAG && !currentPoolIds.has(tag) && !editorCreatablePoolIds.has(tag),
              );
              if (stalePoolTags.length > 0) {
                throw new Error(`所选卡池已被删除或更新：${stalePoolTags.join('、')}。请重新打开编辑器后再保存。`);
              }
            }
            const existingIds = new Set(deps.getAllGachaItemDefinitions(rawData).map(candidate => candidate.id));
            if (existingItem) existingIds.delete(existingItem.id);
            const id = existingItem?.id || deps.createUniqueGachaItemId(draftItem.id, existingIds);
            const savedAt = Date.now();
            const nextItem: GachaItemDefinition = {
              ...draftItem,
              id,
              enabled: latestExistingItem ? deps.isGachaItemEnabled(latestExistingItem) : deps.isGachaItemEnabled(item),
              order: latestExistingItem?.order ?? item.order,
              createdAt: latestExistingItem?.createdAt || existingItem?.createdAt || savedAt,
              updatedAt: savedAt,
            };
            const nextItems = latestExistingItem
              ? latestCustomItems.map(candidate => (candidate.id === latestExistingItem.id ? nextItem : candidate))
              : [...latestCustomItems, nextItem];
            const localStorageSnapshot = deps.collectGachaLocalStorageSnapshot([deps.STORAGE_KEY_GACHA_POOL_SETTINGS]);
            const savedCatalog = await deps.saveStoredGachaCatalog(nextItems);
            if (!savedCatalog) throw new Error('自定义物品保存失败');
            try {
              deps.ensureGachaPoolsForTags(poolTags);
            } catch (error) {
              const rolledBackCatalog = await deps.saveStoredGachaCatalog(latestCustomItems);
              const rollbackWarnings = deps.restoreGachaLocalStorageSnapshot(localStorageSnapshot);
              const message = deps.getRuntimeErrorMessage(error) || '写入卡池配置失败';
              const rollbackMessage = [
                !rolledBackCatalog ? '自定义物品目录回滚失败' : '',
                ...rollbackWarnings,
              ].filter(Boolean).join('；');
              if (rollbackMessage) throw new Error(`${message}；${rollbackMessage}`);
              throw error;
            }
          });
        } catch (error) {
          console.error('[DICE][GACHA]保存自定义物品失败:', error);
          if (window.toastr)
            showActionableErrorToast(`自定义物品保存失败: ${deps.getJsonLikeErrorMessage(error)}`, { suggestion: 'importExport' });
          return;
        }
        deps.refreshGachaVisualization(rawData);
        deps.refreshGachaShardShop();
        closeEditor();
        if (window.toastr) window.toastr.success(existingItem ? '自定义物品已更新' : '自定义物品已创建');
        void deps.showGachaSettingsDialog();
        } finally {
          if (overlay.parent().length > 0) setItemEditorSubmitting(false);
          else isSubmittingItemEditor = false;
        }
      })();
    });
  };
  return showGachaItemEditorDialog;
}
