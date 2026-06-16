# 趣魅视觉系统实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将"畅通无阻"网站从橙色主题全面升级为抹茶绿手账漫画风格，重命名为"趣魅"，引入小马吉祥物。

**Architecture:** 纯前端视觉改动，涉及 9 个文件。从底层令牌（tailwind.config.ts、globals.css）到布局层（layout、navbar）再到组件层（card、hero、sectionnav），自底向上替换。不改变任何业务逻辑或数据流。

**Tech Stack:** Next.js 14, Tailwind CSS, TypeScript, React Server Components

---

### Task 1: 更新 Tailwind 色彩系统

**Files:**
- Modify: `c:\Users\yuton\Projects\畅通无阻\tailwind.config.ts`

- [ ] **Step 1: 替换颜色系统**

将整个 `colors` 配置替换为抹茶绿系：

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // 主色系 — 抹茶森绿
        primary: {
          50: "#f7faf4",
          100: "#edf3e5",
          200: "#dae6ca",
          300: "#bfd3a5",
          400: "#a3bf7e",
          500: "#8FA86A",
          600: "#7a9555",
          700: "#6B7B4E",
          800: "#566341",
          900: "#475237",
        },
        // 点缀 — 暖珊瑚
        accent: {
          50: "#fef6f4",
          100: "#fde8e3",
          200: "#fbd1c8",
          300: "#f5b0a0",
          400: "#e07b6c",
          500: "#c45c4a",
          600: "#a84738",
          700: "#8c3a2f",
          800: "#73332b",
          900: "#602f28",
        },
        // 暖棕 — 社区模块点缀
        warm: {
          50: "#fdf8f2",
          100: "#f9edde",
          200: "#f1d8bb",
          300: "#e6bd8f",
          400: "#d4a76a",
          500: "#c4904a",
          600: "#b0783b",
          700: "#8b6914",
          800: "#6e5217",
          900: "#5a4418",
        },
        // 背景
        surface: {
          DEFAULT: "#FAFAF5",
          card: "#FDFDFA",
          muted: "#F3F5EE",
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', "serif"],
        sans: ['"Noto Sans SC"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "0.875rem",
        "3xl": "1.25rem",
      },
      boxShadow: {
        card: "0 2px 0 rgba(107,123,78,0.08)",
        lift: "0 4px 0 rgba(107,123,78,0.12)",
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

- [ ] **Step 2: 验证**

运行: `cd c:/Users/yuton/Projects/畅通无阻; npx --no-install next build --no-lint 2>&1 | tail -5`
预期: 编译通过（颜色 class 可能暂时不被使用，但不会报错）

---

### Task 2: 重写全局样式

**Files:**
- Modify: `c:\Users\yuton\Projects\畅通无阻\src\app\globals.css`

- [ ] **Step 1: 完整替换 globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --brand: 85 25% 45%;
    --brand-soft: 85 30% 94%;
    --accent: 12 55% 55%;
    --warm: 38 50% 52%;
    --bg: 60 20% 97%;
    --surface: 60 15% 98%;
    --border-color: 88 20% 78%;
    --text: 80 8% 20%;
    --text-muted: 80 8% 45%;
    --radius: 0.75rem;
  }
}

@layer base {
  * {
    @apply border-[hsl(var(--border-color))];
  }
  body {
    @apply bg-[hsl(var(--bg))] text-[hsl(var(--text))];
    font-family: "Noto Sans SC", system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2 {
    font-family: "Noto Serif SC", serif;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: hsl(88 15% 80%);
    border-radius: 9999px;
  }
}

/* 名言滚动 */
@keyframes scroll-up {
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}
.quote-scroll {
  animation: scroll-up 50s linear infinite;
}
.quote-scroll:hover {
  animation-play-state: paused;
}

/* Markdown 正文样式 */
.prose-content h2 {
  @apply text-2xl font-bold mt-10 mb-4;
  font-family: "Noto Serif SC", serif;
  color: hsl(85, 25%, 40%);
}
.prose-content h3 {
  @apply text-lg font-bold mt-8 mb-3;
  font-family: "Noto Sans SC", sans-serif;
  color: hsl(85, 20%, 42%);
}
.prose-content p {
  @apply mb-4 leading-[1.8] text-gray-600;
}
.prose-content ul {
  @apply list-none pl-0 my-4 space-y-2;
}
.prose-content ul li {
  @apply pl-6 relative leading-[1.8] text-gray-600;
}
.prose-content ul li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.65em;
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: hsl(85, 25%, 55%);
}
.prose-content strong {
  @apply font-bold text-gray-900;
}
.prose-content hr {
  @apply my-10 border-0 h-px;
  background: linear-gradient(90deg, transparent, hsl(88 20% 78%), transparent);
}
.prose-content blockquote {
  @apply border-l-4 border-[hsl(var(--brand))]/25 pl-5 italic text-gray-500 my-6 py-1;
  background: linear-gradient(90deg, hsl(85 30% 94% / 0.5), transparent);
  border-radius: 0 0.5rem 0.5rem 0;
}
.prose-content code {
  @apply bg-[hsl(var(--brand-soft))] px-1.5 py-0.5 rounded-md text-sm;
  color: hsl(85, 25%, 38%);
}
```

- [ ] **Step 2: 验证构建**

运行: `cd c:/Users/yuton/Projects/畅通无阻; npx --no-install next build --no-lint 2>&1 | tail -5`
预期: 编译成功

---

### Task 3: 更新布局和品牌名

**Files:**
- Modify: `c:\Users\yuton\Projects\畅通无阻\src\app\layout.tsx`

- [ ] **Step 1: 更新 metadata 和 body 样式**

修改 `layout.tsx`：

```tsx
import type { Metadata } from "next";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "趣魅 - 沟通能力学习社区",
  description: "学习沟通技巧，提升表达能力。教方法，不教话术。像翻一本手账，轻松学会聊天。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col bg-surface">
        <TopNavbar />
        <div className="flex-1 mx-auto w-full max-w-6xl px-4 py-6">
          <div className="flex gap-8">
            <LeftSidebar />
            <main className="flex-1 min-w-0 pb-20 md:pb-0">
              {children}
            </main>
          </div>
        </div>
        <Footer />
        <BottomTabBar />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: 验证构建**

运行: `cd c:/Users/yuton/Projects/畅通无阻; npx --no-install next build --no-lint 2>&1 | tail -5`
预期: 编译成功

---

### Task 4: 更新导航栏

**Files:**
- Modify: `c:\Users\yuton\Projects\畅通无阻\src\components\layout\TopNavbar.tsx`

- [ ] **Step 1: 替换 Logo 和配色**

修改 `TopNavbar.tsx`，替换 `MessageCircleHeart` 图标为 🐴 emoji，改品牌名，更新选中态颜色：

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/lessons", label: "学习" },
  { href: "/practice", label: "练习" },
  { href: "/favorites", label: "收藏" },
  { href: "/community", label: "社区" },
  { href: "/profile", label: "我的" },
];

export function TopNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl" role="img" aria-label="小趣">🐴</span>
          <span className="text-lg font-bold text-primary-700" style={{ fontFamily: '"Noto Serif SC", serif' }}>
            趣魅
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="md:hidden w-6" />
      </div>
    </header>
  );
}
```

- [ ] **Step 2: 验证**

运行: `cd c:/Users/yuton/Projects/畅通无阻; npx --no-install next build --no-lint 2>&1 | tail -5`
预期: 编译成功

---

### Task 5: 更新底部 Tab 栏

**Files:**
- Modify: `c:\Users\yuton\Projects\畅通无阻\src\components\layout\BottomTabBar.tsx`

- [ ] **Step 1: 替换选中态颜色**

只需将 `text-orange-500` 替换为 `text-primary-600`：

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, BookOpen, Edit3, BookmarkCheck, Users, User } from "lucide-react";

const tabs = [
  { href: "/", label: "首页", icon: Home },
  { href: "/lessons", label: "学习", icon: BookOpen },
  { href: "/practice", label: "练习", icon: Edit3 },
  { href: "/favorites", label: "收藏", icon: BookmarkCheck },
  { href: "/community", label: "社区", icon: Users },
  { href: "/profile", label: "我的", icon: User },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-white/90 backdrop-blur-md">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 min-w-0",
                isActive ? "text-primary-600" : "text-gray-400"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: 验证**

运行: `cd c:/Users/yuton/Projects/畅通无阻; npx --no-install next build --no-lint 2>&1 | tail -5`
预期: 编译成功

---

### Task 6: 更新卡片组件

**Files:**
- Modify: `c:\Users\yuton\Projects\畅通无阻\src\components\shared\LessonCard.tsx`
- Modify: `c:\Users\yuton\Projects\畅通无阻\src\components\ui\card.tsx`

- [ ] **Step 1: 更新 Card 基础组件**

修改 `card.tsx`，将阴影改为细线边框风格：

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-xl border-2 border-[hsl(var(--border-color))] bg-surface-card", className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5 pb-0", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardContent, CardFooter };
```

- [ ] **Step 2: 更新 LessonCard**

修改 `LessonCard.tsx`，替换颜色和 hover 效果：

```tsx
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/lib/utils";
import { BookOpen } from "lucide-react";

interface LessonCardProps {
  title: string;
  slug: string;
  description: string;
  category: string;
  coverImage?: string | null;
}

export function LessonCard({ title, slug, description, category, coverImage }: LessonCardProps) {
  const cat = categories[category] || { label: category, icon: "📖" };

  return (
    <Link href={`/lessons/${slug}`}>
      <Card className="h-full hover:border-primary-400 transition-all group cursor-pointer overflow-hidden">
        {coverImage ? (
          <div className="h-40 bg-gray-100 overflow-hidden">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="h-40 bg-gradient-to-br from-primary-50 to-surface-muted flex items-center justify-center">
            <BookOpen className="h-10 w-10 text-primary-300 group-hover:scale-110 transition-transform" />
          </div>
        )}
        <CardHeader className="p-4 pb-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs">
              {cat.icon} {cat.label}
            </Badge>
          </div>
          <h3
            className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1"
            style={{ fontFamily: '"Noto Serif SC", serif' }}
          >
            {title}
          </h3>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
```

- [ ] **Step 3: 验证**

运行: `cd c:/Users/yuton/Projects/畅通无阻; npx --no-install next build --no-lint 2>&1 | tail -5`
预期: 编译成功

---

### Task 7: 更新首页 Hero

**Files:**
- Modify: `c:\Users\yuton\Projects\畅通无阻\src\app\page.tsx`

- [ ] **Step 1: 替换 Hero Banner**

将 Hero 部分替换为抹茶渐变 + 小马吉祥物：

```tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LessonCard } from "@/components/shared/LessonCard";
import { PostCard } from "@/components/shared/PostCard";
import { Card, CardContent } from "@/components/ui/card";
import { categories } from "@/lib/utils";
import { TrendingUp, Users, ArrowRight } from "lucide-react";

// ... (其余 import 和 getData 不变)

export default async function HomePage() {
  // ... (数据获取不变)

  return (
    <div className="space-y-10">
      {/* Hero Banner — 手账漫画风 */}
      <section className="relative overflow-hidden rounded-2xl border-2 border-primary-200 p-8 md:p-12"
        style={{
          background: "linear-gradient(135deg, #F0F5E8, #FAFAF5, #F5F0E8)",
        }}
      >
        <div className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-8xl md:text-9xl opacity-30 select-none">
          🐴
        </div>
        <div className="relative z-10 max-w-xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight"
            style={{ fontFamily: '"Noto Serif SC", serif', color: "#6B7B4E" }}
          >
            每一次对话，<br />
            都是一次成长的机会
          </h1>
          <p className="text-primary-500 text-base md:text-lg mb-6 leading-relaxed">
            不教固定话术，不提供万能模板。我们教你沟通的思维框架，
            让你在任何场景中都能自信表达。
          </p>
          <div className="flex gap-3">
            <Link
              href="/lessons"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-800 transition-colors"
            >
              🐴 开始学习
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/practice"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-primary-300 px-5 py-2.5 text-sm font-semibold text-primary-700 hover:bg-primary-50 transition-colors"
            >
              去练习
            </Link>
          </div>
        </div>
      </section>

      {/* Daily Quote */}
      {dailyQuote && (
        <Card className="border-2 border-primary-100 bg-gradient-to-r from-primary-50 to-surface-muted">
          <CardContent className="p-6 text-center">
            <p className="text-xs font-semibold text-primary-400 uppercase tracking-wider mb-2">
              今日一句
            </p>
            <p className="text-lg text-primary-800 font-medium leading-relaxed"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
            >
              {dailyQuote.content}
            </p>
            {dailyQuote.author && (
              <p className="text-sm text-primary-400 mt-2">—— {dailyQuote.author}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* 其余区块 (热门课程/场景/最新情景) 不变 */}
    </div>
  );
}
```

注：完整的 `page.tsx` 需要保留下方热门课程、场景入口、最新情景等区块（它们不需要改动，只是引用已更新的 LessonCard 和 PostCard 组件）。

- [ ] **Step 2: 验证构建**

运行: `cd c:/Users/yuton/Projects/畅通无阻; npx --no-install next build --no-lint 2>&1 | tail -10`
预期: 编译成功

---

### Task 8: 更新 SectionNav 选中色

**Files:**
- Modify: `c:\Users\yuton\Projects\畅通无阻\src\components\features\lessons\SectionNav.tsx`

- [ ] **Step 1: 将 orange 替换为 primary**

修改 `SectionNav.tsx`：

```tsx
"use client";

import { cn, sectionTypeLabels } from "@/lib/utils";
import { BookOpen, Lightbulb, Wand2, Compass, Pencil } from "lucide-react";

const sectionIcons: Record<string, React.ReactNode> = {
  story: <BookOpen className="h-4 w-4" />,
  analysis: <Lightbulb className="h-4 w-4" />,
  tips: <Wand2 className="h-4 w-4" />,
  framework: <Compass className="h-4 w-4" />,
  exercise: <Pencil className="h-4 w-4" />,
};

interface SectionNavProps {
  sections: { id: string; type: string; title: string }[];
  activeSection: string;
  onSectionChange: (type: string) => void;
}

export function SectionNav({ sections, activeSection, onSectionChange }: SectionNavProps) {
  return (
    <div className="flex border-b overflow-x-auto">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionChange(section.type)}
          className={cn(
            "flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors shrink-0",
            activeSection === section.type
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-gray-400 hover:text-gray-600"
          )}
        >
          {sectionIcons[section.type]}
          <span className="hidden sm:inline">{sectionTypeLabels[section.type]}</span>
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: 验证构建**

运行: `cd c:/Users/yuton/Projects/畅通无阻; npx --no-install next build --no-lint 2>&1 | tail -5`
预期: 编译成功

---

### Task 9: 更新其余引用

**Files:**
- Modify: `c:\Users\yuton\Projects\畅通无阻\src\components\layout\LeftSidebar.tsx`
- Modify: `c:\Users\yuton\Projects\畅通无阻\src\components\layout\Footer.tsx`
- Modify: `c:\Users\yuton\Projects\畅通无阻\src\components\layout\QuoteScroller.tsx`
- Modify: `c:\Users\yuton\Projects\畅通无阻\src\components\ui\badge.tsx`

- [ ] **Step 1: 全局搜索替换 orange 色系引用**

运行以下命令查找所有残留的 orange/amber 引用：

```bash
cd c:/Users/yuton/Projects/畅通无阻
grep -rn "orange\|amber" src/ --include="*.tsx" --include="*.css"
```

然后逐个替换：
- `orange-500` → `primary-600`
- `orange-600` → `primary-700`
- `orange-50` → `primary-50`
- `orange-100` → `primary-100`
- `orange-200` → `primary-200`
- `orange-300` → `primary-300`
- `orange-400` → `primary-400`
- `amber-*` → `surface-muted` 或 `warm-*`
- `bg-orange-50/30` → `bg-surface`

- [ ] **Step 2: 更新 Badge 组件**

修改 `badge.tsx`，将 orange 替换为 primary：

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary-50 text-primary-700",
        outline: "border border-gray-200 text-gray-600",
        accent: "bg-accent-100 text-accent-600",
        green: "bg-primary-100 text-primary-700",
        blue: "bg-primary-50 text-primary-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// ... (其余不变)
```

- [ ] **Step 3: 更新 Footer 和 LeftSidebar**

Footer: 将 `text-orange-400` 替换为 `text-primary-400`，`text-orange-500` 替换为 `text-primary-500`
LeftSidebar: 将 orange/amber 相关 class 替换为 primary/surface
QuoteScroller: 将 `from-orange-50 to-amber-50` 替换为 `from-primary-50 to-surface-muted`

- [ ] **Step 4: 完整构建验证**

运行: `cd c:/Users/yuton/Projects/畅通无阻; npx --no-install next build --no-lint 2>&1 | tail -5`
预期: 编译成功，无 orange/amber 残留警告

---

### Task 10: 全站验收

- [ ] **Step 1: 启动 dev server**

```bash
cd c:/Users/yuton/Projects/畅通无阻
npm run dev
```

- [ ] **Step 2: 测试所有页面**

在浏览器打开 `http://localhost:3000`，逐个检查：

| 页面 | 检查项 |
|------|--------|
| `/` | Hero 渐变绿+🐴，卡片细线边框，按钮绿色 |
| `/lessons` | 课程卡片 2px 绿边框，宋体标题 |
| `/lessons/how-to-meet-strangers` | 五段式 nav 绿色选中态，正文宋体H2 |
| `/practice` | 练习卡片绿边框 |
| `/community` | 情景卡片绿边框 |
| `/favorites` | 收藏页 |
| `/login` | 登录页绿色按钮 |
| `/register` | 注册页绿色按钮 |

- [ ] **Step 3: 移动端检查**

在浏览器 DevTools 切换到手机模式 (<768px)：
- 底部 Tab 栏绿色选中态
- Hero 吉祥物缩小不遮挡文字
- 卡片全宽排列

- [ ] **Step 4: 确认无残留橙色**

```bash
cd c:/Users/yuton/Projects/畅通无阻
grep -rn "orange\|amber" src/ --include="*.tsx" --include="*.css" | grep -v "node_modules"
```
预期: 无输出（或仅有注释中的引用）

---

## 验证汇总

全部完成后：
1. `npm run build` 零错误
2. 12 个页面全部渲染正常
3. 移动端/桌面端导航配色正确
4. 所有卡片为细线描边样式
5. Logo 显示 🐴 + "趣魅"
6. 页面中无 orange/amber 色系残留
