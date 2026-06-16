"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { A2Editor } from "@/components/editor";

const categoryGroups = [
  { label: "朋友社交", options: ["朋友聊天", "聚会互动", "损友调侃", "开玩笑", "吐槽抱怨"] },
  { label: "恋爱约会", options: ["第一次见面", "暧昧聊天", "约会互动", "微信聊天"] },
  { label: "职场沟通", options: ["同事聊天", "老板交流", "客户交流", "面试"] },
  { label: "陌生人社交", options: ["初次见面", "破冰聊天", "语言交换", "社交活动"] },
  { label: "家庭关系", options: ["父母", "兄弟姐妹", "亲戚"] },
];

const sectionTypes = [
  { type: "scene", label: "场景", placeholder: "写一个真实的沟通场景故事..." },
  { type: "analysis", label: "分析", placeholder: "分析这个场景中发生了什么..." },
  { type: "tips", label: "技巧", placeholder: "实用的沟通技巧和建议..." },
  { type: "exercise", label: "练习", placeholder: "给读者的练习任务..." },
];

interface Lesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string;
  createdAt: string;
  sections: { type: string; title: string; content: string }[];
}

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"list" | "create">("list");

  // List state
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [mainCategory, setMainCategory] = useState("朋友聊天");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sections, setSections] = useState(
    sectionTypes.map((st) => ({ type: st.type, title: "", content: "" }))
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const mainCategories = ["朋友社交", "恋爱约会", "职场沟通", "陌生人社交", "家庭关系"];
  const allTags = categoryGroups.flatMap((g) => g.options);

  // Fetch lessons
  const fetchLessons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/lessons");
      const data = await res.json();
      setLessons(Array.isArray(data) ? data : []);
    } catch { setLessons([]); }
    setLoading(false);
  };

  useEffect(() => {
    fetchLessons();
    // Auto-set slug to next course number
    fetch("/api/admin/lessons/count").then((r) => r.json()).then((d) => {
      if (!editId) setSlug(String(d.count + 1));
    });
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const updateSection = (idx: number, field: "title" | "content", val: string) => {
    setSections((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s)));
  };

  // Reset form
  const resetForm = () => {
    setEditId(null);
    setTitle(""); setSlug(""); setDescription("");
    setMainCategory("朋友聊天"); setSelectedTags([]);
    setSections(sectionTypes.map((st) => ({ type: st.type, title: "", content: "" })));
  };

  // Edit: load lesson into form
  const handleEdit = (lesson: Lesson) => {
    setEditId(lesson.id);
    setTitle(lesson.title);
    setSlug(lesson.slug);
    setDescription(lesson.description || "");
    setMainCategory(lesson.category || "朋友聊天");
    setSelectedTags(lesson.tags ? lesson.tags.split(",").filter(Boolean) : []);
    const secs = sectionTypes.map((st) => {
      const existing = lesson.sections.find((s) => s.type === st.type);
      return existing ? { type: st.type, title: existing.title, content: existing.content } : { type: st.type, title: "", content: "" };
    });
    setSections(secs);
    setTab("create");
  };

  // Delete
  const handleDelete = async (lesson: Lesson) => {
    if (!confirm(`确定删除「${lesson.title}」吗？此操作不可恢复。`)) return;
    try {
      const res = await fetch(`/api/admin/lessons?id=${lesson.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: `「${lesson.title}」已删除` });
        fetchLessons();
      } else {
        setMessage({ type: "error", text: data.error || "删除失败" });
      }
    } catch { setMessage({ type: "error", text: "网络错误" }); }
  };

  // Submit (create or update)
  const handleSubmit = async () => {
    if (!title || !slug || !mainCategory) { setMessage({ type: "error", text: "请填写标题、Slug 和主分类" }); return; }
    if (sections.some((s) => !s.title || !s.content)) { setMessage({ type: "error", text: "请填写所有章节的标题和内容" }); return; }

    setSaving(true); setMessage(null);

    try {
      const method = editId ? "PUT" : "POST";
      const body: any = { title, slug, description, category: mainCategory, tags: selectedTags, sections };
      if (editId) body.id = editId;

      const res = await fetch("/api/admin/lessons", {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: editId ? `「${title}」已更新` : `「${title}」发布成功` });
        resetForm();
        setTab("list");
        fetchLessons();
        router.refresh();
      } else {
        setMessage({ type: "error", text: data.error || "操作失败" });
      }
    } catch { setMessage({ type: "error", text: "网络错误" }); }
    setSaving(false);
  };

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "24px 16px 100px" }}>

      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px" }}>✍️ 创作者中心</h1>
        <p style={{ fontSize: "13px", color: "#999", margin: 0 }}>管理课程内容</p>
      </div>

      {/* Message */}
      {message && (
        <div style={{
          padding: "12px 16px", borderRadius: "8px", marginBottom: "16px",
          background: message.type === "success" ? "#FDF0EA" : "#FEE2E2",
          color: message.type === "success" ? "#8B3A2A" : "#991B1B",
          fontSize: "13px", fontWeight: 600,
        }}>
          {message.text}
        </div>
      )}

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "20px", background: "#fff", borderRadius: "10px", padding: "4px" }}>
        <button onClick={() => { setTab("list"); resetForm(); }} style={{
          flex: 1, padding: "10px", fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "8px",
          cursor: "pointer", transition: "all 0.15s",
          color: tab === "list" ? "#fff" : "#8B3A2A",
          background: tab === "list" ? "#8B3A2A" : "transparent",
        }}>📋 课程列表 ({lessons.length})</button>
        <button onClick={() => setTab("create")} style={{
          flex: 1, padding: "10px", fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "8px",
          cursor: "pointer", transition: "all 0.15s",
          color: tab === "create" ? "#fff" : "#8B3A2A",
          background: tab === "create" ? "#8B3A2A" : "transparent",
        }}>{editId ? "✏️ 编辑中" : "➕ 发布新课程"}</button>
      </div>

      {/* ===== LIST TAB ===== */}
      {tab === "list" && (
        <div>
          {loading ? (
            <div style={{ textAlign: "center", padding: "48px", color: "#ccc" }}>加载中...</div>
          ) : lessons.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px", background: "#fff", borderRadius: "10px", color: "#ccc", fontSize: "14px" }}>
              暂无课程，点"发布新课程"开始
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {lessons.map((l, i) => {
                const listNum = /^\d+$/.test(l.slug) ? parseInt(l.slug) : i + 1;
                const tagList = l.tags ? l.tags.split(",").filter(Boolean) : [];
                return (
                <div key={l.id} style={{
                  background: "#fff", padding: "14px 16px", borderRadius: "8px",
                  display: "flex", alignItems: "center", gap: "12px",
                }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#D4A090", width: "24px", flexShrink: 0 }}>
                    {listNum}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {l.title}
                    </div>
                    <div style={{ display: "flex", gap: "6px", marginTop: "3px", flexWrap: "wrap", alignItems: "center" }}>
                      {tagList.length > 0 ? tagList.slice(0, 3).map((t) => (
                        <span key={t} style={{ fontSize: "10px", padding: "1px 6px", background: "#FDF0EA", color: "#8B3A2A", borderRadius: "4px" }}>{t}</span>
                      )) : <span style={{ fontSize: "10px", color: "#bbb" }}>{l.category}</span>}
                      <span style={{ fontSize: "10px", color: "#ccc" }}>{new Date(l.createdAt).toLocaleDateString("zh-CN")}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                    <button onClick={() => handleEdit(l)} style={{
                      padding: "5px 12px", fontSize: "11px", fontWeight: 600,
                      color: "#8B3A2A", background: "#FDF0EA", border: "none",
                      borderRadius: "6px", cursor: "pointer",
                    }}>编辑</button>
                    <button onClick={() => handleDelete(l)} style={{
                      padding: "5px 12px", fontSize: "11px", fontWeight: 600,
                      color: "#999", background: "#f5f5f5", border: "none",
                      borderRadius: "6px", cursor: "pointer",
                    }}>删除</button>
                  </div>
                </div>
              ); })}
            </div>
          )}
        </div>
      )}

      {/* ===== CREATE TAB ===== */}
      {tab === "create" && (
        <div>

          {/* Basic info */}
          <div style={{ background: "#fff", padding: "16px", borderRadius: "10px", marginBottom: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={lbl}>课程标题 *</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="如：咖啡店怎么自然开口聊天" style={inp} />
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={lbl}>编号（网址用） *</label>
                  <input value={slug} onChange={(e) => setSlug(e.target.value)} style={inp} placeholder="自动填充" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={lbl}>主分类 *</label>
                  <select value={mainCategory} onChange={(e) => setMainCategory(e.target.value)} style={{ ...inp, cursor: "pointer" }}>
                    {mainCategories.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={lbl}>课程简介</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="一句话描述这门课..." rows={2} style={{ ...inp, resize: "vertical" }} />
              </div>
              <div>
                <label style={lbl}>相关场景标签（可多选）</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
                  {categoryGroups.map((group) => (
                    <div key={group.label}>
                      <div style={{ fontSize: "11px", fontWeight: 600, color: "#D4A090", marginBottom: "4px" }}>{group.label}</div>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {group.options.map((tag) => {
                          const sel = selectedTags.includes(tag);
                          return (
                            <button key={tag} type="button" onClick={() => toggleTag(tag)} style={{
                              padding: "4px 12px", fontSize: "11px", fontWeight: 600,
                              color: sel ? "#fff" : "#8B3A2A", background: sel ? "#8B3A2A" : "#FDF0EA",
                              border: "none", borderRadius: "14px", cursor: "pointer", transition: "all 0.15s",
                            }}>{tag}</button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
            {sections.map((s, i) => {
              const meta = sectionTypes[i];
              return (
                <div key={meta.type} style={{ background: "#fff", padding: "16px", borderRadius: "10px" }}>
                  <div style={{ display: "inline-block", fontSize: "11px", fontWeight: 700, padding: "3px 10px", background: "#FDF0EA", color: "#8B3A2A", borderRadius: "8px", marginBottom: "10px" }}>
                    {i + 1} · {meta.label}
                  </div>
                  <input value={s.title} onChange={(e) => updateSection(i, "title", e.target.value)}
                    placeholder={`${meta.label}标题`} style={{ ...inp, marginBottom: "8px", fontWeight: 600 }} />
                  <A2Editor
                    value={s.content}
                    onChange={(val) => updateSection(i, "content", val)}
                    placeholder={meta.placeholder}
                    rows={i === 0 ? 8 : 5}
                  />
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            {editId && (
              <button onClick={() => { resetForm(); setTab("list"); }} style={{
                padding: "14px 20px", fontSize: "15px", fontWeight: 700,
                color: "#999", background: "#f5f5f5", border: "none", borderRadius: "10px",
                cursor: "pointer", flex: 1,
              }}>取消</button>
            )}
            <button onClick={handleSubmit} disabled={saving} style={{
              flex: 2, padding: "14px", fontSize: "15px", fontWeight: 700,
              color: "#fff", background: saving ? "#D4A090" : "#8B3A2A",
              border: "none", borderRadius: "10px", cursor: saving ? "not-allowed" : "pointer",
            }}>
              {saving ? "保存中..." : editId ? "💾 保存修改" : "🚀 发布课程"}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

const lbl: React.CSSProperties = { fontSize: "12px", fontWeight: 600, color: "#555", display: "block", marginBottom: "4px" };
const inp: React.CSSProperties = { width: "100%", padding: "10px 12px", border: "1px solid #eee", borderRadius: "8px", fontSize: "13px", color: "#333", outline: "none", background: "#fafaf9", fontFamily: "'Noto Sans SC', sans-serif", boxSizing: "border-box" };
