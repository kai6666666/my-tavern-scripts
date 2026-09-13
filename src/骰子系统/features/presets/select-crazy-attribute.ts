// @ts-nocheck
/**
 * select-crazy-attribute.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSelectCrazyAttribute(deps: any) {
  const selectCrazyAttribute = participant => {
    if (!participant) return { name: '幸运', value: 50 };

    // 1. 优先使用角色已有属性
    if (participant.attrs && participant.attrs.length > 0) {
      const randomAttr = participant.attrs[Math.floor(Math.random() * participant.attrs.length)];
      return { name: randomAttr.name, value: randomAttr.value };
    }

    // 2. 使用当前属性规则定义的属性
    const activePreset = deps.AttributePresetManager.getActivePreset();
    if (activePreset) {
      const allPresetAttrs = [...(activePreset.baseAttributes || []), ...(activePreset.specialAttributes || [])];
      if (allPresetAttrs.length > 0) {
        const randomPresetAttr = allPresetAttrs[Math.floor(Math.random() * allPresetAttrs.length)];
        // 使用 range 的 50% 作为默认值
        const range = randomPresetAttr.range || [0, 100];
        const defaultValue = Math.floor((range[0] + range[1]) / 2);
        return { name: randomPresetAttr.name, value: defaultValue };
      }
    }

    // 3. 使用随机技能池
    const skillPool = deps.getRandomSkillPool();
    if (skillPool && skillPool.length > 0) {
      const randomSkill = skillPool[Math.floor(Math.random() * skillPool.length)];
      return { name: randomSkill, value: 50 };
    }

    return { name: '幸运', value: 50 };
  };
  return selectCrazyAttribute;
}
