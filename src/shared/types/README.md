# shared/types

共享类型定义目录（Feature-Sliced 的 shared 层）。

将跨功能复用的 TypeScript 类型/接口集中在此处，例如角色卡与前端界面共用的数据结构。

规则：
- 只放类型（`type` / `interface` / `enum`），不放运行时实现；
- 被多个 features 引用的类型才进 shared，单一功能内使用的类型留在对应 feature 内。
