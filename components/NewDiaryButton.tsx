"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createDiaryAction } from "@/actions/diaries";

type Props = {
  user: User | null;
};

function NewDiaryButton({ user }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleClickNewDiaryButton = async () => {
    if (!user) {
      router.push("/login");
    } else {
      setLoading(true);
      const uuid = uuidv4();
      await createDiaryAction(uuid);
      router.push(`/?diaryId=${uuid}`);

      toast.success("You have created a new diary.");
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
