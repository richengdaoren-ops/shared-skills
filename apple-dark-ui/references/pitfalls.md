# 实现中的坑

每一条都是在真实项目里踩过、并且确认了原因和修法的问题。遇到对应症状时直接对照。

## 目录

1. 样式与 Tailwind
2. 玻璃与浏览器兼容
3. 布局与滚动
4. 测量与动画
5. 移动端

---

## 1. 样式与 Tailwind

**症状：`text-body` 和 `text-label` 写在一起，其中一个被吞掉。**
原因：tailwind-merge 不认识自定义字号，把 `text-body` 当成颜色，和 `text-label` 互相覆盖。
修法：在 `cn()` 里扩展 tailwind-merge 配置，注册自定义的字号（`large-title`、`title-1…3`、`headline`、`body`、`callout`、`subhead`、`footnote`、`caption-1/2`、`kpi`）、颜色和圆角。

```ts
import { extendTailwindMerge } from 'tailwind-merge'
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['large-title', 'title-1', 'title-2', 'title-3', 'headline', 'body', 'callout', 'subhead', 'footnote', 'caption-1', 'caption-2', 'kpi'],
      radius: ['shell', 'card', 'inner', 'control', 'small'],
    },
  },
})
```

**症状：Tailwind 工具类不生效，按钮字体、链接颜色总是被重置。**
原因：元素级重置（`button { font: inherit }`、`a { color: inherit }`）写在 `@layer` 外面，优先级压过所有工具类。
修法：重置写进 `@layer base`。

**症状：给标题或材质加的工具类不生效，例如 `text-title-3 font-mono` 仍然是衬线字体、`mat-regular bg-transparent` 仍然有底色。**
原因：自定义的组件级样式（`.text-title-*` 的 font-family、`.lg-*` / `.mat-*` 材质等）写在 `@layer` 外面。不在任何 layer 里的规则优先级高于所有 layer，包括 Tailwind 的 `utilities`。
修法：组件级样式放进 `@layer components`（`assets/tokens.css` 已这样组织）；只有无障碍降级（`prefers-reduced-transparency` 等）故意留在 layer 外，让它压过一切。

**症状：组件里到处是 `bg-[hsl(var(--x))]`。**
修法：把 token 通过 `@theme` 暴露成语义类，组件只用语义类。迁移期给旧 token 留别名，逐页清理到零。

**症状：清理旧样式后某处样式丢失。**
修法：删类名前全局搜索，包括模板字符串拼出来的类名（如 `` `sheet-content-${side}` ``）和 CSS 里的选择器。

## 2. 玻璃与浏览器兼容

**症状：Safari 上玻璃没有模糊 / 构建后某浏览器玻璃消失。**
原因：`backdrop-filter` 值里用了 `var()`（WebKit 前缀属性不解析自定义属性），或标准属性写在 `-webkit-` 前缀之前（压缩工具会丢掉标准属性）。
修法：值写死；`-webkit-backdrop-filter` 写在前面。

**症状：Safari / Firefox 上折射玻璃整块变透明。**
原因：用 `@supports` 检测 `backdrop-filter: url()`，这两个浏览器能解析却渲染为空。
修法：按内核特征判断（`window.chrome`、`navigator.userAgentData`），只在 Chromium 挂折射。

**症状：Chrome 开发者工具切到 iPhone 视图后折射消失。**
原因：只看 UA，设备模拟把 UA 改成了 iOS Safari。
修法：优先看内核独有对象，UA 只作兜底；但 UA 含 `CriOS / EdgiOS / FxiOS` 时一律当 WebKit。

**症状：玻璃里的玻璃发灰、发平。**
原因：外层的 `backdrop-filter` 让它成为 backdrop root，里层只能模糊外层。
修法：玻璃内部不再用玻璃，改用填充色或凸起玻璃片。

**症状：毛玻璃弹窗看起来像实心底。**
原因：遮罩太暗或遮罩本身也模糊。
修法：遮罩 30% 黑、不模糊；弹窗底色只压到一半左右。

**症状：滚动掉帧。**
原因：背景在动画，或内容层大量使用 `backdrop-filter`。
修法：背景静态；内容层材质不模糊；同屏 backdrop-filter ≤ 8 个。

## 3. 布局与滚动

**症状：整页比窗口还宽，出现横向滚动。**
原因：CSS Grid 的默认 `auto` 列宽会被内容（如设置了 `min-width` 的宽表格）撑开。
修法：`grid-template-columns: minmax(0, 1fr)`。

**症状：「内容少时页脚贴底」改完后，整页高度的页面（工作台、内部滚动的表格页）不再撑满。**
修法：内容区用两行网格 `minmax(0,1fr) auto`；页面根元素是 `h-full` 时，用 `:has()` 把网格固定为视口高度（见 layouts.md）。

**症状：表格页工具条里的控件互相重叠。**
原因：一行里放了太多固定宽度的元素。
修法：把信息类元素（地址胶囊、汇总数字）挪出工具条（标题右侧或下一行摘要），按钮组 `shrink-0`，筛选区 `min-w-0`。

**症状：表格右侧多出几个像素的横向滚动。**
原因：某列内容（长数字、操作按钮）比列宽宽。
修法：给该列足够宽度、内容 `whitespace-nowrap`，图标按钮缩到 `size-7`，再适当降低表格 `min-width`。量 `scrollWidth - clientWidth` 确认为 0。

**症状：页面明明没有更多内容，却能往上滚一截。**
原因：用 `grid-template-rows: 0fr → 1fr` 做展开 / 收起时，收起状态下行高为 0，但里面的元素仍会溢出，撑大父级滚动容器的可滚动高度。
修法：收起时给网格的子元素 `overflow: hidden`（展开后可以去掉，避免裁掉阴影和焦点环）。

**症状：一张很长的列表卡片把同一行的另一张卡片也拉高了。**
修法：让「内容固定高度」的那张卡片决定行高；长列表卡片放进 `relative` 格子，自身 `absolute inset-0` 填满并内部滚动；单列布局时改用 `max-height`。

**症状：图表在「最小高度」容器里高度为 0，什么都不显示。**
原因：ResponsiveContainer 之类按父元素百分比取高，父元素只有 `min-height` 时百分比解析为 0。
修法：父元素 `relative min-h-[220px] flex-1`，里面一层 `absolute inset-0`，图表放在这一层里。

## 4. 测量与动画

**症状：容器查询的阈值算对了，卡片却没有切换布局。**
原因：`@container` 查询的是容器的**内容盒**宽度（减去 padding 和 border），不是元素外框宽度。
修法：阈值按内容宽度算（卡片宽 554、padding 20 → 内容约 512）。更好的做法是：卡片内部结构保持固定，只在外层网格上改列数。

**症状：在后台标签页 / 隐藏面板里测量，元素位置停在动画中间。**
原因：页面不可见时 CSS transition 可能不推进。
修法：验证布局时临时注入 `* { transition-duration: 0s !important }`，或等页面可见后再测；不要把动画中途的数值当结果。

**症状：用 flex-grow 过渡做「展开时标题上移」，标题跳到页面顶部。**
原因：flex-grow 只能在「贴顶 / 居中 / 贴底」几种状态之间切换，控制不了「只上移一点」。
修法：由脚本测量出各段空白的目标高度，用 `height` 过渡；`ResizeObserver` 监听容器、标题和卡片，尺寸变化时重算。

**症状：选中块（滑块）位置在收起 / 展开动画后没跟上。**
原因：其他项收缩时当前项只是移动、尺寸没变，ResizeObserver 不触发。
修法：同时监听 `transitionend` 再测一次。

## 5. 移动端

**症状：iOS 输入框聚焦时页面被放大。**
修法：移动端（以及 `pointer: coarse`、`-webkit-touch-callout` 支持的环境）输入控件字号 ≥ 16px。

**症状：PWA 底部胶囊和 Home 指示条之间多出一截。**
原因：standalone 模式下视口已铺满屏幕，Home 指示条是透明叠层，又叠了一次 safe-area。
修法：在 `<html>` 上标记 `data-standalone`，standalone 下胶囊底部只留 21px（浏览器里是安全区 + 21px），主滚动区底部留白同理去掉安全区。代码见 layouts.md「PWA standalone」。

**症状：iOS 主屏应用冷启动时页面底部缺一截，转一下屏才恢复。**
原因：standalone 冷启动时 `100dvh` / `innerHeight` 比真实屏幕矮约一个 `safe-area-inset-top`。
修法：standalone 下根高度用 `100vh`（浏览器里仍用 `100dvh`）。

**症状：大屏安卓上底部胶囊偏左。**
原因：胶囊只设了 `max-width`，没有居中。
修法：外面包一层 `mx-auto w-full max-w-[480px]`。

**症状：底部胶囊下方的内容发雾、看不清。**
原因：Tab Bar 下方加了 scroll-edge 模糊 + 压暗层。
修法：去掉这一层，让内容清楚地从胶囊下方穿过。

**症状：iOS 上整页被拖动回弹，露出背景。**
修法：在应用根元素拦截 `touchmove`：只有当触点下存在能沿该方向继续滚动的容器时才放行，否则 `preventDefault()`（监听器要 `passive: false`）。

**症状：一个页面叠了两个悬浮按钮，互相遮挡并盖住列表最后一项。**
修法：只保留一个主操作悬浮按钮；次要操作放进筛选区的圆形图标按钮；列表底部留出 `pb-20` 左右的空间。
