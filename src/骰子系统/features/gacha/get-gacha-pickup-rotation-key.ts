// @ts-nocheck
/**
 * get-gacha-pickup-rotation-key.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_PICKUP_CHAT_DEPTH_BUCKET } from './gacha-helpers';
export function createGetGachaPickupRotationKey(deps: any) {
  const getGachaPickupRotationKey = (): string => {
    const chatLength = deps.getDbChatMessages()?.length || 0;
    const dateKey = deps.getGachaLocalDateKey();
    const cachedRotation = deps.getGachaPickupRotationKeyCache();
    if (cachedRotation && cachedRotation.chatLength === chatLength && cachedRotation.dateKey === dateKey) {
      return cachedRotation.key;
    }
    const depthBucket = Math.floor(chatLength / GACHA_PICKUP_CHAT_DEPTH_BUCKET);
    const key = `${deps.getGachaChatIdSeed()}|${dateKey}|${depthBucket}`;
    deps.setGachaPickupRotationKeyCache({ chatLength, dateKey, key });
    return key;
  };
  return getGachaPickupRotationKey;
}
