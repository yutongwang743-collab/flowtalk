"use client";

import { MapPin, Lightbulb, Wand2, Pencil } from "lucide-react";

const config: Record<string, { icon: React.ReactNode; label: string }> = {
  scene: { icon: <MapPin size={14} />, label: "场景故事" },
  analysis: { icon: <Lightbulb size={14} />, label: "分析" },
  tips: { icon: <Wand2 size={14} />, label: "技巧" },
  exercise: { icon: <Pencil size={14} />, label: "练习" },
};

interface SectionNavProps {
  sections: { id: string; type: string; title: string }[];
  activeSection: string;
  onSectionChange: (type: string) => void;
}

export function SectionNav({ sections, activeSection, onSectionChange }: SectionNavProps) {
  return (
    <div style={{
      display: "flex", overflow: "auto",
      background: "#FFFBF7",
      borderBottom: "1px solid #f0e8e0",
      padding: "0 12px",
    }}>
      {sections.map((section, i) => {
        const c = config[section.type];
        const isActive = section.type === activeSection;
        return (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.type)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "12px 14px", fontSize: "12px", fontWeight: 600,
              fontFamily: "'ZCOOL KuaiLe', cursive",
              color: isActive ? C.dark : "#D4A090",
              background: "transparent",
              border: "none", borderBottom: isActive ? `3px solid ${C.dark}` : "3px solid transparent",
              cursor: "pointer",
              whiteSpace: "nowrap", transition: "all 0.15s",
              flexShrink: 0,
            }}>
              <span style={{ fontSize: "16px", fontWeight: 700, color: isActive ? C.dark : "#D4A090" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {c?.icon}
              <span>{c?.label}</span>
          </button>
        );
      })}
    </div>
  );
}

const C = { dark: "#8B3A2A" };
