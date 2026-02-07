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
      // Prevent multiple executions
      if (hasProcessed) {
        console.log("⏭️ [Callback] Already processed, skipping");
        return;
      }

      if (status === "loading") {
        console.log("⏳ [Callback] Session loading...");
        return;
      }

      if (status === "unauthenticated") {
        console.log("🚫 [Callback] Not authenticated, redirecting to login");
        router.push("/login");
        return;
      }

      if (session?.user) {
        console.log("📋 [Callback] Session found:", {
          email: session.user.email,
          isUser: session.user.isUser,
          isOwner: session.user.isOwner,
        });

        const pendingRole = localStorage.getItem("oauth-pending-role");
        console.log("🎯 [Callback] Pending role:", pendingRole);

        // Check if user has NO role assigned yet (new user)
        const hasNoRole = !session.user.isUser && !session.user.isOwner;

        if (hasNoRole && pendingRole) {
          console.log(`🆕 [Callback] New user detected, assigning role: ${pendingRole}`);
          
          setHasProcessed(true); // Mark as processing
          
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

            console.log("✅ [Callback] Role set successfully:", data.user);
            
            // Clear pending role
            localStorage.removeItem("oauth-pending-role");
            
            // FORCE session refresh by calling the refresh endpoint
            console.log("🔄 [Callback] Refreshing session...");
            await fetch("/api/auth/refresh-session");
            
            // Wait for session to propagate
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Use router.push instead of window.location.href
            const targetPath = pendingRole === "OWNER" ? "/owner" : "/homepage";
            console.log(`🔀 [Callback] Redirecting to: ${targetPath}`);
            
            router.push(targetPath);
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

        // User already has a role assigned
        if (!hasNoRole) {
          const existingRole = session.user.isOwner ? "OWNER" : "USER";
          
          console.log(`👤 [Callback] Existing user with role: ${existingRole}`);

          // If they have a pending role that doesn't match, show error
          if (pendingRole && pendingRole !== existingRole) {
            console.log(`⚠️ [Callback] Role mismatch: pending ${pendingRole} vs existing ${existingRole}`);
            toast.error(`This email is registered as ${existingRole}. Please use the correct login option.`);
            await signOut({ redirect: false });
            localStorage.removeItem("oauth-pending-role");
            setHasProcessed(false);
            router.push(`/login?role=${pendingRole}&error=wrong-role`);
            return;
          }

          // Clear any pending role
          localStorage.removeItem("oauth-pending-role");
          
          // Mark as processed before redirect
          setHasProcessed(true);
          
          // Redirect to correct page based on their role
          const targetPath = session.user.isOwner ? "/owner" : "/homepage";
          console.log(`🔀 [Callback] Redirecting existing user to: ${targetPath}`);
          router.push(targetPath);
          return;
        }

        // No pending role and no existing role - error state
        console.error("⚠️ [Callback] No role found and no pending role");
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

  
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100">
//       <div className="text-center">
//         <div className="relative">
//           <div className="h-16 w-16 mx-auto rounded-full border-4 border-zinc-200 border-t-zinc-900 animate-spin" />
//           <div className="absolute inset-0 h-16 w-16 mx-auto rounded-full border-4 border-transparent border-t-zinc-400 animate-spin" 
//                style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
//         </div>
//         <p className="mt-6 text-lg font-medium text-zinc-900">Completing sign in...</p>
//         <p className="mt-2 text-sm text-zinc-500">Setting up your account</p>
//       </div>
//     </div>
//   );
// }