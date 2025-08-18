"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

export default function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhoneNo] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, username, email, password, phone }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success("Successfully created an account! 🚀", { autoClose: 2000 });
      setTimeout(() => {
        router.push("/homepage");
      }, 2000);
    } else {
      toast.error("Signup failed ❌", { autoClose: 3000 });
      setError(data.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 px-4">
      <div
        className="w-[90%] sm:w-[70%] md:w-[50%] lg:w-[35%] flex flex-col rounded shadow-md p-6 bg-white"
        style={{
          fontFamily: "Raleway, sans-serif",
          color: "rgb(13, 14, 62)",
        }}
      >
        {/* Title */}
        <div className="flex mb-6 items-center">
          <div className="flex flex-row mr-2">
            <div className="w-1 h-8 sm:h-10 bg-blue-900"></div>
            <div className="w-1 h-8 sm:h-10 bg-red-600 ml-1 mt-2"></div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium">
            Create Account
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border bg-gray-50 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Full Name"
            required
          />

          <input
            type="text"
            id="username"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border bg-gray-50 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="email"
            id="email"
            value={email}
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border bg-gray-50 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            id="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border bg-gray-50 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="tel"
            id="phone"
            value={phone}
            placeholder="Mobile No."
            onChange={(e) => setPhoneNo(e.target.value)}
            className="w-full border bg-gray-50 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="bg-black hover:bg-red-600 text-white p-2 mt-1 rounded-md transition"
          >
            Sign Up
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="text-red-500 text-center mt-2">{error}</div>
        )}

        {/* Login Redirect */}
        <div className="flex justify-center items-center text-sm mt-3">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="text-red-600 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
