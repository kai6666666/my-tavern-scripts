// @ts-nocheck
/**
 * default-output-template.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createDefaultOutputTemplate(deps: any) {
  const DEFAULT_OUTPUT_TEMPLATE = `<meta:检定结果>
$outcomeText
元叙事：$initiator 发起了 $attrName 检定，$formula=$roll，判定 $conditionExpr？$judgeResult，判定为【$outcomeName】
</meta:检定结果>`;
  return DEFAULT_OUTPUT_TEMPLATE;
}
