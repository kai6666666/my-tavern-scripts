// @ts-nocheck
/**
 * is-dashboard-role-in-scene-value.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsDashboardRoleInSceneValue(deps: any) {
  const isDashboardRoleInSceneValue = (value, header = ''): boolean => {
    const normalized = String(value || '')
      .trim()
      .toLowerCase();
    if (!normalized) return false;

    const normalizedHeader = String(header || '').toLowerCase();
    if (normalizedHeader.includes('离场')) {
      return (
        normalized === '否' ||
        normalized === 'false' ||
        normalized === 'no' ||
        normalized === '0' ||
        normalized.includes('未离场') ||
        normalized.includes('不离场')
      );
    }

    if (normalized === 'true' || normalized === 'yes' || normalized === '是' || normalized === '1') return true;
    if (normalized.includes('不在场') || normalized.includes('离场')) return false;
    return normalized.startsWith('在场') || normalized.includes('在场');
  };
  return isDashboardRoleInSceneValue;
}
