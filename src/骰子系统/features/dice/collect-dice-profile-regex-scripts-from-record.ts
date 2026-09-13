// @ts-nocheck
/**
 * collect-dice-profile-regex-scripts-from-record.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCollectDiceProfileRegexScriptsFromRecord(deps: any) {
  const collectDiceProfileRegexScriptsFromRecord = (record: Record<string, unknown>): unknown[] => {
    const scripts: unknown[] = [];
    const pushScripts = (value: unknown): void => {
      if (Array.isArray(value)) scripts.push(...value);
    };
    const data = deps.isDiceConfigBackupRecord(record.data) ? record.data : null;
    const extensions = deps.isDiceConfigBackupRecord(record.extensions) ? record.extensions : null;
    const dataExtensions = deps.isDiceConfigBackupRecord(data?.extensions) ? data.extensions : null;
    pushScripts(record.regex_scripts);
    pushScripts(extensions?.regex_scripts);
    pushScripts(dataExtensions?.regex_scripts);

    try {
      const RawCharacterCtor =
        (globalThis as Record<string, any>).RawCharacter ||
        (window as unknown as Record<string, any>).RawCharacter ||
        (window.parent as unknown as Record<string, any>).RawCharacter;
      if (typeof RawCharacterCtor === 'function') {
        const rawCharacter = new RawCharacterCtor(record);
        if (rawCharacter && typeof rawCharacter.getRegexScripts === 'function') pushScripts(rawCharacter.getRegexScripts());
      }
    } catch {
      // ignore
    }

    return scripts;
  };
  return collectDiceProfileRegexScriptsFromRecord;
}
