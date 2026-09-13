// @ts-nocheck
/**
 * get-dice-config-backup-module-warnings.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDiceConfigBackupModuleWarnings(deps: any) {
  const getDiceConfigBackupModuleWarnings = (
    moduleId: DiceConfigBackupModuleId,
    storage: Record<string, unknown>,
    resources: Record<string, unknown> = {},
  ): string[] => {
    const warnings: string[] = [];
    if (moduleId === 'avatarMap') {
      warnings.push('本地上传头像图片存放在 IndexedDB 中，不会进入该备份包；仅备份 URL、偏移、缩放与别名配置。');
    }
    if (moduleId === 'customIcons' && deps.hasDiceConfigBackupLocalImageReference(storage)) {
      warnings.push('检测到本地图标引用；备份包只包含图标配置元数据，不包含 IndexedDB 中的图片二进制。');
    }
    if (
      moduleId === 'gachaSettings' &&
      (deps.hasDiceConfigBackupLocalImageReference(storage) || deps.hasDiceConfigBackupLocalImageReference(resources))
    ) {
      warnings.push('检测到商城本地图标引用；备份包不包含 IndexedDB 中的图片二进制，也不包含当前聊天抽取状态。');
    }
    if (moduleId === 'validation' || moduleId === 'regex') {
      warnings.push('内置预设规则会以当前脚本版本为准；备份包只保存自定义规则和内置规则的启用/拦截等偏好。');
    }
    if (moduleId === 'tableTemplate') {
      const hasTemplate = resources[deps.DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY] !== undefined;
      warnings.push(
        hasTemplate
          ? '备份包含当前聊天生效的数据库表格模板；恢复时会导入到数据库模板列表，如果已有同名模板会覆盖同名模板。'
          : '未读取到可备份的数据库表格模板，备份文件中不会包含可恢复的模板内容。',
      );
    }
    return warnings;
  };
  return getDiceConfigBackupModuleWarnings;
}
