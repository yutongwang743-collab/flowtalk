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
      <body style={{ background: "#fafaf9", minHeight: "100vh" }}>
        <TopNavbar />
        <main style={{ paddingBottom: "60px" }}>
          {children}
        </main>
        <BottomTabBar />
      </body>
    </html>
  );
}
