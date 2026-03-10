import { useSession, signOut as nextAuthSignOut, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const isUser = session?.user?.isUser ?? false;
  const isOwner = session?.user?.isOwner ?? false;
  const currentRole = session?.user?.currentRole ?? null;

  const signOut = async () => {
    await nextAuthSignOut({ redirect: false });
    router.push("/login");
  };

  const switchRole = async (
    targetRole: "USER" | "OWNER",
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!session?.user?.email) {
      return { success: false, error: "Not logged in" };
    }

    if (targetRole === "OWNER" && !isOwner) {
      return { success: false, error: "Your account does not have OWNER role" };
    }
    if (targetRole === "USER" && !isUser) {
      return { success: false, error: "Your account does not have USER role" };
    }

    const result = await signIn("credentials", {
      redirect: false,
      email: session.user.email,
      password,
      role: targetRole,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    router.refresh();
    router.push(targetRole === "OWNER" ? "/owner" : "/homepage");

    return { success: true };
  };

  return {
    session,
    user: session?.user || null,
    loading: status === "loading",
    isAuthenticated: !!session,
    isUser,
    isOwner,
    currentRole,
    signOut,
    switchRole,
    refresh: () => router.refresh(),
  };
}