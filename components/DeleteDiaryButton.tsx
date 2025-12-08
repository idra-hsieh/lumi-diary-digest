"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { deleteDiaryAction } from "@/actions/diaries";

type Props = {
  diaryId: string;
  deleteDiaryLocally: (diaryId: string) => void;
};

function DeleteDiaryButton({ diaryId, deleteDiaryLocally }: Props) {
  const router = useRouter();
  const diaryIdParam = useSearchParams().get("diaryId") || "";

  const [isPending, startTransition] = useTransition();

  const handleDeleteDiary = () => {
    startTransition(async () => {
      const { errorMessage } = await deleteDiaryAction(diaryId);

      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }

      deleteDiaryLocally(diaryId);

      if (diaryId === diaryIdParam) {
        router.replace("/");
      }

      toast.success("You have successfully deleted the diary.");
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="absolute top-1/2 right-2 size-7 -translate-y-1/2 p-0 opacity-0 group-hover/item:opacity-100 [&_svg]:size-3"
          variant="ghost"
        >
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this diary?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            diary from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteDiary}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-24"
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteDiaryButton;
