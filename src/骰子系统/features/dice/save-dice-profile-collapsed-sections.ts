// @ts-nocheck
/**
 * save-dice-profile-collapsed-sections.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
export function createSaveDiceProfileCollapsedSections(deps: any) {
  const saveDiceProfileCollapsedSections = (sections: readonly string[]): void => {
    Store.set(deps.getDICE_PROFILE_COLLAPSED_SECTIONS_STORAGE_KEY(), Array.from(new Set(sections.map(String).filter(Boolean))));
  };
  return saveDiceProfileCollapsedSections;
}
