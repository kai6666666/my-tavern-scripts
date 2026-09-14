// @ts-nocheck
/**
 * push-dashboard-npc-entry.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createPushDashboardNpcEntry(deps: any) {
  const pushDashboardNpcEntry = (entries, entry): void => {
    const name = String(entry.name || '').trim();
    if (!name) return;
    if (entries.some(existing => deps.characterNamesMatch(existing.name, name))) return;
    entries.push({ ...entry, name });
  };
  return pushDashboardNpcEntry;
}
