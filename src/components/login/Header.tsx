"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Role, Mode } from "./types";

interface HeaderProps {
  role: Role;
  mode: Mode;
}

const roleConfig = {
  USER: {
    color: "text-emerald-600",
    subtitle: "Book parking spots easily",
  },
  OWNER: {
    color: "text-blue-600",
    subtitle: "Manage your parking venues",
  },
};

const Header = ({ role, mode }: HeaderProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${role}-${mode}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
          {mode === "login" ? "Login as " : "Sign Up as "}
          <span className={roleConfig[role].color}>
            {role === "USER" ? "User" : "Owner"}
          </span>
        </h1>
        <p className="text-muted-foreground text-sm">
          {roleConfig[role].subtitle}
        </p>
      </motion.div>
    </AnimatePresence>
  );
};

export default Header;