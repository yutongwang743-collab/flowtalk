import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { C, S } from "@/lib/colors";

export const dynamic = "force-dynamic";

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { name: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { name: true } } },
      },
    },
  });
  if (!post) notFound();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "640px" }}>
      <Link href="/community" style={{ fontSize: "13px", color: C.textMuted, textDecoration: "none" }}>← 疑难情景库</Link>
      <div style={{ background: C.white, padding: "24px" }}>
        <h1 style={{ ...S.heading, fontSize: "24px", color: C.text, marginBottom: "8px" }}>{post.title}</h1>
        <div style={{ display: "flex", gap: "16px", fontSize: "11px", color: C.terracotta, marginBottom: "16px" }}>
          <span>{post.author.name || "匿名用户"}</span>
          <span>{new Date(post.createdAt).toLocaleDateString("zh-CN")}</span>
        </div>
        <p style={{ fontSize: "14px", color: C.text, lineHeight: 1.8 }}>{post.content}</p>
      </div>
      <div>
        <h3 style={{ ...S.heading, fontSize: "18px", color: C.text, marginBottom: "14px" }}>回复 ({post.comments.length})</h3>
        {post.comments.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {post.comments.map((c) => (
              <div key={c.id} style={{ background: C.white, padding: "16px 20px" }}>
                <div style={{ display: "flex", gap: "8px", fontSize: "12px", color: C.terracotta, marginBottom: "6px" }}>
                  <span style={{ fontWeight: 700 }}>{c.author.name || "匿名用户"}</span>
                  <span>{new Date(c.createdAt).toLocaleDateString("zh-CN")}</span>
                </div>
                <p style={{ fontSize: "13px", color: C.text }}>{c.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "48px", background: C.white }}>
            <p style={{ color: C.textMuted, fontSize: "13px" }}>暂无回复，来做第一个分享经验的人吧</p>
          </div>
        )}
      </div>
    </div>
  );
}
