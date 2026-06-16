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
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 16px" }}>

      {/* Search bar */}
      <div style={{ padding: "16px 0 0" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          background: "#fff", padding: "10px 16px", borderRadius: "10px",
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
            <span onClick={() => setSearch("")} style={{ fontSize: "14px", color: "#ccc", cursor: "pointer", flexShrink: 0 }}>✕</span>
          )}
        </div>
      </div>

      {/* Title */}
      <div style={{ padding: "20px 0 16px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
          今天想提升什么？
        </h1>
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
        <button
          onClick={() => setActiveGroup(null)}
          style={{
            padding: "7px 16px", fontSize: "13px", fontWeight: 600,
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
              padding: "7px 16px", fontSize: "13px", fontWeight: 600,
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

      {/* Card grid — 3 columns, flat rectangular, 2-row layout */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "8px",
      }}>
        {filtered.map((card) => (
          <Link key={card.id} href={`/lessons/${card.slug}`} style={{ textDecoration: "none" }}>
            <div style={{
              background: "#fff", cursor: "pointer",
              display: "flex", flexDirection: "column", gap: "5px",
              padding: "10px 10px 8px",
            }}>
              {/* Row 1: number + emoji + title + star */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#D4A090", flexShrink: 0 }}>
                  {card.num}
                </span>
                <span style={{ fontSize: "18px", flexShrink: 0 }}>{card.emoji}</span>
                <span style={{
                  fontSize: "10px", fontWeight: 600, color: "#333", flex: 1,
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
                      fontSize: "8px", padding: "1px 5px",
                      background: "#FDF0EA", color: "#8B3A2A",
                      borderRadius: "4px", fontWeight: 600,
                    }}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px", color: "#ccc", fontSize: "14px" }}>
          没找到相关内容 🐴
        </div>
      )}

    </div>
  );
}
