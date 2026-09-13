// @ts-nocheck
/**
 * acu-dice-presets-instance.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { AcuDicePresets } from './presets';
export function createAcuDicePresetsInstance(deps: any) {
  const acuDicePresets = new AcuDicePresets({
    getAllPresets: () => deps.getActionPresetManager().getAllPresets(),
    getActivePresetId: () => deps.getActionPresetManager().getActivePresetId(),
    getPresetById: (id: string) => deps.getActionPresetManager().getPresetById(id),
  });
  return acuDicePresets;
}
