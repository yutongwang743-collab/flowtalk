import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const quotes = await prisma.quote.findMany({
    take: 20,
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ data: quotes });
}
