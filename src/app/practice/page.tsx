import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { C } from "@/lib/colors";

export const dynamic = "force-dynamic";

const diffLabels: Record<string, string> = { beginner: "入门", medium: "进阶", hard: "挑战" };

export default async function PracticePage() {
  const scenarios = await prisma.practiceScenario.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 16px" }}>

      <div style={{ padding: "20px 0 12px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px" }}>场景练习</h1>
        <p style={{ fontSize: "13px", color: "#999", margin: 0 }}>
          选一个场景，自己动手练习。没人打分，你的思考最重要。
        </p>
      </div>

      {scenarios.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {scenarios.map((sc) => (
            <Link key={sc.id} href={`/practice/${sc.id}`} style={{ textDecoration: "none" }}>
              <div style={{
                background: "#fff", padding: "16px", borderRadius: "8px",
                display: "flex", alignItems: "center", gap: "12px",
              }}>
                <span style={{ fontSize: "24px", flexShrink: 0 }}>✏️</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#333" }}>{sc.title}</div>
                  <div style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>
                    {sc.description}
                  </div>
                </div>
                <span style={{
                  fontSize: "11px", padding: "3px 10px",
                  background: C.warm, color: C.dark, borderRadius: "10px",
                  flexShrink: 0,
                }}>
                  {diffLabels[sc.difficulty] || "入门"}
                </span>
                <span style={{ fontSize: "16px", color: "#D4A090", flexShrink: 0 }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "64px", background: "#fff", borderRadius: "8px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>✏️</div>
          <p style={{ fontSize: "14px", color: "#999" }}>练习场景即将上线</p>
        </div>
      )}

    </div>
  );
}
