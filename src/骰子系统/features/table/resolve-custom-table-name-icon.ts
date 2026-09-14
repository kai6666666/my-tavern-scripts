// @ts-nocheck
/**
 * resolve-custom-table-name-icon.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createResolveCustomTableNameIcon(deps: any) {
  const resolveCustomTableNameIcon = (
    defaultIcon: string,
    context?: CustomTableNameIconContext | null,
  ): ResolvedCustomTableNameIcon => {
    const fallbackIcon = deps.normalizeCustomTableNameIconKeyPart(defaultIcon) || 'fa-table';
    const normalizedContext = deps.normalizeCustomTableNameIconContext(context);
    if (!normalizedContext) {
      return {
        icon: fallbackIcon,
        entry: null,
        key: null,
        sourceType: null,
        imageUrl: null,
        localIconKey: null,
        assetUrl: null,
        reason: 'invalid',
      };
    }

    if (!deps.isCustomTableNameIconContextAllowed(normalizedContext)) {
      return {
        icon: fallbackIcon,
        entry: null,
        key: deps.getCustomTableNameIconContextKey(normalizedContext),
        sourceType: null,
        imageUrl: null,
        localIconKey: null,
        assetUrl: null,
        reason: 'not_whitelisted',
      };
    }

    let resolvedContext = normalizedContext;
    let entry = deps.CustomTableNameIconStoreManager.get(resolvedContext);
    if (!entry) {
      for (const fallbackContext of deps.getCustomTableNameIconFallbackContexts(normalizedContext)) {
        const fallbackEntry = deps.CustomTableNameIconStoreManager.get(fallbackContext);
        if (fallbackEntry) {
          resolvedContext = fallbackContext;
          entry = fallbackEntry;
          break;
        }
      }
    }

    if (!entry) {
      return {
        icon: fallbackIcon,
        entry: null,
        key: deps.getCustomTableNameIconContextKey(normalizedContext),
        sourceType: null,
        imageUrl: null,
        localIconKey: null,
        assetUrl: null,
        reason: 'missing',
      };
    }

    return {
      icon: fallbackIcon,
      entry,
      key: deps.getCustomTableNameIconContextKey(resolvedContext),
      sourceType: entry.sourceType,
      imageUrl: entry.imageUrl || null,
      localIconKey: entry.localIconKey,
      assetUrl: entry.sourceType === 'url' ? entry.imageUrl : null,
      reason: 'resolved',
    };
  };
  return resolveCustomTableNameIcon;
}
