"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Car, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const loading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const isOwner = session?.user?.isOwner || false;

  // Extract email prefix (before @)
  const getUsernameFromEmail = (email: string | null | undefined) => {
    if (!email) return null;
    return email.split("@")[0];
  };

  const username = session?.user?.name || getUsernameFromEmail(session?.user?.email);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  if (loading) {
    return (
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="glass-card px-6 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center glow-subtle">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Park<span className="text-primary">Mate</span>
              </span>
            </Link>
            <div className="h-9 w-24 bg-muted/20 animate-pulse rounded" />
          </div>
        </div>
      </motion.nav>
    );
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass-card px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center glow-subtle">
              <Car className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Park<span className="text-primary">Mate</span>
            </span>
          </Link>

          {/* Desktop Center - Owner Dashboard Link */}
          <div className="hidden md:flex items-center">
            <Link
              href="/owner"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
          </div>

          {/* Desktop Auth CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && isOwner && username && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/20">
                <User className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">
                  {username}
                </span>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleSignOut}
            >
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-2 glass-card p-4"
            >
              <div className="flex flex-col gap-4">
                <Link
                  href="/owner"
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium py-2"
                >
                  Dashboard
                </Link>

                <div className="pt-4 border-t border-border flex flex-col gap-2">
                  {isAuthenticated && isOwner && username && (
                    <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/20 mb-2">
                      <User className="w-4 h-4 text-accent" />
                      <span className="text-sm font-medium text-accent">
                        {username}
                      </span>
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    className="w-full justify-center"
                    onClick={() => {
                      setIsOpen(false);
                      handleSignOut();
                    }}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}