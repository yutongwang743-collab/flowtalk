"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "首页", icon: "🏠" },
  { href: "/lessons", label: "对话课", icon: "💬" },
  { href: "/practice", label: "练习", icon: "✏️" },
  { href: "/community", label: "社区", icon: "👥" },
];

export function TopNavbar() {
  const pathname = usePathname();

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "#8B3A2A",
    }}>
      <div style={{
        margin: "0 auto", maxWidth: "1200px", height: "48px",
        display: "flex", alignItems: "center", gap: "20px",
        padding: "0 20px", overflowX: "auto",
      }}>
        <Link href="/" style={{
          display: "flex", alignItems: "center", gap: "8px",
          textDecoration: "none", flexShrink: 0,
        }}>
          <span style={{
            width: "30px", height: "30px", borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px",
          }}>🐴</span>
          <span style={{
            fontFamily: "'ZCOOL KuaiLe', cursive", fontSize: "18px",
            color: "#fff", letterSpacing: "0.04em",
          }}>趣魅</span>
        </Link>

        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} style={{
              fontSize: "13px", fontWeight: 600, textDecoration: "none",
              color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
              whiteSpace: "nowrap", flexShrink: 0, transition: "color 0.15s",
            }}>
              {link.icon} {link.label}
            </Link>
          );
        })}

        <Link href="/admin" style={{
          fontSize: "13px", fontWeight: 600, textDecoration: "none",
          color: pathname === "/admin" ? "#fff" : "rgba(255,255,255,0.3)",
          whiteSpace: "nowrap", flexShrink: 0, marginLeft: "auto",
        }}>
          ✍️
        </Link>
      </div>
    </header>
  );
}
