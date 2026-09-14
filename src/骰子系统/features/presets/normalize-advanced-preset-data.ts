// @ts-nocheck
/**
 * normalize-advanced-preset-data.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeAdvancedPresetData(deps: any) {
  const normalizeAdvancedPresetData = (
    rawData: Record<string, unknown>,
    options: { idOverride?: string; nameOverride?: string; descriptionOverride?: string } = {},
  ): { preset: AdvancedDicePreset; importedVersion: string; needsUpdate: boolean } => {
    const data: Record<string, unknown> = { ...rawData };
    const importedVersion = typeof data.version === 'string' ? data.version : '0.0.0';
    const needsUpdate = deps.compareVersion(importedVersion, deps.getPRESET_FORMAT_VERSION()) < 0;

    const ui = data.ui;
    if (deps.isAdvancedPresetRecord(ui)) {
      const attribute = deps.isAdvancedPresetRecord(data.attribute) ? { ...data.attribute } : {};
      const dc = deps.isAdvancedPresetRecord(data.dc) ? { ...data.dc } : {};
      if (typeof ui.attributeLabel === 'string' && !attribute.label) attribute.label = ui.attributeLabel;
      if (typeof ui.dcLabel === 'string' && !dc.label) dc.label = ui.dcLabel;
      data.attribute = attribute;
      data.dc = dc;
      delete data.ui;
    }

    delete data.format;
    delete data.tests;
    delete data.notes;
    delete data.preset;

    const name =
      typeof options.nameOverride === 'string' && options.nameOverride.trim()
        ? options.nameOverride.trim()
        : typeof data.name === 'string'
          ? data.name.trim()
          : '';
    const description =
      typeof options.descriptionOverride === 'string'
        ? options.descriptionOverride.trim()
        : typeof data.description === 'string'
          ? data.description.trim()
          : '';
    const id =
      typeof options.idOverride === 'string' && options.idOverride.trim()
        ? options.idOverride.trim()
        : typeof data.id === 'string' && data.id.trim()
          ? data.id.trim()
          : `custom_${Date.now()}`;

    data.attribute = deps.cloneAdvancedPresetFieldWithDefaults(data.attribute, {
      label: '属性值',
      placeholder: '留空=50',
      defaultValue: 50,
    });
    const hasDcConfig = deps.hasAdvancedPresetFieldConfig(data.dc);
    const hasModConfig = deps.hasAdvancedPresetFieldConfig(data.mod);
    data.dc = deps.cloneAdvancedPresetFieldWithDefaults(
      data.dc,
      hasDcConfig
        ? { defaultValue: 0 }
        : {
            hidden: true,
            defaultValue: 0,
          },
    );
    data.mod = deps.cloneAdvancedPresetFieldWithDefaults(
      data.mod,
      hasModConfig
        ? { defaultValue: 0 }
        : {
            hidden: true,
            defaultValue: 0,
          },
    );

    const preset = {
      ...data,
      id,
      kind: 'advanced' as const,
      name,
      description,
      builtin: false,
      version: deps.getPRESET_FORMAT_VERSION(),
      attribute: data.attribute,
      dc: data.dc,
      mod: data.mod,
      outcomes: Array.isArray(data.outcomes) ? data.outcomes : [],
      diceExpression: typeof data.diceExpression === 'string' ? data.diceExpression.trim() : '',
    } as AdvancedDicePreset;

    return { preset, importedVersion, needsUpdate };
  };
  return normalizeAdvancedPresetData;
}
