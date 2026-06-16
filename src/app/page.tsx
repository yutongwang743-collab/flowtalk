import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { C } from "@/lib/colors";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [quote, lessonCount, scenarioCount, postCount] = await Promise.all([
    prisma.quote.findFirst({ orderBy: { createdAt: "desc" } }),
    prisma.lesson.count(),
    prisma.practiceScenario.count(),
    prisma.post.count(),
  ]);

  return (
    <div>

      {/* ===== Hero ===== */}
      <section style={{
        background: "linear-gradient(160deg, #8B3A2A 0%, #A64B3A 40%, #C97A6A 100%)",
        padding: "clamp(32px, 6vw, 56px) 20px",
        textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: -40, top: -50, fontSize: "clamp(100px, 16vw, 180px)", opacity: 0.08, transform: "rotate(-10deg)", userSelect: "none" }}>🐴</div>
        <div style={{ position: "absolute", left: -30, bottom: -40, fontSize: "clamp(60px, 10vw, 100px)", opacity: 0.06, userSelect: "none" }}>💬</div>

        <h1 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 700, color: "#fff", margin: 0, position: "relative", lineHeight: 1.3 }}>
          每一次对话<br />都是一次成长
        </h1>
        <p style={{ fontSize: "clamp(12px, 1.5vw, 14px)", color: "rgba(255,255,255,0.65)", margin: "12px 0 0", position: "relative" }}>
          不教话术，用沟通框架打开表达的无限可能
        </p>

        <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center", position: "relative", flexWrap: "wrap" }}>
          <Link href="/lessons" style={{
            padding: "10px 24px", background: "#fff", color: "#8B3A2A",
            borderRadius: "24px", fontSize: "13px", fontWeight: 700,
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px",
          }}>🐴 探索对话课 →</Link>
          <Link href="/practice" style={{
            padding: "10px 24px", border: "2px solid rgba(255,255,255,0.35)", color: "#fff",
            borderRadius: "24px", fontSize: "13px", fontWeight: 600, textDecoration: "none",
          }}>开始练习</Link>
        </div>

        <div style={{ display: "flex", gap: "clamp(24px, 5vw, 48px)", justifyContent: "center", marginTop: "24px", position: "relative" }}>
          {[{ n: lessonCount, label: "门课程" }, { n: scenarioCount, label: "个场景" }, { n: postCount, label: "个讨论" }].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 700, color: "#fff" }}>{s.n}</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 学习模块 ===== */}
      <section style={{ background: C.warm, padding: "clamp(20px, 3vw, 32px) 20px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: C.dark, margin: "0 0 16px" }}>📚 对话学习</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link href="/lessons" style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", padding: "16px", borderRadius: "10px", display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <div style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, #8B3A2A, #A64B3A)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>💬</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a1a" }}>对话课程</div>
                  <div style={{ fontSize: "12px", color: "#999", marginTop: "4px", lineHeight: 1.6 }}>场景 → 分析 → 技巧 → 练习，四段式掌握沟通方法</div>
                  <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
                    <span style={{ fontSize: "10px", padding: "3px 10px", background: C.warm, color: C.dark, borderRadius: "8px" }}>{lessonCount}门课程</span>
                    <span style={{ fontSize: "10px", padding: "3px 10px", background: C.warm, color: C.dark, borderRadius: "8px" }}>免费学习</span>
                  </div>
                </div>
                <span style={{ fontSize: "18px", color: "#D4A090", flexShrink: 0, marginTop: "6px" }}>→</span>
              </div>
            </Link>
            <Link href="/practice" style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", padding: "16px", borderRadius: "10px", display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <div style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, #C97A6A, #D4A090)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>✏️</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a1a" }}>场景练习</div>
                  <div style={{ fontSize: "12px", color: "#999", marginTop: "4px", lineHeight: 1.6 }}>真实沟通场景，写下你的思考和回应</div>
                  <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
                    <span style={{ fontSize: "10px", padding: "3px 10px", background: C.warm, color: C.dark, borderRadius: "8px" }}>{scenarioCount}个场景</span>
                    <span style={{ fontSize: "10px", padding: "3px 10px", background: C.warm, color: C.dark, borderRadius: "8px" }}>入门→挑战</span>
                  </div>
                </div>
                <span style={{ fontSize: "18px", color: "#D4A090", flexShrink: 0, marginTop: "6px" }}>→</span>
              </div>
            </Link>
            <Link href="/community" style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", padding: "16px", borderRadius: "10px", display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <div style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, #C9A87C, #D4B896)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>👥</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a1a" }}>情景讨论</div>
                  <div style={{ fontSize: "12px", color: "#999", marginTop: "4px", lineHeight: 1.6 }}>真实的沟通难题，来自大家的经验和建议</div>
                  <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
                    <span style={{ fontSize: "10px", padding: "3px 10px", background: C.warm, color: C.dark, borderRadius: "8px" }}>{postCount}个讨论</span>
                    <span style={{ fontSize: "10px", padding: "3px 10px", background: C.warm, color: C.dark, borderRadius: "8px" }}>匿名可发</span>
                  </div>
                </div>
                <span style={{ fontSize: "18px", color: "#D4A090", flexShrink: 0, marginTop: "6px" }}>→</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 每日一句 ===== */}
      {quote && (
        <section style={{ padding: "20px", background: "#fafaf9" }}>
          <div style={{ maxWidth: "720px", margin: "0 auto", background: C.warm, padding: "24px 20px", textAlign: "center", borderRadius: "10px" }}>
            <div style={{ fontSize: "32px", color: "#D4A090", opacity: 0.4, marginBottom: "4px", lineHeight: 1 }}>&ldquo;</div>
            <p style={{ fontSize: "15px", color: C.dark, lineHeight: 2, margin: 0 }}>{quote.content}</p>
            {quote.author && <p style={{ fontSize: "11px", color: "#D4A090", marginTop: "10px" }}>—— {quote.author} · 每日一句</p>}
          </div>
        </section>
      )}

      <footer style={{ textAlign: "center", padding: "20px 16px 80px", fontSize: "11px", color: "#ccc" }}>
        © 趣魅 · 沟通能力学习社区
      </footer>

    </div>
  );
}
