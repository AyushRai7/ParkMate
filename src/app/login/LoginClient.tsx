"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

import Navbar from "@/components/login/Navbar";
import Header from "@/components/login/Header";
import Google from "@/components/login/Google";
import Form from "@/components/login/Form";
import AuthSwitch from "@/components/login/AuthSwitch";
import { Role, Mode } from "@/components/login/types";

export default function LoginClient() {
  const searchParams = useSearchParams();

  const roleFromURL = searchParams.get("role") as Role | null;
  const modeFromURL = searchParams.get("mode") as Mode | null;

  const [role, setRole] = useState<Role>("USER");
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (roleFromURL) setRole(roleFromURL);
    if (modeFromURL) setMode(modeFromURL);
    setLoading(false);
  }, [roleFromURL, modeFromURL]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient relative overflow-hidden flex flex-col">
      {/* Background blobs */}
      <div className="pointer-events-none absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-primary/20 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute bottom-[-30%] right-[-15%] w-[700px] h-[700px] bg-accent/20 rounded-full blur-[160px]" />

      <Navbar role={role} setRole={setRole} />

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="glass-card glow-subtle bg-card/80 p-8 md:p-10">
            <Header role={role} mode={mode} />
            <Google role={role} />

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-xs text-muted-foreground">OR</span>
              </div>
            </div>

            <Form role={role} mode={mode} />
            <AuthSwitch mode={mode} setMode={setMode} />
          </div>

          <p className="text-center text-muted-foreground text-xs mt-6">
            By continuing, you agree to our{" "}
            <a href="/terms" className="underline hover:text-foreground">
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
