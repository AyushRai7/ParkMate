import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Home() {
  const cookieStore = cookies();
  const userToken = cookieStore.get("userToken");

  if (userToken) {
    redirect("/homepage");
  } else {
    redirect("/landingpage");
  }
}
