"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";

export default function AuthCallback() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      if (hasProcessed) {
        return;
      }

      if (status === "loading") {
        return;
      }

      if (status === "unauthenticated") {
        router.push("/login");
        return;
      }

      if (session?.user) {
        const pendingRole = localStorage.getItem("oauth-pending-role");

        const hasNoRole = !session.user.isUser && !session.user.isOwner;

        if (hasNoRole && pendingRole) {          
          setHasProcessed(true);
          
          try {
            const response = await fetch("/api/auth/set-role", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ role: pendingRole }),
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.error || "Failed to set role");
            }
            
            localStorage.removeItem("oauth-pending-role");
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const targetPath = pendingRole === "OWNER" ? "/owner" : "/homepage";
            
            window.location.href = targetPath;
            return;
          } catch (error: any) {
            console.error("❌ [Callback] Failed to set role:", error);
            toast.error(error.message || "Failed to set role");
            await signOut({ redirect: false });
            localStorage.removeItem("oauth-pending-role");
            setHasProcessed(false);
            router.push("/login");
            return;
          }
        }

        if (!hasNoRole) {
          const existingRole = session.user.isOwner ? "OWNER" : "USER";
          
          if (pendingRole && pendingRole !== existingRole) {
            toast.error(`This email is registered as ${existingRole}. Please use the correct login option.`);
            await signOut({ redirect: false });
            localStorage.removeItem("oauth-pending-role");
            setHasProcessed(false);
            router.push(`/login?role=${pendingRole}&error=wrong-role`);
            return;
          }

          localStorage.removeItem("oauth-pending-role");
          setHasProcessed(true);
          
          const targetPath = session.user.isOwner ? "/owner" : "/homepage";
          router.push(targetPath);
          return;
        }

        console.error("No role found and no pending role");
        toast.error("Role assignment required. Please try again.");
        await signOut({ redirect: false });
        setHasProcessed(false);
        router.push("/login");
      }
    };

    handleCallback();
  }, [session, status, hasProcessed, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100">
      <div className="text-center">
        <div className="relative">
          <div className="h-16 w-16 mx-auto rounded-full border-4 border-zinc-200 border-t-zinc-900 animate-spin" />
        </div>
        <p className="mt-6 text-lg font-medium text-zinc-900">Completing sign in...</p>
        <p className="mt-2 text-sm text-zinc-500">Setting up your account</p>
      </div>
    </div>
  );
}