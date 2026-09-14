// @ts-nocheck
/**
 * attribute-preset-manager-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { PRESET_FORMAT_VERSION } from '../../shared/constants';
import { Store } from '../../shared/storage/store';
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowAttributePresetManager(deps: any) {
  const showAttributePresetManager = () => {
    const { $ } = deps.getCore();
    $('.acu-edit-overlay').remove();
    deps.pushModal('showAttributePresetManager', showAttributePresetManager);

    const config = deps.getConfig();
    const presets = deps.AttributePresetManager.getAllPresets();
    const activeId = Store.get(deps.STORAGE_KEY_ACTIVE_ATTR_PRESET, null);

    // 生成默认规则项HTML（当activeId为null时启用）
    const isDefaultActive = activeId === null;
    const defaultPresetHtml = `
      <div class="acu-preset-item" data-id="__default__">
        <div class="acu-preset-info">
          <div class="acu-preset-name">
            六维属性百分制
            <span class="acu-preset-badge">默认</span>
          </div>
          <div class="acu-preset-desc">使用百分制生成六维基础属性（力量、敏捷、体质、智力、感知、魅力），范围5-95</div>
          <div class="acu-preset-stats">
            基础属性: 6 | 特别属性: 0
          </div>
        </div>
          <div class="acu-preset-actions">
            <label class="acu-toggle">
              <input type="checkbox" class="acu-preset-toggle" data-id="__default__" ${isDefaultActive ? 'checked' : ''}>
              <span class="acu-toggle-slider"></span>
            </label>
            <button type="button" class="acu-preset-btn acu-preset-copy" data-id="__default__" title="复制为属性预设" aria-label="复制为属性预设"><i class="fa-solid fa-copy"></i></button>
            <button type="button" class="acu-preset-btn acu-preset-export" data-id="__default__" title="导出" aria-label="导出属性预设"><i class="fa-solid fa-download"></i></button>
          </div>
        </div>
    `;

    // 生成预设列表HTML
    const presetsHtml = presets
      .map(preset => {
        const isActive = preset.id === activeId;
        const isBuiltin = preset.builtin;

        return `
        <div class="acu-preset-item" data-id="${deps.escapeHtml(preset.id)}">
          <div class="acu-preset-info">
            <div class="acu-preset-name">
              ${deps.escapeHtml(preset.name)}
              ${isBuiltin ? `<span class="acu-preset-badge">内置</span>` : ''}
            </div>
            ${preset.description ? `<div class="acu-preset-desc">${deps.escapeHtml(preset.description)}</div>` : ''}
            <div class="acu-preset-stats">
              基础属性: ${preset.baseAttributes.length} | 特别属性: ${preset.specialAttributes?.length || 0}
            </div>
          </div>
          <div class="acu-preset-actions">
            <label class="acu-toggle">
              <input type="checkbox" class="acu-preset-toggle" data-id="${deps.escapeHtml(preset.id)}" ${isActive ? 'checked' : ''}>
              <span class="acu-toggle-slider"></span>
            </label>
            ${
              isBuiltin
                ? `<button type="button" class="acu-preset-btn acu-preset-copy" data-id="${deps.escapeHtml(preset.id)}" title="复制为属性预设" aria-label="复制为属性预设"><i class="fa-solid fa-copy"></i></button>`
                : `<button type="button" class="acu-preset-btn acu-preset-edit" data-id="${deps.escapeHtml(preset.id)}" title="编辑" aria-label="编辑属性预设"><i class="fa-solid fa-pen"></i></button>`
            }
            <button type="button" class="acu-preset-btn acu-preset-export" data-id="${deps.escapeHtml(preset.id)}" title="导出" aria-label="导出属性预设"><i class="fa-solid fa-download"></i></button>
            ${!isBuiltin ? `<button type="button" class="acu-preset-btn acu-preset-delete" data-id="${deps.escapeHtml(preset.id)}" title="删除" aria-label="删除属性预设"><i class="fa-solid fa-trash"></i></button>` : ''}
          </div>
        </div>
      `;
      })
      .join('');

    // 合并默认规则和预设列表
    const allPresetsHtml = defaultPresetHtml + presetsHtml;

    const overlay = $(`
      <div class="acu-edit-overlay">
        <div class="acu-edit-dialog acu-attribute-preset-manager-dialog acu-advanced-preset-manager-dialog acu-theme-${config.theme}">
          <div class="acu-advanced-preset-header">
            <h3>
              <i class="fa-solid fa-dice-d20"></i> 属性预设
            </h3>
            <div class="acu-advanced-preset-header-actions">
              ${deps.getTutorialButtonHtml('attributePresetManager', '查看属性预设教程', 'acu-help-btn')}
              <button type="button" class="acu-close-btn" aria-label="关闭属性预设管理" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>

          <div class="acu-advanced-preset-body">
            <div id="acu-presets-list">
              ${allPresetsHtml || `<div style="text-align: center; padding: 40px; color: var(--acu-text-sub);">暂无属性预设</div>`}
            </div>
          </div>

          <div class="acu-advanced-preset-footer">
            <button type="button" id="acu-preset-new" class="acu-dialog-btn acu-btn-confirm acu-advanced-preset-footer-main" title="新建属性预设" aria-label="新建属性预设">
              <i class="fa-solid fa-plus"></i> 新建
            </button>
            <button type="button" id="acu-preset-import" class="acu-dialog-btn">
              <i class="fa-solid fa-file-import"></i> 导入
            </button>
            <button type="button" id="acu-preset-back" class="acu-dialog-btn">
              <i class="fa-solid fa-arrow-left"></i> 返回
            </button>
          </div>

          <input type="file" id="acu-preset-file-input" class="acu-advanced-preset-file-input" accept="${deps.JSONC_FILE_ACCEPT}" />
        </div>
      </div>
    `);

    $('body').append(overlay);
    deps.bindTutorialButtonsIn(overlay);

    // 关闭按钮
    overlay.find('.acu-close-btn, #acu-preset-back').on('click', () => {
      overlay.remove();
      deps.popModal();
    });

    // Toggle切换预设激活状态
    overlay.on('change', '.acu-preset-toggle', function () {
      const $toggle = $(this);
      const id = $toggle.data('id');
      const isChecked = $toggle.is(':checked');

      if (isChecked) {
        // 激活该预设（如果是默认规则，id为"__default__"，需要设置为null）
        const finalId = id === '__default__' ? null : id;
        deps.AttributePresetManager.setActivePreset(finalId);

        // 将其他所有toggle设置为未选中状态（确保只有一个激活）
        overlay.find('.acu-preset-toggle').each(function () {
          const $thisToggle = $(this);
          const thisId = $thisToggle.data('id');
          if (thisId !== id) {
            $thisToggle.prop('checked', false);
          }
        });
      } else {
        // 取消激活（设置为null，使用默认规则）
        deps.AttributePresetManager.setActivePreset(null);
      }
    });

    // 编辑预设
    overlay.on('click', '.acu-preset-edit', function () {
      const id = $(this).data('id');
      overlay.remove();
      deps.showAttributePresetEditor(id);
    });

    // 导出预设
    overlay.on('click', '.acu-preset-export', function () {
      const id = $(this).data('id');

      let json;
      let filename;

      if (id === '__default__') {
        // 导出默认预设（六维属性百分制）
        const STANDARD_ATTRS = ['力量', '敏捷', '体质', '智力', '感知', '魅力'];
        const defaultPresetData = {
          format: 'acu_attr_preset_v1',
          version: PRESET_FORMAT_VERSION,
          id: 'default_percentile',
          name: '六维属性百分制',
          description: '使用百分制生成六维基础属性（力量、敏捷、体质、智力、感知、魅力），范围5-95',
          quickSelect: deps.ATTRIBUTE_QUICK_SELECT_DEFAULT,
          baseAttributes: STANDARD_ATTRS.map(name => ({
            name,
            formula: '3d6*5',
            range: [15, 90],
            modifier: '1d10-5',
          })),
          specialAttributes: [],
        };
        json = JSON.stringify(defaultPresetData, null, 2);
        filename = `acu_preset_六维属性百分制_${Date.now()}.json`;
      } else {
        json = deps.AttributePresetManager.exportPreset(id);
        if (!json) {
          if (window.toastr) showActionableErrorToast('导出失败', { title: '属性预设导出失败', suggestion: 'importExport' });
          return;
        }
        const preset = presets.find(p => p.id === id);
        filename = `acu_preset_${preset?.name || id}_${Date.now()}.json`;
      }

      deps.downloadJsonFile(json, filename);
    });

    // 删除预设
    overlay.on('click', '.acu-preset-delete', async function () {
      const id = $(this).data('id');
      const preset = presets.find(p => p.id === id);

      const confirmed = await deps.showDiceSystemConfirmDialog({
        title: '删除属性预设',
        message: `确定要删除预设「${preset?.name || '未命名预设'}」吗？`,
        detail: '删除后需要重新导入或手动创建才能恢复。',
        iconClass: 'fa-trash',
        confirmText: '删除预设',
        cancelText: '取消',
        tone: 'danger',
      });
      if (confirmed) {
        const success = deps.AttributePresetManager.deletePreset(id);
        if (success) {
          overlay.remove();
          showAttributePresetManager();
        } else {
          if (window.toastr) showActionableErrorToast('删除失败', { title: '属性预设删除失败', suggestion: 'save' });
        }
      }
    });

    // 复制预设为自定义预设
    overlay.on('click', '.acu-preset-copy', function () {
      const id = $(this).data('id');

      let copyData;
      if (id === '__default__') {
        // 复制默认预设（六维属性百分制）
        // 使用与内置预设相同的数据结构：formula + range + modifier
        const STANDARD_ATTRS = ['力量', '敏捷', '体质', '智力', '感知', '魅力'];
        copyData = {
          name: '六维属性百分制 (副本)',
          description: '使用百分制生成六维基础属性（力量、敏捷、体质、智力、感知、魅力），范围5-95',
          quickSelect: deps.ATTRIBUTE_QUICK_SELECT_DEFAULT,
          baseAttributes: STANDARD_ATTRS.map(name => ({
            name,
            formula: '3d6*5',
            range: [15, 90],
            modifier: '1d10-5',
          })),
          specialAttributes: [],
        };
      } else {
        // 复制内置预设
        const preset = presets.find(p => p.id === id);
        if (!preset) return;

        copyData = {
          name: preset.name + ' (副本)',
          description: preset.description || '',
          quickSelect: JSON.parse(JSON.stringify(preset.quickSelect || deps.ATTRIBUTE_QUICK_SELECT_DEFAULT)),
          baseAttributes: JSON.parse(JSON.stringify(preset.baseAttributes)),
          specialAttributes: JSON.parse(JSON.stringify(preset.specialAttributes || [])),
        };
      }

      const newPreset = deps.AttributePresetManager.createPreset(copyData);
      if (newPreset) {
        if (window.toastr) window.toastr.success(`已创建副本：${newPreset.name}`);
        overlay.remove();
        showAttributePresetManager(); // 刷新列表
      }
    });

    // 新建预设
    overlay.find('#acu-preset-new').on('click', () => {
      overlay.remove();
      deps.showAttributePresetEditor();
    });

    // 导入预设
    overlay.find('#acu-preset-import').on('click', () => {
      overlay.find('#acu-preset-file-input').click();
    });

    overlay.find('#acu-preset-file-input').on('change', function (e) {
      const input = e.target as HTMLInputElement;
      const file = input.files?.[0];
      if (!file) return;

      void (async () => {
        try {
          const jsonStr = await deps.readTextFile(file);
          if (!jsonStr?.trim()) return;

          // 先解析 JSONC 获取预设名称，检查是否有同名预设
          let parsedData: Record<string, unknown>;
          try {
            parsedData = deps.parseJsoncRecord(jsonStr.trim(), '属性预设');
          } catch (error) {
            console.error('[DICE]ACU 属性预设 JSONC 解析失败:', error);
            if (window.toastr) showActionableErrorToast('JSONC 格式无效', { suggestion: 'importExport' });
            return;
          }

          const importingName =
            typeof parsedData.name === 'string' && parsedData.name.trim() ? parsedData.name.trim() : '导入的预设';
          const existingPresets = deps.AttributePresetManager.getAllPresets();
          const existingNames = existingPresets.map(p => p.name);
          const hasConflict = existingNames.includes(importingName);

          // 执行导入的函数
          const doImport = (overwrite: boolean, newName?: string) => {
            // 如果需要重命名，修改JSON中的名称
            let finalJson = jsonStr.trim();
            if (newName) {
              parsedData.name = newName;
              // 同时生成新的ID避免ID冲突
              parsedData.id = `attr_preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
              finalJson = JSON.stringify(parsedData);
            }

            // 如果是覆盖模式且存在同名预设，先删除旧预设
            if (overwrite && hasConflict) {
              const existingPreset = existingPresets.find(p => p.name === importingName);
              if (existingPreset && !existingPreset.builtin) {
                deps.AttributePresetManager.deletePreset(existingPreset.id);
              }
            }

            const imported = deps.AttributePresetManager.importPreset(finalJson);
            if (imported) {
              overlay.remove();
              showAttributePresetManager();
            } else {
              if (window.toastr) showActionableErrorToast('导入失败：格式不正确', { suggestion: 'importExport' });
            }
          };

          // 如果有冲突，显示冲突处理弹窗
          if (hasConflict) {
            deps.showPresetConflictDialog({
              presetName: importingName,
              presetType: '属性预设',
              existingNames,
              onOverwrite: () => doImport(true),
              onRename: newName => doImport(false, newName),
              onCancel: () => {},
            });
          } else {
            // 无冲突，直接导入
            doImport(false);
          }
        } catch (err) {
          console.error('[DICE]ACU 导入预设失败:', err);
          if (window.toastr) showActionableErrorToast('导入失败: ' + deps.getJsonLikeErrorMessage(err), { suggestion: 'importExport' });
        } finally {
          input.value = '';
        }
      })();
    });

    // 点击遮罩关闭
    deps.setupOverlayClose(overlay, 'acu-edit-overlay', () => {
      overlay.remove();
      deps.popModal();
    });
  };
  return showAttributePresetManager;
}
