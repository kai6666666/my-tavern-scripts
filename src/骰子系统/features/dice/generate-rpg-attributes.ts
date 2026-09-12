// @ts-nocheck
/**
 * generate-rpg-attributes.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGenerateRPGAttributes(deps: any) {
  const generateRPGAttributes = (isDNDOrPreset = undefined) => {
    // 兼容旧版：如果传入布尔值，使用传统逻辑
    if (typeof isDNDOrPreset === 'boolean') {
      const isDND = isDNDOrPreset;
      const rollDice = sides => Math.floor(Math.random() * sides) + 1;
      const generate3d6 = () => rollDice(6) + rollDice(6) + rollDice(6);

      const generateValue = () => {
        if (isDND) {
          const base = generate3d6();
          const adjust = rollDice(4) - 2;
          return Math.max(3, Math.min(18, base + adjust));
        } else {
          const base = generate3d6() * 5;
          const adjust = rollDice(10) - 5;
          return Math.max(5, Math.min(95, base + adjust));
        }
      };

      const result = {};
      deps.STANDARD_ATTRS.forEach(attr => {
        result[attr] = generateValue();
      });
      return result; // 旧格式
    }

    // 新版：使用预设系统
    const preset = isDNDOrPreset || deps.AttributePresetManager.getActivePreset();

    // 如果没有激活预设，使用默认逻辑（百分制六维）
    if (!preset) {
      const rollDice = sides => Math.floor(Math.random() * sides) + 1;
      const generate3d6 = () => rollDice(6) + rollDice(6) + rollDice(6);
      const result = {};
      deps.STANDARD_ATTRS.forEach(attr => {
        const base = generate3d6() * 5;
        const adjust = rollDice(10) - 5;
        result[attr] = Math.max(5, Math.min(95, base + adjust));
      });
      return { base: result, special: {} };
    }

    // 第一阶段：生成基本属性
    const baseResult = {};
    preset.baseAttributes.forEach(attr => {
      const formula = attr.modifier ? `${attr.formula}+${attr.modifier}` : attr.formula;
      baseResult[attr.name] = deps.generateAttributeValue(formula, attr.range, {});
    });

    // 第二阶段：生成特别属性（可引用基本属性）
    const specialResult = {};
    if (preset.specialAttributes && Array.isArray(preset.specialAttributes)) {
      preset.specialAttributes.forEach(attr => {
        specialResult[attr.name] = deps.generateAttributeValue(attr.formula, attr.range, baseResult);
      });
    }

    return { base: baseResult, special: specialResult };
  };
  return generateRPGAttributes;
}
