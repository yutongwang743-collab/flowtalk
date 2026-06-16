import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

async function main() {
  const lessons = await p.lesson.findMany({
    orderBy: { createdAt: "asc" },
  });

  console.log(`Found ${lessons.length} lessons`);

  // Phase 1: rename all to temp slugs to avoid conflicts
  for (let i = 0; i < lessons.length; i++) {
    await p.lesson.update({
      where: { id: lessons[i].id },
      data: { slug: `__temp__${i}` },
    });
  }
  console.log("Phase 1: all renamed to temp");

  // Phase 2: rename to sequential numbers
  for (let i = 0; i < lessons.length; i++) {
    const newSlug = String(i + 1);
    await p.lesson.update({
      where: { id: lessons[i].id },
      data: { slug: newSlug },
    });
    console.log(`  "${lessons[i].title}" → slug: ${newSlug}`);
  }

  console.log("Done - all slugs unique 1.." + lessons.length);
}

main()
  .catch(console.error)
  .finally(() => p.$disconnect());
