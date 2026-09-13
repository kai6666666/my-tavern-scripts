// @ts-nocheck
/**
 * parse-dice-profile-input.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { decodeAcuDiceProfileMarkerPayload, extractAcuDiceProfileMarkerPayloads } from '../../features/profiles/profile-packages';
import type { NormalizeAcuDiceProfileOptions } from '../../features/profiles/profile-packages';
export function createParseDiceProfileInput(deps: any) {
  const parseDiceProfileInput = (
    input: unknown,
    options: NormalizeAcuDiceProfileOptions = {},
  ): DiceProfileRecord => {
    if (typeof input !== 'string') return deps.normalizeDiceProfileRecord(input, options);
    const text = input.trim();
    const marker = extractAcuDiceProfileMarkerPayloads(text)[0];
    if (marker) {
      const decoded = decodeAcuDiceProfileMarkerPayload(marker.payload);
      return deps.normalizeDiceProfileRecord(JSON.parse(decoded), options);
    }
    const parsed = deps.parseJsoncDocument({
      text,
      emptyMessage: '配置方案文件内容为空',
      invalidJsonMessage: '配置方案文件不是有效的 JSON/JSONC',
      validate: value => {
        if (!deps.isDiceConfigBackupRecord(value)) throw new Error('配置方案文件结构无效');
        return value;
      },
    });
    return deps.normalizeDiceProfileRecord(parsed, options);
  };
  return parseDiceProfileInput;
}
