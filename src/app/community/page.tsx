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
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 16px" }}>

      <div style={{ padding: "20px 0 12px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>情景讨论</h1>
        <p style={{ fontSize: "13px", color: "#999", margin: "4px 0 0" }}>真实的沟通难题，来自大家的经验</p>
      </div>

      {/* Quick post CTA */}
      <div style={{
        background: "#fff", padding: "14px 16px", borderRadius: "8px",
        display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px",
      }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "50%",
          background: C.warm, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "14px", flexShrink: 0,
        }}>🐴</div>
        <span style={{ fontSize: "14px", color: "#bbb" }}>写下你遇到的沟通难题...</span>
      </div>

      {posts.length > 0 ? (
        <div>
          <p style={{ fontSize: "13px", color: "#bbb", margin: "0 0 8px" }}>
            共 <b style={{ color: "#D4A090" }}>{posts.length}</b> 个讨论
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {posts.map((p) => (
              <Link key={p.id} href={`/community/${p.id}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "#fff", padding: "16px", borderRadius: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <div style={{
                      width: "24px", height: "24px", borderRadius: "50%",
                      background: C.warm, display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: "12px",
                    }}>🐴</div>
                    <span style={{ fontSize: "13px", color: "#888" }}>匿名用户</span>
                    <span style={{ fontSize: "12px", color: "#bbb", marginLeft: "auto" }}>
                      {timeAgo(p.createdAt)}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#333", margin: "0 0 6px" }}>{p.title}</h3>
                  <p style={{ fontSize: "13px", color: "#777", lineHeight: 1.7, margin: "0 0 10px" }}>
                    {p.content}
                  </p>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <span style={{ fontSize: "12px", color: "#bbb" }}>💬 {p._count.comments} 个回答</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "64px", background: "#fff", borderRadius: "8px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>💬</div>
          <p style={{ fontSize: "14px", color: "#999", marginBottom: "16px" }}>还没有讨论</p>
          <Link href="/lessons" style={{
            display: "inline-block", fontSize: "14px", padding: "8px 20px",
            background: C.dark, color: "#fff", borderRadius: "20px",
            textDecoration: "none", fontWeight: 600,
          }}>先去学习 →</Link>
        </div>
      )}

    </div>
  );
}

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return "刚刚";
  if (m < 60) return `${m} 分钟前`;
  if (h < 24) return `${h} 小时前`;
  if (d < 30) return `${d} 天前`;
  return new Date(date).toLocaleDateString("zh-CN");
}
