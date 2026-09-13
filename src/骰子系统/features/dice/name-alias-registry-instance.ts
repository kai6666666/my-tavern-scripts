// @ts-nocheck
/**
 * name-alias-registry-instance.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { NameAliasRegistryCore } from '../../entities/name-alias';
export function createNameAliasRegistryInstance(deps: any) {
  const NameAliasRegistry = new NameAliasRegistryCore({
    getManualPrimaryName: (name: string) => deps.getAvatarManager().getPrimaryName(name),
    getAvatarMap: () => deps.getAvatarManager().load() as Record<string, { aliases?: unknown[] } | undefined>,
  });
  return NameAliasRegistry;
}
