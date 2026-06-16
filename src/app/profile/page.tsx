import Link from "next/link";
import { C, S } from "@/lib/colors";

export default function ProfilePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", maxWidth: "640px" }}>
      <div>
        <Link href="/" style={{ fontSize: "13px", color: C.textMuted, textDecoration: "none" }}>← 返回首页</Link>
        <h1 style={{ ...S.heading, fontSize: "28px", color: C.text, margin: "8px 0 4px" }}>个人中心</h1>
        <p style={{ fontSize: "13px", color: C.textMuted }}>管理你的学习记录和个人信息</p>
      </div>
      <div style={{ textAlign: "center", padding: "64px", background: C.white }}>
        <div style={{ ...S.circle(80, "dashed"), margin: "0 auto 16px" }}>
          <span style={{ fontSize: "32px" }}>🐴</span>
        </div>
        <h3 style={{ ...S.heading, fontSize: "16px", color: C.text, marginBottom: "8px" }}>登录后查看个人主页</h3>
        <p style={{ fontSize: "13px", color: C.textMuted, marginBottom: "16px" }}>登录后可以查看学习记录和练习历史</p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/favorites" style={{ ...S.btnOutline, display: "inline-flex" }}>⭐ 我的收藏</Link>
          <Link href="/login" style={S.btnPrimary}>去登录</Link>
        </div>
      </div>
    </div>
  );
}
