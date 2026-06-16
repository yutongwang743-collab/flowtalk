import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const lessons = await prisma.lesson.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      category: true,
      coverImage: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ data: lessons });
}
