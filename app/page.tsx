import AskAIButton from "@/components/AskAIButton";
import DiaryTextInput from "@/components/DiaryTextInput";
import DiaryTitleInput from "@/components/DiaryTitleInput";
import NewDiaryButton from "@/components/NewDiaryButton";
import { prisma } from "@/db/prisma";
import { getUser } from "@/utils/supabase/server";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function Homepage({ searchParams }: Props) {
  const diaryIdParam = (await searchParams).diaryId;
  const user = await getUser();

  const diaryId = Array.isArray(diaryIdParam)
    ? diaryIdParam![0]
    : diaryIdParam || "";

  const diary = await prisma.diary.findUnique({
    where: { id: diaryId, authorId: user?.id },
  });

  const derivedDiaryTitle = diary?.title?.trim() ?? "";

  return (
    <div className="flex h-full flex-col items-center gap-4">
      <div className="flex w-full max-w-4xl justify-end gap-2">
        <AskAIButton user={user} />
        <NewDiaryButton user={user} />
      </div>

      <DiaryTitleInput
        diaryId={diaryId}
        startingDiaryTitle={derivedDiaryTitle}
      />
      <DiaryTextInput diaryId={diaryId} startingDiaryText={diary?.text || ""} />
    </div>
  );
}

export default Homepage;
