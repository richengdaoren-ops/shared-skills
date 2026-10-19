# 材质：Liquid Glass、标准材质、顶光、折射

材质类的完整 CSS 在 `assets/tokens.css`，折射组件在 `assets/components/`。

## 目录

1. 选哪种材质
2. Liquid Glass 三档（L2 / L3）
3. 标准材质（L1）
4. 组件顶光
5. 边缘光的实现方式
6. 折射：渐进增强
7. Scroll edge effect
8. 交互中的玻璃（按压、形状变化、瞬时玻璃）
9. 性能与降级

---

## 1. 选哪种材质

| 元素 | 层 | 材质 |
|---|---|---|
| 页面背景 | L0 | 纯色 `bg-canvas` |
| 指标卡、图表卡、列表卡片 | L1 | `.mat-regular` |
| 表格容器、表单卡片、长文本 | L1 | `.mat-thick` |
| 直接放在背景上的轻量提示 | L1 | `.mat-thin` |
| 嵌在材质里的区块、低端设备降级 | L1 | `.surface-solid` 或 `bg-fill-*` |
| 侧边栏、工具栏控件组、菜单、Popover、Select 面板、Toast | L2 | `.lg-regular` |
| 移动端胶囊 Tab Bar、浮动圆形按钮 | L2 | `.lg-clear` |
| Dialog、Sheet、抽屉、Alert、命令菜单 | L3 | `.lg-thick` |
| Tooltip | L2 | 实色 `bg-elevated-3`（小而短暂，不值得开模糊） |

规律：**文字越多，材质越厚**——厚材质给细小文字提供更好的对比。表格一律 thick 或实色。

## 2. Liquid Glass 三档

| 类 | 用途 | 底色 | backdrop-filter |
|---|---|---|---|
| `.lg-regular` | 功能层：承载少量文字的导航与面板 | `rgb(24 26 33 / .50)` + 顶光 | `blur(24px) saturate(150%)` |
| `.lg-thick` | 覆盖层：承载大量文字（磨砂） | `rgb(22 24 31 / .62)` + 顶光 | `blur(28px) saturate(150%)` |
| `.lg-clear` | 下方有内容经过的小控件 | `rgb(20 21 25 / .30)` + 顶光 | `blur(10px) saturate(200%) brightness(1.08)` |

要点：

- **覆盖层是磨砂，不是实心。** 底色只压到一半左右，靠大半径模糊让下方页面变成柔和的色块透出来，文字仍然清晰。实心底会让弹窗和页面失去层次。
- **遮罩不模糊**：Dialog 的遮罩用 30% 黑，不加 blur。遮罩压太暗或也模糊，磨砂玻璃会看起来像实心底。
- **clear 只给小面积**：底色很薄，大面积使用时下方内容会干扰可读性。下方内容偏亮（大图、亮色图表）时，HIG 建议加约 35% 黑的调暗层。
- **同屏玻璃尽量 ≤ 5 个**（HIG：只用于最重要的功能元素）。
- **玻璃里不套玻璃**。玻璃内部分组用 `bg-fill-3`，选中项用 `bg-fill-2` 或下面的「凸起玻璃片」。

### 凸起玻璃片（玻璃内的选中项）

侧边栏选中项、分段控件选中块这类「玻璃里的选中态」，不再嵌一层玻璃，而是用一块看起来微微凸起的片：

```css
.nav-item-selected {
  background: linear-gradient(180deg, rgb(255 255 255 / .11), rgb(255 255 255 / .05));
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / .12),  /* 顶边高光 */
    inset 0 0 0 1px rgb(255 255 255 / .05), /* 极淡描边 */
    0 1px 2px rgb(0 0 0 / .45),             /* 贴身阴影 */
    0 6px 16px rgb(0 0 0 / .28);            /* 浮起阴影 */
}
```

形状用胶囊。只用 `bg-fill-3` 平涂会让选中项「被压平」，没有质感。

## 3. 标准材质（内容层）

| 类 | 背景 | 用途 |
|---|---|---|
| `.mat-thin` | `rgb(255 255 255 / .025)` | 轻量提示区 |
| `.mat-regular` | `rgb(255 255 255 / .035)` | 指标卡、图表卡、列表卡片 |
| `.mat-thick` | `rgb(255 255 255 / .05)` | 表格容器、表单卡片、长文本 |
| `.surface-solid` | `bg-elevated-1` + `border-separator` | 嵌套区块、降级 |

共同外观：`1px solid rgb(255 255 255 / .085)` 发丝线描边 + `inset 0 1px 0 rgb(255 255 255 / .055)` 顶部内高光。**不做模糊，不做投影。**

为什么内容层不模糊：内容层面积大、数量多，全部开 `backdrop-filter` 会拖慢滚动；而且模糊是功能层的视觉语言，内容层也模糊就分不清谁浮在谁上面。为什么不用渐变描边：半透明的面会让渐变描边的底层透进来，把卡片内部也染亮。

材质内部的分组用 `bg-fill-*`，不再嵌套材质。

## 4. 组件顶光

整个界面只有一个隐含的光源：**从正上方往下打的弱光**。背景不受光（纯色），光只落在组件表面。

```css
--top-light: linear-gradient(180deg,
  rgb(255 255 255 / .028),
  rgb(255 255 255 / .01) 64px,
  rgb(255 255 255 / 0) 160px);
```

- 叠在所有 `.lg-*`、Toast、图表 Tooltip 的底色之上（作为第一层 background）。
- 用**固定像素**而不是百分比淡出：高 600 的表格和高 80 的指标卡，顶部受光的范围一样，不会因为组件高度不同而亮度不一。
- 光要弱：最亮处不到 3% 白，正文对比度不受影响。
- 玻璃的描边同样遵循这个光源：左上 / 顶边亮，往下变暗（见下一节）。

## 5. 边缘光的实现方式

用「多层背景 + 透明边框」实现玻璃的渐变描边，不用伪元素，也不要求元素是定位元素（`position: fixed` 的 Dialog 可以直接用）：

```css
.lg-regular {
  border: 1px solid transparent;
  background:
    var(--top-light) padding-box,                                            /* 1. 顶光 */
    linear-gradient(rgb(24 26 33 / .5), rgb(24 26 33 / .5)) padding-box,     /* 2. 玻璃底色 */
    linear-gradient(160deg,                                                  /* 3. 边缘光 */
      rgb(255 255 255 / .16), rgb(255 255 255 / .045) 36%,
      rgb(255 255 255 / .025) 64%, rgb(255 255 255 / .07)) border-box;       /*    左上亮、右下弱亮 */
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / .06),  /* 顶部镜面高光 */
    0 8px 28px rgb(0 0 0 / .26);           /* 浮起投影 */
  -webkit-backdrop-filter: blur(24px) saturate(150%);  /* 前缀写在前面 */
  backdrop-filter: blur(24px) saturate(150%);
}
```

两个必须遵守的写法细节（违反会在某个浏览器上整块失效）：

- `-webkit-backdrop-filter` 写在标准属性**之前**。部分 CSS 压缩工具（如 Lightning CSS）在标准属性位于前缀之前时会丢掉 `backdrop-filter`。
- `backdrop-filter` 的值**写死，不要用 `var()`**。WebKit 的 `-webkit-backdrop-filter` 不解析自定义属性。

clear 档额外加一道 `inset 0 -1px 0 rgb(0 0 0 / .16)` 底部暗边，增加体积感。

## 6. 折射：渐进增强

### 原理

用 SVG `feDisplacementMap` 作为 `backdrop-filter: url(#id)`，让玻璃边缘像凸透镜一样弯折下方的真实页面内容：

1. **位移贴图**：按元素实际宽高与圆角，在 canvas 上生成圆角矩形的位移贴图。R、G 通道编码「指向内部的法线 × 折射强度」，128 为不位移。强度只作用在边缘的 bezel 带内，按凸透镜曲面 `(1 − t)^2.4` 衰减；中间区域不位移，文字保持清晰。
2. **滤镜链**：`feImage`（贴图）→ 对 R / G / B 三个通道分别做 `feDisplacementMap`，位移量依次递减 6–8%，产生轻微色散 → 用 `screen` 混合回一张图。
3. **挂载**：`backdrop-filter: blur(x) url(#id) saturate() brightness()`，先模糊再折射。元素尺寸变化时由 `ResizeObserver` 在下一帧重建贴图。

参数：

| 变体 | bezel | 最大位移 | 色散 | 预模糊 | 用于 |
|---|---|---|---|---|---|
| regular | 26 | 64 | 6% | 10px | 侧边栏、工具栏控件组、菜单（承载文字，要先模糊保证可读） |
| clear | 22 | 72 | 8% | 0.5px | 胶囊 Tab Bar、浮动按钮 |

覆盖层（thick）和内容层不折射：thick 承载大量文字，折射会干扰阅读；内容层不是玻璃。

### 只在 Chromium 启用

- 判断内核用 Chromium 独有的 `window.chrome` 与 `navigator.userAgentData`，UA 字符串只作兜底。不能只看 UA：Chrome 开发者工具切到 iPhone 视图时 UA 会变成 iOS Safari，真实的 Chromium 会被误判。
- iOS 上的 Chrome / Edge / Firefox（UA 含 `CriOS` / `EdgiOS` / `FxiOS`）是 WebKit 外壳，一律不启用。
- **不能用 `@supports (backdrop-filter: url(#x))`**：Safari / Firefox 能解析 `url()` 却渲染为空，会被误判为支持，结果整块玻璃变透明。
- 启用后在 `<html>` 上标记 `data-glass-refraction="true"`，折射元素带 `data-refraction` 属性。CSS 据此**降低玻璃底色不透明度**（regular .50 → .40，clear .30 → .12）并换成内侧高光（左上亮边 + 右下弱亮边 + 一圈内发光），让被弯折的背景透出来。

### Safari / iOS PWA 上怎么办

WebKit 的 `backdrop-filter` 只接受内置滤镜函数，**做不到对实时页面内容的折射**；Apple 自己的 Liquid Glass 是原生系统材质，网页（包括主屏 PWA）用不到。可选方案：

- **只用 CSS 加强厚度感**（推荐）：更亮更厚的边缘光、内发光、随选中项移动的高光，只对 WebKit 生效。没有真实弯折，但一眼看上去是玻璃。
- **对背景副本做 `filter: url()`**：WebKit 支持对元素自身应用 SVG 滤镜。玻璃内放一份被裁剪的背景副本再折射它——只适合背景是固定图片的场景（如独立页的装饰背景），滚动内容无法实时同步。
- **WebGL**：截图页面后在 canvas 里折射。成本高（滚动重截、耗电、图片和字体问题），不值得用在 Tab Bar 这类控件上。WebGL 液态玻璃只适合背景是一张静态图片的沉浸页。

近黑背景下折射只在亮色内容经过时明显，所以 Safari 上「只有磨砂」的观感差距比想象中小。

## 7. Scroll edge effect

浮动控件不铺整条背景，内容滚到控件下方时用一段渐变模糊过渡：

```css
.scroll-edge-top {
  position: absolute; inset-inline: 0; top: 0;
  height: var(--scroll-edge-height, 72px);
  pointer-events: none;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  background: linear-gradient(rgb(17 19 26 / .7), rgb(17 19 26 / 0));  /* 用背景色 */
  -webkit-mask-image: linear-gradient(#000 45%, transparent);
  mask-image: linear-gradient(#000 45%, transparent);
}
```

- 放在滚动容器之上、浮动控件之下，不拦截点击。
- 桌面放在内容区顶部（高度 = 顶栏控件所占高度，如 84），移动端顶部高度加上 `env(safe-area-inset-top)`。
- **底部 Tab Bar 下方一般不加**：内容从胶囊下方清楚地穿过，折射和磨砂才有东西可表现；加了模糊和压暗反而像一层脏雾。确有亮色内容干扰可读性时，再加一层很轻的调暗。

## 8. 交互中的玻璃

- **按压**：`active` 时 scale 0.96–0.97，100ms。
- **指针高光**（可选）：`radial-gradient` 的中心取 `--mx / --my`，跟随指针。
- **形状变化**：按钮展开为菜单时，从按钮位置放大展开（`transform-origin` 设为触发点，scale 0.6 → 1，220ms `--ease-standard`）。更进一步可以做「按钮变形成菜单」：按钮先缩成液滴，再冲出并略超过菜单尺寸，最后回落；关闭时反向收回，并有一颗小液滴被吸回按钮。用 Web Animations API 分段控制，进行中忽略关闭请求，reduced-motion 时只淡入淡出。
- **瞬时玻璃**：Switch、Slider 的滑块在按住时变成半透明玻璃（Switch 滑块同时横向拉长约 6px，Slider 滑块放大 1.18 倍），松手恢复。这是内容层中唯一允许出现玻璃的情况。

## 9. 性能与降级

- 同屏 `backdrop-filter` 元素 ≤ 8 个；中端 Android 设备滚动表格页保持 ≥ 55fps。
- 背景不动画——背景动则所有 backdrop-filter 每帧重算。
- 内容层不模糊。
- 折射贴图按元素尺寸生成，尺寸没变不重建（用 `宽x高r圆角` 做缓存 key）。
- `prefers-reduced-transparency: reduce` 时所有 `.lg-*`、`.mat-*` 改为实色 `bg-elevated-2`、去掉 backdrop-filter。
