import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const lesson = await prisma.lesson.findUnique({
    where: { slug: params.slug },
    include: {
      sections: { orderBy: { order: "asc" } },
    },
  });

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  return NextResponse.json({ data: lesson });
}
