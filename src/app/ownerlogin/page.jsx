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
    <div className="flex justify-center items-center h-screen bg-gray-50 px-4">
      {/* Toast Notification Container */}
      <ToastContainer position="top-right" />

      <div
        className="w-[90%] sm:w-[70%] md:w-[50%] lg:w-[35%] flex flex-col shadow-md p-6 rounded-md bg-white"
        style={{
          fontFamily: "Raleway, sans-serif",
          color: "rgb(13, 14, 62)",
        }}
      >
        {/* Heading */}
        <div className="flex items-center mb-4">
          <div className="flex flex-row">
            <div className="w-1 h-8 sm:h-10 bg-blue-900"></div>
            <div className="w-1 h-8 sm:h-10 bg-red-600 ml-1 mt-2"></div>
          </div>
          <h1 className="ml-2 text-2xl sm:text-3xl md:text-4xl font-medium">
            Admin LogIn
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col pb-2">
          <div className="flex flex-col pb-3">
            <input
              type="text"
              id="username"
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              className="border rounded px-3 sm:px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="border rounded px-3 sm:px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black hover:bg-red-600 text-white p-2 rounded mt-3 transition"
          >
            Log In
          </button>
        </form>

        {/* Error */}
        {error && <div className="text-red-500 text-center mt-2">{error}</div>}

        {/* Signup Redirect */}
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
