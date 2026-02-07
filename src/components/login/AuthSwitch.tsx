"use client";

import { Mode } from "./types";

interface AuthSwitchProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const AuthSwitch = ({ mode, setMode }: AuthSwitchProps) => {
  return (
    <div className="mt-6 text-center">
      <p className="text-zinc-500 text-sm">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <button
              onClick={() => setMode("signup")}
              className="text-zinc-400 font-medium hover:text-foreground underline-offset-2"
              type="button"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              onClick={() => setMode("login")}
              className="text-zinc-400 font-medium hover:text-foreground underline-offset-2"
              type="button"
            >
              Log in
            </button>
          </>
        )}
      </p>
    </div>
  );
};

export default AuthSwitch;