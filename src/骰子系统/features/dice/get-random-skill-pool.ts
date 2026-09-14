// @ts-nocheck
/**
 * get-random-skill-pool.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetRandomSkillPool(deps: any) {
  const getRandomSkillPool = () => {
    try {
      const preset = deps.AttributePresetManager.getActivePreset();
      if (preset) {
        // 选中特定规则：返回该规则的基本属性 + 特殊属性
        const allAttrs = new Set();

        // 添加基本属性
        if (preset.baseAttributes && Array.isArray(preset.baseAttributes)) {
          preset.baseAttributes.forEach(attr => {
            const attrName = typeof attr === 'string' ? attr : attr && attr.name;
            if (attrName) {
              allAttrs.add(attrName);
            }
          });
        }

        // 添加特殊属性
        if (preset.specialAttributes && Array.isArray(preset.specialAttributes)) {
          preset.specialAttributes.forEach(attr => {
            const attrName = typeof attr === 'string' ? attr : attr && attr.name;
            if (attrName) {
              allAttrs.add(attrName);
            }
          });
        }

        return Array.from(allAttrs);
      }

      // 默认状态（没有激活预设）：返回所有规则预设的属性合并（超级大杂烩）
      const allPresets = deps.AttributePresetManager.getAllPresets() || [];
      const allAttrs = new Set(deps.getRANDOM_SKILL_POOL() || []); // 先添加默认池

      // 合并所有预设的基本属性和特殊属性
      if (Array.isArray(allPresets)) {
        allPresets.forEach(p => {
          if (!p) return;

          // 添加基本属性
          if (p.baseAttributes && Array.isArray(p.baseAttributes)) {
            p.baseAttributes.forEach(attr => {
              const attrName = typeof attr === 'string' ? attr : attr && attr.name;
              if (attrName) {
                allAttrs.add(attrName);
              }
            });
          }

          // 添加特殊属性
          if (p.specialAttributes && Array.isArray(p.specialAttributes)) {
            p.specialAttributes.forEach(attr => {
              const attrName = typeof attr === 'string' ? attr : attr && attr.name;
              if (attrName) {
                allAttrs.add(attrName);
              }
            });
          }
        });
      }

      return Array.from(allAttrs);
    } catch (err) {
      console.error('[DICE]ACU getRandomSkillPool 错误:', err);
      return deps.getRANDOM_SKILL_POOL() || [];
    }
  };
  return getRandomSkillPool;
}
