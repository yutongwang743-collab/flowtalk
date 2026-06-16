import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - List all lessons
export async function GET() {
  const lessons = await prisma.lesson.findMany({
    orderBy: { createdAt: "asc" },
    include: { sections: { orderBy: { order: "asc" } } },
  });

  // Sort by numeric slug descending (largest first), text slugs at bottom
  lessons.sort((a, b) => {
    const aNum = /^\d+$/.test(a.slug) ? parseInt(a.slug) : -1;
    const bNum = /^\d+$/.test(b.slug) ? parseInt(b.slug) : -1;
    return bNum - aNum;
  });

  return NextResponse.json(lessons);
}

// POST - Create lesson
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, slug, description, category, tags, sections } = body;

    if (!title || !slug || !category) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
    }
    if (!sections || sections.length === 0) {
      return NextResponse.json({ error: "至少需要一个章节" }, { status: 400 });
    }

    const existing = await prisma.lesson.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: `Slug "${slug}" 已存在` }, { status: 409 });
    }

    const lesson = await prisma.lesson.create({
      data: {
        title, slug,
        description: description || "",
        category,
        tags: Array.isArray(tags) ? tags.join(",") : (tags || ""),
        sections: {
          create: sections.map((s: any, i: number) => ({
            type: s.type, title: s.title, content: s.content, order: i + 1,
          })),
        },
      },
      include: { sections: true },
    });
    return NextResponse.json({ success: true, lesson });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT - Update lesson
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, slug, description, category, tags, sections } = body;

    if (!id || !title || !slug) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
    }

    // Check slug uniqueness (exclude self)
    const existing = await prisma.lesson.findUnique({ where: { slug } });
    if (existing && existing.id !== id) {
      return NextResponse.json({ error: `Slug "${slug}" 已被其他课程使用` }, { status: 409 });
    }

    // Delete old sections and recreate
    await prisma.lessonSection.deleteMany({ where: { lessonId: id } });

    const lesson = await prisma.lesson.update({
      where: { id },
      data: {
        title, slug,
        description: description || "",
        category,
        tags: Array.isArray(tags) ? tags.join(",") : (tags || ""),
        sections: {
          create: (sections || []).map((s: any, i: number) => ({
            type: s.type, title: s.title, content: s.content, order: i + 1,
          })),
        },
      },
      include: { sections: true },
    });
    return NextResponse.json({ success: true, lesson });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE - Delete lesson
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "缺少 id" }, { status: 400 });

    await prisma.lessonSection.deleteMany({ where: { lessonId: id } });
    await prisma.lesson.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
