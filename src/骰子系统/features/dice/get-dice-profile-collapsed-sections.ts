// @ts-nocheck
/**
 * get-dice-profile-collapsed-sections.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
export function createGetDiceProfileCollapsedSections(deps: any) {
  const getDiceProfileCollapsedSections = (): string[] => {
    const stored = Store.get(deps.getDICE_PROFILE_COLLAPSED_SECTIONS_STORAGE_KEY(), ['saveScope']);
    return Array.isArray(stored) ? stored.map(item => String(item)).filter(Boolean) : [];
  };
  return getDiceProfileCollapsedSections;
}
