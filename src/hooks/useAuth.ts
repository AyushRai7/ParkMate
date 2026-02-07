import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isUser = session?.user?.isUser ?? false;
  const isOwner = session?.user?.isOwner ?? false;

  const signOut = async () => {
    await nextAuthSignOut({ redirect: false });
    router.push("/login");
  };

  return {
    session,
    user: session?.user || null,
    loading: status === "loading",
    isAuthenticated: !!session,
    isUser,
    isOwner,
    signOut,
    refresh: () => {
      router.refresh();
    },
  };
}