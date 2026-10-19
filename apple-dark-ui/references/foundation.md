# Foundation：颜色、字体、间距、尺寸、圆角、动效、图标

所有 token 的完整代码在 `assets/tokens.css`。本文解释每组 token 的取值理由和使用规则。

## 目录

1. 背景层级
2. 文字（Label）
3. 填充与分隔线
4. 强调色与系统色
5. 图表配色
6. 字体栈
7. 字号体系
8. 间距
9. 尺寸与点击区域
10. 圆角（同心规则）
11. 动效
12. 图标
13. 无障碍

---

## 1. 背景层级

| Token | Tailwind | 值 | 用途 | 对应 HIG |
|---|---|---|---|---|
| `--bg-base` | `bg-canvas` | `#11131A`（可在 `#0A0B0D`–`#11131A` 间取） | 页面底色 | systemBackground |
| `--bg-elevated-1` | `bg-elevated-1` | `#181B22` | 实色卡片、吸顶表头 | secondarySystemBackground |
| `--bg-elevated-2` | `bg-elevated-2` | `#1F222A` | 卡片内分组、玻璃的不透明降级色 | tertiarySystemBackground |
| `--bg-elevated-3` | `bg-elevated-3` | `#282B34` | Tooltip、hover 强调 | elevated |

- 四级都带一点冷调（色相约 225°、饱和度约 10–20%）。纯中性灰在近黑处显得发脏、没有空气感。
- **不用纯黑 `#000`**：卡片在纯黑上发飘，OLED 屏滚动有拖影。
- **不用 `#1C1C1E` 这种中性深灰做底**：背景、侧边栏、卡片会挤在同一亮度区间，层级拉不开。
- L0 背景是纯色、静态的。保留一个独立的 `position: fixed` 背景图层，以后要调背景只改这一处。
- 取舍：纯色背景上，直接压在背景上的玻璃（桌面侧边栏）下方没有图案可弯折，折射看不出来，玻璃感主要靠边缘光和投影；下方有内容滚过的玻璃（移动端 Tab Bar、浮在内容上的工具栏）折射依然明显。这是可以接受的。

## 2. 文字（Label）

沿用 Apple 深色模式的 label 语义：白色 / 冷白的透明度阶梯。

| Token | Tailwind | 值 | 用途 |
|---|---|---|---|
| `--label-primary` | `text-label` | `rgb(255 255 255 / .95)` | 标题、正文、表格主列 |
| `--label-secondary` | `text-label-2` | `rgb(235 235 245 / .68)` | 描述、次要列、表单说明 |
| `--label-tertiary` | `text-label-3` | `rgb(235 235 245 / .44)` | placeholder、禁用态、时间戳 |
| `--label-quaternary` | `text-label-4` | `rgb(235 235 245 / .20)` | 水印、装饰线；不得用在 thin / clear 材质上 |

对比度：正文 ≥ 4.5:1，小字号自定义配色争取 7:1。`label-tertiary` 在 elevated-1 上约 3.4:1，只能放非关键信息。

## 3. 填充与分隔线

| Token | Tailwind | 值 | 用途 |
|---|---|---|---|
| `--fill-primary` | `bg-fill-1` | `rgb(255 255 255 / .14)` | Switch 关闭态轨道、Slider 轨道 |
| `--fill-secondary` | `bg-fill-2` | `rgb(255 255 255 / .10)` | secondary 按钮底、分段控件底 |
| `--fill-tertiary` | `bg-fill-3` | `rgb(255 255 255 / .07)` | 输入框底、玻璃内分组、行 hover |
| `--fill-quaternary` | `bg-fill-4` | `rgb(255 255 255 / .045)` | 斑马纹、中性标签底、卡片 hover |
| `--separator` | `border-separator` | `rgb(255 255 255 / .07)` | 分隔线、描边 |
| `--separator-opaque` | `border-separator-opaque` | `#2A2D35` | 需要不透明分隔的地方（吸顶表头下沿） |

填充一律用**白色透明度**，不用灰色透明度——灰叠在近黑上会发脏。

## 4. 强调色与系统色

### 强调色

| Token | 值 | 用途 |
|---|---|---|
| `--tint` | `#E7EBF3` | 主按钮背景、选中态图标、链接、焦点环 |
| `--tint-foreground` | `#1C1C1E` | 强调色背景上的文字与图标（对比度约 14:1） |

推荐用**略带冷调的浅灰白**做强调色，界面接近单色：主按钮是浅色底深色字，在一片深色控件里形成最强的明暗对比，比任何彩色都更「苹果」。如果品牌必须用彩色，换掉 `--tint` 和 `--tint-foreground` 即可，规则不变。

使用规则（HIG Liquid Glass Color）：

- 强调色**用在背景上**，不用在大段文字上：主按钮 = `bg-tint text-tint-foreground`。
- 每个视图**最多一个**强调色主按钮。
- 玻璃上的图标和文字默认单色（白 / label-secondary），只有选中项用 tint。
- 不靠颜色单独传达状态：状态徽标必须同时带文字或图标。

### 系统色（深色版）

只用于语义和图表，不做装饰。

| 名称 | 值 | Tailwind 语义 | 语义 |
|---|---|---|---|
| Blue | `#0A84FF` | `chart-1` | 图表 |
| Green | `#30D158` | `success` | 成功、健康、在线 |
| Red | `#FF453A` | `danger` | 错误、删除、失败 |
| Orange | `#FF9F0A` | `warning` | 警告、限流、冷却 |
| Yellow | `#FFD60A` | `caution` | 待处理、注意 |
| Teal | `#40C8E0` | `info` | 信息、同步中 |
| Indigo | `#5E5CE6` | — | 图表 |
| Purple | `#BF5AF2` | — | 图表、特殊标签 |
| Pink | `#FF375F` | — | 图表 |
| Gray | `#8E8E93` | — | 中性、未知 |

彩色出现的形态：小面积的徽标（系统色 16% 底 + 系统色文字）、圆点、进度条、图表系列。不要大面积铺彩色底。

## 5. 图表配色

系列顺序：Blue → Teal → Green → Orange → Purple → Pink → Yellow → Indigo（`--chart-1…8`）。

- 只画水平网格线，颜色 `--separator`。
- 坐标轴文字 11px、`label-tertiary`、等宽数字；标签互相重叠时自动跳过。
- 折线 2px、不画点；面积图用系列色 0.25 → 0 的渐变。
- Tooltip 用 Liquid Glass regular、圆角 12。
- 图表库（如 recharts）把颜色写进 SVG 属性，CSS 变量不一定生效，主题色值要在 JS 里再定义一份并保持同步。

## 6. 字体栈

```css
--font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display",
             "PingFang SC", "Hiragino Sans", "Hiragino Kaku Gothic ProN",
             "Noto Sans CJK SC", "Microsoft YaHei UI", "Segoe UI", sans-serif;
--font-serif: "Literata Variable", "Noto Serif SC Variable", "Songti SC", Georgia, serif;
--font-mono: "JetBrains Mono Variable", "SF Mono", ui-monospace, Menlo, "PingFang SC", Consolas, monospace;
```

| 字体 | 用途 |
|---|---|
| 系统字体 `font-sans` | 正文、表格、表单、按钮、导航等全部界面文字 |
| 衬线 `font-serif` | 大标题与 Title 1–3。Literata（拉丁）+ 思源宋体（中日文）是一组中英文气质一致的开源组合 |
| 等宽 `font-mono` | 代码、JSON、ID、密钥、KPI 指标数字 |

- 衬线标题是可选的品牌化手段；不用时标题回到系统字体，规则不变。
- 字体都选 SIL OFL 授权，用 `@fontsource-variable/*` 自托管，按 unicode-range 切片按需加载（中文衬线约 100 片，浏览器只下载页面出现的字符）。切片不要进 PWA 预缓存。
- 字重只用 400 / 500 / 600 / 700，不用 100–300（HIG：避免 Light / Thin）。
- 数字统一 `font-variant-numeric: tabular-nums`（表格、KPI、计费、计数、分页）。

## 7. 字号体系

HIG 的 pt 对应 CSS px。桌面采用介于 macOS 与 iPadOS 之间的密度并为中文略放大；移动端（< 1024px）直接采用 iOS 默认（Large）档。字号写成 `@theme` 变量，移动端在媒体查询里覆盖，组件只写 `text-body` 这样的语义类。

| Style | Tailwind | 桌面 size / line | 移动 size / line | 字重 | 用途 |
|---|---|---|---|---|---|
| Large Title | `text-large-title` | 30 / 36 | 34 / 41 | 700 | 页面标题 |
| Title 1 | `text-title-1` | 24 / 30 | 28 / 34 | 700 | 独立页标题、空页大标题 |
| Title 2 | `text-title-2` | 20 / 26 | 22 / 28 | 600 | Dialog / Sheet 标题 |
| Title 3 | `text-title-3` | 17 / 22 | 20 / 25 | 600 | 卡片标题、设置分组标题 |
| Headline | `text-headline` | 14 / 20 | 17 / 22 | 600 | 列表行主文字、强调 |
| Body | `text-body` | 14 / 20 | 17 / 22 | 400 | 正文、单元格、表单值 |
| Callout | `text-callout` | 13 / 18 | 16 / 21 | 400 | 小按钮文字、说明段落 |
| Subhead | `text-subhead` | 13 / 18 | 15 / 20 | 500 | Tab、分段控件、表单标签 |
| Footnote | `text-footnote` | 12 / 16 | 13 / 18 | 400 | 辅助说明、时间戳、表头 |
| Caption 1 | `text-caption-1` | 11 / 14 | 12 / 16 | 500 | 徽标、坐标轴、分组小标题 |
| Caption 2 | `text-caption-2` | 11 / 13 | 11 / 13 | 500 | 极小的辅助标签 |
| KPI | `text-kpi` | 28 / 34 | 28 / 34 | 600 · mono | 指标数值 |

硬性规则：

- **最小字号 11px**，不要出现 `text-[10px]` 及以下。
- 移动端输入控件 ≥ 16px，否则 iOS 聚焦时会自动放大页面。
- 分组小标题不用「全大写 + 宽字距」：中文没有大小写，宽字距破坏阅读节奏。用 Caption 1 / 500 / label-secondary（或 label-tertiary）。
- 正文行宽 ≤ 72ch。

## 8. 间距

刻度（4 pt 基数，8 pt 为主）：`0 · 2 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64`

| 场景 | 桌面 | 移动 |
|---|---|---|
| 页面左右边距 | 32 | 16（HIG 紧凑宽度标准边距） |
| 页面区块间距 | 32 | 24 |
| 卡片之间 | 16 | 12 |
| 卡片内边距 | 20 | 16 |
| 表单字段之间 | 16 | 16 |
| 标签 → 控件 | 6 | 6 |
| 列表行垂直内边距 | 10 | 12 |
| 按钮组之间 | 8 | 8 |

## 9. 尺寸与点击区域

| 元素 | 桌面 | 移动 |
|---|---|---|
| 按钮 small | 32 | 36（热区仍需 ≥ 44） |
| 按钮 regular | 36 | 44 |
| 按钮 large | 44 | 50 |
| 输入框 / Select | 36 | 44 |
| 列表行 / 表格行 | ≥ 44 | ≥ 52 |
| 侧边栏项 | 44 | — |
| 胶囊 Tab Bar | — | 62 |
| Switch | 40 × 24 | 51 × 31（iOS 标准） |
| Checkbox / Radio | 18 | 22 |

控件高度用变量 `--control-h-sm / --control-h / --control-h-lg` 表达，按钮和输入框共用，移动端自动切换，保证同尺寸的按钮和输入框并排时上下对齐。任何可点击元素热区 ≥ 44×44：移动端强制，桌面视觉可以更小，用 padding 补足。

## 10. 圆角（同心规则）

**内层圆角 = 外层圆角 − 内边距**。只在顶层容器定义圆角，内部按规则推导。

公式适用于**贴着外框的内层元素**：选中块、分组底色、面板里的选项、卡片里的输入组。它们与外框之间只隔一圈内边距，圆角不同心会一眼看出来。

公式算出的值**小于 R-inner（12）时，按元素类型取刻度值**，不要真的用 4、6 这种接近直角的圆角：
- 内层是一张独立的小卡片（例如移动端大卡片里的订单小卡片、卡片里的列表项卡片）→ 用 R-inner 12。它有自己的边框和底色，读起来是另一张卡片而不是外框的「内衬」。
- 内层是控件（输入框、方形按钮）→ 用 R-control 10；胶囊控件保持胶囊。
- 内层是很小的装饰（色块、代码块、kbd）→ 用 R-small 6。

需要严格同心又不想内层圆角太小时，减小外层的内边距（例如卡片 20、内边距 8 → 内层 12），而不是把内层圆角压到 4。

| 层级 | Tailwind | 值 | 示例 |
|---|---|---|---|
| R-shell | `rounded-shell` | 24 | 浮动侧边栏、Sheet、Dialog、命令菜单 |
| R-card | `rounded-card` | 20 | 卡片、表格容器、Popover、菜单、Toast |
| R-inner | `rounded-inner` | 12 | 卡片内分组（20 − 8）、面板里的搜索框 |
| R-control | `rounded-control` | 10 | 输入框、表单内的方形控件 |
| R-small | `rounded-small` | 6 | 代码块、kbd、小色块、Checkbox |
| Capsule | `rounded-full` | 9999 | 按钮、徽标、分段控件、搜索框、Tab Bar、Switch |

- 按钮默认胶囊形（iOS 26 控件趋向更圆；HIG：水平排列的按钮优先胶囊）。
- 菜单面板 R-card 20、内边距 6 → 选项圆角 14。
- 侧边栏选中项也用胶囊形，与按钮、Tabs 一致。
- 把项目里零散的 `rounded-[2px]`、`rounded-[4px]` 收敛到上表。

## 11. 动效

| 场景 | 时长 | 曲线 |
|---|---|---|
| hover / 颜色变化 | 150ms | ease-out |
| 按压 | 100ms | ease-out（scale 0.97） |
| 菜单 / Popover 展开（形状变化） | 220ms | `cubic-bezier(.2,.8,.2,1)`（`--ease-standard`），从触发点放大 0.6 → 1 |
| Dialog 进入 | 280ms | `cubic-bezier(.32,.72,0,1)`（`--ease-sheet`），scale 0.95 → 1 + 淡入 |
| Sheet / 抽屉进入 | 380–400ms | `--ease-sheet`，从边缘滑入 |
| 退出 | 约进入时长 × 0.6 | ease-in |
| 分段控件选中块滑动 | 300ms | 轻微回弹 |
| Tab Bar 选中块 | 420ms | 弹簧 `cubic-bezier(.34,1.4,.64,1)` |
| Tab Bar 收起 / 展开 | 300ms | `--ease-sheet` |

- 不做：背景漂移、图标 hover 放大、按钮 hover 上浮、卡片 hover 上浮。
- `prefers-reduced-motion` 时只保留透明度变化（或把动画时长设为 1ms）。

## 12. 图标

- 用与 SF Symbols 风格接近的线性图标库（如 lucide-react）。
- 尺寸：16（行内、侧边栏）/ 18（按钮）/ 24（Tab Bar）/ 40（空状态）。线宽统一 1.75。
- 图标默认单色，跟随文字颜色；只有选中项用 tint。
- 白底的品牌 Logo 在深色界面上略微压暗（HIG：深色模式下柔化白色背景）。
- 图标按钮必须带 `aria-label`；只有图标的导航项还要有悬停提示。

## 13. 无障碍

```css
@media (prefers-reduced-transparency: reduce) {
  /* 所有 .lg-* 与 .mat-* 改为实色 bg-elevated-2，去掉 backdrop-filter */
}
@media (prefers-contrast: more) {
  /* separator 提到 .24，label-secondary 提到 .78，label-tertiary 提到 .56 */
}
@media (prefers-reduced-motion: reduce) {
  /* 关闭形状变化、按压缩放、弹跳；只保留淡入淡出 */
}
```

完整实现见 `assets/tokens.css`。关闭透明度后，所有页面都要可用，不能出现透明元素叠在一起看不清的情况。
