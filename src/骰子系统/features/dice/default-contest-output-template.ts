// @ts-nocheck
/**
 * default-contest-output-template.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createDefaultContestOutputTemplate(deps: any) {
  const DEFAULT_CONTEST_OUTPUT_TEMPLATE = `<meta:检定结果>
元叙事：进行了一次【$initiator $initAttrName vs $opponent $oppAttrName】的对抗检定。
$initiator $initAttrName：$initFormula=$initRoll，判定 $initConditionExpr？$initJudgeResult，判定为【$initSuccessName】；
$opponent $oppAttrName：$oppFormula=$oppRoll，判定 $oppConditionExpr？$oppJudgeResult，判定为【$oppSuccessName】。
最终结果：【$winner】
</meta:检定结果>`;
  return DEFAULT_CONTEST_OUTPUT_TEMPLATE;
}
