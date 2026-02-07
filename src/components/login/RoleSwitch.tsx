"use client";

import { User, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Role } from "./types";

interface RoleSwitchProps {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleSwitch = ({ role, setRole }: RoleSwitchProps) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-card/70 backdrop-blur-md rounded-xl border border-border">
      <button
        onClick={() => setRole("USER")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
          role === "USER"
            ? "bg-zinc-900 text-white shadow-md"
            : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
        )}
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">User</span>
      </button>
      <button
        onClick={() => setRole("OWNER")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
          role === "OWNER"
            ? "bg-zinc-900 text-white shadow-md"
            : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
        )}
      >
        <Building2 className="w-4 h-4" />
        <span className="hidden sm:inline">Owner</span>
      </button>
    </div>
  );
};

export default RoleSwitch;