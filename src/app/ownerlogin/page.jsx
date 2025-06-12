"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/ownerlogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success("Successfully logged in! 🚀", { autoClose: 2000 });
      setTimeout(() => {
        router.push("/owner"); 
      }, 2000);
    } else {
      toast.error("Incorrect username or password ❌", { autoClose: 3000 });
      setError(data.message); 
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <ToastContainer position="top-right" />

      <div
        className="w-[35%] flex flex-col shadow-md p-6"
        style={{
          fontFamily: "Raleway, sans-serif",
          color: "rgb(13, 14, 62)",
        }}
      >
        <div className="flex">
          <div className="flex flex-row">
            <div className="w-1 h-10 bg-blue-900"></div>
            <div className="w-1 h-10 bg-red-600 ml-1 mt-2"></div>
          </div>
          <h1 className="pb-3 block text-4xl font-medium ml-2">Admin LogIn</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col pb-2">
          <div className="flex flex-col pb-3">
            <input
              type="text"
              id="username"
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              className="border rounded px-4 py-2 mt-2"
              required
            />
          </div>

          <div className="flex flex-col pb-3">
            <input
              type="password"
              id="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded px-4 py-2 mt-2"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black hover:bg-red-600 text-white p-2 rounded mt-3"
          >
            Log In
          </button>
        </form>

        {error && <div className="text-red-500 text-center mt-2">{error}</div>}

        <div className="flex justify-center items-center text-sm mt-3">
          <p>
            Don't have an account?{" "}
            <Link href="/ownersignup" className="text-red-600 font-semibold">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
