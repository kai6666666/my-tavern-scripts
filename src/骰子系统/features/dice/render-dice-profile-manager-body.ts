// @ts-nocheck
/**
 * render-dice-profile-manager-body.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderDiceProfileManagerBody(deps: any) {
  const renderDiceProfileManagerBody = async (): Promise<string> => {
    let characterDetection: DiceCharacterProfileDetection | null = null;
    try {
      characterDetection = await deps.detectCharacterDiceProfile({ includeSkipped: true });
    } catch (error) {
      console.warn('[DICE][PROFILE]读取当前角色卡配置方案失败:', error);
    }
    const summaries = await deps.refreshDiceProfileIndex();
    const snapshots = summaries.filter(summary => summary.source?.type === 'snapshot');
    const regularProfiles = summaries.filter(
      summary => summary.source?.type !== 'snapshot' && !deps.isDiceProfileCharacterSource(summary.source),
    );
    const characterProfiles = characterDetection ? [deps.toDiceProfileSummary(characterDetection.profile)] : [];
    const collapsedSections = deps.getDiceProfileCollapsedSections();
    const isProfileLibraryCollapsed = collapsedSections.includes('library');
    const isSaveScopeCollapsed = collapsedSections.includes('saveScope');
    const managerStateClasses = [
      isProfileLibraryCollapsed ? 'is-library-collapsed' : '',
      isSaveScopeCollapsed ? 'is-save-scope-collapsed' : '',
    ].filter(Boolean).join(' ');
    return `
      <div class="acu-config-backup-content acu-profile-manager ${managerStateClasses}">
        <section class="acu-profile-collapsible acu-profile-library ${isProfileLibraryCollapsed ? 'collapsed' : ''}" data-profile-section="library">
          <button type="button" class="acu-profile-collapse-header" aria-expanded="${isProfileLibraryCollapsed ? 'false' : 'true'}">
            <div class="acu-profile-collapse-title">
              <i class="fa-solid fa-layer-group"></i><span>方案管理</span>
            </div>
            <div class="acu-profile-collapse-meta">应用前保存快照，保留最近 ${deps.DICE_PROFILE_PRE_APPLY_SNAPSHOT_LIMIT} 个</div>
            <i class="fa-solid fa-chevron-down acu-profile-collapse-chevron"></i>
          </button>
          <div class="acu-profile-collapse-body acu-profile-library-body">
            <div class="acu-profile-tabs" role="tablist" aria-label="配置方案分类">
              <button type="button" class="acu-profile-tab is-active" data-profile-tab="character" role="tab" aria-selected="true"><span>角色卡</span><em>${characterProfiles.length}</em></button>
              <button type="button" class="acu-profile-tab" data-profile-tab="library" role="tab" aria-selected="false"><span>方案库</span><em>${regularProfiles.length}</em></button>
              <button type="button" class="acu-profile-tab" data-profile-tab="snapshots" role="tab" aria-selected="false"><span>快照</span><em>${snapshots.length}</em></button>
            </div>
            <div class="acu-profile-tab-panels">
              ${deps.renderDiceProfileTabPanel('character', characterProfiles, '当前角色卡暂无内置方案', { active: true, current: true })}
              ${deps.renderDiceProfileTabPanel('library', regularProfiles, '暂无方案，可保存或导入')}
              ${deps.renderDiceProfileTabPanel('snapshots', snapshots, '暂无快照，应用时自动创建')}
            </div>
          </div>
        </section>
        <section class="acu-profile-collapsible acu-profile-section acu-profile-module-section ${isSaveScopeCollapsed ? 'collapsed' : ''}" data-profile-section="saveScope">
          <button type="button" class="acu-profile-collapse-header" aria-expanded="${isSaveScopeCollapsed ? 'false' : 'true'}">
            <div class="acu-profile-collapse-title">
              <i class="fa-solid fa-list-check"></i><span>保存范围</span>
            </div>
            <div class="acu-profile-collapse-meta" data-profile-save-scope-meta>勾选要存入方案的设置</div>
            <i class="fa-solid fa-chevron-down acu-profile-collapse-chevron"></i>
          </button>
          <div class="acu-profile-collapse-body acu-profile-save-scope-body">
            <div class="acu-config-backup-selection-actions">
              <button type="button" class="acu-config-backup-select-all acu-setting-action-btn acu-config-backup-mini-btn">全选</button>
              <button type="button" class="acu-config-backup-invert acu-setting-action-btn acu-config-backup-mini-btn">反选</button>
              <button type="button" class="acu-config-backup-clear acu-setting-action-btn acu-config-backup-mini-btn">清空选择</button>
            </div>
            <div class="acu-config-backup-module-list acu-profile-module-list">
              ${deps.renderDiceConfigBackupModuleRows(deps.DICE_CONFIG_BACKUP_MODULES.map(module => module.id))}
            </div>
          </div>
        </section>
      </div>`;
  };
  return renderDiceProfileManagerBody;
}
