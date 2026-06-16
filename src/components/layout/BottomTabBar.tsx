"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Edit3, Users, User } from "lucide-react";

const tabs = [
  { href: "/", label: "首页", icon: Home },
  { href: "/lessons", label: "对话课", icon: BookOpen },
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
            <Link key={tab.href} href={tab.href} style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: "2px", padding: "4px 6px", textDecoration: "none",
              color: isActive ? "#8B3A2A" : "#bbb", transition: "color 0.15s",
            }}>
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span style={{ fontSize: "9px", fontWeight: isActive ? 600 : 400 }}>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
