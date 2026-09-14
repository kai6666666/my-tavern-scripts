// @ts-nocheck
/**
 * is-quick-select-target-available.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsQuickSelectTargetAvailable(deps: any) {
  const isQuickSelectTargetAvailable = (
    target: AttributeQuickSelectTarget,
    preset: QuickSelectCheckPresetConfig | null | undefined,
    mode: 'normal' | 'contest',
  ): boolean => {
    if (target === 'attribute') return true;
    if (target === 'skillMod') {
      if (!preset?.skillMod || preset.skillMod.hidden) return false;
      return mode !== 'contest' || preset.contestRule?.hideSkillMod !== true;
    }
    if (target === 'mod') {
      if (!preset?.mod || preset.mod.hidden) return false;
      return mode !== 'contest' || preset.contestRule?.hideMod !== true;
    }
    return false;
  };
  return isQuickSelectTargetAvailable;
}
