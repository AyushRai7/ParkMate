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
      if (hasProcessed) return;
      if (status === "loading") return;

      if (status === "unauthenticated") {
        router.push("/login");
        return;
      }

      if (session?.user) {
        const pendingRole = localStorage.getItem("oauth-pending-role") as
          | "USER"
          | "OWNER"
          | null;

        // No pending role means user landed here without going through
        // the Google button — just redirect based on existing role
        if (!pendingRole) {
          setHasProcessed(true);
          router.push(session.user.isOwner ? "/owner" : "/homepage");
          return;
        }

        // Always call set-role for the pending role.
        // - New user: assigns the role for the first time
        // - Returning user with same role: set-role is idempotent, no-op
        // - Returning user with wrong role (different email registered as
        //   different role): set-role returns 403, we handle it below
        setHasProcessed(true);

        try {
          const response = await fetch("/api/auth/set-role", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: pendingRole }),
          });

          const data = await response.json();

          if (!response.ok) {
            // 403 means this email is already registered as a different role
            throw new Error(data.error || "Failed to set role");
          }

          localStorage.removeItem("oauth-pending-role");

          // Small delay to allow JWT to pick up the DB change on next refresh
          await new Promise((resolve) => setTimeout(resolve, 1000));

          window.location.href = pendingRole === "OWNER" ? "/owner" : "/homepage";
        } catch (error: any) {
          console.error("[Callback] Failed to set role:", error);
          toast.error(error.message || "Failed to set role");
          await signOut({ redirect: false });
          localStorage.removeItem("oauth-pending-role");
          setHasProcessed(false);
          router.push("/login");
        }
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