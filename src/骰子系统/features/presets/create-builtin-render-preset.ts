// @ts-nocheck
/**
 * create-builtin-render-preset.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { PRESET_FORMAT_VERSION } from '../../shared/constants';
export function createCreateBuiltinRenderPreset(deps: any) {
  const createBuiltinRenderPreset = (): RenderPreset => ({
    format: deps.getRENDER_PRESET_FORMAT(),
    version: PRESET_FORMAT_VERSION,
    id: deps.getRENDER_DEFAULT_PRESET_ID(),
    name: '默认渲染预设',
    builtin: true,
    description: '内置默认渲染规则，包含列名显示、属性键值对、关系、短标签、快捷检定过滤和正文头像渲染标签过滤等规则',
    rules: deps.cloneRenderPresetRules(deps.getDEFAULT_RENDER_PRESET_RULES()),
  });
  return createBuiltinRenderPreset;
}
