// @ts-nocheck
/**
 * create-global-interaction-sections.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCreateGlobalInteractionSections(deps: any) {
  const createGlobalInteractionSections = (groups: GlobalInteractionGroup[]): GlobalInteractionSection[] => {
    const sectionByKind = new Map<GlobalInteractionSectionKind, GlobalInteractionSection>();
    groups.forEach(group => {
      const meta = deps.resolveGlobalInteractionSectionMeta(group.tableName);
      const existingSection = sectionByKind.get(meta.kind);
      if (existingSection) {
        existingSection.groups.push(group);
        return;
      }
      sectionByKind.set(meta.kind, {
        kind: meta.kind,
        title: meta.title,
        icon: meta.icon,
        order: meta.order,
        groups: [group],
      });
    });

    return [...sectionByKind.values()].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'zh-CN'));
  };
  return createGlobalInteractionSections;
}
