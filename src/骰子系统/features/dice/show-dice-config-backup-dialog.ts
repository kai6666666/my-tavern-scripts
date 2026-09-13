// @ts-nocheck
/**
 * show-dice-config-backup-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowDiceConfigBackupDialog(deps: any) {
  const showDiceConfigBackupDialog = (): void => {
    const { $ } = deps.getCore();
    const config = deps.getConfig();
    $('.acu-config-backup-overlay').remove();

    const dialog = $(`
      <div class="acu-config-backup-overlay acu-theme-${deps.escapeHtml(config.theme)}">
        <div class="acu-config-backup-dialog">
          <div class="acu-config-backup-header">
            <div class="acu-config-backup-heading">
              <i class="fa-solid fa-arrows-rotate acu-config-backup-title-icon"></i>
              <div class="acu-config-backup-title-copy">
                <div class="acu-config-backup-title">配置方案与备份</div>
                <div class="acu-config-backup-subtitle">保存、应用、导入与导出骰子系统配置。</div>
              </div>
            </div>
            <div class="acu-config-backup-header-actions">
              ${deps.getTutorialButtonHtml('configBackup', '查看备份与还原教程', 'acu-config-backup-tutorial-btn')}
              <button type="button" class="acu-config-backup-close acu-close-btn" title="关闭" aria-label="关闭备份与还原"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>
          <div class="acu-config-backup-body acu-profile-manager-body"><div class="acu-config-backup-empty">正在读取配置方案...</div></div>
          <div class="acu-config-backup-footer">
            <div class="acu-config-backup-footer-actions">
              <button type="button" id="acu-config-backup-pick-file" class="acu-setting-action-btn acu-config-backup-footer-btn" title="导入配置方案或备份"><i class="fa-solid fa-file-import"></i> 导入</button>
              <button type="button" id="acu-profile-save-current" class="acu-setting-action-btn acu-config-backup-footer-btn" title="把当前勾选的设置保存为方案"><i class="fa-solid fa-floppy-disk"></i> 保存方案</button>
              <button type="button" id="acu-config-backup-cancel" class="acu-setting-action-btn acu-config-backup-footer-btn acu-config-backup-primary-btn" title="关闭"><i class="fa-solid fa-xmark"></i> 关闭</button>
            </div>
          </div>
        </div>
      </div>`);

    const closeDialog = () => dialog.remove();
    $('body').append(dialog);
    deps.bindTutorialButtonsIn(dialog);
    deps.setupOverlayClose(dialog, 'acu-config-backup-overlay', closeDialog);

    const refreshBody = async () => {
      dialog.find('.acu-config-backup-body').html('<div class="acu-config-backup-empty">正在读取配置方案...</div>');
      dialog.find('.acu-config-backup-body').html(await deps.renderDiceProfileManagerBody());
      updateDiceProfileSaveScopeMeta();
    };

    const updateDiceProfileSaveScopeMeta = () => {
      const saveScope = dialog.find('.acu-profile-module-section');
      if (saveScope.length === 0) return;
      const checkboxes = saveScope.find<HTMLInputElement>('.acu-config-backup-module-checkbox');
      const selectedCount = checkboxes.filter(':checked').length;
      const totalCount = checkboxes.length;
      const text = totalCount > 0 ? `已选 ${selectedCount}/${totalCount} 个模块` : '勾选要存入方案的设置';
      saveScope.find('[data-profile-save-scope-meta]').text(text);
    };

    void refreshBody();

    dialog.on('click', '.acu-config-backup-close', closeDialog);
    dialog.on('click', '#acu-config-backup-cancel', closeDialog);
    dialog.on('click', '.acu-profile-collapse-header', function () {
      const section = $(this).closest('.acu-profile-collapsible');
      const sectionId = String(section.data('profile-section') || '');
      if (!sectionId) return;
      const nextCollapsed = !section.hasClass('collapsed');
      section.toggleClass('collapsed', nextCollapsed);
      $(this).attr('aria-expanded', nextCollapsed ? 'false' : 'true');
      const collapsedSections = deps.getDiceProfileCollapsedSections();
      deps.saveDiceProfileCollapsedSections(
        nextCollapsed
          ? [...collapsedSections, sectionId]
          : collapsedSections.filter(item => item !== sectionId),
      );
      const manager = section.closest('.acu-profile-manager');
      if (manager.length > 0) {
        const libraryCollapsed = manager.find('.acu-profile-library').hasClass('collapsed');
        const saveScopeCollapsed = manager.find('.acu-profile-module-section').hasClass('collapsed');
        manager.toggleClass('is-library-collapsed', libraryCollapsed);
        manager.toggleClass('is-save-scope-collapsed', saveScopeCollapsed);
      }
    });
    dialog.on('click', '.acu-profile-tab', function () {
      const tab = $(this);
      const target = String(tab.data('profile-tab') || '');
      const library = tab.closest('.acu-profile-library');
      if (!target || library.length === 0) return;
      library.find('.acu-profile-tab').removeClass('is-active').attr('aria-selected', 'false');
      tab.addClass('is-active').attr('aria-selected', 'true');
      library.find('.acu-profile-tab-panel').prop('hidden', true).removeClass('is-active');
      library.find(`.acu-profile-tab-panel[data-profile-panel="${target}"]`).prop('hidden', false).addClass('is-active');
    });
    dialog.on('click', '.acu-config-backup-select-all', function () {
      $(this)
        .closest('.acu-profile-module-section, .acu-config-backup-content')
        .find<HTMLInputElement>('.acu-config-backup-module-checkbox')
        .prop('checked', true);
      updateDiceProfileSaveScopeMeta();
    });
    dialog.on('click', '.acu-config-backup-invert', function () {
      $(this)
        .closest('.acu-profile-module-section, .acu-config-backup-content')
        .find<HTMLInputElement>('.acu-config-backup-module-checkbox')
        .each((_, element) => {
        element.checked = !element.checked;
      });
      updateDiceProfileSaveScopeMeta();
    });
    dialog.on('click', '.acu-config-backup-clear', function () {
      $(this)
        .closest('.acu-profile-module-section, .acu-config-backup-content')
        .find<HTMLInputElement>('.acu-config-backup-module-checkbox')
        .prop('checked', false);
      updateDiceProfileSaveScopeMeta();
    });
    dialog.on('change', '.acu-profile-module-section .acu-config-backup-module-checkbox', updateDiceProfileSaveScopeMeta);
    dialog.on('click', '#acu-config-backup-export', async function () {
      const button = this as HTMLButtonElement;
      try {
        button.disabled = true;
        const selectedIds = deps.getDiceConfigBackupSelectedModuleIdsFromDialog(dialog);
        const backup = await deps.buildDiceConfigBackup(selectedIds);
        const confirmed = await deps.showDiceConfigBackupPrivacyConfirm('export', selectedIds, backup);
        if (!confirmed) return;
        deps.downloadDiceConfigBackupJson(backup);
        const warningCount = deps.getDiceConfigBackupWarningCount(backup);
        if (warningCount > 0) {
          toastr.info(`配置备份已导出；${warningCount} 条备份说明已写入文件。`);
        } else {
          toastr.success('配置备份已导出');
        }
      } catch (error) {
        showActionableErrorToast(error instanceof Error ? error.message : '导出失败', {
          title: '导出失败',
          suggestion: 'importExport',
        });
      } finally {
        button.disabled = false;
      }
    });

    dialog.on('click', '#acu-config-backup-pick-file', () => {
      void (async () => {
        const selected = await deps.pickTextFile();
        if (!selected) return;
        try {
          const basename = selected.file.name.replace(/\.(jsonc?|txt)$/i, '');
          const profile = await deps.importDiceProfile(selected.text, {
            name: basename,
            source: { type: 'imported', label: selected.file.name },
          });
          toastr.success(`已导入配置方案：${profile.name}`);
          await refreshBody();
        } catch (error) {
          showActionableErrorToast(error instanceof Error ? error.message : '读取配置方案文件失败', {
            title: '导入失败',
            suggestion: 'importExport',
          });
        }
      })();
    });

    dialog.on('click', '#acu-profile-save-current', async function () {
      const button = this as HTMLButtonElement;
      try {
        const selectedIds = deps.getDiceConfigBackupSelectedModuleIdsFromDialog(dialog).filter(moduleId =>
          deps.getAllDiceConfigBackupModuleIds().includes(moduleId),
        );
        if (selectedIds.length === 0) {
          toastr.warning('请至少选择一个模块');
          return;
        }
        const name = await deps.showDiceSystemInputDialog({
          title: '保存配置方案',
          message: '配置方案名称',
          iconClass: 'fa-floppy-disk',
          initialValue: `我的骰子系统配置方案 ${new Date().toISOString().slice(0, 10)}`,
          confirmText: '保存',
        });
        if (!name) return;
        button.disabled = true;
        const profile = await deps.saveCurrentDiceProfile({ name, moduleIds: selectedIds, source: { type: 'user' } });
        toastr.success(`已保存配置方案：${profile.name}`);
        await refreshBody();
      } catch (error) {
        showActionableErrorToast(error instanceof Error ? error.message : '保存配置方案失败', {
          title: '保存失败',
          suggestion: 'importExport',
        });
      } finally {
        button.disabled = false;
      }
    });

    dialog.on('click', '.acu-profile-action', async function () {
      const button = this as HTMLButtonElement;
      const profileId = String($(button).data('profile-id') || '');
      const action = String($(button).data('profile-action') || '');
      if (!profileId || !action) return;
      try {
        button.disabled = true;
        if (action === 'apply') {
          const stats = await deps.applyDiceProfile(profileId, { createSnapshot: true, confirm: true });
          const warningText = stats.warnings.length > 0 ? `，${stats.warnings.length} 条提示请查看控制台` : '';
          if (stats.warnings.length > 0) console.warn('[DICE][PROFILE]配置方案应用提示:', stats.warnings);
          toastr.success(
            `配置方案应用完成：新增 ${stats.added}，覆盖 ${stats.overwritten}，跳过 ${stats.skipped}${warningText}`,
          );
          await refreshBody();
          return;
        }
        if (action === 'export') {
          const profile = await deps.exportDiceProfile(profileId);
          deps.downloadDiceProfileJson(profile);
          toastr.success('配置方案已导出');
          return;
        }
        if (action === 'tavern-regex') {
          const profile = await deps.exportDiceProfile(profileId);
          deps.downloadDiceProfileTavernRegex(profile);
          toastr.success('已转换为酒馆正则文件');
          return;
        }
        if (action === 'rename') {
          const profile = await deps.exportDiceProfile(profileId);
          if (deps.isDiceProfileCharacterSource(profile.source)) return;
          const name = await deps.showDiceSystemInputDialog({
            title: '重命名配置方案',
            message: '配置方案名称',
            iconClass: 'fa-pen',
            initialValue: profile.name,
            confirmText: '重命名',
          });
          const nextName = String(name || '').trim();
          if (!nextName || nextName === profile.name) return;
          const now = new Date().toISOString();
          await deps.saveDiceProfileRecord({
            ...profile,
            name: nextName,
            savedAt: now,
            updatedAt: now,
          });
          toastr.success(`已重命名为：${nextName}`);
          await refreshBody();
          return;
        }
        if (action === 'delete') {
          const profile = await deps.exportDiceProfile(profileId);
          if (deps.isDiceProfileCharacterSource(profile.source)) return;
          const confirmed = await deps.showDiceSystemConfirmDialog({
            title: '删除配置方案',
            message: `删除「${profile.name}」？`,
            detail: '删除只会移除方案库里的记录，不会撤销已经应用到骰子系统的配置。',
            iconClass: 'fa-trash',
            confirmText: '删除配置方案',
            cancelText: '取消',
            tone: 'danger',
          });
          if (!confirmed) return;
          await deps.deleteDiceProfileRecord(profileId);
          toastr.success('配置方案已删除');
          await refreshBody();
          return;
        }
        if (action === 'save-as') {
          const profile = await deps.exportDiceProfile(profileId);
          if (deps.isDiceProfileCharacterSource(profile.source)) return;
          const name = await deps.showDiceSystemInputDialog({
            title: '另存为配置方案',
            message: '新配置方案名称',
            iconClass: 'fa-copy',
            initialValue: `${profile.name} 副本`,
            confirmText: '另存为',
          });
          if (!name) return;
          const now = new Date().toISOString();
          const copy = deps.normalizeDiceProfileRecord(
            {
              ...profile,
              id: deps.createDiceProfileRuntimeId('profile_copy'),
              name,
              source: { type: 'user' },
              createdAt: now,
              updatedAt: now,
            },
            { now, source: { type: 'user' } },
          );
          await deps.saveDiceProfileRecord(copy);
          toastr.success(`已另存为配置方案：${copy.name}`);
          await refreshBody();
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (message !== '已取消应用配置方案') {
          showActionableErrorToast(message || '配置方案操作失败', {
            title: '配置方案操作失败',
            suggestion: 'importExport',
            developerHint: true,
          });
        }
      } finally {
        button.disabled = false;
      }
    });
  };
  return showDiceConfigBackupDialog;
}
