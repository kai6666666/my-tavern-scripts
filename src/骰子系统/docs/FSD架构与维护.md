# 骰子系统 FSD 架构与维护指南

> 版本：v7.0.0-fsd-s81（实验分支 feat/fsd-core）
> 本文件随重构批次更新。

## 1. 目标与成果

- 将原 `src/骰子系统/index.ts` 巨型单体（约 72,000 行 IIFE）重构为 **Feature-Sliced 分层模块**；
- 当前 `index.ts`：**13,948 行**（约 -80.6%），剩余为：装配/接线、状态变量、少量待处理块；
- 全量模块文件：**1,110 个 .ts**（features 1,040 / shared 62 / entities 5 / app 1）。

## 2. 目录结构

```
src/骰子系统/
├── index.ts                # 入口：装配、接线、状态变量、初始化流程
├── entities/               # 领域实体（gacha-items、name-alias 等）
├── features/               # 功能切面（dice / gacha / presets / table / ui / tutorial / api / textarea / human-input / avatars / dashboard …）
├── shared/                 # 无业务依赖工具（storage、types、常量、通用解析器）
├── app/ 、pages/ 、widgets/# 预留分层
├── docs/                   # 文档（API、提示词、评审基线、本指南）
└── 骰子表格SQL_v4.3.json     # 内置表模板
```

## 3. 模块规范（工厂 + DI）

每个模块导出一个工厂函数：

```ts
// @ts-nocheck
export function createXxx(deps: any) {
  const xxx = (...) => { /* 原始逻辑，外部依赖改走 deps.* */ };
  return xxx;
}
```

- 外部依赖一律通过 `deps.xxx` 访问，**不直接引用 index 作用域变量**；
- 对象/实例依赖使用 **getter 风格**：`deps.getX()`，避免把对象误包成函数；
- 可变状态变量使用 **accessor 风格**：`deps.getX()` / `deps.setX(v)`；
- index 中接线为惰性对象：`getX: () => x`、`setX: v => { x = v; }`、`fn: (...a)=>fn(...a)`。

### 三条铁律

1. **对象/实例绝不用函数包装**（否则 `.method` 丢失，引发初始化崩溃）；
2. **对象键保护**：替换标识符时跳过 `{ key: ... }` 中的键名；
3. **单行/极小片段使用确定性手工接线**，不走 span 机器，避免吞邻块。

## 4. 质量闸门（每批必过）

| # | 闸门 | 说明 |
|---|---|---|
| 1 | no-undef 扫描 | 构建产物与上一稳定基线对比，零新增未定义 |
| 2 | TDZ 扫描 | 急切引用后定义/惰性包装检查 |
| 3 | spread 扫描 | `...IDENT` 未接线检测 |
| 4 | 对象包装审计 | `new/{}/[]` 值与函数包装冲突检测 |
| 5 | 常量消失审计 | 批次前后全集差集，非目标消失必须解释/还原 |
| 6 | 启动冒烟 | Node 桩环境加载 stable.js，顶层零异常 |

## 5. 构建与发布

- 构建：`pnpm build`（产物 `dist/骰子系统/stable.js`）；
- 发布：实验分支 `feat/fsd-core`；每批唯一 tag（`fsd-sN`）与迭代版本号（`v7.0.0-fsd-sN`）；
- 加载：`https://gcore.jsdelivr.net/gh/kai6666666/my-tavern-scripts@<tag>/dist/骰子系统/stable.js`；
- 注意：**jsdelivr 对同一 tag 首次拉取即缓存，禁止复用 tag**；需要修正时出新 tag（如 fsd-s77c）。

## 6. 批次历史（概要）

- s1–s22：手工单块迁移（数据层、表达式引擎、API 层、关键管理器）；
- s23–s53：批量 codemod 流水线（九大保留区、超大块 4098 行纪录）；
- s54–s66：大件收尾 + 教程按钮回归修复（捕获阶段委托 / MVU 快速开教程）；
- s67–s81：长尾清扫（≥20 → 2 行档）、工具链升级（span 适体 / 跳过保护 / 五道闸门 / 手工接线）；
- 当前：`feat/fsd-core` = 最新 fsd-s81（详见 git log）。

## 7. 已知遗留

- 1 行档中的**状态变量**按设计保留在 `index.ts`；
- `normalizeCrudHeaderLookupKey`（正则字面量导致 span 误判）与部分高级预设历史块曾以“跳过/还原”策略处理，未来可用“手工接线”安全迁出；
- `docs/API.md` 为公共 API 文档；模块内部契约以本指南为准。


## 批次历史（续：s84–s100）

- **s84–s87 收尾提取期**：14/13→12→10→≤2 行档全部清零；长尾提取池在 s87 彻底清空（残余单行档 = 抽卡状态委托器）。
- **s88–s99 功能与稳定性期**：
  - 装备拆解 / 统一物品栏面板（物品+装备 Tab）/ PICK UP 修复 / 数据库回调单例分发器（s93–s94）/ 排序稳定性（s95–s98：预冻结 + 回写导航盘顺序，全链路单一排序源）；
  - s99：导入配置方案时按模板 `orderNo` 覆盖导航盘管理顺序；「填表开始」改为保护式基线（存在待审核变更时不覆盖），并新增 `maybe-refresh-review-baseline-at-fill-start`。
  - s100：`shared/styles.ts`（17.3k 行）拆分为 `shared/styles/part-01..07`（按章节保持原顺序拼接，逐字节校验一致）；调用回调透传数据库 `meta.persisted`（S2-1）。
- **质量闸门（七道）**：no-undef 扫描 / TDZ 扫描 / spread 扫描 / 对象包装审计 / 常量消失审计 / 启动冒烟 / 依赖完整性审计。

## Release v7.0.0

- 2026-09-14：`feat/fsd-core` 全量合并至 `main`，`SCRIPT_VERSION = v7.0.0`；
- 正式引用：`https://gcore.jsdelivr.net/gh/kai6666666/my-tavern-scripts@v7.0.0/dist/骰子系统/stable.js`
- 回退点：`fsd-s100` / `fsd-s99`（或 v6.68 `5cb1851`）。
