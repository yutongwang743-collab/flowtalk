import Link from "next/link";
import { C, S } from "@/lib/colors";

export default function LoginPage() {
  return (
    <div style={{ display: "flex", minHeight: "70vh", flexDirection: "column" }} className="md:flex-row">
      {/* 左侧 */}
      <div style={{ flex: 1, background: C.brick, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", textAlign: "center" }}>
        <div style={{ ...S.circle(100, "dashed"), borderColor: C.terracotta, marginBottom: "20px" }}>
          <span style={{ fontSize: "40px" }}>🐴</span>
        </div>
        <h2 style={{ ...S.heading, fontSize: "24px", color: C.warm, marginBottom: "8px" }}>欢迎回来</h2>
        <p style={{ fontSize: "13px", color: "rgba(253,240,234,0.6)" }}>继续你的沟通学习之旅</p>
      </div>
      {/* 右侧 */}
      <div style={{ flex: 1, background: C.warm, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
        <div style={{ width: "100%", maxWidth: "320px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1 style={{ ...S.heading, fontSize: "24px", color: C.text, textAlign: "center", marginBottom: "8px" }}>登录</h1>
          <input type="email" placeholder="邮箱" style={{ width: "100%", padding: "12px", border: `2px solid ${C.terracotta}`, fontSize: "14px", background: C.white, outline: "none", color: C.text }} />
          <input type="password" placeholder="密码" style={{ width: "100%", padding: "12px", border: `2px solid ${C.terracotta}`, fontSize: "14px", background: C.white, outline: "none", color: C.text }} />
          <button style={{ ...S.btnPrimary, width: "100%", justifyContent: "center" }}>登录</button>
          <p style={{ textAlign: "center", fontSize: "12px", color: C.textMuted }}>
            还没有账号？<Link href="/register" style={{ color: C.brick, fontWeight: 700 }}>注册</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
