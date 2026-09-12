// @ts-nocheck
/**
 * get-dice-profile-current-character-records.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDiceProfileCurrentCharacterRecords(deps: any) {
  const getDiceProfileCurrentCharacterRecords = (): Record<string, unknown>[] => {
    const ST = deps.getDiceProfileSillyTavern();
    const records: Record<string, unknown>[] = [];
    const seen = new Set<string>();
    const addRecord = (value: unknown): void => {
      if (!deps.isDiceConfigBackupRecord(value)) return;
      const key =
        deps.getDiceConfigBackupRecordString(value, 'avatar') ||
        deps.getDiceConfigBackupRecordString(value, 'name') ||
        deps.getDiceConfigBackupRecordString((value.data as Record<string, unknown>) || {}, 'name') ||
        JSON.stringify(value).slice(0, 200);
      if (seen.has(key)) return;
      seen.add(key);
      records.push(value);
      const jsonData = deps.getDiceConfigBackupRecordString(value, 'json_data');
      if (jsonData) {
        try {
          addRecord(JSON.parse(jsonData));
        } catch {
          // ignore invalid embedded character json
        }
      }
    };

    try {
      addRecord(ST?.getCharacterCardFields?.({}));
    } catch {
      // ignore
    }

    try {
      if (typeof getCharData === 'function') addRecord(getCharData('current', true));
    } catch {
      // ignore
    }

    try {
      const RawCharacterCtor =
        (globalThis as Record<string, any>).RawCharacter ||
        (window as unknown as Record<string, any>).RawCharacter ||
        (window.parent as unknown as Record<string, any>).RawCharacter;
      if (RawCharacterCtor && typeof RawCharacterCtor.find === 'function') {
        addRecord(RawCharacterCtor.find({ name: 'current', allowAvatar: true }));
      }
    } catch {
      // ignore
    }

    try {
      const characterSources = [
        (globalThis as Record<string, any>).characters,
        (window.parent as unknown as Record<string, any>).characters,
        ST?.characters,
      ];
      const indexCandidates = [
        (globalThis as Record<string, any>).this_chid,
        (window.parent as unknown as Record<string, any>).this_chid,
        ST?.this_chid,
        ST?.characterId,
      ];
      characterSources.forEach(source => {
        if (!Array.isArray(source)) return;
        indexCandidates.forEach(indexValue => {
          const index = Number.parseInt(String(indexValue ?? ''), 10);
          if (!Number.isNaN(index) && index >= 0 && index < source.length) addRecord(source[index]);
        });
      });
    } catch {
      // ignore
    }

    return records;
  };
  return getDiceProfileCurrentCharacterRecords;
}
