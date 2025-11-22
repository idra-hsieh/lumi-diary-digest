import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "";

  const newestDiaryId = await prisma.diary.findFirst({
    where: {
      authorId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
    },
  });

  return NextResponse.json({
    newestDiaryId: newestDiaryId?.id,
  });
}
