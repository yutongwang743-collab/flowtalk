# 趣魅微信读书风页面重构 · 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将趣魅页面从手账风多层级装饰布局重构为微信读书风格的内容驱动单列布局

**Architecture:** 单列 640px 居中，灰白底(#f5f5f5) + 白色卡片，去除 LeftSidebar/Footer/Hero，保留暖色系作为点缀

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, 内联 style 样式

---

## File Map

| 文件 | 操作 | 职责 |
|------|------|------|
| `src/app/globals.css` | 修改 | 页面底色，移除无用样式 |
| `src/app/layout.tsx` | 修改 | 去除 LeftSidebar/Footer，调整结构 |
| `src/components/layout/TopNavbar.tsx` | 重写 | 微信读书风标题栏 |
| `src/components/layout/BottomTabBar.tsx` | 重写 | 5 Tab 底部导航 |
| `src/components/layout/Footer.tsx` | 删除 | 不再使用 |
| `src/components/layout/LeftSidebar.tsx` | 删除 | 每日一句移入首页 |
| `src/components/layout/QuoteScroller.tsx` | 删除 | 改为首页静态展示 |
| `src/components/features/home/SceneGrid.tsx` | 重写 | 微信读书风场景网格 |
| `src/app/page.tsx` | 重写 | 首页 3 模块 |
| `src/app/lessons/page.tsx` | 重写 | 两列编号网格 |
| `src/app/lessons/[slug]/page.tsx` | 修改 | 简化排版 |
| `src/app/lessons/[slug]/LessonDetailClient.tsx` | 不改 | 保持现有 |
| `src/app/practice/page.tsx` | 修改 | 行列表样式 |
| `src/app/community/page.tsx` | 修改 | Feed 更新 |
| `src/components/shared/LessonCard.tsx` | 删除 | 不再使用 |
| `src/components/shared/PostCard.tsx` | 删除 | 不再使用 |

---

### Task 1: 更新 globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: 修改 body 背景色**

将 `src/app/globals.css` 中 body 的背景相关样式改为：

```css
body {
  font-family: 'Noto Sans SC', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #3D1810;
  line-height: 1.7;
  background: #f5f5f5;
}
```

即 body 规则中增加 `background: #f5f5f5;`。

- [ ] **Step 2: 提交**

```bash
cd c:/Users/yuton/Projects/趣魅 && git add src/app/globals.css && git commit -m "style: change page background to #f5f5f5"
```

---

### Task 2: 重写 TopNavbar 为微信读书风标题栏

**Files:**
- Modify: `src/components/layout/TopNavbar.tsx`

- [ ] **Step 1: 写入新 TopNavbar**

用以下完整代码替换 `src/components/layout/TopNavbar.tsx`：

```tsx
"use client";

import Link from "next/link";
import { C } from "@/lib/colors";

export function TopNavbar() {
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "#fff",
      borderBottom: "1px solid #eee",
    }}>
      <div style={{
        margin: "0 auto", maxWidth: "640px", height: "44px",
        display: "flex", alignItems: "center", gap: "10px",
        padding: "0 14px",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "6px", textDecoration: "none", flexShrink: 0 }}>
          <span style={{
            width: "26px", height: "26px", borderRadius: "50%",
            border: `2px solid ${C.dark}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px",
          }}>🐴</span>
          <span style={{
            fontFamily: "'ZCOOL KuaiLe', cursive", fontSize: "16px",
            color: C.dark, letterSpacing: "0.04em",
          }}>趣魅</span>
        </Link>

        <div style={{
          flex: 1, height: "28px", background: "#f5f5f5",
          borderRadius: "14px", display: "flex", alignItems: "center",
          padding: "0 12px",
        }}>
          <span style={{ fontSize: "10px", color: "#bbb" }}>🔍 搜索课程、场景...</span>
        </div>

        <span style={{ fontSize: "16px", flexShrink: 0 }}>🔔</span>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: 提交**

```bash
cd c:/Users/yuton/Projects/趣魅 && git add src/components/layout/TopNavbar.tsx && git commit -m "refactor: rewrite TopNavbar as WeRead-style header"
```

---

### Task 3: 重写 BottomTabBar 为 5 Tab

**Files:**
- Modify: `src/components/layout/BottomTabBar.tsx`

- [ ] **Step 1: 写入新 BottomTabBar**

用以下完整代码替换 `src/components/layout/BottomTabBar.tsx`：

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Edit3, Users, User } from "lucide-react";

const tabs = [
  { href: "/", label: "首页", icon: Home },
  { href: "/lessons", label: "学习", icon: BookOpen },
  { href: "/practice", label: "练习", icon: Edit3 },
  { href: "/community", label: "社区", icon: Users },
  { href: "/profile", label: "我的", icon: User },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden" style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
      background: "#fff", borderTop: "1px solid #eee",
    }}>
      <div style={{ display: "flex", justifyContent: "space-around", height: "50px", alignItems: "center" }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: "2px", padding: "4px 6px", textDecoration: "none",
                color: isActive ? "#8B3A2A" : "#bbb",
                transition: "color 0.15s",
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span style={{ fontSize: "9px", fontWeight: isActive ? 600 : 400 }}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: 提交**

```bash
cd c:/Users/yuton/Projects/趣魅 && git add src/components/layout/BottomTabBar.tsx && git commit -m "refactor: expand BottomTabBar to 5 tabs with WeRead styling"
```

---

### Task 4: 更新 layout.tsx——去除 LeftSidebar 和 Footer

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: 修改 layout.tsx**

用以下内容替换 `src/app/layout.tsx`：

```tsx
import type { Metadata } from "next";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "趣魅 - 沟通能力学习社区",
  description: "学习沟通技巧，提升表达能力。教方法，不教话术。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body style={{ background: "#f5f5f5", minHeight: "100vh" }}>
        <TopNavbar />
        <main style={{
          maxWidth: "640px", margin: "0 auto",
          padding: "8px 0 80px",
        }}>
          {children}
        </main>
        <BottomTabBar />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: 提交**

```bash
cd c:/Users/yuton/Projects/趣魅 && git add src/app/layout.tsx && git commit -m "refactor: remove LeftSidebar and Footer from layout, single-column centered"
```

---

### Task 5: 删除不再使用的组件

**Files:**
- Delete: `src/components/layout/Footer.tsx`
- Delete: `src/components/layout/LeftSidebar.tsx`
- Delete: `src/components/layout/QuoteScroller.tsx`
- Delete: `src/components/shared/LessonCard.tsx`
- Delete: `src/components/shared/PostCard.tsx`

- [ ] **Step 1: 删除文件**

```bash
cd c:/Users/yuton/Projects/趣魅 && git rm src/components/layout/Footer.tsx src/components/layout/LeftSidebar.tsx src/components/layout/QuoteScroller.tsx src/components/shared/LessonCard.tsx src/components/shared/PostCard.tsx && git commit -m "refactor: remove unused layout and shared components"
```

---

### Task 6: 重写 SceneGrid 组件

**Files:**
- Modify: `src/components/features/home/SceneGrid.tsx`

- [ ] **Step 1: 写入新 SceneGrid**

用以下完整代码替换 `src/components/features/home/SceneGrid.tsx`：

```tsx
"use client";

import Link from "next/link";

interface SceneGridProps {
  entries: [string, { label: string; icon: string }][];
}

export function SceneGrid({ entries }: SceneGridProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
      {entries.slice(0, 6).map(([key, cat]) => (
        <Link key={key} href={`/lessons?category=${key}`} style={{ textDecoration: "none" }}>
          <div style={{
            textAlign: "center", padding: "14px 6px",
            background: "#fafafa", borderRadius: "6px",
            transition: "background 0.15s", cursor: "pointer",
          }}>
            <div style={{ fontSize: "24px", marginBottom: "4px" }}>{cat.icon}</div>
            <div style={{ fontSize: "10px", color: "#555", fontWeight: 600 }}>{cat.label}</div>
            <div style={{ fontSize: "8px", color: "#D4A090", marginTop: "2px" }}>{/* course count via prop or data */}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: 提交**

```bash
cd c:/Users/yuton/Projects/趣魅 && git add src/components/features/home/SceneGrid.tsx && git commit -m "refactor: restyle SceneGrid to WeRead-style 3-column grid"
```

---

### Task 7: 重写首页 page.tsx

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: 写入新首页**

用以下完整代码替换 `src/app/page.tsx`：

```tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { categories } from "@/lib/utils";
import { C } from "@/lib/colors";
import { SceneGrid } from "@/components/features/home/SceneGrid";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [quote, posts] = await Promise.all([
    prisma.quote.findFirst({ orderBy: { createdAt: "desc" } }),
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { _count: { select: { comments: true } } },
    }),
  ]);

  const CATS = Object.entries(categories).slice(0, 6);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "0 0 8px" }}>

      {/* ===== 按场景学习 ===== */}
      <section style={{ background: "#fff", padding: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
          <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>按场景学习</h2>
          <Link href="/lessons" style={{ fontSize: "10px", color: "#D4A090", textDecoration: "none" }}>全部 →</Link>
        </div>
        <SceneGrid entries={CATS} />
      </section>

      {/* ===== 每日一句 ===== */}
      {quote && (
        <section style={{ background: C.warm, padding: "18px 16px", textAlign: "center" }}>
          <p style={{ fontSize: "13px", color: C.dark, lineHeight: 1.9, margin: 0 }}>
            "{quote.content}"
          </p>
          {quote.author && (
            <p style={{ fontSize: "9px", color: "#D4A090", marginTop: "8px" }}>—— {quote.author} · 每日一句</p>
          )}
        </section>
      )}

      {/* ===== 情景讨论 ===== */}
      <section style={{ background: "#fff", padding: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
          <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>情景讨论</h2>
          <Link href="/community" style={{ fontSize: "10px", color: "#D4A090", textDecoration: "none" }}>更多 →</Link>
        </div>

        {posts.length > 0 ? (
          <div>
            {posts.map((p, i) => (
              <Link key={p.id} href={`/community/${p.id}`} style={{ textDecoration: "none" }}>
                <div style={{
                  padding: "12px 0",
                  borderBottom: i < posts.length - 1 ? "1px solid #f5f5f5" : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                    <div style={{
                      width: "20px", height: "20px", borderRadius: "50%",
                      background: C.warm, display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: "10px", flexShrink: 0,
                    }}>🐴</div>
                    <span style={{ fontSize: "10px", color: "#888" }}>匿名用户</span>
                    <span style={{ fontSize: "8px", color: "#ccc", marginLeft: "auto" }}>
                      {timeAgo(p.createdAt)}
                    </span>
                  </div>
                  <p style={{ fontSize: "11px", color: "#444", lineHeight: 1.7, margin: "0 0 6px" }}>
                    {p.title}
                  </p>
                  <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "7px", padding: "1px 6px", background: "#f5f5f5", color: "#aaa", borderRadius: "3px" }}>
                      {p.content.length > 20 ? p.content.slice(0, 20) + "..." : p.content}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "16px" }}>
                    <span style={{ fontSize: "8px", color: "#ccc" }}>💬 {p._count.comments}个回答</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "32px", color: "#ccc", fontSize: "11px" }}>
            暂无讨论，来发起第一个情景吧
          </div>
        )}
      </section>

    </div>
  );
}

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return "刚刚";
  if (m < 60) return `${m}分钟前`;
  if (h < 24) return `${h}小时前`;
  if (d < 30) return `${d}天前`;
  return new Date(date).toLocaleDateString("zh-CN");
}
```

- [ ] **Step 2: 提交**

```bash
cd c:/Users/yuton/Projects/趣魅 && git add src/app/page.tsx && git commit -m "refactor: rewrite homepage with 3-module WeRead-style layout"
```

---

### Task 8: 重写学习中心 lessons/page.tsx

**Files:**
- Modify: `src/app/lessons/page.tsx`

- [ ] **Step 1: 写入两列编号网格**

用以下完整代码替换 `src/app/lessons/page.tsx`：

```tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { categories } from "@/lib/utils";
import { C } from "@/lib/colors";

export const dynamic = "force-dynamic";

export default async function LessonsPage({ searchParams }: { searchParams: { category?: string } }) {
  const { category } = searchParams;
  const lessons = await prisma.lesson.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: "desc" },
  });

  const CATS = Object.entries(categories);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

      {/* Header */}
      <div style={{ background: "#fff", padding: "10px 14px", display: "flex", alignItems: "center", borderBottom: "1px solid #eee" }}>
        <Link href="/" style={{ fontSize: "10px", color: "#D4A090", textDecoration: "none", flexShrink: 0 }}>← 返回</Link>
        <h1 style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a1a", margin: "0 auto" }}>学习中心</h1>
        <div style={{ width: "30px", flexShrink: 0 }} />
      </div>

      {/* Category filter */}
      <div style={{ background: "#fff", padding: "10px 14px", display: "flex", gap: "8px", overflowX: "auto", borderBottom: "1px solid #f5f5f5" }}>
        <Link href="/lessons" style={{
          padding: "4px 12px", fontSize: "9px", fontWeight: 700, borderRadius: "20px", textDecoration: "none",
          color: !category ? "#fff" : "#666",
          background: !category ? C.dark : "transparent",
          whiteSpace: "nowrap", flexShrink: 0,
        }}>全部</Link>
        {CATS.map(([key, cat]) => (
          <Link key={key} href={`/lessons?category=${key}`} style={{
            padding: "4px 12px", fontSize: "9px", fontWeight: 600, borderRadius: "20px", textDecoration: "none",
            color: category === key ? "#fff" : "#666",
            background: category === key ? C.dark : "transparent",
            whiteSpace: "nowrap", flexShrink: 0,
          }}>{cat.icon} {cat.label}</Link>
        ))}
      </div>

      {/* Course grid */}
      <div style={{ padding: "10px 14px" }}>
        <div style={{ fontSize: "9px", color: "#bbb", marginBottom: "8px" }}>
          共 <b style={{ color: "#D4A090" }}>{lessons.length}</b> 篇课程
        </div>

        {lessons.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 10px" }}>
            {lessons.map((l, i) => {
              const cat = categories[l.category] || { label: l.category, icon: "📖" };
              return (
                <Link key={l.id} href={`/lessons/${l.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", gap: "8px", alignItems: "center",
                    padding: "8px 10px", background: "#fff", borderRadius: "6px",
                  }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#D4A090", width: "14px", flexShrink: 0 }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: "16px", flexShrink: 0 }}>{cat.icon}</span>
                    <span style={{ fontSize: "10px", color: "#333", fontWeight: 600, lineHeight: 1.3 }}>
                      {l.title}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "48px", background: "#fff", borderRadius: "6px" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>📭</div>
            <p style={{ fontSize: "11px", color: "#999" }}>该场景暂无课程</p>
          </div>
        )}
      </div>

    </div>
  );
}
```

- [ ] **Step 2: 提交**

```bash
cd c:/Users/yuton/Projects/趣魅 && git add src/app/lessons/page.tsx && git commit -m "refactor: rewrite lessons page as two-column numbered grid"
```

---

### Task 9: 更新课程详情页

**Files:**
- Modify: `src/app/lessons/[slug]/page.tsx`

- [ ] **Step 1: 简化课程详情页**

用以下完整代码替换 `src/app/lessons/[slug]/page.tsx`：

```tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { categories } from "@/lib/utils";
import { LessonDetailClient } from "./LessonDetailClient";
import { C } from "@/lib/colors";

export const dynamic = "force-dynamic";

export default async function LessonDetailPage({ params }: { params: { slug: string } }) {
  const lesson = await prisma.lesson.findUnique({
    where: { slug: params.slug },
    include: { sections: { orderBy: { order: "asc" } } },
  });
  if (!lesson) notFound();

  const cat = categories[lesson.category] || { label: lesson.category, icon: "📖" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

      {/* Header */}
      <div style={{ background: "#fff", padding: "10px 14px", display: "flex", alignItems: "center", borderBottom: "1px solid #eee" }}>
        <Link href="/lessons" style={{ fontSize: "10px", color: "#D4A090", textDecoration: "none", flexShrink: 0 }}>← 学习中心</Link>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: "16px" }}>⭐</span>
      </div>

      {/* Info card */}
      <div style={{ background: "#fff", padding: "14px" }}>
        <span style={{ display: "inline-block", fontSize: "8px", padding: "2px 8px", background: C.warm, color: C.dark, borderRadius: "10px", marginBottom: "8px" }}>
          {cat.icon} {cat.label}
        </span>
        <h1 style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px" }}>{lesson.title}</h1>
        <p style={{ fontSize: "10px", color: "#999", lineHeight: 1.6, margin: "0 0 8px" }}>{lesson.description}</p>
        <div style={{ display: "flex", gap: "12px", fontSize: "8px", color: "#bbb" }}>
          <span>{lesson.sections.length}个章节</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ background: "#fff" }}>
        <LessonDetailClient lesson={lesson} />
      </div>

      {/* CTA */}
      <div style={{ background: C.dark, padding: "14px", textAlign: "center" }}>
        <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.7)", marginBottom: "4px" }}>学完理论了？</div>
        <div style={{ fontSize: "11px", color: "#fff", fontWeight: 600, marginBottom: "8px" }}>去练习场景实战</div>
        <Link href="/practice" style={{
          display: "inline-block", fontSize: "9px", padding: "6px 16px",
          background: "#fff", color: C.dark, borderRadius: "16px",
          textDecoration: "none", fontWeight: 600,
        }}>进入练习 →</Link>
      </div>

    </div>
  );
}
```

- [ ] **Step 2: 提交**

```bash
cd c:/Users/yuton/Projects/趣魅 && git add src/app/lessons/[slug]/page.tsx && git commit -m "refactor: simplify lesson detail page layout"
```

---

### Task 10: 更新练习中心

**Files:**
- Modify: `src/app/practice/page.tsx`

- [ ] **Step 1: 简化练习列表**

用以下完整代码替换 `src/app/practice/page.tsx`：

```tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { C } from "@/lib/colors";

export const dynamic = "force-dynamic";

const diffLabels: Record<string, string> = { beginner: "入门", medium: "进阶", hard: "挑战" };

export default async function PracticePage() {
  const scenarios = await prisma.practiceScenario.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

      {/* Header */}
      <div style={{ background: "#fff", padding: "10px 14px", display: "flex", alignItems: "center", borderBottom: "1px solid #eee" }}>
        <Link href="/" style={{ fontSize: "10px", color: "#D4A090", textDecoration: "none", flexShrink: 0 }}>← 返回</Link>
        <h1 style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a1a", margin: "0 auto" }}>练习中心</h1>
        <div style={{ width: "30px", flexShrink: 0 }} />
      </div>

      <div style={{ padding: "0 14px" }}>
        <p style={{ fontSize: "10px", color: "#999", margin: "0 0 8px" }}>
          选一个场景，自己动手练习。没人打分，你的思考最重要。
        </p>

        {scenarios.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {scenarios.map((sc) => (
              <Link key={sc.id} href={`/practice/${sc.id}`} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "#fff", padding: "12px", borderRadius: "6px",
                  display: "flex", alignItems: "center", gap: "10px",
                }}>
                  <span style={{ fontSize: "20px", flexShrink: 0 }}>✏️</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "10px", fontWeight: 600, color: "#333" }}>{sc.title}</div>
                    <div style={{ fontSize: "8px", color: "#999", marginTop: "2px" }}>
                      {sc.description.length > 40 ? sc.description.slice(0, 40) + "..." : sc.description}
                    </div>
                  </div>
                  <span style={{
                    fontSize: "8px", padding: "2px 6px",
                    background: C.warm, color: C.dark, borderRadius: "8px",
                    fontFamily: "'ZCOOL KuaiLe', cursive", flexShrink: 0,
                  }}>
                    {diffLabels[sc.difficulty] || "入门"}
                  </span>
                  <span style={{ fontSize: "14px", color: "#D4A090", flexShrink: 0 }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "48px", background: "#fff", borderRadius: "6px" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>✏️</div>
            <p style={{ fontSize: "11px", color: "#999" }}>练习场景即将上线</p>
          </div>
        )}
      </div>

    </div>
  );
}
```

- [ ] **Step 2: 提交**

```bash
cd c:/Users/yuton/Projects/趣魅 && git add src/app/practice/page.tsx && git commit -m "refactor: simplify practice page with row-style layout"
```

---

### Task 11: 更新社区页面

**Files:**
- Modify: `src/app/community/page.tsx`

- [ ] **Step 1: 重写社区页面为 Feed**

用以下完整代码替换 `src/app/community/page.tsx`：

```tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { C } from "@/lib/colors";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { comments: true } } },
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

      {/* Header */}
      <div style={{ background: "#fff", padding: "10px 14px", display: "flex", alignItems: "center", borderBottom: "1px solid #eee" }}>
        <Link href="/" style={{ fontSize: "10px", color: "#D4A090", textDecoration: "none", flexShrink: 0 }}>← 返回</Link>
        <h1 style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a1a", margin: "0 auto" }}>情景讨论</h1>
        <div style={{ width: "30px", flexShrink: 0 }} />
      </div>

      {/* Quick post CTA */}
      <div style={{ padding: "0 14px" }}>
        <div style={{
          background: "#fff", padding: "10px 14px", borderRadius: "6px",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <div style={{
            width: "24px", height: "24px", borderRadius: "50%",
            background: C.warm, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "10px", flexShrink: 0,
          }}>🐴</div>
          <span style={{ fontSize: "10px", color: "#bbb" }}>写下你遇到的沟通难题...</span>
        </div>
      </div>

      {/* Posts */}
      <div style={{ padding: "0 14px" }}>
        {posts.length > 0 ? (
          <div>
            <p style={{ fontSize: "9px", color: "#ccc", margin: "0 0 8px" }}>
              共 <b style={{ color: "#D4A090" }}>{posts.length}</b> 个情景
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {posts.map((p, i) => (
                <Link key={p.id} href={`/community/${p.id}`} style={{ textDecoration: "none" }}>
                  <div style={{ background: "#fff", padding: "12px", borderRadius: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                      <div style={{
                        width: "18px", height: "18px", borderRadius: "50%",
                        background: C.warm, display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: "9px",
                      }}>🐴</div>
                      <span style={{ fontSize: "9px", color: "#888" }}>匿名用户</span>
                      <span style={{ fontSize: "7px", color: "#ccc", marginLeft: "auto" }}>
                        {timeAgo(p.createdAt)}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "11px", fontWeight: 600, color: "#333", margin: "0 0 4px" }}>{p.title}</h3>
                    <p style={{ fontSize: "10px", color: "#666", lineHeight: 1.6, margin: "0 0 6px" }}>
                      {p.content.length > 60 ? p.content.slice(0, 60) + "..." : p.content}
                    </p>
                    <div style={{ display: "flex", gap: "14px" }}>
                      <span style={{ fontSize: "8px", color: "#ccc" }}>💬 {p._count.comments}个回答</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "48px", background: "#fff", borderRadius: "6px" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>💬</div>
            <p style={{ fontSize: "11px", color: "#999", marginBottom: "12px" }}>社区功能即将上线</p>
            <Link href="/lessons" style={{
              display: "inline-block", fontSize: "10px", padding: "6px 16px",
              background: C.dark, color: "#fff", borderRadius: "16px",
              textDecoration: "none", fontWeight: 600,
            }}>先去看看课程 →</Link>
          </div>
        )}
      </div>

    </div>
  );
}

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return "刚刚";
  if (m < 60) return `${m}分钟前`;
  if (h < 24) return `${h}小时前`;
  if (d < 30) return `${d}天前`;
  return new Date(date).toLocaleDateString("zh-CN");
}
```

- [ ] **Step 2: 提交**

```bash
cd c:/Users/yuton/Projects/趣魅 && git add src/app/community/page.tsx && git commit -m "refactor: rewrite community page as WeRead-style feed"
```

---

### Task 12: 验证——启动并检查

**Files:**
- None (verification only)

- [ ] **Step 1: 启动开发服务器**

```bash
cd c:/Users/yuton/Projects/趣魅 && npm run dev
```

- [ ] **Step 2: 等待服务器就绪后，检查页面无报错**

在浏览器打开以下页面逐一检查：
1. `http://localhost:3000/` — 首页：场景网格 + 每日一句 + 情景讨论
2. `http://localhost:3000/lessons` — 学习中心：两列编号网格
3. `http://localhost:3000/lessons/<任意slug>` — 课程详情
4. `http://localhost:3000/practice` — 练习中心
5. `http://localhost:3000/community` — 社区页面
6. `http://localhost:3000/profile` — 个人中心（空状态）
7. `http://localhost:3000/favorites` — 收藏（空状态）

- [ ] **Step 3: 检查关键布局特征**
  - 页面底色为 #f5f5f5 ✓
  - 卡片为白色，有 8px 间距 ✓
  - 顶部为标题栏（品牌 + 搜索框 + 通知） ✓
  - 无 LeftSidebar、无 Footer、无 Hero ✓
  - 移动端底部有 5 Tab ✓

- [ ] **Step 4: 如有报错，修复后重新验证**
