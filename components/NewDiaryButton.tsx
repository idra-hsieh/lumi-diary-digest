"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createDiaryAction } from "@/actions/diaries";
import { DIARY_CREATED_EVENT } from "@/lib/constants";
import useDiary from "@/hooks/useDiary";

type DiaryCreatedEventPayload = {
  id: string;
  title: string;
  text: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  user: User | null;
};

function NewDiaryButton({ user }: Props) {
  const router = useRouter();
  const { setDiaryText, setDiaryTitle } = useDiary();

  const [loading, setLoading] = useState(false);

  const handleClickNewDiaryButton = async () => {
    if (!user) {
      router.push("/login");
    } else {
      setLoading(true);
      const uuid = uuidv4();
      try {
        const { errorMessage, diary } = await createDiaryAction(uuid);
        if (errorMessage || !diary) {
          toast.error(errorMessage || "Unable to create diary.");
          return;
        }

        const detail: DiaryCreatedEventPayload = {
          id: diary.id,
          title: diary.title,
          text: diary.text,
          authorId: diary.authorId,
          createdAt: new Date(diary.createdAt).toISOString(),
          updatedAt: new Date(diary.updatedAt).toISOString(),
        };

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent(DIARY_CREATED_EVENT, { detail }),
          );
        }

        setDiaryText("");
        setDiaryTitle("");

        router.push(`/?diaryId=${diary.id}`);
        router.refresh();
        toast.success("You have created a new diary.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Button
      onClick={handleClickNewDiaryButton}
      variant="secondary"
      className="w-24"
      disabled={loading}
    >
      {loading ? <Loader2 className="animate-spin" /> : "New Diary"}
    </Button>
  );
}

export default NewDiaryButton;
