import Link from "next/link";
import { C, S } from "@/lib/colors";

export default function RegisterPage() {
  return (
    <div style={{ display: "flex", minHeight: "70vh", flexDirection: "column" }} className="md:flex-row">
      <div style={{ flex: 1, background: C.brick, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", textAlign: "center" }}>
        <div style={{ ...S.circle(100, "dashed"), borderColor: C.terracotta, marginBottom: "20px" }}>
          <span style={{ fontSize: "40px" }}>🐴</span>
        </div>
        <h2 style={{ ...S.heading, fontSize: "24px", color: C.warm, marginBottom: "8px" }}>加入趣魅</h2>
        <p style={{ fontSize: "13px", color: "rgba(253,240,234,0.6)" }}>开始你的沟通学习之旅</p>
      </div>
      <div style={{ flex: 1, background: C.warm, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
        <div style={{ width: "100%", maxWidth: "320px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1 style={{ ...S.heading, fontSize: "24px", color: C.text, textAlign: "center", marginBottom: "8px" }}>注册</h1>
          <input type="text" placeholder="用户名" style={{ width: "100%", padding: "12px", border: `2px solid ${C.terracotta}`, fontSize: "14px", background: C.white, outline: "none", color: C.text }} />
          <input type="email" placeholder="邮箱" style={{ width: "100%", padding: "12px", border: `2px solid ${C.terracotta}`, fontSize: "14px", background: C.white, outline: "none", color: C.text }} />
          <input type="password" placeholder="密码" style={{ width: "100%", padding: "12px", border: `2px solid ${C.terracotta}`, fontSize: "14px", background: C.white, outline: "none", color: C.text }} />
          <button style={{ ...S.btnPrimary, width: "100%", justifyContent: "center" }}>注册</button>
          <p style={{ textAlign: "center", fontSize: "12px", color: C.textMuted }}>
            已有账号？<Link href="/login" style={{ color: C.brick, fontWeight: 700 }}>登录</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
