// @ts-nocheck
/**
 * get-global-interaction-collapsed-sections.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import { STORAGE_KEY_GLOBAL_INTERACTION_COLLAPSED_SECTIONS } from '../../shared/storage-keys';
export function createGetGlobalInteractionCollapsedSections(deps: any) {
  const getGlobalInteractionCollapsedSections = (): string[] => {
    const collapsedSections = Store.get(STORAGE_KEY_GLOBAL_INTERACTION_COLLAPSED_SECTIONS, []);
    return Array.isArray(collapsedSections) ? collapsedSections.map(sectionKind => String(sectionKind)) : [];
  };
  return getGlobalInteractionCollapsedSections;
}
