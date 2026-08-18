// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=23「属性规则预设系统」
// 原行范围：13804-14213（含 banner 13800-14213）；拆分批次 5；外部 closure 依赖：7（PRESET_FORMAT_VERSION@3 / Store@29 / STORAGE_KEY_ATTRIBUTE_PRESETS@3 / compareVersion@3 / STORAGE_KEY_ACTIVE_ATTR_PRESET@3 / parseJsoncRecord@29 / updateTemplateForActivePreset@25）
// 接线说明：PRESET_FORMAT_VERSION/STORAGE_KEY_ATTRIBUTE_PRESETS/STORAGE_KEY_ACTIVE_ATTR_PRESET 已随批次 5 拆至 engine/preset-constants.ts（0 依赖叶子模块），直接 import；
//   顶层 BUILTIN_ATTRIBUTE_PRESETS 数组在模块求值时即读取真实值，不受接线时序影响；
//   updateTemplateForActivePreset@25 与本批次同拆至 preset-switch-table-template.ts（两文件互引，直接 import 会形成循环），
//   Store/compareVersion@3、parseJsoncRecord@29 定义于 index.ts IIFE 内无法 export，均采用运行时注入：
//   index.ts IIFE 末尾调用 __wireAttributeRulePresetDeps({ Store, compareVersion, parseJsoncRecord, updateTemplateForActivePreset }) 注入；
//   未注入时模块级引用为 null（方法仅在运行时调用，注入先于任何调用，与 IIFE 内原时序等价）。

import { PRESET_FORMAT_VERSION, STORAGE_KEY_ATTRIBUTE_PRESETS, STORAGE_KEY_ACTIVE_ATTR_PRESET } from '../engine/preset-constants';

let Store = null;
let compareVersion = null;
let parseJsoncRecord = null;
let updateTemplateForActivePreset = null;

export function __wireAttributeRulePresetDeps(deps) {
  Store = deps.Store;
  compareVersion = deps.compareVersion;
  parseJsoncRecord = deps.parseJsoncRecord;
  updateTemplateForActivePreset = deps.updateTemplateForActivePreset;
}
  // ========================================
  // 属性规则预设系统
  // ========================================

  type AttributeQuickSelectTarget = 'attribute' | 'skillMod' | 'mod';
  type CharacterAttributeSource = 'base' | 'special' | 'generic';

  interface AttributeQuickSelectConfig {
    /** 基础属性快捷按钮默认填入的检定字段 */
    baseTarget?: AttributeQuickSelectTarget;
    /** 特有属性快捷按钮默认填入的检定字段 */
    specialTarget?: AttributeQuickSelectTarget;
    /** 来源不明确时的默认填入字段 */
    fallbackTarget?: AttributeQuickSelectTarget;
    /** 少数属性名需要单独覆盖时使用，key 为目标字段，value 为属性名列表 */
    nameTargetMapping?: Partial<Record<AttributeQuickSelectTarget, string[]>>;
  }

  interface NormalizedAttributeQuickSelectConfig {
    baseTarget: AttributeQuickSelectTarget;
    specialTarget: AttributeQuickSelectTarget;
    fallbackTarget: AttributeQuickSelectTarget;
    nameTargetMapping: Partial<Record<AttributeQuickSelectTarget, string[]>>;
  }

  interface AttributePresetAttributeDef {
    name: string;
    formula: string;
    range: [number, number];
    modifier?: string;
  }

  interface AttributePresetConfig {
    format?: string;
    version?: string | number;
    id?: string;
    name?: string;
    builtin?: boolean;
    description?: string;
    createdAt?: string;
    baseAttributes?: AttributePresetAttributeDef[];
    specialAttributes?: AttributePresetAttributeDef[];
    quickSelect?: AttributeQuickSelectConfig;
  }

  interface CharacterAttributeEntry {
    name: string;
    value: number;
    source?: CharacterAttributeSource;
  }

  interface QuickSelectCheckPresetConfig {
    attrTargetMapping?: Record<string, string[]>;
    skillMod?: {
      hidden?: boolean;
    };
    mod?: {
      hidden?: boolean;
    };
    contestRule?: {
      hideSkillMod?: boolean;
      hideMod?: boolean;
    };
  }

  const ATTRIBUTE_QUICK_SELECT_DEFAULT: NormalizedAttributeQuickSelectConfig = {
    baseTarget: 'attribute',
    specialTarget: 'attribute',
    fallbackTarget: 'attribute',
    nameTargetMapping: {},
  };

  const ATTRIBUTE_QUICK_SELECT_DND: NormalizedAttributeQuickSelectConfig = {
    baseTarget: 'attribute',
    specialTarget: 'skillMod',
    fallbackTarget: 'attribute',
    nameTargetMapping: {
      skillMod: [
        '运动',
        '杂技',
        '巧手',
        '隐匿',
        '奥秘',
        '历史',
        '调查',
        '自然',
        '宗教',
        '驯兽',
        '洞悉',
        '医药',
        '察觉',
        '求生',
        '欺瞒',
        '威吓',
        '表演',
        '游说',
        '先攻',
      ],
    },
  };

  const isAttributeQuickSelectTarget = (value: unknown): value is AttributeQuickSelectTarget =>
    value === 'attribute' || value === 'skillMod' || value === 'mod';

  const cloneQuickSelectNameMapping = (
    mapping: Partial<Record<AttributeQuickSelectTarget, string[]>> | undefined,
  ): Partial<Record<AttributeQuickSelectTarget, string[]>> => {
    const result: Partial<Record<AttributeQuickSelectTarget, string[]>> = {};
    if (!mapping) return result;
    (['attribute', 'skillMod', 'mod'] as AttributeQuickSelectTarget[]).forEach(target => {
      const names = mapping[target];
      if (Array.isArray(names)) {
        result[target] = names.map(name => String(name).trim()).filter(Boolean);
      }
    });
    return result;
  };

  const normalizeAttributeQuickSelectConfig = (
    config: AttributeQuickSelectConfig | null | undefined,
  ): NormalizedAttributeQuickSelectConfig => ({
    baseTarget: isAttributeQuickSelectTarget(config?.baseTarget) ? config.baseTarget : 'attribute',
    specialTarget: isAttributeQuickSelectTarget(config?.specialTarget) ? config.specialTarget : 'attribute',
    fallbackTarget: isAttributeQuickSelectTarget(config?.fallbackTarget) ? config.fallbackTarget : 'attribute',
    nameTargetMapping: cloneQuickSelectNameMapping(config?.nameTargetMapping),
  });

  const applyAttributeQuickSelectDefaults = (preset: AttributePresetConfig): boolean => {
    const before = JSON.stringify(preset.quickSelect ?? null);
    preset.quickSelect = normalizeAttributeQuickSelectConfig(preset.quickSelect);
    return before !== JSON.stringify(preset.quickSelect);
  };

  // 内置属性规则预设
  const BUILTIN_ATTRIBUTE_PRESETS = [
    {
      format: 'acu_attr_preset_v1',
      version: PRESET_FORMAT_VERSION,
      id: 'coc7',
      name: '简化COC规则',
      builtin: true,
      description: '基于克苏鲁的呼唤第7版规则的属性预设。包含9条基本属性和18条特殊属性。',
      quickSelect: ATTRIBUTE_QUICK_SELECT_DEFAULT,
      baseAttributes: [
        { name: '力量', formula: '3d6*5', range: [15, 90], modifier: '1d10-5' },
        { name: '体质', formula: '3d6*5', range: [15, 90], modifier: '1d10-5' },
        { name: '体型', formula: '2d6*5+30', range: [40, 90], modifier: '1d10-5' },
        { name: '敏捷', formula: '3d6*5', range: [15, 90], modifier: '1d10-5' },
        { name: '外貌', formula: '3d6*5', range: [15, 90], modifier: '1d10-5' },
        { name: '意志', formula: '3d6*5', range: [15, 90], modifier: '1d10-5' },
        { name: '幸运', formula: '3d6*5', range: [15, 90], modifier: '1d10-5' },
        { name: '智力', formula: '2d6*5+30', range: [40, 90], modifier: '1d10-5' },
        { name: '教育', formula: '2d6*5+30', range: [40, 90], modifier: '1d10-5' },
      ],
      specialAttributes: [
        // 高频核心技能（范围 15-110，限制到95，平均60）
        { name: '侦查', formula: '10+5d20', range: [15, 95] },
        { name: '聆听', formula: '10+5d20', range: [15, 95] },
        { name: '心理学', formula: '10+5d20', range: [15, 95] },
        // 中频常用技能（范围 9-85，平均47）
        { name: '说服', formula: '5+4d20', range: [9, 85] },
        { name: '话术', formula: '5+4d20', range: [9, 85] },
        { name: '潜行', formula: '5+4d20', range: [9, 85] },
        { name: '格斗', formula: '5+4d20', range: [9, 85] },
        { name: '射击', formula: '5+4d20', range: [9, 85] },
        { name: '信用评级', formula: '5+4d20', range: [9, 85] },
        // 低频辅助技能（范围 8-65，平均36）
        { name: '魅惑', formula: '5+3d20', range: [8, 65] },
        { name: '恐吓', formula: '5+3d20', range: [8, 65] },
        { name: '图书馆使用', formula: '5+3d20', range: [8, 65] },
        { name: '急救', formula: '5+3d20', range: [8, 65] },
        { name: '驾驶', formula: '5+3d20', range: [8, 65] },
        // 极低稀有技能（范围 3-41，平均22）
        { name: '神秘学', formula: '1+2d20', range: [3, 41] },
        // 公式计算
        { name: '闪避', formula: '敏捷/2', range: [1, 99] },
        // COC 特色
        { name: 'SAN值', formula: '意志', range: [1, 99] },
        { name: '克苏鲁神话', formula: '1d5', range: [1, 5] },
      ],
    },
    {
      format: 'acu_attr_preset_v1',
      version: PRESET_FORMAT_VERSION,
      id: 'dnd5e',
      name: '简化DND规则',
      builtin: true,
      description:
        '基于龙与地下城第5版规则的属性预设。包含6条基本属性和19条技能/派生属性。技能使用长尾分布：多数人为0或负值，少数专家可达+10以上。',
      quickSelect: ATTRIBUTE_QUICK_SELECT_DND,
      baseAttributes: [
        { name: '力量', formula: '4d6dl1', range: [3, 18], modifier: '1d4-2' },
        { name: '敏捷', formula: '4d6dl1', range: [3, 18], modifier: '1d4-2' },
        { name: '体质', formula: '4d6dl1', range: [3, 18], modifier: '1d4-2' },
        { name: '智力', formula: '4d6dl1', range: [3, 18], modifier: '1d4-2' },
        { name: '感知', formula: '4d6dl1', range: [3, 18], modifier: '1d4-2' },
        { name: '魅力', formula: '4d6dl1', range: [3, 18], modifier: '1d4-2' },
      ],
      specialAttributes: [
        // DND5e 18个技能 - 使用 NdMkl1-X 公式实现长尾分布
        // 原理：取多个骰子的最低值，低值常见、高值稀有
        // 例如 4d8kl1-3: 范围 -2 到 +5，大部分人在 -2~+1，少数专家能到 +5

        // 力量系技能
        { name: '运动', formula: '4d8kl1-3', range: [-2, 5] }, // 范围 -2 到 +5
        // 敏捷系技能
        { name: '杂技', formula: '4d8kl1-3', range: [-2, 5] },
        { name: '巧手', formula: '4d8kl1-3', range: [-2, 5] },
        { name: '隐匿', formula: '5d10kl1-4', range: [-3, 6] }, // 高频，长尾更长
        // 智力系技能
        { name: '奥秘', formula: '3d6kl1-2', range: [-1, 4] }, // 稀有技能，范围小
        { name: '历史', formula: '3d6kl1-2', range: [-1, 4] },
        { name: '调查', formula: '4d8kl1-3', range: [-2, 5] },
        { name: '自然', formula: '3d6kl1-2', range: [-1, 4] },
        { name: '宗教', formula: '3d6kl1-2', range: [-1, 4] },
        // 感知系技能
        { name: '驯兽', formula: '3d6kl1-2', range: [-1, 4] },
        { name: '洞悉', formula: '5d10kl1-4', range: [-3, 6] }, // 高频
        { name: '医药', formula: '3d6kl1-2', range: [-1, 4] },
        { name: '察觉', formula: '5d10kl1-4', range: [-3, 6] }, // 高频，长尾更长
        { name: '求生', formula: '3d6kl1-2', range: [-1, 4] },
        // 魅力系技能
        { name: '欺瞒', formula: '4d8kl1-3', range: [-2, 5] },
        { name: '威吓', formula: '4d8kl1-3', range: [-2, 5] },
        { name: '表演', formula: '3d6kl1-2', range: [-1, 4] },
        { name: '游说', formula: '4d8kl1-3', range: [-2, 5] },
        // 派生属性
        { name: '先攻', formula: 'floor((敏捷-10)/2)', range: [-4, 4] },
      ],
    },
  ];

  // 属性预设管理器
  const AttributePresetManager = (() => {
    let _cache = null;

    return {
      // 获取所有预设（内置 + 自定义，自动检测并更新版本）
      getAllPresets() {
        const stored = Store.get(STORAGE_KEY_ATTRIBUTE_PRESETS, []) as AttributePresetConfig[];
        // 自动检测并更新所有自定义预设的版本（每次调用都检测，不依赖缓存）
        let needsSave = false;
        stored.forEach(preset => {
          const presetVersion = preset.version || '0.0.0';
          if (compareVersion(presetVersion, PRESET_FORMAT_VERSION) < 0) {
            console.log(
              `[DICE]AttributePresetManager 检测到预设 "${preset.name}" 版本较旧 (${presetVersion})，自动更新到 ${PRESET_FORMAT_VERSION}`,
            );
            preset.version = PRESET_FORMAT_VERSION;
            needsSave = true;
          }
          if (applyAttributeQuickSelectDefaults(preset)) {
            needsSave = true;
          }
        });
        if (needsSave) {
          Store.set(STORAGE_KEY_ATTRIBUTE_PRESETS, stored);
          // 清除缓存，确保下次获取时使用更新后的数据
          _cache = null;
        }
        // 只有在没有更新时才使用缓存
        if (!needsSave && _cache) {
          return _cache;
        }
        _cache = [...BUILTIN_ATTRIBUTE_PRESETS, ...stored];
        return _cache;
      },

      // 获取当前激活的预设（null = 使用默认逻辑）
      getActivePreset() {
        const activeId = Store.get(STORAGE_KEY_ACTIVE_ATTR_PRESET, null);
        if (!activeId) return null;
        return this.getAllPresets().find(p => p.id === activeId) || null;
      },

      // 设置激活的预设
      setActivePreset(id) {
        try {
          // 如果id是空字符串，设置为null
          const finalId = id === '' || id === undefined ? null : id;
          Store.set(STORAGE_KEY_ACTIVE_ATTR_PRESET, finalId);
          // 清除缓存，确保下次获取时是最新的
          _cache = null;
          console.log('[DICE]AttributePresetManager 切换预设:', finalId);
          console.info('[DICE][属性规则同步] 属性预设切换已触发', {
            inputId: id,
            finalId,
            activeStoredId: Store.get(STORAGE_KEY_ACTIVE_ATTR_PRESET, null),
          });
          // 延迟调用以确保函数已定义（函数在 AttributePresetManager 之后定义）
          setTimeout(() => {
            console.info('[DICE][属性规则同步] 准备执行模板同步', {
              finalId,
              hasUpdater: typeof updateTemplateForActivePreset === 'function',
            });
            if (typeof updateTemplateForActivePreset === 'function') {
              updateTemplateForActivePreset(finalId);
            } else {
              console.warn('[DICE][属性规则同步] updateTemplateForActivePreset 不可用，跳过同步');
            }
          }, 0);
          return true;
        } catch (err) {
          console.error('[DICE]AttributePresetManager 设置预设失败:', err);
          return false;
        }
      },

      // 创建自定义预设
      createPreset(preset) {
        const stored = Store.get(STORAGE_KEY_ATTRIBUTE_PRESETS, []) as AttributePresetConfig[];
        const newPreset = {
          ...preset,
          id: preset.id || 'custom_' + Date.now(),
          builtin: false,
          version: preset.version || PRESET_FORMAT_VERSION,
          createdAt: new Date().toISOString(),
        };
        applyAttributeQuickSelectDefaults(newPreset);
        stored.push(newPreset);
        Store.set(STORAGE_KEY_ATTRIBUTE_PRESETS, stored);
        _cache = null;
        console.log('[DICE]AttributePresetManager 创建预设:', newPreset.name);
        return newPreset;
      },

      // 更新自定义预设
      updatePreset(id, updates) {
        const stored = Store.get(STORAGE_KEY_ATTRIBUTE_PRESETS, []) as AttributePresetConfig[];
        const index = stored.findIndex(p => p.id === id);
        if (index < 0) return false;
        const nextPreset = { ...stored[index], ...updates };
        applyAttributeQuickSelectDefaults(nextPreset);
        stored[index] = nextPreset;
        Store.set(STORAGE_KEY_ATTRIBUTE_PRESETS, stored);
        _cache = null;
        console.log('[DICE]AttributePresetManager 更新预设:', id);
        return true;
      },

      // 删除自定义预设
      deletePreset(id) {
        const stored = Store.get(STORAGE_KEY_ATTRIBUTE_PRESETS, []) as AttributePresetConfig[];
        const filtered = stored.filter(p => p.id !== id);
        if (filtered.length === stored.length) return false;
        Store.set(STORAGE_KEY_ATTRIBUTE_PRESETS, filtered);
        _cache = null;
        // 如果删除的是激活预设，清除激活状态
        if (Store.get(STORAGE_KEY_ACTIVE_ATTR_PRESET) === id) {
          Store.set(STORAGE_KEY_ACTIVE_ATTR_PRESET, null);
        }
        console.log('[DICE]AttributePresetManager 删除预设:', id);
        return true;
      },

      // 导出预设为 JSON
      exportPreset(id) {
        const preset = this.getAllPresets().find(p => p.id === id);
        if (!preset) return null;
        const exported = {
          format: 'acu_attr_preset_v1',
          version: PRESET_FORMAT_VERSION,
          ...preset,
        };
        delete exported.builtin; // 导出时移除内置标记
        return JSON.stringify(exported, null, 2);
      },

      // 从 JSON/JSONC 导入预设
      importPreset(jsonStr, autoUpdate = false) {
        try {
          const data = parseJsoncRecord(jsonStr, '属性预设');

          // 校验格式
          if (data.format !== 'acu_attr_preset_v1') {
            throw new Error('不支持的预设格式');
          }

          // 基本校验
          if (typeof data.name !== 'string' || !data.name.trim() || !Array.isArray(data.baseAttributes)) {
            throw new Error('预设数据不完整');
          }

          const importedVersion = typeof data.version === 'string' && data.version.trim() ? data.version : '0.0.0';
          const needsUpdate = compareVersion(importedVersion, PRESET_FORMAT_VERSION) < 0;

          // 生成新ID避免冲突
          const imported = {
            ...data,
            id: 'imported_' + Date.now(),
            builtin: false,
            version: autoUpdate && needsUpdate ? PRESET_FORMAT_VERSION : importedVersion,
            createdAt: new Date().toISOString(),
          };

          const result = this.createPreset(imported);
          if (result && needsUpdate && !autoUpdate) {
            console.warn(
              `[DICE]AttributePresetManager 导入的预设 "${result.name}" 版本较旧 (${importedVersion})，建议更新到 ${PRESET_FORMAT_VERSION}`,
            );
          }
          return result;
        } catch (e) {
          console.error('[DICE]AttributePresetManager 导入失败:', e);
          return null;
        }
      },

      // 清除缓存
      clearCache() {
        _cache = null;
      },
    };
  })();
export {
  ATTRIBUTE_QUICK_SELECT_DEFAULT,
  ATTRIBUTE_QUICK_SELECT_DND,
  isAttributeQuickSelectTarget,
  cloneQuickSelectNameMapping,
  normalizeAttributeQuickSelectConfig,
  applyAttributeQuickSelectDefaults,
  BUILTIN_ATTRIBUTE_PRESETS,
  AttributePresetManager,
};
export type {
  AttributeQuickSelectTarget,
  CharacterAttributeSource,
  AttributeQuickSelectConfig,
  NormalizedAttributeQuickSelectConfig,
  AttributePresetAttributeDef,
  AttributePresetConfig,
  CharacterAttributeEntry,
  QuickSelectCheckPresetConfig,
};
