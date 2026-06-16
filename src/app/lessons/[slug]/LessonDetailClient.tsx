"use client";

import { useState } from "react";
import { SectionNav } from "@/components/features/lessons/SectionNav";
import { A2Renderer } from "@/components/editor";

interface Section { id: string; type: string; title: string; content: string; order: number; }

const sectionMeta: Record<string, { icon: string; label: string }> = {
  scene: { icon: "📍", label: "场景故事" },
  analysis: { icon: "🔍", label: "分析" },
  tips: { icon: "✨", label: "技巧" },
  exercise: { icon: "✏️", label: "练习" },
};

export function LessonDetailClient({ lesson }: { lesson: { id: string; title: string; sections: Section[] } }) {
  const [active, setActive] = useState(lesson.sections[0]?.type || "scene");
  const [fading, setFading] = useState(false);

  const handleChange = (type: string) => {
    if (type === active) return;
    setFading(true);
    setTimeout(() => { setActive(type); setFading(false); }, 150);
  };

  const current = lesson.sections.find((s) => s.type === active);
  const idx = lesson.sections.findIndex((s) => s.type === active);
  const meta = sectionMeta[active];

  return (
    <div style={{ background: "#FFFBF7" }}>
      {/* Progress dots */}
      <div style={{ display: "flex", gap: "4px", padding: "12px 20px 0" }}>
        {lesson.sections.map((s, i) => (
          <div key={s.id} style={{
            flex: 1, height: "3px",
            background: i <= idx ? "#D4795A" : "#f0e8e0",
            borderRadius: "2px", transition: "background 0.3s",
          }} />
        ))}
      </div>

      <SectionNav
        sections={lesson.sections.map((s) => ({ id: s.id, type: s.type, title: s.title }))}
        activeSection={active}
        onSectionChange={handleChange}
      />

      <div style={{ padding: "28px 22px" }}>
        <div style={{
          opacity: fading ? 0 : 1,
          transform: fading ? "translateY(6px)" : "translateY(0)",
          transition: "all 0.15s",
        }}>
          {current ? (
            <div>
              {/* Section header */}
              <div style={{ display: "flex", gap: "10px", alignItems: "baseline", marginBottom: "14px" }}>
                <span style={{
                  fontFamily: "'ZCOOL KuaiLe', cursive",
                  fontSize: "28px", color: "#D4795A", lineHeight: 1,
                }}>
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span style={{
                  fontSize: "11px", padding: "4px 12px",
                  background: "#8B3A2A", color: "#fff",
                  borderRadius: "3px", fontWeight: 700,
                  fontFamily: "'ZCOOL KuaiLe', cursive",
                }}>
                  {meta?.label}
                </span>
              </div>

              <h2 style={{
                fontFamily: "Georgia, 'Noto Serif SC', serif",
                fontSize: "20px", fontWeight: 700, color: "#2D1810",
                margin: "0 0 8px", lineHeight: 1.4, fontStyle: "italic",
              }}>
                {current.title}
              </h2>

              <div style={{
                width: "40px", height: "3px",
                background: "#D4795A", marginBottom: "20px",
              }} />

              {/* A2 rendered content */}
              <A2Renderer content={current.content} />

              {/* Next section button */}
              {idx < lesson.sections.length - 1 && (
                <div style={{ marginTop: "36px" }}>
                  <div style={{
                    height: "1px", background: "#f0e8e0", marginBottom: "16px",
                  }} />
                  <button
                    onClick={() => handleChange(lesson.sections[idx + 1].type)}
                    style={{
                      width: "100%", textAlign: "left",
                      padding: "14px 18px",
                      background: "#fff",
                      border: "2px dashed #D4A090",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontFamily: "'Noto Sans SC', sans-serif",
                    }}
                  >
                    <span style={{ fontSize: "10px", color: "#D4A090", fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                      下一节
                    </span>
                    <p style={{
                      fontSize: "14px", fontWeight: 600, color: "#5A2D24",
                      margin: "4px 0 0",
                    }}>
                      {sectionMeta[lesson.sections[idx + 1].type]?.icon} {lesson.sections[idx + 1].title} →
                    </p>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "#D4A090", padding: "48px", fontFamily: "'ZCOOL KuaiLe', cursive" }}>
              加载中...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
