"use client";

import Link from "next/link";
import { Car } from "lucide-react";
import RoleSwitch from "./RoleSwitch";
import { Role } from "./types";

interface NavbarProps {
  role: Role;
  setRole: (role: Role) => void;
}

const Navbar = ({ role, setRole }: NavbarProps) => {
  return (
    <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-10">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center glow-subtle">
          <Car className="w-5 h-5 text-primary" />
        </div>
        <span className="text-xl font-bold text-foreground">
          Park<span className="text-primary">Mate</span>
        </span>
      </Link>

      {/* Role Switch */}
      <RoleSwitch role={role} setRole={setRole} />
    </nav>
  );
};

export default Navbar;