"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const skillTags = ["朋友社交", "恋爱约会", "职场沟通", "陌生人社交"];

const tagMap: Record<string, string[]> = {
  "朋友社交": ["朋友聊天", "聚会互动", "损友调侃", "开玩笑", "吐槽抱怨"],
  "恋爱约会": ["第一次见面", "暧昧聊天", "约会互动", "微信聊天"],
  "职场沟通": ["同事聊天", "老板交流", "客户交流", "面试"],
  "陌生人社交": ["初次见面", "破冰聊天", "语言交换", "社交活动"],
};

interface Card {
  id: string;
  num: number;
  emoji: string;
  title: string;
  tags: string[];
  slug: string;
}

export function LessonsClient({ cards }: { cards: Card[] }) {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [favLoading, setFavLoading] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/favorites")
      .then((r) => r.json())
      .then((data: { lessonId: string }[]) => {
        setFavorites(new Set(data.map((f) => f.lessonId)));
      })
      .catch(() => {});
  }, []);

  const toggleFav = useCallback(async (lessonId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavLoading((prev) => new Set(prev).add(lessonId));
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      });
      const data = await res.json();
      setFavorites((prev) => {
        const next = new Set(prev);
        if (data.favorited) next.add(lessonId);
        else next.delete(lessonId);
        return next;
      });
    } catch {}
    setFavLoading((prev) => {
      const next = new Set(prev);
      next.delete(lessonId);
      return next;
    });
  }, []);

  let filtered = cards;
  if (activeGroup && tagMap[activeGroup]) {
    filtered = cards.filter((c) =>
      c.tags.some((t) => tagMap[activeGroup].includes(t))
    );
  }
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.tags.some((t) => t.includes(q))
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 0 80px" }}>

      {/* Hero Banner — 1200×180, radius 24px */}
      <div style={{
        margin: "16px 20px 0",
        height: "180px",
        borderRadius: "24px",
        background: "linear-gradient(160deg, #8B3A2A 0%, #A64B3A 40%, #C97A6A 100%)",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", right: "-40px", top: "-50px",
          fontSize: "140px", opacity: 0.06, pointerEvents: "none",
        }}>💬</div>
        <div style={{
          position: "absolute", left: "-30px", bottom: "-40px",
          fontSize: "100px", opacity: 0.05, pointerEvents: "none",
        }}>🐴</div>
        <h1 style={{
          fontSize: "28px", fontWeight: 700, color: "#fff",
          margin: 0, position: "relative", lineHeight: 1.4,
        }}>
          今天想提升什么？
        </h1>
        <p style={{
          fontSize: "13px", color: "rgba(255,255,255,0.6)",
          margin: "8px 0 0", position: "relative",
        }}>
          不教话术，用沟通框架打开表达的无限可能
        </p>
        <div style={{
          display: "flex", gap: "28px", marginTop: "16px", position: "relative",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#fff" }}>{cards.length}</div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>门课程</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#fff" }}>{skillTags.length}</div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>个场景</div>
          </div>
        </div>
      </div>

      {/* Search + Filter area */}
      <div style={{ padding: "20px 20px 16px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          background: "#fff", padding: "10px 16px", borderRadius: "12px",
        }}>
          <span style={{ fontSize: "16px", flexShrink: 0 }}>🔍</span>
          <input
            type="text"
            placeholder="搜索场景..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1, border: "none", outline: "none",
              fontSize: "14px", color: "#333", background: "transparent",
            }}
          />
          {search && (
            <span onClick={() => setSearch("")} style={{
              fontSize: "14px", color: "#ccc", cursor: "pointer", flexShrink: 0,
            }}>✕</span>
          )}
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "14px" }}>
          <button
            onClick={() => setActiveGroup(null)}
            style={{
              padding: "7px 18px", fontSize: "13px", fontWeight: 600,
              color: activeGroup === null ? "#fff" : "#8B3A2A",
              background: activeGroup === null ? "#8B3A2A" : "#FDF0EA",
              border: "none", borderRadius: "20px",
              cursor: "pointer", transition: "all 0.15s",
            }}
          >
            所有场景
          </button>
          {skillTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveGroup(activeGroup === tag ? null : tag)}
              style={{
                padding: "7px 18px", fontSize: "13px", fontWeight: 600,
                color: activeGroup === tag ? "#fff" : "#8B3A2A",
                background: activeGroup === tag ? "#8B3A2A" : "#FDF0EA",
                border: "none", borderRadius: "20px",
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Card Grid — 3 columns, 380×88 cards, gap 16px */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 380px)",
        gap: "16px",
        padding: "0 20px",
      }}>
        {filtered.map((card) => (
          <Link key={card.id} href={`/lessons/${card.slug}`} style={{ textDecoration: "none" }}>
            <div style={{
              width: "380px", height: "88px",
              background: "#fff", borderRadius: "16px",
              cursor: "pointer", display: "flex", flexDirection: "column",
              gap: "6px", padding: "14px 16px 12px",
              boxSizing: "border-box",
              transition: "box-shadow 0.15s",
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
            >
              {/* Row 1: number + emoji + title + star */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#D4A090", flexShrink: 0, width: "20px" }}>
                  {card.num}
                </span>
                <span style={{ fontSize: "20px", flexShrink: 0 }}>{card.emoji}</span>
                <span style={{
                  fontSize: "12px", fontWeight: 600, color: "#333", flex: 1,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {card.title}
                </span>
                <span
                  onClick={(e) => toggleFav(card.id, e)}
                  style={{
                    fontSize: "16px", cursor: "pointer", flexShrink: 0,
                    opacity: favLoading.has(card.id) ? 0.4 : 1,
                    userSelect: "none", lineHeight: 1,
                    filter: favorites.has(card.id) ? "none" : "grayscale(1)",
                  }}
                  title={favorites.has(card.id) ? "取消收藏" : "收藏"}
                >
                  ⭐
                </span>
              </div>
              {/* Row 2: tags */}
              {card.tags.length > 0 && (
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                  {card.tags.slice(0, 2).map((tag) => (
                    <span key={tag} style={{
                      fontSize: "9px", padding: "2px 7px",
                      background: "#FDF0EA", color: "#8B3A2A",
                      borderRadius: "5px", fontWeight: 600,
                    }}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "64px", color: "#ccc", fontSize: "14px" }}>
          没找到相关内容
        </div>
      )}

    </div>
  );
}
