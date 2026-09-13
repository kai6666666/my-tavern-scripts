// @ts-nocheck
/**
 * get-dice-profile-character-context.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDiceProfileCharacterContext(deps: any) {
  const getDiceProfileCharacterContext = (): {
    chatId: string;
    characterId: string;
    characterName: string;
    fields: Record<string, unknown> | null;
  } => {
    const statsContext = deps.getDiceStatsContext();
    const ST = deps.getDiceProfileSillyTavern();
    let fields: Record<string, unknown> | null = null;
    try {
      const rawFields = ST?.getCharacterCardFields?.({});
      if (deps.isDiceConfigBackupRecord(rawFields)) fields = rawFields;
    } catch {
      // ignore
    }
    let characterName =
      deps.getDiceConfigBackupRecordString(fields || {}, 'name') ||
      deps.getDiceConfigBackupRecordString((fields?.data as Record<string, unknown>) || {}, 'name');
    try {
      if (!characterName && typeof getCharData === 'function') {
        const currentChar = getCharData('current', true);
        characterName = String(currentChar?.name || currentChar?.avatar || '').trim();
      }
    } catch {
      // ignore
    }
    if (!characterName) characterName = statsContext.characterId;
    return {
      chatId: statsContext.chatId,
      characterId: statsContext.characterId,
      characterName: characterName || '未知角色卡',
      fields,
    };
  };
  return getDiceProfileCharacterContext;
}
