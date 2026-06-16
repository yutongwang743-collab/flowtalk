"use client";

import { useRef, useEffect, useCallback } from "react";

// Convert legacy Markdown to HTML for editor display
function mdToHtml(md: string): string {
  const lines = md.split("\n");
  let html = "";
  for (const line of lines) {
    const t = line.trim();
    if (!t) { html += "<div><br></div>"; continue; }
    if (t.startsWith("## ")) { html += `<h2>${t.slice(3)}</h2>`; continue; }
    if (t.startsWith("### ")) { html += `<h3>${t.slice(4)}</h3>`; continue; }
    if (t === "---") { html += '<hr style="border:none;height:1px;background:#f0e8e0;margin:20px 0">'; continue; }
    if (t.startsWith("→ ")) { html += `<div>→ ${t.slice(2)}</div>`; continue; }
    if (/^\*\*(.+)\*\*$/.test(t)) { html += `<div><b>${t.slice(2, -2)}</b></div>`; continue; }
    let p = t
      .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
      .replace(/[""][^""]*[""]/g, (m) => `<span style="background:linear-gradient(180deg,transparent 60%,#FFE4D6 60%);padding:0 2px">${m}</span>`)
      .replace(/"([^"]*)"/g, (_, t) => `<span style="background:linear-gradient(180deg,transparent 60%,#FFE4D6 60%);padding:0 2px">"${t}"</span>`);
    html += `<div>${p}</div>`;
  }
  return html;
}

interface A2EditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  rows?: number;
}

export function A2Editor({ value, onChange, placeholder = "开始写...", rows = 10 }: A2EditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInternal = useRef(false);

  // Load value into editor (only when value changes externally)
  // If content is Markdown (no HTML tags), convert to HTML for display
  useEffect(() => {
    const el = ref.current;
    if (!el || isInternal.current) { isInternal.current = false; return; }
    const isMd = !/<[a-zA-Z][^>]*>/.test(value);
    const displayHtml = isMd ? mdToHtml(value) : value;
    if (el.innerHTML === displayHtml) return;
    el.innerHTML = displayHtml;
  }, [value]);

  const handleInput = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    isInternal.current = true;
    onChange(el.innerHTML);
  }, [onChange]);

  const execCmd = (cmd: string, val?: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, val);
    handleInput();
  };

  const applyHighlight = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const text = sel.toString();
    if (!text) return;
    const span = `<span style="background:linear-gradient(180deg,transparent 60%,#FFE4D6 60%);padding:0 2px">${text}</span>`;
    document.execCommand("insertHTML", false, span);
    handleInput();
  };

  const insertHr = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const hr = document.createElement("hr");
    hr.style.cssText = "border:none;height:1px;background:#f0e8e0;margin:20px 0";
    range.insertNode(hr);
    const br = document.createElement("br");
    range.setStartAfter(hr);
    range.insertNode(br);
    range.setStartAfter(br);
    range.collapse(true);
    handleInput();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const mod = e.ctrlKey || e.metaKey;
    if (!mod) return;
    switch (e.key.toLowerCase()) {
      case "b": e.preventDefault(); execCmd("bold"); break;
      case "i": e.preventDefault(); execCmd("italic"); break;
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    // Split by newlines and wrap in divs
    const html = text.split("\n").map((line) => line ? `<div>${line}</div>` : "<div><br></div>").join("");
    document.execCommand("insertHTML", false, html);
    handleInput();
  };

  const minH = rows * 28 + 16;

  return (
    <div style={{ border: "1px solid #eee", borderRadius: "8px", overflow: "hidden", background: "#FFFBF7" }}>

      {/* Toolbar */}
      <div style={{
        display: "flex", gap: "2px", padding: "6px 8px",
        background: "#fafaf9", borderBottom: "1px solid #eee",
        flexWrap: "wrap", alignItems: "center",
      }}>
        <ToolBtn label="B" title="加粗 (Ctrl+B)" onMouseDown={() => execCmd("bold")} />
        <ToolBtn label="I" title="斜体 (Ctrl+I)" onMouseDown={() => execCmd("italic")} />
        <span style={{ width: "6px" }} />
        <ToolBtn label="H2" title="大标题" onMouseDown={() => execCmd("formatBlock", "h2")} />
        <ToolBtn label="H3" title="小标题" onMouseDown={() => execCmd("formatBlock", "h3")} />
        <ToolBtn label="P" title="正文" onMouseDown={() => execCmd("formatBlock", "p")} />
        <span style={{ width: "6px" }} />
        <ToolBtn label="💬" title="选中文字后点此：引号高亮" onMouseDown={applyHighlight} />
        <ToolBtn label="—" title="插入分隔线" onMouseDown={insertHr} />
      </div>

      {/* WYSIWYG canvas */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        style={{
          minHeight: `${minH}px`,
          padding: "14px 16px",
          fontSize: "14px", lineHeight: 2,
          color: "#5A2D24",
          fontFamily: "'Noto Sans SC', sans-serif",
          outline: "none", cursor: "text",
        }}
      />

      {/* Hints */}
      <div style={{
        padding: "7px 12px", fontSize: "10px", color: "#ccc",
        background: "#fafaf9", borderTop: "1px solid #eee",
        display: "flex", gap: "12px", flexWrap: "wrap",
      }}>
        <span><b style={{ color: "#bbb" }}>Ctrl+B</b> 加粗</span>
        <span><b style={{ color: "#bbb" }}>Ctrl+I</b> 斜体</span>
        <span>选中文字后点 💬 加荧光高亮</span>
      </div>
    </div>
  );
}

function ToolBtn({ label, title, onMouseDown }: { label: string; title: string; onMouseDown: () => void }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onMouseDown(); }}
      style={{
        padding: "4px 10px", fontSize: "11px", fontWeight: 700,
        color: "#8B3A2A", background: "#FDF0EA",
        border: "none", borderRadius: "4px", cursor: "pointer",
        fontFamily: label === "H2" || label === "H3" || label === "P" ? "monospace" : "inherit",
      }}
    >
      {label}
    </button>
  );
}
