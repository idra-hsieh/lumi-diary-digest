"use client";

import { User } from "@supabase/supabase-js";

type Props = {
  user: User | null;
};

function NewDiaryButton({ user }: Props) {
  console.log(user?.email);
  return <div>NewDiaryButton</div>;
}

export default NewDiaryButton;
