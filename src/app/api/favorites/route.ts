import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ANON_USER = "anonymous-user-001";

// GET - list favorites with lesson details
export async function GET() {
  const favs = await prisma.favorite.findMany({
    where: { userId: ANON_USER, targetType: "lesson" },
    orderBy: { createdAt: "desc" },
  });

  const lessonIds = favs.map((f) => f.targetId);
  const lessons = lessonIds.length > 0
    ? await prisma.lesson.findMany({ where: { id: { in: lessonIds } } })
    : [];

  const result = favs.map((f) => {
    const lesson = lessons.find((l) => l.id === f.targetId);
    return { id: f.id, lessonId: f.targetId, title: lesson?.title || "(已删除)", slug: lesson?.slug || "", createdAt: f.createdAt };
  });

  return NextResponse.json(result);
}

// POST - toggle favorite (body: { lessonId: string })
export async function POST(req: NextRequest) {
  const { lessonId } = await req.json();
  if (!lessonId) return NextResponse.json({ error: "缺少 lessonId" }, { status: 400 });

  const existing = await prisma.favorite.findUnique({
    where: { userId_targetType_targetId: { userId: ANON_USER, targetType: "lesson", targetId: lessonId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ favorited: false });
  }

  await prisma.favorite.create({
    data: { userId: ANON_USER, targetType: "lesson", targetId: lessonId },
  });
  return NextResponse.json({ favorited: true });
}
