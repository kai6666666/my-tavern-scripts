// @ts-nocheck
/**
 * load-npc-avatars.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { LocalAvatarDB } from '../../entities/local-avatar-db';
import { getDisplayName } from '../../entities/name-alias';
export function createLoadDashboardNpcAvatars(deps: any) {
  const loadDashboardNpcAvatars = () => {
    const $avatars = $('.acu-dash-npc-avatar[data-npc-name]');
    if ($avatars.length === 0) return;

    const normalizeName = (value: string): string => {
      const base = String(value || '')
        .normalize('NFKC')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .trim();
      if (!base) return '';
      const display = deps.replaceUserPlaceholders(getDisplayName(base)).trim() || base;
      return display
        .normalize('NFKC')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/\s+/g, '')
        .toLowerCase();
    };

    void (async () => {
      const allAvatarData = deps.AvatarManager.getAll();
      const candidatePool: string[] = [];
      const pushUnique = (name: string) => {
        const cleaned = String(name || '').trim();
        if (!cleaned) return;
        if (!candidatePool.includes(cleaned)) candidatePool.push(cleaned);
      };

      Object.keys(allAvatarData).forEach(pushUnique);
      Object.values(allAvatarData).forEach(data => {
        const aliasCandidates = Array.isArray((data as { aliases?: unknown[] }).aliases)
          ? ((data as { aliases?: unknown[] }).aliases as unknown[])
          : [];
        aliasCandidates.forEach(alias => pushUnique(String(alias || '')));
      });

      let localNames: string[] = [];
      try {
        localNames = (await LocalAvatarDB.getAllNames()) as string[];
      } catch {
        localNames = [];
      }
      localNames.forEach(name => pushUnique(String(name || '')));

      const normalizedNameMap = new Map<string, string[]>();
      const addNormalized = (name: string) => {
        const key = normalizeName(name);
        if (!key) return;
        if (!normalizedNameMap.has(key)) normalizedNameMap.set(key, []);
        const list = normalizedNameMap.get(key)!;
        if (!list.includes(name)) list.push(name);
      };
      candidatePool.forEach(addNormalized);

      const getManualAliases = (name: string): string[] => {
        const data = deps.AvatarManager.getAll()[name] as { aliases?: unknown[] } | undefined;
        if (!data || !Array.isArray(data.aliases)) return [];
        return data.aliases.map(alias => String(alias || '').trim()).filter(Boolean);
      };

      $avatars.each(function () {
        const $el = $(this);
        const rawName = String($el.attr('data-npc-name') || '').trim();
        if (!rawName) return;

        void (async () => {
          try {
            const displayName = getDisplayName(rawName);
            const resolvedName = deps.NameAliasRegistry.resolve(rawName);
            const avatarPrimaryName = deps.AvatarManager.getPrimaryName(rawName);

            const directCandidates = Array.from(
              new Set(
                [
                  rawName,
                  displayName,
                  resolvedName,
                  avatarPrimaryName,
                  deps.replaceUserPlaceholders(rawName),
                  deps.replaceUserPlaceholders(displayName),
                  deps.replaceUserPlaceholders(resolvedName),
                  ...deps.NameAliasRegistry.getAliases(resolvedName),
                  ...deps.NameAliasRegistry.getAliases(avatarPrimaryName),
                  ...getManualAliases(resolvedName),
                  ...getManualAliases(avatarPrimaryName),
                ]
                  .map(v => String(v || '').trim())
                  .filter(Boolean),
              ),
            );

            const allCandidates = [...directCandidates];
            directCandidates.forEach(name => {
              const key = normalizeName(name);
              if (!key) return;
              const mapped = normalizedNameMap.get(key) || [];
              mapped.forEach(m => {
                if (!allCandidates.includes(m)) allCandidates.push(m);
              });
            });

            let matchedName: string | null = null;
            let matchedUrl: string | null = null;
            let matchedLocal = false;

            // 1) 先尝试本地头像（最稳定）
            for (const name of allCandidates) {
              const localUrl = await LocalAvatarDB.get(name);
              if (localUrl) {
                matchedName = name;
                matchedUrl = localUrl;
                matchedLocal = true;
                break;
              }
            }

            // 2) 再尝试URL头像缓存
            if (!matchedUrl) {
              for (const name of allCandidates) {
                const url = deps.AvatarManager.get(name);
                if (url) {
                  matchedName = name;
                  matchedUrl = url;
                  break;
                }
              }
            }

            // 3) 最后完整兜底（主角占位符/别名）
            if (!matchedUrl) {
              for (const name of allCandidates) {
                const url = await deps.AvatarManager.getAsync(name);
                if (url) {
                  matchedName = name;
                  matchedUrl = url;
                  break;
                }
              }
            }

            // 找不到头像：保留首字fallback
            if (!matchedUrl || !matchedName) {
              $el.css({
                'background-image': 'none',
                'background-color': 'var(--acu-badge-bg, rgba(0,255,255,0.12))',
              });
              $el.find('.acu-dash-npc-avatar-fallback').show();
              return;
            }

            const applyAvatar = () => {
              const offsetX = deps.AvatarManager.getOffsetX(matchedName!);
              const offsetY = deps.AvatarManager.getOffsetY(matchedName!);
              const scale = deps.AvatarManager.getScale(matchedName!);
              const cssImageUrl = deps.formatCssImageUrl(matchedUrl, { allowInternalObjectUrl: true });
              if (!cssImageUrl) {
                $el.css({
                  'background-image': 'none',
                  'background-color': 'var(--acu-badge-bg, rgba(0,255,255,0.12))',
                });
                $el.find('.acu-dash-npc-avatar-fallback').show();
                return;
              }
              $el.css({
                'background-image': cssImageUrl,
                'background-size': `${scale}%`,
                'background-position': `${offsetX}% ${offsetY}%`,
                'background-repeat': 'no-repeat',
                'background-color': 'var(--acu-badge-bg, rgba(0,255,255,0.12))',
              });
              $el.find('.acu-dash-npc-avatar-fallback').hide();
            };

            // 本地头像/Blob链接直接应用，避免预加载阶段被误判
            if (matchedLocal || matchedUrl.startsWith('blob:')) {
              applyAvatar();
              return;
            }

            // URL头像先预加载，坏链路保持fallback
            const img = new Image();
            img.onload = applyAvatar;
            img.onerror = () => {
              $el.css({
                'background-image': 'none',
                'background-color': 'var(--acu-badge-bg, rgba(0,255,255,0.12))',
              });
              $el.find('.acu-dash-npc-avatar-fallback').show();
            };
            img.src = matchedUrl;
          } catch {
            $el.css({
              'background-image': 'none',
              'background-color': 'var(--acu-badge-bg, rgba(0,255,255,0.12))',
            });
            $el.find('.acu-dash-npc-avatar-fallback').show();
          }
        })();
      });
    })();
  };
  return loadDashboardNpcAvatars;
}
