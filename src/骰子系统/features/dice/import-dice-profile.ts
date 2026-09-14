// @ts-nocheck
/**
 * import-dice-profile.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createImportDiceProfile(deps: any) {
  const importDiceProfile = async (input: unknown, options: DiceProfileImportOptions = {}): Promise<DiceProfileRecord> => {
    const record = deps.parseDiceProfileInput(input, {
      name: options.name,
      source: options.source || { type: 'imported' },
    });
    const saved = await deps.upsertDiceProfileRecord(record);
    if (options.apply) {
      await deps.applyDiceProfile(saved.id, { createSnapshot: true, confirm: true });
    }
    return saved;
  };
  return importDiceProfile;
}
