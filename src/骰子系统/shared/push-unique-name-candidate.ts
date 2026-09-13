// @ts-nocheck
/**
 * push-unique-name-candidate.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createPushUniqueNameCandidate(deps: any) {
  const pushUniqueNameCandidate = (candidates: string[], value: unknown): void => {
    const name = String(value ?? '').trim();
    if (!name) return;
    if (!candidates.includes(name)) candidates.push(name);
  };
  return pushUniqueNameCandidate;
}
