/**
 * 用法示例：把 LiquidTabBar 接到路由上，并配合滚动收起。
 * 这是示例，不是可直接使用的组件——按项目替换路由库、图标和「更多」菜单。
 *
 * 应用启动时调用一次 installGlassRefraction()（refraction.ts），在 Chromium 上启用折射；
 * 并按 references/layouts.md「PWA standalone」在 <html> 上标记 data-standalone。
 */
import type { CSSProperties } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { BarChart3, Home, MoreHorizontal, Search, Settings } from 'lucide-react'
import { LiquidTabBar, type LiquidTabBarItem } from './liquid-tab-bar'
import { useCollapseOnScroll } from './use-collapse-on-scroll'

const MORE_KEY = '__more'

const PRIMARY: LiquidTabBarItem[] = [
  { key: '/', label: '首页', icon: Home },
  { key: '/search', label: '搜索', icon: Search },
  { key: '/reports', label: '报表', icon: BarChart3 },
  { key: '/settings', label: '设置', icon: Settings },
]

export function MobileShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const { collapsed, onScroll, expand } = useCollapseOnScroll()
  const active = PRIMARY.find((item) => pathname === item.key || pathname.startsWith(`${item.key}/`))
  const items = [...PRIMARY, { key: MORE_KEY, label: '更多', icon: MoreHorizontal }]

  // 根高度：浏览器 100dvh，主屏 PWA 由 --app-viewport-height 改为 100vh（见 layouts.md「PWA standalone」）
  return (
    <div className="relative h-[var(--app-viewport-height,100dvh)] overflow-hidden bg-canvas">
      {/* 主滚动容器：onScroll 驱动 Tab Bar 收起；底部留出胶囊的空间 */}
      <main onScroll={onScroll} className="main-scroll h-full overflow-y-auto px-4">
        {children}
      </main>

      {/* 顶部 scroll edge，让内容在浮动顶栏下方淡出 */}
      <div
        className="scroll-edge-top z-20"
        style={{ '--scroll-edge-height': 'calc(env(safe-area-inset-top, 0px) + 72px)' } as CSSProperties}
      />

      {/* Tab Bar：距左右下各 21（.tabbar-shell：浏览器里再加安全区，主屏 PWA 里不加）；
          最宽 480 并居中（只设 max-width 会在大屏手机上贴左）。不要在它下方再加模糊 / 压暗层 */}
      <nav
        aria-label="主导航"
        className="tabbar-shell pointer-events-none absolute inset-x-0 bottom-0 z-30 px-[21px]"
      >
        <div className="mx-auto w-full max-w-[480px]">
          <LiquidTabBar
            items={items}
            activeKey={active?.key ?? MORE_KEY}
            collapsed={collapsed}
            onExpand={expand}
            renderItem={(item, slotProps) =>
              item.key === MORE_KEY ? (
                <button key={item.key} type="button" onClick={() => {/* 打开「更多」菜单 */}} {...slotProps} />
              ) : (
                <NavLink key={item.key} to={item.key} {...slotProps} />
              )
            }
          />
        </div>
      </nav>
    </div>
  )
}
