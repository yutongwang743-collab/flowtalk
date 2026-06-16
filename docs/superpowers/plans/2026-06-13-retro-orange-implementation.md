# 趣魅 · 复古橙视觉重设计 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将趣魅全站从抹茶绿手账风重设计为 70 年代复古橙风格——陶砖深红、手写体、平涂色块、手绘线稿装饰。

**Architecture:** 所有视觉样式用 JSX `style={{}}` 内联（避免 CSS 层叠冲突），globals.css 最小化（仅字体+prose排版），Tailwind 仅用于布局工具类（flex/grid/padding）。颜色常量文件统一管理四色调。

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS (layout only), ZCOOL KuaiLe (Google Fonts)

---

## 文件改动清单

| 文件 | 操作 | 职责 |
|------|------|------|
| `src/lib/colors.ts` | 新建 | 颜色常量 + 共享样式工厂 |
| `src/app/globals.css` | 重写 | 字体加载 + prose排版 + body reset |
| `tailwind.config.ts` | 重写 | 移除扩展颜色，保留基础配置 |
| `src/app/layout.tsx` | 修改 | body背景 + Google Fonts |
| `src/app/page.tsx` | 重写 | 首页（Hero+名言+课程+场景+社区+CTA） |
| `src/components/shared/LessonCard.tsx` | 重写 | 课程卡片（平涂色块三色交替） |
| `src/components/shared/PostCard.tsx` | 重写 | 帖子卡片 |
| `src/components/ui/card.tsx` | 重写 | 通用卡片（平涂） |
| `src/components/layout/TopNavbar.tsx` | 重写 | 导航栏复古风 |
| `src/components/layout/BottomTabBar.tsx` | 修改 | 底部栏颜色 |
| `src/components/layout/Footer.tsx` | 修改 | 页脚颜色 |
| `src/components/features/lessons/SectionNav.tsx` | 修改 | 五段式Tab |
| `src/app/lessons/page.tsx` | 修改 | 课程列表 |
| `src/app/lessons/[slug]/page.tsx` | 修改 | 课程详情 |
| `src/app/lessons/[slug]/LessonDetailClient.tsx` | 修改 | 课程内容区 |
| `src/app/practice/page.tsx` | 修改 | 练习列表 |
| `src/app/practice/[id]/page.tsx` | 修改 | 练习详情 |
| `src/app/community/page.tsx` | 修改 | 社区广场 |
| `src/app/community/[id]/page.tsx` | 修改 | 帖子详情 |
| `src/app/login/page.tsx` | 修改 | 登录页 |
| `src/app/register/page.tsx` | 修改 | 注册页 |
| `src/app/favorites/page.tsx` | 修改 | 收藏页 |
| `src/app/profile/page.tsx` | 修改 | 个人中心 |
| `src/components/layout/LeftSidebar.tsx` | 修改 | 左侧栏 |
| `src/components/layout/QuoteScroller.tsx` | 修改 | 名言滚动 |

---

### Task 1: 颜色常量和样式工厂

**Files:**
- Create: `src/lib/colors.ts`

- [ ] **Step 1: 创建颜色常量文件**

```typescript
// src/lib/colors.ts
// 趣魅 · 复古橙色彩系统

export const C = {
  brick: "#A64B3A",       // 主色 陶砖 — Hero、深色卡片、主按钮
  dark: "#8B3A2A",        // 深色 深砖 — 文字强调、hover
  terracotta: "#D4A090",  // 辅色 浅陶 — 中色卡片、标签
  warm: "#FDF0EA",        // 底色 暖白 — 页面背景、浅色卡片
  white: "#FFFAF7",       // 卡片白
  text: "#3D1810",        // 正文深棕
  textMuted: "#8B5A4A",   // 次要文字
} as const;

// 三色交替卡片背景
export const cardTones = [C.white, C.terracotta, C.brick] as const;

// 共享样式
export const S = {
  // 手写标题
  heading: {
    fontFamily: "'ZCOOL KuaiLe', 'Noto Sans SC', cursive",
    fontWeight: 400,
    letterSpacing: "0.03em",
  } as React.CSSProperties,

  // 正文
  body: {
    fontFamily: "'Noto Sans SC', system-ui, sans-serif",
    lineHeight: 1.7,
  } as React.CSSProperties,

  // 主按钮
  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "11px 22px",
    fontSize: "13px",
    fontWeight: 700,
    color: C.warm,
    background: C.brick,
    border: "none",
    borderRadius: "8px",
    textDecoration: "none",
    cursor: "pointer",
  } as React.CSSProperties,

  // 次按钮
  btnOutline: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "11px 22px",
    fontSize: "13px",
    fontWeight: 700,
    color: C.brick,
    background: "transparent",
    border: `2px solid ${C.brick}`,
    borderRadius: "8px",
    textDecoration: "none",
    cursor: "pointer",
  } as React.CSSProperties,

  // 手绘圆圈装饰
  circle: (size: number, borderStyle = "solid") => ({
    width: size,
    height: size,
    borderRadius: "50%",
    border: `2.5px ${borderStyle} ${C.terracotta}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
};
```

---

### Task 2: 全局样式和字体

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: 重写 globals.css（最小化版本）**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&family=Noto+Sans+SC:wght@400;600;700&family=Noto+Serif+SC:wght@400;700&display=swap');

/* 全局 reset */
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Noto Sans SC', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #3D1810;
  line-height: 1.7;
}

::selection {
  background: #D4A090;
  color: #FDF0EA;
}

::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #D4A090; border-radius: 999px; }

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

/* Markdown 正文 */
.prose-content {
  font-family: 'Noto Sans SC', system-ui, sans-serif;
  color: #3D1810;
  line-height: 1.85;
  font-size: 0.9375rem;
}
.prose-content h2 {
  font-family: 'ZCOOL KuaiLe', 'Noto Sans SC', cursive;
  font-size: 1.5rem;
  font-weight: 400;
  color: #8B3A2A;
  margin-top: 2.5rem;
  margin-bottom: 0.75rem;
  letter-spacing: 0.03em;
}
.prose-content h3 {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 1.0625rem;
  font-weight: 700;
  color: #A64B3A;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
}
.prose-content p {
  margin-bottom: 1.25rem;
  color: #5A2D24;
}
.prose-content ul {
  list-style: none;
  padding-left: 0;
  margin: 1.25rem 0;
}
.prose-content ul li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
  color: #5A2D24;
  line-height: 1.85;
}
.prose-content ul li::before {
  content: "";
  position: absolute;
  left: 0.25rem;
  top: 0.65em;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #A64B3A;
}
.prose-content strong { color: #3D1810; font-weight: 700; }
.prose-content blockquote {
  margin: 2rem 0;
  padding: 1rem 1.5rem;
  border-left: 3px solid #A64B3A;
  background: #FDF0EA;
  border-radius: 0 0.5rem 0.5rem 0;
  color: #8B3A2A;
}
.prose-content hr {
  margin: 2.5rem 0;
  height: 2px;
  border: 0;
  background: linear-gradient(90deg, transparent, #D4A090, transparent);
}
.prose-content code {
  font-size: 0.875em;
  padding: 0.15em 0.4em;
  border-radius: 3px;
  background: #FDF0EA;
  color: #A64B3A;
}

/* 动画 */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-up { animation: fade-up 0.5s ease-out both; }
.stagger-1 { animation-delay: 0.05s; }
.stagger-2 { animation-delay: 0.1s; }
.stagger-3 { animation-delay: 0.15s; }
.stagger-4 { animation-delay: 0.2s; }
.stagger-5 { animation-delay: 0.25s; }
.stagger-6 { animation-delay: 0.3s; }
```

---

### Task 3: Tailwind 配置精简 + Layout

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: 精简 tailwind.config.ts**

移除所有扩展颜色（style={{}} 内联），只保留基础功能：

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: 更新 layout.tsx**

```tsx
import type { Metadata } from "next";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { Footer } from "@/components/layout/Footer";
import { C } from "@/lib/colors";
import "./globals.css";

export const metadata: Metadata = {
  title: "趣魅 - 沟通能力学习社区",
  description: "学习沟通技巧，提升表达能力。教方法，不教话术。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body style={{ background: C.warm, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <TopNavbar />
        <div style={{ flex: 1, margin: "0 auto", width: "100%", maxWidth: "1152px", padding: "0 16px 24px" }}>
          <div style={{ display: "flex", gap: "32px" }}>
            <LeftSidebar />
            <main style={{ flex: 1, minWidth: 0, paddingBottom: "80px" }} className="md:pb-0">
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

---

### Task 4: 导航栏 + 底部栏 + 页脚

**Files:**
- Modify: `src/components/layout/TopNavbar.tsx`
- Modify: `src/components/layout/BottomTabBar.tsx`
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: TopNavbar 复古橙**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { C } from "@/lib/colors";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/lessons", label: "学习" },
  { href: "/practice", label: "练习" },
  { href: "/favorites", label: "收藏" },
  { href: "/community", label: "社区" },
];

export function TopNavbar() {
  const pathname = usePathname();

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(253,240,234,0.9)", backdropFilter: "blur(12px)",
      borderBottom: `1.5px solid ${C.terracotta}`,
    }}>
      <div style={{
        margin: "0 auto", maxWidth: "1152px", height: "52px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <span style={{
            width: "34px", height: "34px", borderRadius: "50%",
            border: `2.5px solid ${C.brick}`, display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: "18px",
          }}>🐴</span>
          <span style={{
            fontFamily: "'ZCOOL KuaiLe', cursive", fontSize: "20px",
            color: C.brick, letterSpacing: "0.04em",
          }}>趣魅</span>
        </Link>

        <nav className="hidden md:flex" style={{ gap: "2px" }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} style={{
                padding: "6px 14px", fontSize: "13px", fontWeight: 600,
                color: isActive ? C.warm : C.textMuted,
                background: isActive ? C.brick : "transparent",
                borderRadius: "6px", textDecoration: "none",
                fontFamily: "'ZCOOL KuaiLe', cursive",
                transition: "all 0.15s",
              }}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="md:hidden" style={{ width: "24px" }} />
      </div>
    </header>
  );
}
```

- [ ] **Step 2: BottomTabBar 更新颜色**

修改 `BottomTabBar.tsx`: 将 `text-primary-600` 替换为内联 `color: C.brick`，`text-gray-400` 替换为 `color: C.terracotta`。

- [ ] **Step 3: Footer 更新颜色**

修改 `Footer.tsx`: 使用 C 颜色常量，背景改为 `C.terracotta` + `color: C.warm`。

---

### Task 5: 首页重写

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: 复古橙首页**

完整的首页代码，Hero 陶砖满铺 + 同心圆装饰 + 🐴 水印，名言暖白底，课程三色交替卡片，场景大色块，社区卡片，底部 CTA。全部使用 `style={{}}` 内联，导入 `C` 和 `S`。

```tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LessonCard } from "@/components/shared/LessonCard";
import { PostCard } from "@/components/shared/PostCard";
import { categories } from "@/lib/utils";
import { C, S, cardTones } from "@/lib/colors";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [lessons, quotes, posts, lessonCount] = await Promise.all([
    prisma.lesson.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.quote.findMany({ take: 1 }),
    prisma.post.findMany({
      orderBy: { createdAt: "desc" }, take: 4,
      include: { _count: { select: { comments: true } } },
    }),
    prisma.lesson.count(),
  ]);

  const dailyQuote = quotes[0];
  const CATS = Object.entries(categories).slice(0, 8);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
      {/* ===== HERO ===== */}
      <section style={{
        position: "relative", overflow: "hidden",
        background: C.brick, padding: "clamp(32px, 6vw, 56px)",
        display: "flex", alignItems: "center", minHeight: "420px",
      }}>
        {/* 同心圆 */}
        <div style={{ position: "absolute", right: -40, top: -40, ...S.circle(200, "dashed"), borderColor: "rgba(253,240,234,0.12)", opacity: 0.6 }} />
        <div style={{ position: "absolute", right: 20, top: 20, ...S.circle(120), borderColor: "rgba(253,240,234,0.08)" }} />
        {/* 🐴 水印 */}
        <div style={{ position: "absolute", left: -20, bottom: -20, fontSize: "clamp(100px, 18vw, 200px)", opacity: 0.08, userSelect: "none", transform: "rotate(-5deg)" }}>🐴</div>
        {/* 主内容 */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "clamp(20px, 6vw, 60px)", flexWrap: "wrap", width: "100%" }}>
          <div style={{ flex: "1 1 300px" }}>
            <span style={{ display: "inline-block", padding: "3px 12px", fontSize: "10px", letterSpacing: "0.15em", color: C.warm, border: `1.5px solid ${C.terracotta}`, borderRadius: "20px", marginBottom: "16px" }}>
              — 2026 · 马年 —
            </span>
            <h1 style={{ ...S.heading, fontSize: "clamp(28px, 5vw, 48px)", color: C.warm, lineHeight: 1.2, margin: 0 }}>
              每一次<span style={{ color: C.terracotta }}>对话</span>，<br />都是一次<span style={{ color: C.terracotta }}>成长</span>
            </h1>
            <p style={{ fontSize: "clamp(14px, 2vw, 16px)", color: "rgba(253,240,234,0.65)", lineHeight: 1.7, maxWidth: "400px", margin: "16px 0 24px" }}>
              不教话术，不提供模板。用沟通框架打开表达的无限可能。
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link href="/lessons" style={S.btnPrimary}>🐴 探索课程 →</Link>
              <Link href="/practice" style={S.btnOutline}>开始练习</Link>
            </div>
            <div style={{ display: "flex", gap: "32px", marginTop: "28px" }}>
              {[{ n: lessonCount, l: "篇课程" }, { n: CATS.length, l: "个场景" }, { n: "∞", l: "种可能" }].map((s, i) => (
                <div key={i}>
                  <div style={{ ...S.heading, fontSize: "22px", color: C.warm }}>{s.n}</div>
                  <div style={{ fontSize: "11px", color: "rgba(253,240,234,0.5)", marginTop: "2px" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* 吉祥物 */}
          <div style={{ flex: "0 0 auto", textAlign: "center" }}>
            <div style={{ ...S.circle(140, "dashed"), borderColor: C.terracotta, margin: "0 auto" }}>
              <span style={{ fontSize: "56px" }}>🐴</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DAILY QUOTE ===== */}
      {dailyQuote && (
        <section style={{ textAlign: "center", maxWidth: "480px", margin: "0 auto", padding: "32px 16px" }}>
          <span style={{ fontSize: "56px", color: C.terracotta, lineHeight: 1, opacity: 0.4 }}>"</span>
          <p style={{ ...S.heading, fontSize: "18px", color: C.text, lineHeight: 1.8, marginTop: "-16px" }}>
            {dailyQuote.content}
          </p>
          {dailyQuote.author && (
            <p style={{ fontSize: "11px", color: C.textMuted, marginTop: "10px", letterSpacing: "0.1em" }}>
              —— {dailyQuote.author}
            </p>
          )}
        </section>
      )}

      {/* ===== 热门课程 ===== */}
      <section>
        <SectionTitle num="01" title="热门课程" sub="故事 → 分析 → 技巧 → 框架 → 练习" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {lessons.map((l, i) => (
            <div key={l.id} className={`animate-fade-up stagger-${i + 1}`}>
              <LessonCard {...l} tone={cardTones[i % 3]} />
            </div>
          ))}
        </div>
      </section>

      {/* ===== 场景入口 ===== */}
      <section>
        <SectionTitle num="02" title="按场景学习" sub="找到你最关心的沟通场景" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px" }}>
          {CATS.map(([key, cat], i) => (
            <Link key={key} href={`/lessons?category=${key}`} style={{ textDecoration: "none" }}>
              <div style={{
                background: cardTones[i % 3], padding: "22px 12px", textAlign: "center",
                fontFamily: "'ZCOOL KuaiLe', cursive",
                fontSize: "14px", fontWeight: 700,
                color: i % 3 === 2 ? C.warm : C.text,
                transition: "transform 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                <div style={{ fontSize: "30px", marginBottom: "6px" }}>{cat.icon}</div>
                {cat.label}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 疑难情景 ===== */}
      <section>
        <SectionTitle num="03" title="疑难情景库" sub="真实的沟通难题，社区的智慧" />
        {posts.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "14px" }}>
            {posts.map((p, i) => (
              <div key={p.id} className={`animate-fade-up stagger-${i + 1}`}>
                <PostCard id={p.id} title={p.title} content={p.content} createdAt={p.createdAt} commentCount={p._count.comments} tone={cardTones[i % 2]} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "48px", background: C.white }}>
            <div style={{ fontSize: "40px", marginBottom: "8px" }}>💬</div>
            <p style={{ color: C.textMuted, fontSize: "13px" }}>社区功能即将上线</p>
          </div>
        )}
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section style={{ textAlign: "center", padding: "48px 24px", background: C.terracotta }}>
        <div style={{ ...S.circle(80, "dashed"), borderColor: C.warm, margin: "0 auto 16px" }}>
          <span style={{ fontSize: "32px" }}>🐴</span>
        </div>
        <h2 style={{ ...S.heading, fontSize: "24px", color: C.warm, marginBottom: "8px" }}>
          准备好驰骋沟通的世界了吗？
        </h2>
        <p style={{ fontSize: "13px", color: "rgba(253,240,234,0.7)", maxWidth: "320px", margin: "0 auto 20px" }}>
          从小马「小趣」的第一堂课开始，每一次对话都是向前奔跑的一步。
        </p>
        <Link href="/lessons" style={{ ...S.btnPrimary, background: C.warm, color: C.brick }}>🐴 免费开始学习</Link>
      </section>
    </div>
  );
}

// 区块标题组件
function SectionTitle({ num, title, sub }: { num: string; title: string; sub: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: "14px", marginBottom: "24px" }}>
      <span style={{ fontSize: "11px", color: C.terracotta, letterSpacing: "0.15em", fontFamily: "'ZCOOL KuaiLe', cursive" }}>{num}</span>
      <div>
        <h2 style={{ ...S.heading, fontSize: "22px", color: C.text, margin: 0 }}>{title}</h2>
        <p style={{ fontSize: "12px", color: C.textMuted, margin: "2px 0 0" }}>{sub}</p>
      </div>
    </div>
  );
}
```

**注意**: 场景入口卡片使用了 `onMouseEnter`/`onMouseLeave`，需要将 `page.tsx` 改为 Client Component（添加 `"use client"`），或将场景卡片提取为独立 Client Component。推荐后者。

---

### Task 6: LessonCard + PostCard 平涂色块

**Files:**
- Modify: `src/components/shared/LessonCard.tsx`
- Modify: `src/components/shared/PostCard.tsx`

- [ ] **Step 1: LessonCard（平涂色块 + tone参数）**

```tsx
"use client";

import Link from "next/link";
import { categories } from "@/lib/utils";
import { C, S } from "@/lib/colors";

interface LessonCardProps {
  title: string; slug: string; description: string;
  category: string; coverImage?: string | null;
  tone?: string; // 背景色
}

export function LessonCard({ title, slug, description, category, coverImage, tone = C.white }: LessonCardProps) {
  const cat = categories[category] || { label: category, icon: "📖" };
  const isDark = tone === C.brick;

  return (
    <Link href={`/lessons/${slug}`} style={{ textDecoration: "none" }}>
      <article style={{
        background: tone, padding: "24px 20px", transition: "transform 0.15s",
        position: "relative", overflow: "hidden", cursor: "pointer",
      }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {/* 装饰圆圈 */}
        <div style={{ position: "absolute", right: -16, top: -16, ...S.circle(64, "dashed"), borderColor: isDark ? "rgba(253,240,234,0.15)" : C.terracotta, opacity: 0.5 }} />
        {/* 类别标签 */}
        <span style={{
          display: "inline-block", padding: "2px 10px", fontSize: "10px", fontWeight: 700,
          color: isDark ? C.warm : C.brick,
          background: isDark ? "rgba(253,240,234,0.15)" : C.warm,
          borderRadius: "12px", marginBottom: "14px", fontFamily: "'ZCOOL KuaiLe', cursive",
        }}>
          {cat.icon} {cat.label}
        </span>
        <h3 style={{
          ...S.heading, fontSize: "18px", lineHeight: 1.35,
          color: isDark ? C.warm : C.text, marginBottom: "6px",
        }}>
          {title}
        </h3>
        <p style={{ fontSize: "13px", color: isDark ? "rgba(253,240,234,0.6)" : C.textMuted, lineHeight: 1.6 }}>
          {description}
        </p>
      </article>
    </Link>
  );
}
```

- [ ] **Step 2: PostCard（平涂色块 + tone参数）**

同样的平涂色块模式，装饰圆圈在左上角。

---

### Task 7: 课程详情 + 练习 + 社区页面

**Files:**
- Modify: `src/app/lessons/page.tsx`
- Modify: `src/app/lessons/[slug]/page.tsx`
- Modify: `src/app/lessons/[slug]/LessonDetailClient.tsx`
- Modify: `src/components/features/lessons/SectionNav.tsx`
- Modify: `src/app/practice/page.tsx`
- Modify: `src/app/practice/[id]/page.tsx`
- Modify: `src/app/community/page.tsx`
- Modify: `src/app/community/[id]/page.tsx`

- [ ] **统一改造模式**：

所有页面导入 `C` 和 `S`，将 Tailwind color class 全部替换为内联 style：
- 页面背景: `background: C.warm`
- 标题: `S.heading` + `color: C.text`
- 副标题: `color: C.textMuted`
- 卡片: 平涂色块（`background: C.white` 或 `C.terracotta`）
- 按钮: `S.btnPrimary` / `S.btnOutline`
- 选中态: `background: C.brick` + `color: C.warm`

SectionNav: 选中 tab 背景 `C.brick`、文字 `C.warm`，未选中文字 `C.textMuted`。

---

### Task 8: 登录/注册/收藏/个人中心

**Files:**
- Modify: `src/app/login/page.tsx`
- Modify: `src/app/register/page.tsx`
- Modify: `src/app/favorites/page.tsx`
- Modify: `src/app/profile/page.tsx`

- [ ] **统一改造**：

登录/注册：左半屏陶砖红 `C.brick` + 🐴 吉祥物 + 标语，右半屏暖白 `C.warm` + 表单。
收藏/个人：标题手写体，卡片平涂色块，空状态手绘圆圈 🐴。

---

### Task 9: 左侧栏和名言滚动

**Files:**
- Modify: `src/components/layout/LeftSidebar.tsx`
- Modify: `src/components/layout/QuoteScroller.tsx`

- [ ] **更新颜色和装饰**

QuoteScroller: 背景 `C.white`，文字 `C.textMuted`，滚动容器带顶部陶砖色虚线边框。
LeftSidebar: 标题手写体，底色暖白。

---

### Task 10: 构建验证 + 全站检查

- [ ] **Step 1: 构建**

```bash
cd "c:/Users/yuton/Projects/趣魅"
npx --no-install next build --no-lint
```
预期: 编译成功，所有页面 prerendered。

- [ ] **Step 2: 页面检查**

启动 `npm run dev`，逐个打开 11 个页面：
`/`, `/lessons`, `/lessons/how-to-meet-strangers`, `/practice`, `/practice/[id]`, `/community`, `/community/[id]`, `/favorites`, `/profile`, `/login`, `/register`

- [ ] **Step 3: 视觉验证**

确认每个页面：
- 陶砖红 `#A64B3A` 可见
- 手写体标题生效（ZCOOL KuaiLe）
- 平涂色块无边无影
- 🐴 圆圈装饰可见
- 无绿色/橙色残留

---

## 验证汇总

全部完成后：
1. `npm run build` 零错误
2. 11 个页面全部 200
3. 全站陶砖红系统统一
4. 手写体标题正常加载
5. 零 Tailwind 颜色类残留（全改为内联 style）
