"use client";

import { useMemo } from "react";

// If content contains HTML tags, render as HTML; otherwise treat as Markdown
function isHtml(text: string): boolean {
  return /<[a-zA-Z][^>]*>/.test(text);
}

// Legacy Markdown renderer for existing content
function processInline(text: string): React.ReactNode[] {
  const parts = text.split(/([""][^""]*[""]|[''][^'']*['']|"[^"]*"|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (!part) return null;
    const isQuote = (part.startsWith("“") && part.endsWith("”")) ||
                    (part.startsWith("‘") && part.endsWith("’")) ||
                    (part.startsWith('"') && part.endsWith('"'));
    if (isQuote) return <span key={i} style={{ background: "linear-gradient(180deg, transparent 60%, #FFE4D6 60%)", padding: "0 2px" }}>{part}</span>;
    if (part.startsWith("**") && part.endsWith("**")) return <b key={i} style={{ color: "#D4795A" }}>{part.slice(2, -2)}</b>;
    return part;
  });
}

function renderMarkdown(md: string): React.ReactNode {
  const lines = md.split("\n");
  const els: React.ReactNode[] = [];
  let key = 0;
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (!t) { els.push(<div key={key++} style={{ height: "12px" }} />); continue; }
    if (t.startsWith("## ")) { els.push(<h2 key={key++} style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "17px", fontWeight: 700, color: "#2D1810", margin: "28px 0 10px" }}>{processInline(t.slice(3))}</h2>); continue; }
    if (t.startsWith("### ")) { els.push(<h3 key={key++} style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "15px", fontWeight: 700, color: "#8B3A2A", margin: "20px 0 8px" }}>{processInline(t.slice(4))}</h3>); continue; }
    if (t === "---") { els.push(<div key={key++} style={{ height: "1px", background: "#f0e8e0", margin: "20px 0" }} />); continue; }
    if (/^\*\*(.+)\*\*$/.test(t)) { els.push(<p key={key++} style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "14px", fontWeight: 700, color: "#D4795A", lineHeight: 2, margin: "8px 0" }}>{processInline(t.slice(2, -2))}</p>); continue; }
    if (t.startsWith("→ ")) { els.push(<div key={key++} style={{ display: "flex", gap: "8px", alignItems: "baseline", padding: "2px 0" }}><span style={{ color: "#D4795A", fontSize: "13px", flexShrink: 0 }}>→</span><span style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "14px", color: "#5A2D24", lineHeight: 2 }}>{processInline(t.slice(2))}</span></div>); continue; }
    els.push(<p key={key++} style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "14px", color: "#5A2D24", lineHeight: 2.1, margin: 0 }}>{processInline(t)}</p>);
  }
  return els;
}

function HtmlContent({ html }: { html: string }) {
  return <div
    dangerouslySetInnerHTML={{ __html: html }}
    style={{
      fontFamily: "'Noto Sans SC', sans-serif",
      fontSize: "14px", color: "#5A2D24", lineHeight: 2.1,
    }}
  />;
}

interface A2RendererProps {
  content: string;
  maxWidth?: string;
}

export function A2Renderer({ content, maxWidth = "65ch" }: A2RendererProps) {
  const rendered = useMemo(() => {
    if (!content) return null;
    if (isHtml(content)) {
      return <HtmlContent html={content} />;
    }
    return renderMarkdown(content);
  }, [content]);

  return (
    <div style={{ maxWidth }}>
      {rendered}
    </div>
  );
}
