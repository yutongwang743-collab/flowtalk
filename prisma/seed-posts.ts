import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean existing test data
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: { name: "小趣", email: "hi@qumei.local" },
  });

  await prisma.post.createMany({
    data: [
      {
        userId: user.id,
        title: "老板开会点名批评我的项目，怎么回应？",
        content: "上周全员会议上，老板突然提到我负责的项目进度落后，当着所有人的面说这个项目怎么回事。我当时脸都红了，不知道该怎么回应。当场辩解怕显得找借口，不说话又怕显得默认了。大家有什么建议？",
      },
      {
        userId: user.id,
        title: "和伴侣吵架总是陷入冷战，有什么破局方法？",
        content: "每次和女朋友吵架后就会进入冷战模式，谁也不理谁，最长一次持续了三天。我知道这样很伤感情，但不知道该怎么打破这个循环。主动开口又怕对方还在气头上。",
      },
      {
        userId: user.id,
        title: "学了非暴力沟通后反而被说太正式了",
        content: "认真学了非暴力沟通的四步法，试着对妈妈用了一次观察感受需要请求。结果她说你怎么说话跟写作文似的。有点挫败，怎么才能把这些技巧自然地融入日常对话中？",
      },
      {
        userId: user.id,
        title: "怎么优雅地拒绝同事的帮忙请求？",
        content: "有个同事总是把任务推给我，说你比较擅长这个。我每次都答应然后自己加班到很晚。这次他又来了，我想拒绝但不知道怎么开口，怕影响同事关系。",
      },
    ],
  });

  console.log("Posts seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
