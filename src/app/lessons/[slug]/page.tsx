import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { categories } from "@/lib/utils";
import { LessonDetailClient } from "./LessonDetailClient";

export const dynamic = "force-dynamic";

export default async function LessonDetailPage({ params }: { params: { slug: string } }) {
  const lesson = await prisma.lesson.findUnique({
    where: { slug: params.slug },
    include: { sections: { orderBy: { order: "asc" } } },
  });
  if (!lesson) notFound();

  const cat = categories[lesson.category] || { label: lesson.category, icon: "📖" };
  const tagList = lesson.tags ? lesson.tags.split(",").filter(Boolean) : [];

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 16px" }}>

      {/* Back */}
      <div style={{ padding: "12px 0" }}>
        <Link href="/lessons" style={{
          fontSize: "13px", color: "#D4A090", textDecoration: "none",
          fontFamily: "'ZCOOL KuaiLe', cursive",
        }}>
          ← 对话课
        </Link>
      </div>

      {/* Course info card */}
      <div style={{
        background: "#FFFBF7", padding: "20px 22px", borderRadius: "10px 10px 0 0",
        border: "1px solid #f0e8e0", borderBottom: "none",
      }}>
        <span style={{
          display: "inline-block", fontSize: "11px", padding: "3px 10px",
          background: "#8B3A2A", color: "#fff", borderRadius: "3px",
          fontWeight: 700, fontFamily: "'ZCOOL KuaiLe', cursive",
          marginBottom: "10px",
        }}>
          {cat.icon} {cat.label}
        </span>
        {tagList.length > 0 && (
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
            {tagList.map((tag) => (
              <span key={tag} style={{
                fontSize: "10px", padding: "2px 10px",
                background: "#FFEDE4", color: "#D4795A",
                borderRadius: "10px", fontFamily: "'ZCOOL KuaiLe', cursive",
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}
        <h1 style={{
          fontFamily: "Georgia, 'Noto Serif SC', serif",
          fontSize: "22px", fontWeight: 700, color: "#2D1810",
          margin: "0 0 6px", lineHeight: 1.4, fontStyle: "italic",
        }}>
          {lesson.title}
        </h1>
        <p style={{ fontSize: "13px", color: "#8B5A4A", lineHeight: 1.7, margin: 0 }}>
          {lesson.description}
        </p>
      </div>

      {/* Content */}
      <div style={{
        border: "1px solid #f0e8e0", borderTop: "none",
        borderRadius: "0 0 10px 10px", overflow: "hidden",
      }}>
        <LessonDetailClient lesson={lesson} />
      </div>

      {/* Bottom CTA */}
      <div style={{
        background: "#8B3A2A", padding: "20px 16px", textAlign: "center",
        borderRadius: "10px", marginTop: "12px",
      }}>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", marginBottom: "4px", fontFamily: "'ZCOOL KuaiLe', cursive" }}>
          学完理论了？
        </div>
        <div style={{ fontSize: "16px", color: "#fff", fontWeight: 600, marginBottom: "12px" }}>
          去真实场景里试试
        </div>
        <Link href="/practice" style={{
          display: "inline-block", fontSize: "13px", padding: "8px 24px",
          background: "#fff", color: "#8B3A2A", borderRadius: "20px",
          textDecoration: "none", fontWeight: 700,
          fontFamily: "'ZCOOL KuaiLe', cursive",
        }}>
          🐴 进入练习 →
        </Link>
      </div>

    </div>
  );
}
