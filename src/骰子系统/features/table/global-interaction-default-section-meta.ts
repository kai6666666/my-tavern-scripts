// @ts-nocheck
/**
 * global-interaction-default-section-meta.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGlobalInteractionDefaultSectionMeta(deps: any) {
  const GLOBAL_INTERACTION_DEFAULT_SECTION_META: GlobalInteractionSectionMeta = {
    kind: 'generic',
    title: '通用',
    icon: 'fa-layer-group',
    order: 90,
    keywords: [],
  };
  return GLOBAL_INTERACTION_DEFAULT_SECTION_META;
}
