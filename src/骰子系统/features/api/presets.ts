// @ts-nocheck
/**
 * features/api/presets.ts
 * Feature-Sliced: 对外 API 的预设读取方法（listPresets/getActivePresetId/getPresetSummary）。
 * 通过 DI 注入 ActionPresetManager 的三个读取函数，与 monolith 解耦。
 */

export class AcuDicePresets {
  private readonly deps: {
    getAllPresets: () => any[];
    getActivePresetId: () => string;
    getPresetById: (id: string) => any | null;
  };

  constructor(deps: {
    getAllPresets: () => any[];
    getActivePresetId: () => string;
    getPresetById: (id: string) => any | null;
  }) {
    this.deps = deps;
  }

  listPresets(): Array<{ id: string; name: string; description?: string; builtin: boolean }> {
    const allPresets = this.deps.getAllPresets();
    return allPresets.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description || '',
      builtin: !!p.builtin,
    }));
  }

  getActivePresetId(): string | null {
    const id = this.deps.getActivePresetId();
    return id === '__none__' ? null : id;
  }

  getPresetSummary(
    presetId: string,
  ): { id: string; name: string; description?: string; builtin: boolean } | null {
    const preset = this.deps.getPresetById(presetId);
    if (!preset) return null;
    return {
      id: preset.id,
      name: preset.name,
      description: preset.description || '',
      builtin: !!preset.builtin,
    };
  }
}