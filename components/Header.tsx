import { getUser } from "@/utils/supabase/server";
import HeaderContent from "./Header.client";

async function Header() {
  const user = await getUser();

  return <HeaderContent user={user} />;
}

export default Header;
