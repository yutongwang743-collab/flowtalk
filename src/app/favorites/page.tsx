"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { C } from "@/lib/colors";

interface Fav {
  id: string;
  lessonId: string;
  title: string;
  slug: string;
  createdAt: string;
}

export default function FavoritesPage() {
  const [favs, setFavs] = useState<Fav[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/favorites")
      .then((r) => r.json())
      .then((data) => { setFavs(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const removeFav = async (lessonId: string) => {
    await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId }),
    });
    setFavs((prev) => prev.filter((f) => f.lessonId !== lessonId));
  };

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 16px" }}>

      <div style={{ padding: "20px 0 12px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px" }}>
          ⭐ 我的收藏
        </h1>
        <p style={{ fontSize: "13px", color: "#999", margin: 0 }}>
          {loading ? "加载中..." : `${favs.length} 个收藏`}
        </p>
      </div>

      {favs.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {favs.map((f, i) => (
            <div key={f.id} style={{
              background: "#fff", padding: "14px 16px", borderRadius: "8px",
              display: "flex", alignItems: "center", gap: "12px",
            }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#D4A090", width: "24px", flexShrink: 0 }}>
                {i + 1}
              </span>
              <Link href={`/lessons/${f.slug}`} style={{ flex: 1, minWidth: 0, textDecoration: "none" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {f.title}
                </div>
              </Link>
              <button onClick={() => removeFav(f.lessonId)} style={{
                padding: "4px 10px", fontSize: "11px", fontWeight: 600,
                color: "#999", background: "#f5f5f5", border: "none",
                borderRadius: "6px", cursor: "pointer",
              }}>
                取消
              </button>
            </div>
          ))}
        </div>
      ) : loading ? (
        <div style={{ textAlign: "center", padding: "48px", color: "#ccc" }}>加载中...</div>
      ) : (
        <div style={{ textAlign: "center", padding: "64px", background: "#fff", borderRadius: "10px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>⭐</div>
          <p style={{ fontSize: "14px", color: "#999", marginBottom: "16px" }}>还没有收藏，去对话课点星星吧</p>
          <Link href="/lessons" style={{
            display: "inline-block", fontSize: "14px", padding: "8px 20px",
            background: C.dark, color: "#fff", borderRadius: "20px",
            textDecoration: "none", fontWeight: 600,
          }}>去发现课程 →</Link>
        </div>
      )}

    </div>
  );
}
