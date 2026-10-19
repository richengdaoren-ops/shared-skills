# 组件规范

「层」：F = 功能层（Liquid Glass），C = 内容层，L3 = 覆盖层。尺寸写成「桌面 / 移动」。

## 目录

1. 操作：Button、Icon button、ConfirmPopover
2. 输入：Input、FormField、Select、MultiSelect、Switch、Checkbox、Radio、Slider、日期时间
3. 导航：Tabs、分段控件、命令菜单
4. 覆盖层：Dialog、ConfirmDialog、抽屉、Sheet、HoverDetails、Toast、Tooltip
5. 数据展示：Card、Badge、StatusBadge、Progress、Table、Pagination、Skeleton、空状态、图表、代码块

---

## 1. 操作

### 设计逻辑

按钮围绕一个问题：**用户在这个视图里最可能做什么**。最可能的操作给最强的视觉，其余逐级减弱。HIG：用样式而不是尺寸区分主次——同一组按钮尺寸一致，靠底色深浅表达优先级。

- 全部胶囊形。
- 没有 hover 上浮和投影：按钮是控件不是卡片。hover 只改底色或亮度（+6%），按下缩到 0.97。
- 高度取 `--control-h-*`。
- 文案以动词开头，两到四个字；取消按钮固定写「取消」。

### Button variant

| variant | 层 | 外观 | 用途 |
|---|---|---|---|
| `default` | C/F | `bg-tint text-tint-foreground` | 主按钮：视图中最可能的操作，**每个视图最多一个** |
| `secondary` | C | `bg-fill-2 text-label`，hover `bg-fill-1` | 次要操作，与主按钮并列 |
| `outline` | C | 1px `white/14` 描边、透明底，hover `bg-fill-4` | 与次要同级、视觉更轻（成组的导出、筛选） |
| `ghost` | C | 无底色，hover `bg-fill-4` | 工具栏图标、行内操作、取消 |
| `destructive-soft` | C | `bg-danger/14 text-danger` | 页面上的删除、停用入口 |
| `destructive` | L3 | `bg-danger` 实底 + 白字 | 只在确认弹窗里做最终确认 |
| `glass` | F | `.lg-regular` + 折射 | 只用在悬浮于内容之上的位置（浮动工具栏、画布控件） |

破坏性操作分两档的原因：页面上的「删除」只是入口，红字提示风险就够了，不应比主按钮更抢眼；真正执行删除发生在确认弹窗里，那时它是唯一的主操作。HIG 同时要求破坏性操作**永远不能设为默认按钮**，回车不能直接触发删除。

不要把 `glass` 按钮放进卡片或表格——那是内容层，用 `secondary` 或 `ghost`。

**写组件时把确认一起写出来。** 新写或改写一个带删除 / 清空 / 吊销等不可撤销操作的组件时，确认弹窗（ConfirmDialog，见第 4 节）要在同一份代码里实现，入口按钮点击后打开它，确认按钮才真正执行；不要只留一个 `onRequestDelete` 之类的回调让调用方以后再补——那样交付出去的界面实际上没有确认。项目里已有 ConfirmDialog 组件时直接用它，没有时就地写一个最小实现（原生 `<dialog>` 或 Radix Dialog 均可）。

### 尺寸

| size | 高度 | 字号 | 用途 |
|---|---|---|---|
| `sm` | 32 / 36 | Callout | 表格工具条、卡片内、Popover 内 |
| `default` | 36 / 44 | Body | 页面标题旁、表单、Dialog 底部 |
| `lg` | 44 / 50 | Body | 独立页、空状态里的唯一操作 |
| `icon` / `icon-sm` | 36 / 44 · 32 / 36 | — | 只有图标，圆形，**必须带 `aria-label`** |

### 状态

- **禁用**：40% 不透明度。用户可能不明白为什么不能点时，在旁边用文字说明原因。
- **加载**：文字前显示转圈并禁用，宽度基本不变。
- **焦点**：2px `tint/55` 外环 + 2px 间隙（`focus-visible`）。

### 排列

- 页面标题旁：主按钮在最右，次要操作依次向左。
- Dialog 底部：右对齐，「取消」在左、主按钮在右。
- 移动端 Sheet 底部：全宽按钮垂直堆叠，主按钮在最上。
- 工具栏：以图标按钮为主，每组不超过 3 个。

### 移动端悬浮添加按钮

列表页的主操作在移动端变成右下角 56 的圆形 `default` 按钮，图标 24，停在 Tab Bar 上方并留出间距：`bottom: calc(env(safe-area-inset-bottom) + 6.5rem); right: 20px`，投影 `0 12px 32px rgb(0 0 0 / .45)`。列表底部留出足够的 padding，不要让它盖住最后一张卡片的操作。

### ConfirmPopover（轻量确认）

影响小或可撤销的操作（删除一条记录、移除一个标签）用从按钮位置展开的小确认面板：Liquid Glass regular、R-card 20、从触发点放大展开，点空白处或「取消」收起。**不可撤销**的操作仍然用 ConfirmDialog。

---

## 2. 输入

### 设计逻辑

1. **像可以填的槽，而不是框。** 所有字段用填充色底 `bg-fill-3`、不加描边。描边会让密集表单像网格线。
2. **焦点和错误用外环。** 焦点：2px `tint/50` 外环；错误：2px `danger/60` 外环 + 字段下方文字说明。外环不改变尺寸，表单不跳动。
3. **同一种外观，同一种尺寸。** Input、Select、MultiSelect、日期时间选择器共用一套样式常量，高度都取 `--control-h`，和同尺寸按钮并排时对齐。

### Input / Textarea

`bg-fill-3`、无描边、R-control 10、placeholder `label-3`、高 36 / 44、禁用 40%。移动端字号 ≥ 16px。

### FormField

- 标签在上（Subhead、`label`），必填加红色 `*`；说明文字 Footnote、`label-2`。
- 标签与控件间距 6，字段之间 16。
- **有错误时错误文字替换说明文字**（`role="alert"`），不要两段同时出现。

### 选择控件怎么选

| 场景 | 用什么 |
|---|---|
| 改了**立即生效**的设置 | Switch |
| 表单里的是 / 否，**提交后才生效** | Checkbox |
| 2–5 个互斥选项，要一眼看到全部 | Radio 或分段控件 |
| 多于 5 个互斥选项，或空间有限 | Select |
| 从很多项里选多个 | MultiSelect |
| 表格上方的筛选条件 | Select / MultiSelect 的 **filter 形态** |
| 大致数值（权重、温度、透明度） | Slider，旁边显示当前数值 |

Switch 与 Checkbox 的唯一判断标准：切换后是否马上生效。

### Select

- 触发器：同 Input + 右侧上下双箭头（⇅）；展开时显示焦点外环。
- **filter 形态**：虚线胶囊 + ⊕ 图标、Callout、高 32 / 36；有选中值时变实线 + `tint/10` 底，并显示「标签：值」，一眼看出哪些筛选在生效。
- 面板：Liquid Glass regular（挂在 Portal 内容上）、R-card 20、内边距 6、从触发点放大展开；选项高 32 / 36、圆角 14；**选中项只在左侧显示 ✓，不整行着色**；面板内搜索框高 32、圆角 12。

### MultiSelect

已选项是 24 高的胶囊标签（`bg-fill-2`、Caption 1），超过 4 个折叠为「+N」；面板分组标题 Caption 1 `label-3`（不全大写）；底部显示已选数量与「清空」。

### Switch / Checkbox / Radio

- **Switch**：关 `bg-fill-1`、开 `bg-success`（系统绿）、白色滑块；40×24 / 51×31。按住时滑块拉长约 6px 并变成半透明玻璃。带文字时整行可点。
- **Checkbox**：未选中 1.5px `white/30` 描边 + `bg-fill-4`；选中 `bg-tint` + 深色勾；18 / 22、圆角 6；按下缩到 90%。
- **Radio**：同 Checkbox，圆形，选中为深色圆点。

### Slider

轨道 4px（已填充 `tint`、其余 `fill-1`），白色圆形滑块 24；控件高 24 扩大点击区；按住放大 1.18 倍并变成半透明玻璃；**旁边必须显示当前数值**。

### 日期 / 时间选择器

触发器同 Input，左侧日历 / 时钟图标、右侧 ⇅，有值时显示 ✕；面板为 Liquid Glass regular。日期格 36 圆形，今天用细环标出，选中 `bg-tint`；时间按小时 / 分钟两列；格式 `yyyy-MM-dd` / `HH:mm`，等宽数字。

日期范围不要并排放两个宽大的选择器占一整行，做成一枚 filter 胶囊（显示「MM-DD HH:mm → MM-DD HH:mm」），点开后在面板里分别选开始和结束。

---

## 3. 导航

### Tabs

| variant | 外观 | 用途 |
|---|---|---|
| `segmented` | `bg-fill-3` 胶囊底，选中块 `white/18` + 轻投影，同心 | 2–5 个互斥视图、单一维度的分类筛选 |
| `segmented-accent` | 同上，选中块 `bg-tint` | 需要更强选中态时 |
| `underline` | Body，选中项下 2px `tint` 线 | 页面 / 弹窗分区 |
| `slash` | Callout，「今日 / 本周 / 本月」用斜杠分隔 | 卡片标题里的轻量切换 |

- 选中块**滑动**到新选中项（300ms 带回弹，reduced-motion 时不动）。
- 分段控件 ≤ 5 段；选项多时允许横向滚动，右侧加渐隐遮罩提示还有内容，末尾留白让最后一项能完整滑出：
  `overflow-x-auto pr-8 [mask-image:linear-gradient(to_right,#000_calc(100%-40px),transparent)]`
- 只在真的放不下时才加渐隐和右侧留白，放得下时其他控件应紧跟在横条后面。
- 分类选项只列出**实际有数据的类别**，不要把所有可能的类别都摆出来。

### 命令菜单（⌘K）

L3、`.lg-thick`、R-shell 24、宽 640、位于屏幕上部约 14%；输入框高 56、无边框、Title 3；行 ≥ 44、圆角 16（同心）、左侧 32 的图标块（圆角 10）；底部快捷键提示。移动端由顶栏的搜索按钮打开。

---

## 4. 覆盖层

### 设计逻辑

覆盖层临时出现在内容之上，处理完就消失。L3、Liquid Glass thick（磨砂）。

- 只在必要时打断用户；能在页面里完成的事不弹窗。
- 遮罩 30% 黑，不模糊。
- 一次只叠一层；只有 ConfirmDialog 允许叠在其他覆盖层之上。
- 都能用 Esc 或点遮罩关闭，关闭后焦点回到打开它的按钮。

### 选哪一种

| 场景 | 用什么 |
|---|---|
| 填写或确认一组信息（新建、编辑） | Dialog |
| 不可撤销操作的最终确认 | ConfirmDialog |
| 查看 / 编辑某一项的详情，同时保留列表上下文 | 抽屉：桌面从右侧滑入，移动端从底部弹出 |
| 从屏幕边缘调出的辅助面板（如移动端侧边导航） | Sheet |
| 悬停时显示的补充信息 | HoverDetails |
| 操作结果的短暂反馈 | Toast |

### Dialog

- `.lg-thick`、R-shell 24；标题区 Title 2 + 说明 Body `label-2`；标题 / 内容 / 页脚三段之间分隔线。
- 宽度几档（如 520 / 640 / 768 / 900），最高 88dvh，内容区内部滚动。
- 进场 scale 0.95 → 1 + 淡入 280ms `--ease-sheet`；离场 160ms。
- 页脚右对齐：取消在左、主按钮在右。
- 自绘外观的弹窗提供一个开关（如 `surface="none"`）关掉默认玻璃。
- **移动端（< 1024）自动改为底部 Sheet**：左右与底部各内缩 8、R-shell 24、顶部 grabber（36×5 胶囊）、最高 88dvh、从底部滑上 400ms；页脚按钮全宽垂直堆叠，主按钮在上。提醒类弹窗保持居中（如 `presentation="center"`）。

### ConfirmDialog（Alert）

同 Dialog，宽 380，**始终居中**，标题 Title 3 与说明居中；两个按钮等宽并排（取消 `secondary`、确认 `default` 或 `destructive`）。标题写清会发生什么（「删除这条记录？」），不写「警告」「错误」。

### 抽屉（Draw）

`.lg-thick`、浮动、R-shell 24。`side="right"`：桌面右侧面板（距边 12、宽 560），移动端改为底部；`side="bottom"`：底部（内缩 8、最高 88dvh）。移动端顶部 grabber；进场 400ms `--ease-sheet`，离场 240ms。

### Sheet

`.lg-thick`、浮动、R-shell 24、左右距边 12、宽 560。移动端左侧导航抽屉例外：贴边、全高、只有右侧圆角，安全区用内边距让出（不要再叠 top 偏移，否则 PWA 顶部出现一截空白）。

### HoverDetails

Liquid Glass regular、R-card 20；标题 Subhead 加粗、正文 Footnote `label-2`；最大宽 256–380。桌面悬停时跟随鼠标位置；**移动端点击后锚定在点击元素旁**（上方优先、放不下翻到下方，最高 50dvh）——不要在移动端用底部抽屉显示这种补充信息。触发区域鼠标样式用手形（pointer），不要用问号（help）。不在 Popover 上再叠其他视图。

### Toast

Liquid Glass regular 外观、R-card 20、右上角距边 16（加上安全区）。**不按类型铺彩色底**，只用系统色图标区分（成功绿、信息青、警告橙、错误红）；标题 Subhead 加粗、说明 Footnote；操作按钮是 `tint` 胶囊。

### Tooltip

实色 `bg-elevated-3`、R-small 6、Footnote，延迟 500ms。

---

## 5. 数据展示

### 设计逻辑

都在 L1：标准材质或干脆不要容器，不用 Liquid Glass。

- 材质随文字量变厚：图表、指标卡用 regular；表格、成段文字用 thick。
- 内容不是控件：卡片默认没有 hover。
- 颜色只表达语义；装饰性彩色底去掉。
- 数字用等宽 + `tabular-nums`，上下行位数对齐。

### Card

`.mat-regular`（表格用 thick）、R-card 20、内边距 20（紧凑 16）。取消 hover 上浮；只有 `interactive` 卡片 hover 加 `fill-4`。

**指标卡（KPI）**：标题行（单色 16px 图标 + Footnote `label-2`）→ 数值（`text-kpi`，等宽）→ Caption 1 补充说明 / 变化量（箭头表方向，颜色表好坏：同一个「上升」，对收入是绿、对延迟是红）。成对数值（「今日 / 累计」「1 / 540.4K」）只放大前半部分，后半部分用小号 `label-3`，一眼先看到主数。两栏数值在卡片足够宽时并排（用容器查询 `@container`），窄时上下排。

**卡片内指标网格**：标签 Caption 1 `label-3` 在上、值 Footnote / Body `label` 在下。一项含两个数（如「Tokens 1884.3M / 费用 $3947.47」）时拆成主值 + 第二行小号次值，不要用「/」挤在一行被截断。卡片内部的布局保持固定（例如固定 3 列 × 2 行），不要在卡片内部根据宽度来回变换结构，变化只发生在卡片网格的列数上。

**卡片网格的列数**：桌面一般 2 列；卡片太宽时（单列跨满大屏）内容会显得空，宁可两列。

### Badge / StatusBadge

胶囊、系统色 16% 底 + 系统色文字、Caption 1 / 500、无描边、高 20、左右 8；中性为 `fill-3` + `label-2`。必须带文字。`dot` 加 6px 圆点；StatusBadge 固定带点（同步中可呼吸闪烁）。状态 → 颜色：healthy / success 绿、warning 橙、error 红、syncing 青、idle / disabled 中性。

**套餐、类型这类非状态标签用中性色**，不要五颜六色。标签不要和名称挤在一行导致名称被截成「h…」：名称独占标题行，标签换到下一行可换行。

### Progress

轨道 `fill-3`、无描边、高 6（显示数值时 14）。按剩余比例取色时，阈值自己定义（例如剩余 ≤ 20% 红、≤ 50% 橙、其余绿）。宽度变化 500ms。额度类进度条：第一行「窗口名 … 剩余 x%」，条下方一行小字放重置时间等辅助信息。

### Table

- 放在 `.mat-thick` 卡片里（`p-0`），表格不画外框。
- 表头：Footnote 12 / 600 `label-2`，不全大写、不加宽字距；吸顶时用不透明 `bg-elevated-1`。
- 行 ≥ 44；hover `fill-4`；选中 `tint/10`；分隔线 `separator`。
- **对齐**：文字列左对齐，数字列右对齐 + 等宽；不要文字列一半居中一半左对齐。
- **列宽**：名称、多行内容（如三行额度）给足宽度，短值列（状态、时间）收窄。允许拖动调整列宽时，存储 key 加版本号，改默认列宽后升级版本，旧的存储值才不会覆盖新默认。
- **操作列**固定在右侧（`position: sticky; right: 0`），底色与 thick 卡片合成后的颜色一致，左侧一道淡阴影；行 hover 时同步提亮。操作按钮用 `icon-sm` + `size-7`，确保在列宽内放得下。
- 列表页的表格卡片撑满剩余高度、表格自身滚动、表头吸顶；分页放在卡片底部。
- **可展开行**的详情保持紧凑：标签与值同一行内联排列、自动换行（「标签 值  标签 值」），按小节（请求 / 用量 / 计费）分组，不要做成每个字段占一格的稀疏网格——那样浪费大量空间。

### Pagination

每页条数 Select + 页码输入（等宽）+ 4 个 secondary 圆形图标按钮；控件高 `--control-h-sm`；总页数 / 条数 `label-3`。

### Skeleton

`fill-4` 底 + 6% 白色微光、R-small 6；1.6s 扫过一次；reduced-motion 时静止；形状与真实内容一致。

### EmptyState / ErrorState

无容器、居中（仿 ContentUnavailableView）；图标 40 `label-3`（错误为系统红）；Title 3 + Body `label-2`；有可执行操作时给按钮（空状态 primary、错误「重试」secondary）。

### 图表

放在 `.mat-regular` 卡片里；系列色按 `--chart-*` 顺序；只画水平网格；坐标轴 11px `label-3` 等宽；折线 2px 无点；tooltip 为 Liquid Glass regular、圆角 12。图表在「最小高度」容器里要用绝对定位填充（见 pitfalls：ResponsiveContainer 高度为 0）。

### 代码 / JSON 块

`rgb(bg-base / .6)` 底、R-small、`font-mono` 12 / 18。可复制的长 ID 用等宽单行 + 复制按钮，允许断行。
