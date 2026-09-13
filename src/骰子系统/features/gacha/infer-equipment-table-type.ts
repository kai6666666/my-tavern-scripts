// @ts-nocheck
/**
 * infer-equipment-table-type.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createInferEquipmentTableTypeForGachaItem(deps: any) {
  const inferEquipmentTableTypeForGachaItem = (
    item: Pick<GachaItemDefinition, 'id' | 'name' | 'type' | 'description'>,
  ): EquipmentTableType => {
    const rawType = String(item.type || '').trim();
    // 历史自定义目录可能仍保存“护具/衣物”，统一归一化到仙SQL装备表三枚举。
    if (rawType === '护具' || rawType === '衣物') return '防具';
    if ((deps.EQUIPMENT_TABLE_TYPE_VALUES as readonly string[]).includes(rawType)) return rawType as EquipmentTableType;

    const haystack = `${item.id || ''} ${item.name || ''} ${rawType} ${item.description || ''}`.toLowerCase();
    const includesAny = (keywords: string[]) => keywords.some(keyword => haystack.includes(keyword.toLowerCase()));

    if (
      includesAny([
        'sword',
        'blade',
        'crowbar',
        'wand',
        'excalibur',
        'rake',
        'handgun',
        'gun',
        'bow',
        'spear',
        'axe',
        'staff',
        'hammer',
        'knife',
        'dagger',
        '剑',
        '刀',
        '枪',
        '弓',
        '弩',
        '矛',
        '戟',
        '斧',
        '锤',
        '棍',
        '杖',
        '鞭',
        '刃',
        '匕',
        '叉',
        '铳',
      ])
    ) {
      return '武器';
    }

if (includesAny(['armor', 'breastplate', 'shield', 'helmet', 'helm', '甲', '铠', '盾', '盔', '护甲', '胸甲'])) {
      return '防具';
    }
    if (
      includesAny([
        'cloak',
        'glove',
        'sash',
        'robe',
        'coat',
        'cloth',
        'dress',
        'boots',
        'shoes',
        '衣',
        '袍',
        '服',
        '披风',
        '斗篷',
        '手套',
        '靴',
        '鞋',
        '帽',
        '冠',
        '巾',
        '带',
      ])
    ) {
      return '防具';
    }

    if (
      includesAny([
        'ring',
        'necklace',
        'amulet',
        'pendant',
        'bracelet',
        'earring',
        'talisman',
        'charm',
        '戒',
        '环',
        '项链',
        '护符',
        '吊坠',
        '手镯',
        '耳环',
        '玉佩',
        '符',
        '珠',
      ])
    ) {
      return '饰品';
    }

    return '饰品';
  };
  return inferEquipmentTableTypeForGachaItem;
}
