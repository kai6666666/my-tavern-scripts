// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=24「高级骰子预设管理器」
// 原行范围：14219-15604（含 banner 14215-15604）；拆分批次 7；外部 closure 依赖：17（parseJsoncValue@29 / compareVersion@3 / PRESET_FORMAT_VERSION@3 / evaluateCondition@28 / evaluateOutcomes@28 / rollComplexDiceExpression@28 / parseJsoncRecord@29 / Store@29 / STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS@3 / isDiceConfigBackupRecord@30 / getDiceConfigBackupPresetRecordId@30 / STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET@3 / STORAGE_KEY_BUILTIN_PRESET_VISIBILITY@3 / STORAGE_KEY_BUILTIN_PRESET_ORDER@3 / STORAGE_KEY_ADVANCED_PRESETS@3 / BUILTIN_ADVANCED_PRESETS@22 / updateTemplateForActiveCheckPreset@25）
// 接线说明：BUILTIN_ADVANCED_PRESETS 已拆至 advanced-dice-preset.ts、updateTemplateForActiveCheckPreset 已拆至 preset-switch-table-template.ts（不引用本文件，无循环）直接 import；
//   evaluateCondition/evaluateOutcomes/rollComplexDiceExpression 已拆至 engine/formula-parser.ts、compareVersion 已拆至 favorites/bookmark-manager.ts、
//   PRESET_FORMAT_VERSION/STORAGE_KEY_ADVANCED_PRESETS/STORAGE_KEY_BUILTIN_PRESET_ORDER/STORAGE_KEY_BUILTIN_PRESET_VISIBILITY/STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS/STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET 已拆至 engine/preset-constants.ts（均不引用本文件，无循环）直接 import；
//   Agent 提示词模板/表格模板要求工具（advancedPresetAgentPromptTemplate 等 6 个 ?raw 模板、defaultTableTemplateRequirementRaw、createBuiltinTableTemplateRequirementPreset/cloneTemplateValue/normalizeTableTemplateRequirementPreset/DEFAULT_TABLE_TEMPLATE_REQUIREMENT_PRESET_ID/exportTableTemplateRequirementPreset/getRequirementInspectionSheets）为 index.ts 既有模块级 import，随本文件迁移（index.ts 侧同步移除不再使用的同名 import）；
//   parseJsoncValue/parseJsoncRecord/Store@29、isDiceConfigBackupRecord/getDiceConfigBackupPresetRecordId@30 定义于 index.ts IIFE 内无法 export，采用运行时注入：
//   index.ts IIFE 末尾调用 __wireAdvancedDicePresetManagerDeps({...}) 注入；
//   未注入时模块级引用为 null（全部仅在运行时方法内调用；顶层 BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS 数组求值期仅依赖直连 import，注入先于任何调用，与 IIFE 内原时序等价）。
//   AdvancedDicePreset/RollResult 类型标注 import type 引入（esbuild 剥离，无运行时依赖）。

import { BUILTIN_ADVANCED_PRESETS } from './advanced-dice-preset';
import { updateTemplateForActiveCheckPreset } from './preset-switch-table-template';
import { evaluateCondition, evaluateOutcomes, rollComplexDiceExpression } from '../engine/formula-parser';
import { compareVersion } from '../favorites/bookmark-manager';
import { PRESET_FORMAT_VERSION, STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET, STORAGE_KEY_ADVANCED_PRESETS, STORAGE_KEY_BUILTIN_PRESET_ORDER, STORAGE_KEY_BUILTIN_PRESET_VISIBILITY, STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS } from '../engine/preset-constants';
import type { AdvancedDicePreset } from './advanced-dice-preset';
import type { RollResult } from '../engine/types';
import advancedPresetAgentPromptTemplate from '../assets/docs/advanced-preset-agent-prompt.md?raw';
import dashboardPresetAgentPromptTemplate from '../assets/docs/dashboard-preset-agent-prompt.md?raw';
import actionPresetAgentPromptTemplate from '../assets/docs/action-preset-agent-prompt.md?raw';
import renderPresetAgentPromptTemplate from '../assets/docs/render-preset-agent-prompt.md?raw';
import tableTemplateRequirementPresetAgentPromptTemplate from '../assets/docs/table-template-requirement-preset-agent-prompt.md?raw';
import gachaCatalogAgentPromptTemplate from '../assets/docs/gacha-catalog-agent-prompt.md?raw';
import defaultTableTemplateRequirementRaw from '../assets/骰子表格SQL_v4.3.json?raw';
import { DEFAULT_TABLE_TEMPLATE_REQUIREMENT_PRESET_ID, cloneTemplateValue, createBuiltinTableTemplateRequirementPreset, exportTableTemplateRequirementPreset, getTemplateInspectionSheets as getRequirementInspectionSheets, normalizeTableTemplateRequirementPreset } from '../template/table-template-requirements';

let parseJsoncValue = null;
let parseJsoncRecord = null;
let Store = null;
let isDiceConfigBackupRecord = null;
let getDiceConfigBackupPresetRecordId = null;

export function __wireAdvancedDicePresetManagerDeps(deps) {
  parseJsoncValue = deps.parseJsoncValue;
  parseJsoncRecord = deps.parseJsoncRecord;
  Store = deps.Store;
  isDiceConfigBackupRecord = deps.isDiceConfigBackupRecord;
  getDiceConfigBackupPresetRecordId = deps.getDiceConfigBackupPresetRecordId;
}
  // ========================================
  // 高级骰子预设管理器
  // ========================================

  const STORAGE_KEY_ACTIVE_ADVANCED_PRESET = 'acu_active_advanced_preset';
  const ADVANCED_PRESET_EXPORT_FORMAT = 'acu_advanced_preset_v1';
  const ADVANCED_PRESET_AGENT_FORMAT = 'acu_advanced_preset_agent_v1';

  interface AdvancedPresetAgentTestCase {
    name?: string;
    context?: Record<string, unknown>;
    expectedOutcomeId?: string;
    expectedOutcomeName?: string;
  }

  interface AdvancedPresetAgentDocument {
    format: typeof ADVANCED_PRESET_AGENT_FORMAT;
    preset: Record<string, unknown>;
    tests?: AdvancedPresetAgentTestCase[];
    notes?: string | string[];
  }

  interface AdvancedPresetValidationIssue {
    path: string;
    message: string;
  }

  interface AdvancedPresetParseResult {
    preset: AdvancedDicePreset;
    tests: AdvancedPresetAgentTestCase[];
    notes: string[];
    sourceFormat: string;
    importedVersion: string;
    needsUpdate: boolean;
    warnings: AdvancedPresetValidationIssue[];
  }

  const isAdvancedPresetRecord = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

  const hasAdvancedPresetFieldConfig = (value: unknown): value is Record<string, unknown> =>
    isAdvancedPresetRecord(value) && Object.keys(value).length > 0;

  const parseAdvancedPresetJsonCandidate = (candidate: string): unknown => parseJsoncValue(candidate);

  const extractAdvancedPresetJsonCandidates = (sourceText: string): string[] => {
    const candidates: string[] = [];
    const text = sourceText.trim();
    const fencePattern = /```(?:jsonc?|JSONC?|javascript|ts|typescript)?\s*([\s\S]*?)```/g;
    let match: RegExpExecArray | null = fencePattern.exec(text);
    while (match) {
      if (match[1]?.trim()) candidates.push(match[1].trim());
      match = fencePattern.exec(text);
    }

    candidates.push(text);

    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      const sliced = text.slice(firstBrace, lastBrace + 1).trim();
      if (sliced && !candidates.includes(sliced)) candidates.push(sliced);
    }

    return candidates;
  };

  const parseAdvancedPresetSourceText = (sourceText: string): unknown => {
    const errors: string[] = [];
    for (const candidate of extractAdvancedPresetJsonCandidates(sourceText)) {
      try {
        return parseAdvancedPresetJsonCandidate(candidate);
      } catch (error) {
        errors.push(error instanceof Error ? error.message : String(error));
      }
    }
    throw new Error(`无法解析 JSON/JSONC：${errors[0] || '未找到有效对象'}`);
  };

  const normalizeAdvancedPresetNotes = (rawNotes: unknown): string[] => {
    if (typeof rawNotes === 'string' && rawNotes.trim()) return [rawNotes.trim()];
    if (!Array.isArray(rawNotes)) return [];
    return rawNotes.map(item => (typeof item === 'string' ? item.trim() : '')).filter(Boolean);
  };

  const normalizeAdvancedPresetAgentTests = (rawTests: unknown): AdvancedPresetAgentTestCase[] => {
    if (rawTests === undefined) return [];
    if (!Array.isArray(rawTests)) {
      throw new Error('tests 必须是数组');
    }

    return rawTests.map((rawTest, index) => {
      if (!isAdvancedPresetRecord(rawTest)) {
        throw new Error(`tests[${index}] 必须是对象`);
      }

      const context = rawTest.context;
      const expectedOutcomeId = rawTest.expectedOutcomeId;
      const expectedOutcomeName = rawTest.expectedOutcomeName;
      const normalizedExpectedOutcomeId = typeof expectedOutcomeId === 'string' ? expectedOutcomeId.trim() : '';
      const normalizedExpectedOutcomeName = typeof expectedOutcomeName === 'string' ? expectedOutcomeName.trim() : '';
      if (context !== undefined && !isAdvancedPresetRecord(context)) {
        throw new Error(`tests[${index}].context 必须是对象`);
      }
      if (expectedOutcomeId !== undefined && typeof expectedOutcomeId !== 'string') {
        throw new Error(`tests[${index}].expectedOutcomeId 必须是字符串`);
      }
      if (expectedOutcomeName !== undefined && typeof expectedOutcomeName !== 'string') {
        throw new Error(`tests[${index}].expectedOutcomeName 必须是字符串`);
      }
      if (!normalizedExpectedOutcomeId && !normalizedExpectedOutcomeName) {
        throw new Error(`tests[${index}] 至少需要 expectedOutcomeId 或 expectedOutcomeName`);
      }

      return {
        ...(typeof rawTest.name === 'string' && rawTest.name.trim() ? { name: rawTest.name.trim() } : {}),
        ...(isAdvancedPresetRecord(context) ? { context } : {}),
        ...(normalizedExpectedOutcomeId ? { expectedOutcomeId: normalizedExpectedOutcomeId } : {}),
        ...(normalizedExpectedOutcomeName ? { expectedOutcomeName: normalizedExpectedOutcomeName } : {}),
      };
    });
  };

  const unwrapAdvancedPresetDocument = (
    parsed: unknown,
  ): {
    presetData: Record<string, unknown>;
    tests: AdvancedPresetAgentTestCase[];
    notes: string[];
    sourceFormat: string;
  } => {
    if (!isAdvancedPresetRecord(parsed)) {
      throw new Error('预设 JSON 必须是对象');
    }

    const format = typeof parsed.format === 'string' ? parsed.format : '';
    if (format === ADVANCED_PRESET_AGENT_FORMAT) {
      const document = parsed as unknown as AdvancedPresetAgentDocument;
      if (!isAdvancedPresetRecord(document.preset)) {
        throw new Error('AI 预设文档缺少 preset 对象');
      }
      return {
        presetData: document.preset,
        tests: normalizeAdvancedPresetAgentTests(document.tests),
        notes: normalizeAdvancedPresetNotes(document.notes),
        sourceFormat: ADVANCED_PRESET_AGENT_FORMAT,
      };
    }

    if (format && format !== ADVANCED_PRESET_EXPORT_FORMAT && parsed.kind !== 'advanced') {
      throw new Error(`不支持的预设格式: ${format}`);
    }

    return {
      presetData: parsed,
      tests: normalizeAdvancedPresetAgentTests(parsed.tests),
      notes: normalizeAdvancedPresetNotes(parsed.notes),
      sourceFormat: format || 'legacy_advanced_preset',
    };
  };

  const cloneAdvancedPresetFieldWithDefaults = (
    rawField: unknown,
    fallback: Record<string, unknown>,
  ): Record<string, unknown> => {
    const field = isAdvancedPresetRecord(rawField) ? { ...rawField } : {};
    Object.entries(fallback).forEach(([key, value]) => {
      if (!(key in field)) field[key] = value;
    });
    return field;
  };

  const normalizeAdvancedPresetData = (
    rawData: Record<string, unknown>,
    options: { idOverride?: string; nameOverride?: string; descriptionOverride?: string } = {},
  ): { preset: AdvancedDicePreset; importedVersion: string; needsUpdate: boolean } => {
    const data: Record<string, unknown> = { ...rawData };
    const importedVersion = typeof data.version === 'string' ? data.version : '0.0.0';
    const needsUpdate = compareVersion(importedVersion, PRESET_FORMAT_VERSION) < 0;

    const ui = data.ui;
    if (isAdvancedPresetRecord(ui)) {
      const attribute = isAdvancedPresetRecord(data.attribute) ? { ...data.attribute } : {};
      const dc = isAdvancedPresetRecord(data.dc) ? { ...data.dc } : {};
      if (typeof ui.attributeLabel === 'string' && !attribute.label) attribute.label = ui.attributeLabel;
      if (typeof ui.dcLabel === 'string' && !dc.label) dc.label = ui.dcLabel;
      data.attribute = attribute;
      data.dc = dc;
      delete data.ui;
    }

    delete data.format;
    delete data.tests;
    delete data.notes;
    delete data.preset;

    const name =
      typeof options.nameOverride === 'string' && options.nameOverride.trim()
        ? options.nameOverride.trim()
        : typeof data.name === 'string'
          ? data.name.trim()
          : '';
    const description =
      typeof options.descriptionOverride === 'string'
        ? options.descriptionOverride.trim()
        : typeof data.description === 'string'
          ? data.description.trim()
          : '';
    const id =
      typeof options.idOverride === 'string' && options.idOverride.trim()
        ? options.idOverride.trim()
        : typeof data.id === 'string' && data.id.trim()
          ? data.id.trim()
          : `custom_${Date.now()}`;

    data.attribute = cloneAdvancedPresetFieldWithDefaults(data.attribute, {
      label: '属性值',
      placeholder: '留空=50',
      defaultValue: 50,
    });
    const hasDcConfig = hasAdvancedPresetFieldConfig(data.dc);
    const hasModConfig = hasAdvancedPresetFieldConfig(data.mod);
    data.dc = cloneAdvancedPresetFieldWithDefaults(
      data.dc,
      hasDcConfig
        ? { defaultValue: 0 }
        : {
            hidden: true,
            defaultValue: 0,
          },
    );
    data.mod = cloneAdvancedPresetFieldWithDefaults(
      data.mod,
      hasModConfig
        ? { defaultValue: 0 }
        : {
            hidden: true,
            defaultValue: 0,
          },
    );

    const preset = {
      ...data,
      id,
      kind: 'advanced' as const,
      name,
      description,
      builtin: false,
      version: PRESET_FORMAT_VERSION,
      attribute: data.attribute,
      dc: data.dc,
      mod: data.mod,
      outcomes: Array.isArray(data.outcomes) ? data.outcomes : [],
      diceExpression: typeof data.diceExpression === 'string' ? data.diceExpression.trim() : '',
    } as AdvancedDicePreset;

    return { preset, importedVersion, needsUpdate };
  };

  const pushAdvancedPresetIssue = (issues: AdvancedPresetValidationIssue[], path: string, message: string): void => {
    issues.push({ path, message });
  };

  const validateAdvancedPresetFieldConfig = (
    field: unknown,
    path: string,
    issues: AdvancedPresetValidationIssue[],
    options: { allowKey?: boolean } = {},
  ): void => {
    if (!isAdvancedPresetRecord(field)) {
      pushAdvancedPresetIssue(issues, path, '必须是对象');
      return;
    }
    if (!('defaultValue' in field)) {
      pushAdvancedPresetIssue(issues, `${path}.defaultValue`, '缺少默认值');
    } else if (typeof field.defaultValue !== 'number' && typeof field.defaultValue !== 'string') {
      pushAdvancedPresetIssue(issues, `${path}.defaultValue`, '必须是数字或字符串');
    }
    if ('label' in field && typeof field.label !== 'string') {
      pushAdvancedPresetIssue(issues, `${path}.label`, '必须是字符串');
    }
    if ('placeholder' in field && typeof field.placeholder !== 'string') {
      pushAdvancedPresetIssue(issues, `${path}.placeholder`, '必须是字符串');
    }
    if ('hidden' in field && typeof field.hidden !== 'boolean') {
      pushAdvancedPresetIssue(issues, `${path}.hidden`, '必须是布尔值');
    }
    if (options.allowKey && 'key' in field && typeof field.key !== 'string') {
      pushAdvancedPresetIssue(issues, `${path}.key`, '必须是字符串');
    }
    if (options.allowKey && 'computeModifier' in field) {
      if (typeof field.computeModifier !== 'string') {
        pushAdvancedPresetIssue(issues, `${path}.computeModifier`, '必须是字符串表达式');
      } else {
        const evalResult = evaluateCondition(field.computeModifier, { $attr: 10 });
        if (!evalResult.success) {
          pushAdvancedPresetIssue(issues, `${path}.computeModifier`, evalResult.error || '表达式无法解析');
        }
      }
    }
  };

  const validateAdvancedPresetCustomFields = (
    preset: AdvancedDicePreset,
    issues: AdvancedPresetValidationIssue[],
  ): void => {
    if (preset.customFields === undefined) return;
    if (!Array.isArray(preset.customFields)) {
      pushAdvancedPresetIssue(issues, 'customFields', '必须是数组');
      return;
    }

    const allowedTypes = new Set(['number', 'text', 'select', 'toggle']);
    const ids = new Set<string>();
    preset.customFields.forEach((field, index) => {
      const path = `customFields[${index}]`;
      if (!isAdvancedPresetRecord(field)) {
        pushAdvancedPresetIssue(issues, path, '必须是对象');
        return;
      }
      if (typeof field.id !== 'string' || !field.id.trim()) {
        pushAdvancedPresetIssue(issues, `${path}.id`, '必须是非空字符串');
      } else if (ids.has(field.id)) {
        pushAdvancedPresetIssue(issues, `${path}.id`, `重复的自定义字段 ID: ${field.id}`);
      } else {
        ids.add(field.id);
      }
      if (typeof field.type !== 'string' || !allowedTypes.has(field.type)) {
        pushAdvancedPresetIssue(issues, `${path}.type`, '必须是 number/text/select/toggle 之一');
      }
      if ('label' in field && typeof field.label !== 'string') {
        pushAdvancedPresetIssue(issues, `${path}.label`, '必须是字符串');
      }
      if ('defaultValue' in field) {
        const valueType = typeof field.defaultValue;
        if (valueType !== 'number' && valueType !== 'string' && valueType !== 'boolean') {
          pushAdvancedPresetIssue(issues, `${path}.defaultValue`, '必须是数字、字符串或布尔值');
        }
      }
      if ('options' in field && !Array.isArray(field.options)) {
        pushAdvancedPresetIssue(issues, `${path}.options`, '必须是数组');
      }
    });
  };

  const validateAdvancedPresetDicePatches = (
    preset: AdvancedDicePreset,
    issues: AdvancedPresetValidationIssue[],
  ): void => {
    if (preset.dicePatches === undefined) return;
    if (!Array.isArray(preset.dicePatches)) {
      pushAdvancedPresetIssue(issues, 'dicePatches', '必须是数组');
      return;
    }

    const allowedOps = new Set(['append', 'prepend', 'replace']);
    const context = buildAdvancedPresetEvaluationContext(preset);
    preset.dicePatches.forEach((patch, index) => {
      const path = `dicePatches[${index}]`;
      if (!isAdvancedPresetRecord(patch)) {
        pushAdvancedPresetIssue(issues, path, '必须是对象');
        return;
      }
      if (typeof patch.op !== 'string' || !allowedOps.has(patch.op)) {
        pushAdvancedPresetIssue(issues, `${path}.op`, '必须是 append/prepend/replace 之一');
      }
      if (typeof patch.template !== 'string' || !patch.template.trim()) {
        pushAdvancedPresetIssue(issues, `${path}.template`, '必须是非空字符串');
      }
      if ('when' in patch) {
        if (typeof patch.when !== 'string') {
          pushAdvancedPresetIssue(issues, `${path}.when`, '必须是字符串');
        } else {
          const conditionResult = evaluateCondition(patch.when, context as Record<string, number>);
          if (!conditionResult.success) {
            pushAdvancedPresetIssue(issues, `${path}.when`, conditionResult.error || '条件表达式无法解析');
          }
        }
      }
    });
  };

  const validateAdvancedPresetContestRule = (
    preset: AdvancedDicePreset,
    issues: AdvancedPresetValidationIssue[],
  ): void => {
    if (preset.contestRule === undefined) return;
    if (!isAdvancedPresetRecord(preset.contestRule)) {
      pushAdvancedPresetIssue(issues, 'contestRule', '必须是对象');
      return;
    }

    const contestRule = preset.contestRule;
    const allowedModes = new Set(['rank', 'value', 'margin', 'custom']);
    const allowedKeys = new Set([
      'disabled',
      'mode',
      'tieBreakers',
      'tieBreaker',
      'customExpr',
      'hideDc',
      'hideMod',
      'hideSkillMod',
    ]);
    Object.keys(contestRule).forEach(key => {
      if (!allowedKeys.has(key)) {
        pushAdvancedPresetIssue(issues, `contestRule.${key}`, '不是支持的对抗规则字段');
      }
    });
    if ('disabled' in contestRule && typeof contestRule.disabled !== 'boolean') {
      pushAdvancedPresetIssue(issues, 'contestRule.disabled', '必须是布尔值');
    }
    if ('mode' in contestRule && (typeof contestRule.mode !== 'string' || !allowedModes.has(contestRule.mode))) {
      pushAdvancedPresetIssue(issues, 'contestRule.mode', '必须是 rank/value/margin/custom 之一');
    }
    if ('tieBreakers' in contestRule) {
      if (!Array.isArray(contestRule.tieBreakers)) {
        pushAdvancedPresetIssue(issues, 'contestRule.tieBreakers', '必须是字符串数组');
      } else if (contestRule.tieBreakers.some(item => typeof item !== 'string')) {
        pushAdvancedPresetIssue(issues, 'contestRule.tieBreakers', '只能包含字符串');
      }
    }
    if ('tieBreaker' in contestRule && typeof contestRule.tieBreaker !== 'string') {
      pushAdvancedPresetIssue(issues, 'contestRule.tieBreaker', '必须是字符串');
    }
    if ('customExpr' in contestRule) {
      if (typeof contestRule.customExpr !== 'string') {
        pushAdvancedPresetIssue(issues, 'contestRule.customExpr', '必须是字符串');
      } else {
        const conditionResult = evaluateCondition(contestRule.customExpr, {
          $initValue: 12,
          $oppValue: 10,
          $initRank: 60,
          $oppRank: 40,
        });
        if (!conditionResult.success) {
          pushAdvancedPresetIssue(issues, 'contestRule.customExpr', conditionResult.error || '条件表达式无法解析');
        }
      }
    }
    (['hideDc', 'hideMod', 'hideSkillMod'] as const).forEach(key => {
      if (key in contestRule && typeof contestRule[key] !== 'boolean') {
        pushAdvancedPresetIssue(issues, `contestRule.${key}`, '必须是布尔值');
      }
    });
  };

  const coerceAdvancedPresetContextNumber = (value: unknown, fallback: number): number => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'boolean') return value ? 1 : 0;
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
    return fallback;
  };

  const createAdvancedPresetRollResult = (total: number, tags: string[] = []): RollResult => ({
    total,
    rawDice: [total],
    keptDice: [total],
    formula: String(total),
    breakdown: String(total),
    tags,
  });

  const readAdvancedPresetContextTags = (value: unknown): string[] => {
    if (!Array.isArray(value)) return [];
    return value.map(item => (typeof item === 'string' ? item.trim() : '')).filter(Boolean);
  };

  const assignAdvancedPresetContextNumber = (
    context: Record<string, string | number | boolean | RollResult>,
    key: string,
    value: unknown,
  ): void => {
    const numericValue = coerceAdvancedPresetContextNumber(value, Number.NaN);
    if (!Number.isFinite(numericValue)) return;
    context[key.startsWith('$') ? key : `$${key}`] = numericValue;
  };

  const buildAdvancedPresetEvaluationContext = (
    preset: AdvancedDicePreset,
    rawContext?: Record<string, unknown>,
  ): Record<string, string | number | boolean | RollResult> => {
    const rollRecord = rawContext && isAdvancedPresetRecord(rawContext.roll) ? rawContext.roll : {};
    const rollTotal = coerceAdvancedPresetContextNumber(rawContext?.rollTotal ?? rollRecord.total, 50);
    const rollTags = readAdvancedPresetContextTags(rawContext?.rollTags ?? rollRecord.tags);
    const context: Record<string, string | number | boolean | RollResult> = {
      $roll: createAdvancedPresetRollResult(rollTotal, rollTags),
      $attr: coerceAdvancedPresetContextNumber(rawContext?.attr ?? rawContext?.attribute, 50),
      $attrMod: 0,
      $dc: coerceAdvancedPresetContextNumber(rawContext?.dc, 0),
      $mod: coerceAdvancedPresetContextNumber(rawContext?.mod, 0),
      $skillMod: coerceAdvancedPresetContextNumber(rawContext?.skillMod, 0),
    };

    if (preset.attribute?.computeModifier) {
      const evalResult = evaluateCondition(preset.attribute.computeModifier, context as Record<string, number>);
      if (evalResult.success) {
        const rawValue = evalResult.value;
        context.$attrMod = typeof rawValue === 'number' && Number.isFinite(rawValue) ? rawValue : rawValue ? 1 : 0;
      }
    }

    if (Array.isArray(preset.customFields)) {
      preset.customFields.forEach(field => {
        context[`$${field.id}`] = coerceAdvancedPresetContextNumber(field.defaultValue, 0);
      });
    }

    if (preset.outcomePolicy?.kind === 'minRank') {
      const requiredRankVarId = preset.outcomePolicy.requiredRankVarId;
      const varKey = requiredRankVarId.startsWith('$') ? requiredRankVarId : `$${requiredRankVarId}`;
      context[varKey] = 1;
    }

    if (rawContext) {
      const vars = isAdvancedPresetRecord(rawContext.vars) ? rawContext.vars : {};
      Object.entries(vars).forEach(([key, value]) => assignAdvancedPresetContextNumber(context, key, value));
      Object.entries(rawContext).forEach(([key, value]) => {
        if (['roll', 'rollTotal', 'rollTags', 'vars', 'attr', 'attribute', 'dc', 'mod', 'skillMod'].includes(key)) {
          return;
        }
        assignAdvancedPresetContextNumber(context, key, value);
      });
    }

    if (Array.isArray(preset.derivedVars)) {
      preset.derivedVars.forEach(spec => {
        if (!spec || typeof spec.id !== 'string' || typeof spec.expr !== 'string') return;
        const evalResult = evaluateCondition(spec.expr, context as Record<string, number>);
        if (!evalResult.success) return;
        const value = evalResult.value;
        context[`$${spec.id}`] = typeof value === 'number' && Number.isFinite(value) ? value : value ? 1 : 0;
      });
    }

    return context;
  };

  interface AdvancedPresetOutcomePolicyResult {
    outcome: OutcomeLevel;
    requiredOutcome?: OutcomeLevel;
    isUnmet: boolean;
  }

  const readAdvancedPresetPolicyNumber = (
    context: Record<string, string | number | boolean | RollResult>,
    key: string,
    fallback: number,
  ): number => {
    const rawValue = context[key];
    if (typeof rawValue === 'number' && Number.isFinite(rawValue)) return rawValue;
    if (typeof rawValue === 'boolean') return rawValue ? 1 : 0;
    if (typeof rawValue === 'string') {
      const parsed = Number(rawValue);
      if (Number.isFinite(parsed)) return parsed;
    }
    return fallback;
  };

  const applyAdvancedPresetOutcomePolicy = (
    preset: AdvancedDicePreset,
    matchedOutcome: OutcomeLevel,
    context: Record<string, string | number | boolean | RollResult>,
  ): AdvancedPresetOutcomePolicyResult => {
    let outcome = matchedOutcome;
    let requiredOutcome: OutcomeLevel | undefined;

    if (preset.outcomePolicy?.kind === 'minRank') {
      const requiredRankVarId = preset.outcomePolicy.requiredRankVarId;
      const varKey = requiredRankVarId.startsWith('$') ? requiredRankVarId : `$${requiredRankVarId}`;
      const requiredRank = readAdvancedPresetPolicyNumber(context, varKey, 0);
      const actualRank = matchedOutcome.rank ?? 0;

      if (requiredRank > 0) {
        requiredOutcome = preset.outcomes.find(candidate => candidate.rank === requiredRank);
      }

      if (Number.isFinite(requiredRank) && actualRank >= 1 && actualRank < requiredRank) {
        const fallbackOutcome = preset.outcomes.find(
          candidate => candidate.id === preset.outcomePolicy?.unmetOutcomeId,
        );
        if (fallbackOutcome) outcome = fallbackOutcome;
      }
    }

    return {
      outcome,
      requiredOutcome,
      isUnmet: outcome !== matchedOutcome,
    };
  };

  const getAdvancedPresetDisplayOutcome = (policyResult: AdvancedPresetOutcomePolicyResult): OutcomeLevel =>
    policyResult.isUnmet && policyResult.requiredOutcome ? policyResult.requiredOutcome : policyResult.outcome;

  const validateAdvancedPresetOutcomes = (
    preset: AdvancedDicePreset,
    issues: AdvancedPresetValidationIssue[],
  ): void => {
    if (!Array.isArray(preset.outcomes) || preset.outcomes.length === 0) {
      pushAdvancedPresetIssue(issues, 'outcomes', '至少需要一个判定结果');
      return;
    }

    const ids = new Set<string>();
    const smokeContext = buildAdvancedPresetEvaluationContext(preset);
    preset.outcomes.forEach((outcome, index) => {
      const path = `outcomes[${index}]`;
      if (!isAdvancedPresetRecord(outcome)) {
        pushAdvancedPresetIssue(issues, path, '必须是对象');
        return;
      }
      if (typeof outcome.id !== 'string' || !outcome.id.trim()) {
        pushAdvancedPresetIssue(issues, `${path}.id`, '必须是非空字符串');
      } else if (ids.has(outcome.id)) {
        pushAdvancedPresetIssue(issues, `${path}.id`, `重复的 outcome ID: ${outcome.id}`);
      } else {
        ids.add(outcome.id);
      }
      if (typeof outcome.name !== 'string' || !outcome.name.trim()) {
        pushAdvancedPresetIssue(issues, `${path}.name`, '必须是非空字符串');
      }
      if (typeof outcome.condition !== 'string') {
        pushAdvancedPresetIssue(issues, `${path}.condition`, '必须是字符串');
      } else {
        const conditionResult = evaluateCondition(outcome.condition, smokeContext as Record<string, number>);
        if (!conditionResult.success) {
          pushAdvancedPresetIssue(issues, `${path}.condition`, conditionResult.error || '条件表达式无法解析');
        }
      }
      if ('displayExpr' in outcome) {
        if (typeof outcome.displayExpr !== 'string') {
          pushAdvancedPresetIssue(issues, `${path}.displayExpr`, '必须是字符串');
        } else {
          const displayExprResult = evaluateCondition(outcome.displayExpr, smokeContext as Record<string, number>);
          if (!displayExprResult.success) {
            pushAdvancedPresetIssue(issues, `${path}.displayExpr`, displayExprResult.error || '显示表达式无法解析');
          }
        }
      }
      if (typeof outcome.priority !== 'number' || !Number.isFinite(outcome.priority)) {
        pushAdvancedPresetIssue(issues, `${path}.priority`, '必须是数字');
      }
      if ('rank' in outcome && typeof outcome.rank !== 'number') {
        pushAdvancedPresetIssue(issues, `${path}.rank`, '必须是数字');
      }
      if ('contestRank' in outcome && typeof outcome.contestRank !== 'number') {
        pushAdvancedPresetIssue(issues, `${path}.contestRank`, '必须是数字');
      }
    });
  };

  const isAdvancedPresetNumericLike = (value: unknown): boolean => {
    if (typeof value === 'number') return Number.isFinite(value);
    if (typeof value === 'string' && value.trim()) return Number.isFinite(Number(value));
    return false;
  };

  const validateAdvancedPresetOutcomePolicy = (
    preset: AdvancedDicePreset,
    issues: AdvancedPresetValidationIssue[],
  ): void => {
    if (preset.outcomePolicy === undefined) return;
    if (!isAdvancedPresetRecord(preset.outcomePolicy)) {
      pushAdvancedPresetIssue(issues, 'outcomePolicy', '必须是对象');
      return;
    }

    const policy = preset.outcomePolicy;
    if (policy.kind !== 'minRank') {
      pushAdvancedPresetIssue(issues, 'outcomePolicy.kind', '当前仅支持 minRank；conditional 是保留类型，不要生成');
      return;
    }

    if (typeof policy.requiredRankVarId !== 'string' || !policy.requiredRankVarId.trim()) {
      pushAdvancedPresetIssue(issues, 'outcomePolicy.requiredRankVarId', '必须是 customFields 里的字段 ID');
    } else {
      const fieldId = policy.requiredRankVarId.startsWith('$')
        ? policy.requiredRankVarId.slice(1)
        : policy.requiredRankVarId;
      const fieldIndex = Array.isArray(preset.customFields)
        ? preset.customFields.findIndex(candidate => candidate.id === fieldId)
        : -1;
      const field = fieldIndex >= 0 && Array.isArray(preset.customFields) ? preset.customFields[fieldIndex] : undefined;
      const fieldPath = fieldIndex >= 0 ? `customFields[${fieldIndex}]` : `customFields.${fieldId}`;
      if (!field) {
        pushAdvancedPresetIssue(issues, 'outcomePolicy.requiredRankVarId', `找不到自定义字段: ${fieldId}`);
      } else if (field.type !== 'number' && field.type !== 'select') {
        pushAdvancedPresetIssue(issues, 'outcomePolicy.requiredRankVarId', '必须指向 number 字段或数值型 select 字段');
      } else if (field.type === 'select') {
        if (!Array.isArray(field.options) || field.options.length === 0) {
          pushAdvancedPresetIssue(issues, `${fieldPath}.options`, 'minRank 使用的 select 必须提供数值选项');
        } else if (field.options.some(option => !isAdvancedPresetNumericLike(option.value))) {
          pushAdvancedPresetIssue(issues, `${fieldPath}.options`, 'minRank 使用的 select 选项 value 必须是数字');
        }
        if (!isAdvancedPresetNumericLike(field.defaultValue)) {
          pushAdvancedPresetIssue(issues, `${fieldPath}.defaultValue`, 'minRank 使用的 select 默认值必须是数字');
        }
      }
    }

    if (typeof policy.unmetOutcomeId !== 'string' || !policy.unmetOutcomeId.trim()) {
      pushAdvancedPresetIssue(issues, 'outcomePolicy.unmetOutcomeId', '必须是 outcomes 里的 outcome ID');
    } else if (!preset.outcomes.some(outcome => outcome.id === policy.unmetOutcomeId)) {
      pushAdvancedPresetIssue(issues, 'outcomePolicy.unmetOutcomeId', `找不到 outcome: ${policy.unmetOutcomeId}`);
    }

    if ('keepActualOutcome' in policy && typeof policy.keepActualOutcome !== 'boolean') {
      pushAdvancedPresetIssue(issues, 'outcomePolicy.keepActualOutcome', '必须是布尔值');
    }

    if (!preset.outcomes.some(outcome => typeof outcome.rank === 'number')) {
      pushAdvancedPresetIssue(issues, 'outcomes', '使用 minRank 时，参与成功等级比较的 outcomes 需要提供数字 rank');
    }
  };

  const validateAdvancedPresetTemplates = (
    preset: AdvancedDicePreset,
    issues: AdvancedPresetValidationIssue[],
    options: { requireMetaWrapper: boolean },
  ): void => {
    const validateTemplate = (value: unknown, path: string): void => {
      if (value === undefined) return;
      if (typeof value !== 'string') {
        pushAdvancedPresetIssue(issues, path, '必须是字符串');
        return;
      }
      if (!options.requireMetaWrapper) return;
      if (!value.includes('<meta:检定结果>')) {
        pushAdvancedPresetIssue(
          issues,
          path,
          'AI 预设自定义输出模板必须包含 <meta:检定结果> 包裹；不需要自定义时请省略该字段',
        );
      }
      if (!value.includes('</meta:检定结果>')) {
        pushAdvancedPresetIssue(
          issues,
          path,
          'AI 预设自定义输出模板必须包含 </meta:检定结果> 结束标签；不需要自定义时请省略该字段',
        );
      }
    };

    validateTemplate(preset.outputTemplate, 'outputTemplate');
    validateTemplate(preset.contestOutputTemplate, 'contestOutputTemplate');
  };

  const validateAdvancedPresetAgentTests = (
    preset: AdvancedDicePreset,
    tests: AdvancedPresetAgentTestCase[],
    issues: AdvancedPresetValidationIssue[],
  ): void => {
    tests.forEach((test, index) => {
      const context = buildAdvancedPresetEvaluationContext(preset, test.context);
      const baseOutcome = evaluateOutcomes(preset.outcomes, context as Record<string, number>);
      const matchedOutcome = applyAdvancedPresetOutcomePolicy(preset, baseOutcome, context).outcome;
      const expectedId = test.expectedOutcomeId?.trim();
      const expectedName = test.expectedOutcomeName?.trim();
      if (expectedId && matchedOutcome.id !== expectedId) {
        pushAdvancedPresetIssue(
          issues,
          `tests[${index}]`,
          `期望 outcome id 为 "${expectedId}"，实际为 "${matchedOutcome.id}"`,
        );
      }
      if (expectedName && matchedOutcome.name !== expectedName) {
        pushAdvancedPresetIssue(
          issues,
          `tests[${index}]`,
          `期望 outcome name 为 "${expectedName}"，实际为 "${matchedOutcome.name}"`,
        );
      }
    });
  };

  const throwAdvancedPresetValidationIssues = (issues: AdvancedPresetValidationIssue[]): void => {
    if (issues.length === 0) return;
    const summary = issues
      .slice(0, 5)
      .map(issue => `${issue.path}: ${issue.message}`)
      .join('；');
    const extra = issues.length > 5 ? `；另有 ${issues.length - 5} 个问题` : '';
    throw new Error(`预设校验失败：${summary}${extra}`);
  };

  const validateAdvancedPreset = (
    preset: AdvancedDicePreset,
    tests: AdvancedPresetAgentTestCase[],
    options: { requireMetaWrapper?: boolean } = {},
  ): AdvancedPresetValidationIssue[] => {
    const issues: AdvancedPresetValidationIssue[] = [];
    if (preset.kind !== 'advanced') {
      pushAdvancedPresetIssue(issues, 'kind', '必须是 "advanced"');
    }
    if (!preset.name || typeof preset.name !== 'string') {
      pushAdvancedPresetIssue(issues, 'name', '必须是非空字符串');
    }
    if (!preset.diceExpression || typeof preset.diceExpression !== 'string') {
      pushAdvancedPresetIssue(issues, 'diceExpression', '必须是非空字符串');
    } else {
      const rollResult = rollComplexDiceExpression(preset.diceExpression);
      if (Number.isNaN(rollResult.total)) {
        pushAdvancedPresetIssue(issues, 'diceExpression', '骰子表达式无法解析');
      }
    }
    validateAdvancedPresetFieldConfig(preset.attribute, 'attribute', issues, { allowKey: true });
    validateAdvancedPresetFieldConfig(preset.dc, 'dc', issues);
    if (preset.mod !== undefined) validateAdvancedPresetFieldConfig(preset.mod, 'mod', issues);
    if (preset.skillMod !== undefined) validateAdvancedPresetFieldConfig(preset.skillMod, 'skillMod', issues);
    validateAdvancedPresetCustomFields(preset, issues);
    validateAdvancedPresetDicePatches(preset, issues);
    validateAdvancedPresetContestRule(preset, issues);
    validateAdvancedPresetOutcomes(preset, issues);
    validateAdvancedPresetOutcomePolicy(preset, issues);
    validateAdvancedPresetTemplates(preset, issues, { requireMetaWrapper: Boolean(options.requireMetaWrapper) });
    if (issues.length === 0 && tests.length > 0) {
      validateAdvancedPresetAgentTests(preset, tests, issues);
    }
    throwAdvancedPresetValidationIssues(issues);
    return issues;
  };

  const parseAdvancedPresetText = (
    sourceText: string,
    options: { idOverride?: string; nameOverride?: string; descriptionOverride?: string } = {},
  ): AdvancedPresetParseResult => {
    const parsed = parseAdvancedPresetSourceText(sourceText);
    const document = unwrapAdvancedPresetDocument(parsed);
    const normalized = normalizeAdvancedPresetData(document.presetData, options);
    const warnings = validateAdvancedPreset(normalized.preset, document.tests, {
      requireMetaWrapper: document.sourceFormat === ADVANCED_PRESET_AGENT_FORMAT,
    });
    return {
      preset: normalized.preset,
      tests: document.tests,
      notes: document.notes,
      sourceFormat: document.sourceFormat,
      importedVersion: normalized.importedVersion,
      needsUpdate: normalized.needsUpdate,
      warnings,
    };
  };

  const getAdvancedPresetErrorMessage = (error: unknown): string =>
    error instanceof Error ? error.message : String(error || '未知错误');

  const buildAdvancedPresetAgentPrompt = (): string => advancedPresetAgentPromptTemplate;

  const buildDashboardPresetAgentPrompt = (): string => dashboardPresetAgentPromptTemplate;

  const buildActionPresetAgentPrompt = (): string => actionPresetAgentPromptTemplate;

  const buildRenderPresetAgentPrompt = (): string => renderPresetAgentPromptTemplate;

  const buildTableTemplateRequirementPresetAgentPrompt = (): string => tableTemplateRequirementPresetAgentPromptTemplate;

  const buildGachaCatalogAgentPrompt = (): string => gachaCatalogAgentPromptTemplate;

  const BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS = [
    createBuiltinTableTemplateRequirementPreset(defaultTableTemplateRequirementRaw),
  ];

  const getTableTemplateRequirementPresetStats = (preset): { sheetCount: number; headerCount: number } => {
    const sheets = getRequirementInspectionSheets(preset?.template || {});
    return {
      sheetCount: sheets.length,
      headerCount: sheets.reduce((total, sheet) => total + Math.max(0, sheet.headers.length - 1), 0),
    };
  };

  const parseTableTemplateRequirementPresetJson = (jsonText: string) => {
    const parsed = parseJsoncRecord(jsonText, '模板检验预设');
    if (parsed.template || parsed.preset) return parsed;
    if (Object.keys(parsed).some(key => key.startsWith('sheet_'))) {
      return {
        name: String(parsed.name || '导入的表格模板要求'),
        description: '从表格模板文件导入生成。',
        template: parsed,
      };
    }
    return parsed;
  };

  const buildNewTableTemplateRequirementPresetJsoncTemplate = (): string => {
    return `{
  // name：预设名称，必填。
  "name": "新的模板检验预设",
  "description": "用于检查当前聊天模板是否满足指定表格结构要求。",

  // requirementLevels：可选。把要求分成 error / warning / info。
  // - error：缺失后核心功能会失败，例如检定找不到角色名或属性列。
  // - warning：功能会降级或体验明显变差，例如地点层级或所在地点缺失。
  // - info：建议保留，用于提示词、排序、注入配置等辅助能力。
  "requirementLevels": {
    "defaults": {
      "sheet": "warning",
      "header": "warning",
      "ddl": "warning",
      "sourceData": {
        "note": "info"
      },
      "mate": "info"
    },
    "sheets": {
      "sheet_protagonist": {
        "sheet": "error",
        "headers": {
          "姓名": "error",
          "基础属性": "error",
          "特有属性": "warning"
        }
      },
      "sheet_important_npc": {
        "sheet": "error",
        "headers": {
          "姓名": "error",
          "基础属性": "error",
          "特有属性": "error"
        }
      },
      "sheet_inventory": {
        "sheet": "error",
        "header": "error"
      },
      "sheet_equipment": {
        "sheet": "error",
        "header": "error"
      },
      "sheet_world_map": {
        "sheet": "warning",
        "header": "warning"
      },
      "sheet_map_elements": {
        "sheet": "warning",
        "header": "warning"
      }
    }
  },

  // template：只放你想校验的表和业务列；不要把整份表格模板塞进来。
  // row_id、普通展示表、纯提示用列不必写，除非你的预设真的要检查它们。
  "template": {
    "sheet_protagonist": {
      "name": "主角信息",
      "content": [["姓名", "基础属性", "特有属性"]],
      "sourceData": {
        "note": "主角信息需要姓名和属性列，属性建议写成 力量:55; 敏捷:40"
      }
    },
    "sheet_important_npc": {
      "name": "重要角色表",
      "content": [["姓名", "基础属性", "特有属性", "所在地点", "在场状态"]]
    },
    "sheet_world_map": {
      "name": "世界地图点",
      "content": [["详细地点", "次要地区", "主要地区"]]
    },
    "sheet_map_elements": {
      "name": "地图元素表",
      "content": [["元素名称", "所在地点"]]
    },
    "sheet_inventory": {
      "name": "物品表",
      "content": [["物品名称", "类型", "数量", "品质", "描述"]]
    },
    "sheet_equipment": {
      "name": "装备表",
      "content": [["装备名称", "类型", "品质", "状态", "描述"]]
    }
  }
}`;
  };

  const TableTemplateRequirementPresetManager = (() => {
    let _cache = null;

    const getStoredPresets = () => {
      const stored = Store.get(STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS, []);
      return Array.isArray(stored) ? stored : [];
    };

    const getBuiltinPresets = () => BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS.map(preset => cloneTemplateValue(preset));
    const getBuiltinPresetIds = () => new Set(BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS.map(preset => preset.id));

    const getCustomPresets = () => {
      const builtinIds = getBuiltinPresetIds();
      const customById = new Map();
      getStoredPresets().forEach((preset, index) => {
        if (!isDiceConfigBackupRecord(preset)) return;
        const id = getDiceConfigBackupPresetRecordId(preset);
        if (!id || preset.builtin === true || builtinIds.has(id)) return;
        const normalized = normalizeTableTemplateRequirementPreset(preset, id);
        if (!normalized || normalized.builtin === true) return;
        customById.set(id, {
          ...normalized,
          id,
          builtin: false,
          order: Number.isFinite(Number(normalized.order)) ? Number(normalized.order) : 1000 + index,
        });
      });
      return Array.from(customById.values());
    };

    const saveCustomPresets = presets => {
      Store.set(
        STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS,
        presets
          .filter(preset => preset && preset.builtin !== true && !getBuiltinPresetIds().has(preset.id))
          .map(preset => ({
            ...preset,
            builtin: false,
          })),
      );
      _cache = null;
    };

    const getUniqueId = (prefix = 'custom_table_template_requirement') => {
      const existing = new Set([...getBuiltinPresets(), ...getCustomPresets()].map(preset => preset.id));
      let id = `${prefix}_${Date.now()}`;
      let index = 2;
      while (existing.has(id)) {
        id = `${prefix}_${Date.now()}_${index}`;
        index += 1;
      }
      return id;
    };

    const sortPresets = presets =>
      presets.sort((left, right) => {
        const orderDiff = Number(left.order || 999) - Number(right.order || 999);
        if (orderDiff !== 0) return orderDiff;
        return String(left.name || '').localeCompare(String(right.name || ''));
      });

    return {
      getAllPresets() {
        if (_cache) return _cache;
        _cache = sortPresets([...getBuiltinPresets(), ...getCustomPresets()]);
        return _cache;
      },

      getPresetById(id) {
        return this.getAllPresets().find(preset => preset.id === id) || null;
      },

      getActivePresetId() {
        const storedId = Store.get(
          STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET,
          DEFAULT_TABLE_TEMPLATE_REQUIREMENT_PRESET_ID,
        );
        return this.getPresetById(storedId) ? storedId : DEFAULT_TABLE_TEMPLATE_REQUIREMENT_PRESET_ID;
      },

      getActivePreset() {
        return this.getPresetById(this.getActivePresetId()) || BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS[0];
      },

      clearCache() {
        _cache = null;
      },

      setActivePresetId(id) {
        const preset = this.getPresetById(id);
        if (!preset) return false;
        Store.set(STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET, preset.id);
        _cache = null;
        return true;
      },

      createPreset(input) {
        const normalized = normalizeTableTemplateRequirementPreset(input, getUniqueId());
        if (!normalized) return null;
        const customPresets = getCustomPresets();
        const preset = {
          ...normalized,
          id: getUniqueId(),
          builtin: false,
          order: customPresets.length > 0 ? Math.max(...customPresets.map(item => Number(item.order || 1000))) + 1 : 1000,
          createdAt: new Date().toISOString(),
        };
        saveCustomPresets([...customPresets, preset]);
        return preset;
      },

      updatePreset(id, input) {
        if (BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS.some(preset => preset.id === id)) {
          throw new Error('内置模板检验预设不能直接修改，请先复制为自定义预设。');
        }
        const customPresets = getCustomPresets();
        const index = customPresets.findIndex(preset => preset.id === id);
        if (index < 0) return false;
        const normalized = normalizeTableTemplateRequirementPreset(input, id);
        if (!normalized) return false;
        customPresets[index] = {
          ...customPresets[index],
          ...normalized,
          id,
          builtin: false,
          updatedAt: new Date().toISOString(),
        };
        saveCustomPresets(customPresets);
        return true;
      },

      deletePreset(id) {
        if (BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS.some(preset => preset.id === id)) {
          throw new Error('内置模板检验预设不能删除。');
        }
        const customPresets = getCustomPresets();
        const nextPresets = customPresets.filter(preset => preset.id !== id);
        if (nextPresets.length === customPresets.length) return false;
        saveCustomPresets(nextPresets);
        if (Store.get(STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET) === id) {
          Store.set(STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET, DEFAULT_TABLE_TEMPLATE_REQUIREMENT_PRESET_ID);
        }
        return true;
      },

      exportPreset(id) {
        const preset = this.getPresetById(id);
        return preset ? exportTableTemplateRequirementPreset(preset) : null;
      },

      importPreset(jsonText) {
        const parsed = parseTableTemplateRequirementPresetJson(jsonText);
        const normalized = normalizeTableTemplateRequirementPreset(parsed, getUniqueId('imported_table_template_requirement'));
        if (!normalized) return null;
        return this.createPreset({
          ...normalized,
          id: getUniqueId('imported_table_template_requirement'),
          builtin: false,
        });
      },
    };
  })();

  // 高级骰子预设管理器
  const AdvancedDicePresetManager = (() => {
    let _cache = null;
    let _lastImportError = '';

    const getBuiltinPresetVisibilityMap = (): Record<string, boolean> => {
      const stored = Store.get(STORAGE_KEY_BUILTIN_PRESET_VISIBILITY, {});
      if (!stored || typeof stored !== 'object') return {};
      return stored as Record<string, boolean>;
    };

    const getBuiltinPresetOrderMap = (): Record<string, number> => {
      const stored = Store.get(STORAGE_KEY_BUILTIN_PRESET_ORDER, {});
      if (!stored || typeof stored !== 'object') return {};
      return stored as Record<string, number>;
    };

    return {
      // 获取所有预设（内置 + 自定义）
      getAllPresets() {
        const stored = Store.get(STORAGE_KEY_ADVANCED_PRESETS, []);
        // 自动检测并更新所有自定义预设的版本
        let needsSave = false;
        stored.forEach(preset => {
          const presetVersion = preset.version || '0.0.0';
          if (compareVersion(presetVersion, PRESET_FORMAT_VERSION) < 0) {
            console.log(
              `[DICE]AdvancedDicePresetManager 检测到预设 "${preset.name}" 版本较旧 (${presetVersion})，自动更新到 ${PRESET_FORMAT_VERSION}`,
            );
            preset.version = PRESET_FORMAT_VERSION;
            needsSave = true;
          }
        });
        if (needsSave) {
          Store.set(STORAGE_KEY_ADVANCED_PRESETS, stored);
          _cache = null;
        }
        // 只有在没有更新时才使用缓存
        if (!needsSave && _cache) {
          return _cache;
        }

        // 填充默认值并合并
        const builtinVisibilityMap = getBuiltinPresetVisibilityMap();
        const builtinOrderMap = getBuiltinPresetOrderMap();
        const processedBuiltin = BUILTIN_ADVANCED_PRESETS.map((p, index) => ({
          ...p,
          visible: builtinVisibilityMap[p.id] ?? p.visible ?? true,
          order: builtinOrderMap[p.id] ?? p.order ?? index,
        }));

        const processedCustom = stored.map(p => ({
          ...p,
          visible: p.visible ?? false,
          order: p.order ?? 999,
        }));

        _cache = [...processedBuiltin, ...processedCustom];
        return _cache;
      },

      // 获取当前激活的预设（null = 未激活）
      getActivePreset() {
        const activeId = Store.get(STORAGE_KEY_ACTIVE_ADVANCED_PRESET, null);
        if (!activeId) return null;
        return this.getAllPresets().find(p => p.id === activeId) || null;
      },

      // 设置激活的预设
      setActivePreset(id) {
        try {
          const finalId = id === '' || id === undefined ? null : id;
          Store.set(STORAGE_KEY_ACTIVE_ADVANCED_PRESET, finalId);
          _cache = null;
          console.log('[DICE]AdvancedDicePresetManager 切换预设:', finalId);
          if (typeof updateTemplateForActiveCheckPreset === 'function') {
            updateTemplateForActiveCheckPreset(finalId);
          }
          return true;
        } catch (err) {
          console.error('[DICE]AdvancedDicePresetManager 设置预设失败:', err);
          return false;
        }
      },

      setBuiltinPresetVisibility(id, visible) {
        try {
          const map = getBuiltinPresetVisibilityMap();
          map[id] = visible;
          Store.set(STORAGE_KEY_BUILTIN_PRESET_VISIBILITY, map);
          _cache = null;
          return true;
        } catch (err) {
          console.error('[DICE]AdvancedDicePresetManager 设置内置预设显示状态失败:', err);
          return false;
        }
      },

      setPresetOrder(id, order) {
        try {
          if (BUILTIN_ADVANCED_PRESETS.some(p => p.id === id)) {
            const map = getBuiltinPresetOrderMap();
            map[id] = order;
            Store.set(STORAGE_KEY_BUILTIN_PRESET_ORDER, map);
            _cache = null;
            return true;
          }
          return this.updatePreset(id, { order });
        } catch (err) {
          console.error('[DICE]AdvancedDicePresetManager 设置预设排序失败:', err);
          return false;
        }
      },

      // 创建自定义预设
      createPreset(preset) {
        const stored = Store.get(STORAGE_KEY_ADVANCED_PRESETS, []);
        const newPreset = {
          ...preset,
          id: preset.id || 'custom_' + Date.now(),
          kind: 'advanced',
          builtin: false,
          version: preset.version || PRESET_FORMAT_VERSION,
          createdAt: new Date().toISOString(),
        };
        stored.push(newPreset);
        Store.set(STORAGE_KEY_ADVANCED_PRESETS, stored);
        _cache = null;
        console.log('[DICE]AdvancedDicePresetManager 创建预设:', newPreset.name);
        return newPreset;
      },

      // 更新自定义预设
      updatePreset(id, updates) {
        // 禁止修改内置预设
        if (BUILTIN_ADVANCED_PRESETS.some(p => p.id === id)) {
          console.error('[DICE]AdvancedDicePresetManager 不能修改内置预设:', id);
          throw new Error('不能修改内置预设');
        }
        const stored = Store.get(STORAGE_KEY_ADVANCED_PRESETS, []);
        const index = stored.findIndex(p => p.id === id);
        if (index < 0) return false;
        stored[index] = { ...stored[index], ...updates, id }; // 保持ID不变
        Store.set(STORAGE_KEY_ADVANCED_PRESETS, stored);
        _cache = null;
        console.log('[DICE]AdvancedDicePresetManager 更新预设:', id);
        return true;
      },

      // 删除自定义预设
      deletePreset(id) {
        // 禁止删除内置预设
        if (BUILTIN_ADVANCED_PRESETS.some(p => p.id === id)) {
          console.error('[DICE]AdvancedDicePresetManager 不能删除内置预设:', id);
          throw new Error('不能删除内置预设');
        }
        const stored = Store.get(STORAGE_KEY_ADVANCED_PRESETS, []);
        const filtered = stored.filter(p => p.id !== id);
        if (filtered.length === stored.length) return false;
        Store.set(STORAGE_KEY_ADVANCED_PRESETS, filtered);
        _cache = null;
        // 如果删除的是激活预设，清除激活状态
        if (Store.get(STORAGE_KEY_ACTIVE_ADVANCED_PRESET) === id) {
          Store.set(STORAGE_KEY_ACTIVE_ADVANCED_PRESET, null);
        }
        console.log('[DICE]AdvancedDicePresetManager 删除预设:', id);
        return true;
      },

      // 导出预设为 JSON
      exportPreset(id) {
        const preset = this.getAllPresets().find(p => p.id === id);
        if (!preset) return null;
        const exported = {
          ...preset,
          format: ADVANCED_PRESET_EXPORT_FORMAT,
          kind: 'advanced',
          version: PRESET_FORMAT_VERSION,
        };
        delete exported.builtin; // 导出时移除内置标记
        return JSON.stringify(exported, null, 2);
      },

      // 从 JSON/JSONC 导入预设
      importPreset(jsonStr) {
        const storedBefore = Store.get(STORAGE_KEY_ADVANCED_PRESETS, []);
        const rollbackPresets = Array.isArray(storedBefore) ? [...storedBefore] : [];
        try {
          _lastImportError = '';
          const parseResult = parseAdvancedPresetText(jsonStr);
          // 生成新ID避免冲突
          const imported = {
            ...parseResult.preset,
            id: 'imported_' + Date.now(),
            kind: 'advanced' as const,
            builtin: false,
            visible: true,
            version: PRESET_FORMAT_VERSION,
            createdAt: new Date().toISOString(),
          };

          const result = this.createPreset(imported);
          if (result && parseResult.needsUpdate) {
            console.warn(
              `[DICE]AdvancedDicePresetManager 导入的预设 "${result.name}" 版本较旧 (${parseResult.importedVersion})，已自动更新到 ${PRESET_FORMAT_VERSION}`,
            );
          }
          if (parseResult.tests.length > 0 || parseResult.notes.length > 0) {
            console.info('[DICE]AdvancedDicePresetManager 已校验 AI/Agent 预设文档', {
              presetName: result?.name,
              sourceFormat: parseResult.sourceFormat,
              testCount: parseResult.tests.length,
              notes: parseResult.notes,
            });
          }
          return result;
        } catch (e) {
          Store.set(STORAGE_KEY_ADVANCED_PRESETS, rollbackPresets);
          _cache = null;
          _lastImportError = getAdvancedPresetErrorMessage(e);
          console.error('[DICE]AdvancedDicePresetManager 导入失败:', e);
          return null;
        }
      },

      getLastImportError() {
        return _lastImportError;
      },

      // 清除缓存
      clearCache() {
        _cache = null;
      },

      /**
       * 检查预设是否支持对抗检定
       * @param preset 预设对象或预设ID
       * @returns true 表示支持对抗检定，false 表示不支持
       */
      supportsContest(preset: AdvancedDicePreset | string | null | undefined): boolean {
        if (!preset) return true; // 无预设时（自定义模式）默认支持

        const presetObj = typeof preset === 'string' ? this.getAllPresets().find(p => p.id === preset) : preset;
        if (!presetObj) return true; // 找不到预设时默认支持

        // 检查 contestRule.disabled 标志
        return !(presetObj.contestRule?.disabled === true);
      },
    };
  })();
export {
  STORAGE_KEY_ACTIVE_ADVANCED_PRESET,
  ADVANCED_PRESET_EXPORT_FORMAT,
  ADVANCED_PRESET_AGENT_FORMAT,
  isAdvancedPresetRecord,
  hasAdvancedPresetFieldConfig,
  parseAdvancedPresetJsonCandidate,
  extractAdvancedPresetJsonCandidates,
  parseAdvancedPresetSourceText,
  normalizeAdvancedPresetNotes,
  normalizeAdvancedPresetAgentTests,
  unwrapAdvancedPresetDocument,
  cloneAdvancedPresetFieldWithDefaults,
  normalizeAdvancedPresetData,
  pushAdvancedPresetIssue,
  validateAdvancedPresetFieldConfig,
  validateAdvancedPresetCustomFields,
  validateAdvancedPresetDicePatches,
  validateAdvancedPresetContestRule,
  coerceAdvancedPresetContextNumber,
  createAdvancedPresetRollResult,
  readAdvancedPresetContextTags,
  assignAdvancedPresetContextNumber,
  buildAdvancedPresetEvaluationContext,
  readAdvancedPresetPolicyNumber,
  applyAdvancedPresetOutcomePolicy,
  getAdvancedPresetDisplayOutcome,
  validateAdvancedPresetOutcomes,
  isAdvancedPresetNumericLike,
  validateAdvancedPresetOutcomePolicy,
  validateAdvancedPresetTemplates,
  validateAdvancedPresetAgentTests,
  throwAdvancedPresetValidationIssues,
  validateAdvancedPreset,
  parseAdvancedPresetText,
  getAdvancedPresetErrorMessage,
  buildAdvancedPresetAgentPrompt,
  buildDashboardPresetAgentPrompt,
  buildActionPresetAgentPrompt,
  buildRenderPresetAgentPrompt,
  buildTableTemplateRequirementPresetAgentPrompt,
  buildGachaCatalogAgentPrompt,
  BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS,
  getTableTemplateRequirementPresetStats,
  parseTableTemplateRequirementPresetJson,
  buildNewTableTemplateRequirementPresetJsoncTemplate,
  TableTemplateRequirementPresetManager,
  AdvancedDicePresetManager,
}; // __wireAdvancedDicePresetManagerDeps 已由头部 export function 导出
export type {
  AdvancedPresetAgentTestCase,
  AdvancedPresetAgentDocument,
  AdvancedPresetValidationIssue,
  AdvancedPresetParseResult,
  AdvancedPresetOutcomePolicyResult,
};
