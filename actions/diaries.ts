"use server";

import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";
import { getUser } from "@/utils/supabase/server";

export const createDiaryAction = async (diaryId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must log in to create a diary.");

    await prisma.diary.create({
      data: {
        id: diaryId,
        authorId: user.id,
        title: new Date().toISOString().slice(0, 10),
        text: "",
      },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const updateDiaryAction = async (diaryId: string, text: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must log in to update a diary.");

    await prisma.diary.update({
      where: { id: diaryId },
      data: { text },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};
