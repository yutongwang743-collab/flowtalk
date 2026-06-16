import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

async function main() {
  const lessons = await p.lesson.findMany({
    include: { sections: { orderBy: { order: "asc" } } },
  });

  for (const l of lessons) {
    const tips = l.sections.filter((s) => s.type === "tips");
    if (tips.length > 1) {
      await p.lessonSection.delete({ where: { id: tips[1].id } });
      console.log("Deleted duplicate tips from:", l.title);

      const remaining = await p.lessonSection.findMany({
        where: { lessonId: l.id },
        orderBy: { order: "asc" },
      });
      for (let i = 0; i < remaining.length; i++) {
        await p.lessonSection.update({
          where: { id: remaining[i].id },
          data: { order: i + 1 },
        });
      }
      console.log("  Reordered:", remaining.map((s) => s.type).join(", "));
    }
  }
  console.log("Done");
}

main()
  .catch(console.error)
  .finally(() => p.$disconnect());
