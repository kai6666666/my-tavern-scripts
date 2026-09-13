// @ts-nocheck
/**
 * validate-gacha-custom-fields-for-existing-row.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createValidateGachaCustomFieldsForExistingRow(deps: any) {
  const validateGachaCustomFieldsForExistingRow = (options: GachaExistingCustomFieldValidationOptions): void => {
    const validation = deps.validateGachaCustomFieldsForTargetTable({ ...options, throwOnMissing: false });
    if (validation.missingHeaders.length === 0) return;

    const headerMap = deps.buildGachaCustomFieldHeaderMap(options.headers);
    const missingEmptyHeaders = validation.missingHeaders.filter(headerName => {
      const columnIndex = headerMap.get(headerName);
      return typeof columnIndex !== 'number' || !String(options.row[columnIndex] ?? '').trim();
    });
    if (missingEmptyHeaders.length === 0) return;

    throw new Error(
      deps.withTableTemplateCheckHint(
        `向目标表“${options.tableName}”写入扭蛋奖励“${options.item.name}”前，发现必填自定义列缺少值：${missingEmptyHeaders.join('、')}。当前可用表头：${validation.availableHeaders.join('、') || '（无）'}。请在该物品的自定义字段中补充对应值，或调整目标表 DDL / 表头，取消这些列的必填要求。`,
      ),
    );
  };
  return validateGachaCustomFieldsForExistingRow;
}
