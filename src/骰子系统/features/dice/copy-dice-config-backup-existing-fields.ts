// @ts-nocheck
/**
 * copy-dice-config-backup-existing-fields.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCopyDiceConfigBackupExistingFields(deps: any) {
  const copyDiceConfigBackupExistingFields = (
    source: Record<string, unknown>,
    target: Record<string, unknown>,
    fields: readonly string[],
  ): void => {
    fields.forEach(field => {
      if (Object.prototype.hasOwnProperty.call(source, field)) {
        const value = source[field];
        target[field] = value === undefined ? undefined : deps.cloneDiceConfigBackupValue(value);
      }
    });
  };
  return copyDiceConfigBackupExistingFields;
}
