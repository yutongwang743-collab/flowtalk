import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { C, S } from "@/lib/colors";

export const dynamic = "force-dynamic";

export default async function PracticeDetailPage({ params }: { params: { id: string } }) {
  const scenario = await prisma.practiceScenario.findUnique({ where: { id: params.id } });
  if (!scenario) notFound();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "640px" }}>
      <Link href="/practice" style={{ fontSize: "13px", color: C.textMuted, textDecoration: "none" }}>← 返回练习列表</Link>
      <div>
        <h1 style={{ ...S.heading, fontSize: "26px", color: C.text, marginBottom: "6px" }}>{scenario.title}</h1>
        <p style={{ fontSize: "13px", color: C.textMuted }}>{scenario.description}</p>
      </div>

      <div style={{ background: C.white, padding: "24px" }}>
        <h3 style={{ ...S.heading, fontSize: "15px", color: C.brick, marginBottom: "10px" }}>📖 背景说明</h3>
        <p style={{ fontSize: "14px", color: C.text, lineHeight: 1.8 }}>{scenario.prompt}</p>
      </div>

      <div style={{ background: C.white, padding: "24px" }}>
        <h3 style={{ ...S.heading, fontSize: "15px", color: C.brick, marginBottom: "10px" }}>🎯 你的任务</h3>
        <p style={{ fontSize: "14px", color: C.text }}>阅读场景，写下你会怎么回应。没有标准答案，重要的是你的思考过程。</p>
      </div>

      <div style={{ background: C.terracotta, padding: "24px" }}>
        <h3 style={{ ...S.heading, fontSize: "15px", color: C.warm, marginBottom: "10px" }}>💡 思考提示</h3>
        <ul style={{ fontSize: "13px", color: C.warm, lineHeight: 2, listStyle: "none", padding: 0 }}>
          <li>· 这个场景中的核心问题是什么？</li>
          <li>· 对方的感受和需求可能是什么？</li>
          <li>· 你可以运用哪些沟通框架？</li>
        </ul>
      </div>

      <div style={{ background: C.white, padding: "24px" }}>
        <textarea
          style={{ width: "100%", minHeight: "140px", border: `2px solid ${C.terracotta}`, padding: "14px", fontSize: "14px", color: C.text, fontFamily: "'Noto Sans SC', sans-serif", resize: "vertical", outline: "none", background: C.warm }}
          placeholder="在这里写下你会说的话、你的思路..."
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
          <span style={{ fontSize: "11px", color: C.textMuted }}>不会被 AI 评分，仅供自己回顾</span>
          <button style={S.btnPrimary}>✉️ 保存回答</button>
        </div>
      </div>
    </div>
  );
}
