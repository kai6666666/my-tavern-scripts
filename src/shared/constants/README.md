# shared/constants

共享常量目录（Feature-Sliced 的 shared 层）。

将跨功能复用的常量（字符串、枚举值、默认配置等）集中在此处。

规则：
- 只放常量与纯数据，不放业务逻辑；
- 被多个 features 引用的常量才进 shared，单一功能内使用的常量留在对应 feature 内。
