import { prisma } from "@/lib/prisma";
import { categories } from "@/lib/utils";
import { LessonsClient } from "./LessonsClient";

export const dynamic = "force-dynamic";

export default async function LessonsPage() {
  const lessons = await prisma.lesson.findMany({
    orderBy: { createdAt: "asc" },
  });

  // Sort by numeric slug first, then by creation date
  const sorted = [...lessons].sort((a, b) => {
    const aNum = /^\d+$/.test(a.slug) ? parseInt(a.slug) : 9999;
    const bNum = /^\d+$/.test(b.slug) ? parseInt(b.slug) : 9999;
    if (aNum !== bNum) return aNum - bNum;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const cards = sorted.map((l, i) => {
    const cat = categories[l.category] || { label: l.category, icon: "📖" };
    const tagList = l.tags ? l.tags.split(",").filter(Boolean) : [];
    const num = /^\d+$/.test(l.slug) ? parseInt(l.slug) : i + 1;
    return {
      id: l.id,
      num,
      emoji: cat.icon,
      title: l.title,
      tags: tagList.length > 0 ? tagList : [l.category],
      slug: l.slug,
    };
  });

  return <LessonsClient cards={cards} />;
}
