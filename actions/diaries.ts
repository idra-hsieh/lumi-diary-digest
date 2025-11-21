"use server";

import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";
import { getUser } from "@/utils/supabase/server";

export const createDiaryAction = async (diaryId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must log in to create a diary.");
    const diary = await prisma.diary.create({
      data: {
        id: diaryId,
        authorId: user.id,
        title: "",
        text: "",
      },
    });

    return { errorMessage: null, diary };
  } catch (error) {
    const { errorMessage } = handleError(error);
    return { errorMessage, diary: null };
  }
};

type DiaryUpdateData = Partial<{
  text: string;
  title: string;
}>;

export const updateDiaryAction = async (
  diaryId: string,
  data: DiaryUpdateData,
) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must log in to update a diary.");
    if (!data || Object.keys(data).length === 0) {
      return { errorMessage: null };
    }

    await prisma.diary.update({
      where: { id: diaryId, authorId: user.id },
      data,
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const deleteDiaryAction = async (diaryId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must log in to delete a diary.");

    await prisma.diary.delete({
      where: { id: diaryId, authorId: user.id },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};
