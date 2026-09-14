// @ts-nocheck
/**
 * validate-gacha-custom-fields-for-target-table.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createValidateGachaCustomFieldsForTargetTable(deps: any) {
  const validateGachaCustomFieldsForTargetTable = (
    options: GachaCustomFieldValidationOptions,
  ): GachaCustomFieldValidationResult => {
    const availableHeaders = Array.from(deps.buildGachaCustomFieldHeaderMap(options.headers).keys());
    const missingHeaders: string[] = [];
    const requiredHeaders = deps.buildCrudRequiredHeaderSet(options.sheet);
    const reservedHeaders = deps.getGachaReservedCustomFieldHeaders(options.target, options.item.targetColumns);
    const providedCustomFieldHeaders = new Set<string>();

    if (deps.hasGachaCustomFields(options.item)) {
      for (const [rawKey, rawValue] of deps.getGachaCustomFieldEntries(options.item)) {
        const headerName = String(rawKey ?? '').trim();
        const value = String(rawValue ?? '').trim();
        if (!headerName || !value || reservedHeaders.has(headerName)) continue;
        providedCustomFieldHeaders.add(headerName);
      }
    }

    availableHeaders.forEach(headerName => {
      if (reservedHeaders.has(headerName)) return;
      if (!requiredHeaders.has(headerName)) return;
      if (!providedCustomFieldHeaders.has(headerName)) missingHeaders.push(headerName);
    });

    const message = missingHeaders.length
      ? deps.withTableTemplateCheckHint(
          `向目标表“${options.tableName}”写入扭蛋奖励“${options.item.name}”前，发现必填自定义列缺少值：${missingHeaders.join('、')}。当前可用表头：${availableHeaders.join('、') || '（无）'}。请在该物品的自定义字段中补充对应值，或调整目标表 DDL / 表头，取消这些列的必填要求。`,
        )
      : '';

    if (message && options.throwOnMissing !== false) {
      throw new Error(message);
    }

    return {
      missingHeaders,
      availableHeaders,
      message,
    };
  };
  return validateGachaCustomFieldsForTargetTable;
}
