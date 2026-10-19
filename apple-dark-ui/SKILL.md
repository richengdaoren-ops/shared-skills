---
name: apple-dark-ui
description: 按 Apple Human Interface Guidelines（含 2025 年起的 Liquid Glass）设计和实现深色 Web 界面的完整方法：分层模型、近黑配色与组件顶光、字号体系、同心圆角、Liquid Glass 与标准材质、SVG 折射的渐进增强、组件与页面模板、移动端胶囊 Tab Bar，以及验收清单。技术栈为 React + Tailwind CSS v4。只要用户想做「苹果风 / iOS 风 / macOS 风 / HIG 风格」的网页、后台、仪表盘、PWA，提到 Liquid Glass、毛玻璃、液态玻璃、磨砂材质、深色主题重构、设计规范 / design token，或要求审查一个界面是否符合 Apple 风格，都应使用本 skill，即使用户没有明确说「HIG」。
---

# Apple 风格深色 Web 界面

这份 skill 把 Apple HIG 落到 Web 上：React + Tailwind CSS v4，**只有一套深色主题**。它给出的是一套已经在真实中后台项目里跑通的决策和数值，不是灵感板——照着做能得到一致、克制、有层次的界面；偏离时要知道自己在偏离什么。

## 什么时候读哪个文件

先读完本文件，再按任务读参考文件。不要一次全读。

| 任务 | 读 |
|---|---|
| 搭设计系统 / 写 token / 配 Tailwind | `references/foundation.md` + `assets/tokens.css` |
| 做玻璃、毛玻璃、折射、卡片材质 | `references/materials.md` + `assets/components/` |
| 写或改某个组件（按钮、表单、弹窗、表格……） | `references/components.md` 对应小节 |
| 搭页面外壳、导航、移动端布局、某类页面 | `references/layouts.md` |
| 实现中遇到布局 / 滚动 / 浏览器兼容问题 | `references/pitfalls.md` |
| 交付前自查，或审查别人的界面 | `references/review-checklist.md` |

`assets/` 里是可以直接拷进项目的代码：`tokens.css`（全部 CSS 变量、Tailwind `@theme` 映射、材质类、无障碍降级）和 `components/`（Liquid Glass 折射、胶囊 Tab Bar、滚动收起 hook）。拷贝后按项目的路径别名改 import。

## 七条核心决策

这七条决定了整套界面的气质。做任何具体设计前先对齐它们；后面所有数值都从这里推出来。

1. **单一深色主题，不做主题切换。** HIG 不建议提供 App 专属的外观设置，并允许少数 App 只用深色。一套主题意味着每个颜色、每层材质都可以针对深色调到最好，而不是两边妥协。
2. **近黑底 + 组件顶光。** 背景是带一点冷调的纯色近黑（约 `#0A0B0D`–`#11131A`），不是纯黑，也不是中性灰 `#1C1C1E`。中性灰会让背景、侧边栏、卡片挤在同一个亮度区间，整体显得死气沉沉；纯黑上卡片发飘，OLED 滚动拖影。组件逐级变亮，表面再加一层从顶部往下淡出的弱光——层级靠亮度差和光来表达。
3. **四层模型，材质由层决定。** L0 背景 → L1 内容（卡片、表格、表单）→ L2 功能（导航、工具栏、菜单）→ L3 覆盖（弹窗、抽屉）。**Liquid Glass 只用于 L2、L3**，内容层用「标准材质」或实色。玻璃是给浮在内容之上的东西用的；内容本身要稳，不能和导航抢视觉。
4. **玻璃以 CSS 为底，折射是渐进增强。** 所有浏览器都拿到模糊 + 提亮 + 边缘光的 CSS 玻璃；只有 Chromium 再叠加 SVG 位移滤镜，弯折下方的真实 DOM。Safari / Firefox 的 `backdrop-filter` 不支持 `url()`，不要试图在那里做折射，也不要用 WebGL 去模拟滚动内容的折射。
5. **字体少而分工明确。** 界面文字用系统字体栈（SF Pro / 苹方）；标题可用一款衬线（中英文统一为衬线，例如 Literata + 思源宋体）增加辨识度；数字、ID、代码用等宽字体（例如 JetBrains Mono）并开 `tabular-nums`。字重只用 400 / 500 / 600 / 700。
6. **同心圆角。** 内层圆角 = 外层圆角 − 内边距。只在顶层容器定义圆角，内部推导。按钮、徽标、分段控件、Tab Bar 默认胶囊形。
7. **克制。** 强调色每个视图最多用在一个主按钮上；彩色只表达语义（成功、警告、错误、信息）和图表系列；同屏 Liquid Glass 元素尽量不超过 5 个；背景永远静态。

## 四层模型速查

```
L3 覆盖层  Dialog / Sheet / 抽屉 / Alert / 命令菜单   Liquid Glass thick（磨砂）+ 30% 黑遮罩
L2 功能层  侧边栏 / 工具栏控件组 / 菜单 / Popover     Liquid Glass regular
           移动端胶囊 Tab Bar / 浮动圆形按钮          Liquid Glass clear（真折射最明显）
L1 内容层  卡片 / 表格 / 表单 / 列表                  标准材质 thin / regular / thick，或实色
L0 背景    全局                                       纯色，不做渐变、噪点、动画
```

三条硬规则，违反任何一条都会直接坏掉观感：

- **Liquid Glass 不进内容层。** 唯一例外是内容里的瞬时交互：Switch、Slider 的滑块在按住时变成半透明玻璃，松手恢复。
- **玻璃里不套玻璃。** 带 `backdrop-filter` 的元素会成为 backdrop root，里层只能模糊外层，表现为发灰发平。玻璃内部分组用填充色（`bg-fill-*`）。
- **背景静态。** 背景一动，页面上所有 `backdrop-filter` 每帧重算，低端设备直接掉帧。

## 工作流程

### 新建一套界面

1. **先搭 foundation。** 拷 `assets/tokens.css` 到项目的全局样式（Tailwind v4 入口），按 `references/foundation.md` 确认背景色、强调色、字体。在 `cn()` / tailwind-merge 里注册自定义字号和颜色（见 pitfalls）。
2. **再搭外壳。** 桌面：浮动玻璃侧边栏 + 无背景的浮动工具栏控件 + scroll edge effect；移动端：浮动顶栏按钮 + 底部胶囊 Tab Bar。见 `references/layouts.md`。
3. **然后做基础组件。** Button、Input、Select、Menu、Popover、Dialog、Sheet、Tabs、Switch、Badge、Card、Table。按 `references/components.md`，每个组件先确定它在哪一层。
4. **挑一个样板页做到位**（通常是一个仪表盘和一个表格列表页），验收后再批量推进其他页面。
5. **最后加增强**：Chromium 折射、Tab Bar 滚动收起、菜单形状变化动效。增强必须可以整体关掉而界面依然完整。

### 改造已有界面

先盘点再动手：列出页面实际用到的结构（不要凭想象套模板），把相同结构的页面归类，然后每类定一套排法。逐页改的时候，每页都先说清楚发现的问题和打算怎么改，再动代码；桌面（≥ 1024px）和移动端（< 1024px）分开检查。

### 审查一个界面

按 `references/review-checklist.md` 逐项过，报告时引用具体元素和数值（「表格容器用了 `.lg-regular`，内容层应为 `.mat-thick`」），不要泛泛地说「不够苹果」。

## 判断题：遇到这些情况怎么选

| 情况 | 做法 | 为什么 |
|---|---|---|
| 想给卡片加毛玻璃 | 用 `.mat-regular`（半透明提亮 + 发丝线，无模糊） | 卡片是内容层；模糊多了会和功能层的玻璃抢层级，还拖性能 |
| 表格放在什么容器里 | `.mat-thick` 卡片，`p-0`，表格本身不画外框 | 文字越多材质越厚，保证小字对比度 |
| 顶栏要不要铺背景 | 不铺；浮动玻璃控件组 + 顶部 scroll edge 渐变模糊 | HIG 要求减少工具栏背景，用 scroll edge 区分内容 |
| 按钮要不要 hover 上浮 / 投影 | 不要；hover 只改底色，按下缩到 0.97 | 按钮是控件不是卡片 |
| 卡片要不要 hover 效果 | 默认不要；整卡可点时才加 `bg-fill-4` | 内容不是控件 |
| 删除按钮 | 页面上用 `destructive-soft`（红字浅红底）；确认弹窗里用 `destructive` 实底 | 页面上的删除只是入口，不应比主按钮抢眼；且破坏性操作不能设为默认按钮 |
| 立即生效 vs 保存后生效 | 立即生效用 Switch，提交后生效用 Checkbox | 这是两者唯一的判断标准 |
| 轻量确认 vs 正式确认 | 可撤销 / 影响小：从按钮展开的 ConfirmPopover；不可撤销：ConfirmDialog | 只在必要时打断用户 |
| 移动端弹窗 | 配置类 Dialog 自动变成底部 Sheet；提醒类保持居中 | 拇指可达；提醒需要聚焦 |
| 移动端 Tab Bar 放几个入口 | 4 个主入口 + 「更多」，只放图标，带 `aria-label` | 胶囊宽度有限；有意偏离 HIG 时要给出补偿 |
| 小屏放不下一排筛选 | 只有一个分类维度用分段横条（可横滑、右侧渐隐）；多个维度用一行可横滑的筛选胶囊 | 不吸顶、不套方框，随内容滚走 |
| 背景太空想加装饰 | 优先不加；确实需要时只在独立页（登录、空状态）用静态装饰 | 背景动或花会拖垮所有玻璃 |

## 关于数值

参考文件里的数值（颜色、圆角、模糊半径、动效曲线）都是调过、在真实设备上看过的。直接用它们，比自己从 HIG 截图里取色更可靠。HIG 页面上的系统色以图片展示，最终色值以 Apple Design Resources 为准。需要偏离时，改 token 而不是在组件里写死任意值——`bg-[hsl(var(--x))]` 这种写法应该收敛到零。

## 写代码时的约定

- Tailwind v4：颜色、字号、圆角都通过 `@theme` 暴露成语义类（`bg-elevated-1`、`text-label-2`、`text-footnote`、`rounded-card`），组件里只用语义类。
- 控件高度用 CSS 变量 `--control-h-sm / --control-h / --control-h-lg`，桌面 32 / 36 / 44，移动端自动放大到 36 / 44 / 50。组件写 `h-[var(--control-h)]`。
- 所有动效都要有 `prefers-reduced-motion` 的降级；所有材质都要有 `prefers-reduced-transparency` 的实色降级。
- 可点击元素热区 ≥ 44×44（移动端强制；桌面视觉可以更小，用 padding 补热区）。图标按钮必须带 `aria-label`。
- 不靠颜色单独传达状态：徽标同时带文字或图标。
