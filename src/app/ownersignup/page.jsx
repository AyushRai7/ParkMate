"use client";
import { useState, useEffect } from "react";
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

    const response = await fetch("/api/ownersignup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, username, email, password, phone }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success("Successfully create new account");
      router.push("/owner");
    } else {
      toast.error("Invalid inputs");
      setError(data.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[35%] flex flex-col rounded shadow-md p-6">
        <div className="flex mb-4">
            <div className="flex flex-row mr-2 mb-2">
            <div className="w-1 h-10 bg-blue-900"></div>
            <div className="w-1 h-10 bg-red-600 ml-1 mt-2"></div>
          </div>
          <div>
          <h1 className="text-4xl mb-4">
            Register account 
          </h1>
          </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col pb-2">
            <div className="flex flex-col">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border bg-gray-50 rounded p-2 mb-4"
                placeholder="Full Name"
                required
              />
            </div>
            <div>
            <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border bg-gray-50 rounded p-2 mb-4"
                placeholder="Username"
                required
              />
            </div>
            <div className="flex flex-col">
              <input
                type="email"
                id="email"
                value={email}
                placeholder="Email Address"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border bg-gray-50 rounded p-2 mb-4"
                required
              />
            </div>
            <div className="flex flex-col">
              <input
                type="password"
                id="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border bg-gray-50 rounded p-2 mb-4"
                required
              />
            </div>
            <div className="flex flex-col">
              <input
                type="telephone"
                id="phone"
                value={phone}
                placeholder="Mobile No."
                onChange={(e) => setPhoneNo(e.target.value)}
                className="w-full border bg-gray-50 rounded p-2 mb-4"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-black hover:bg-red-600 text-white p-2 mt-1 rounded-md"
            >
              Sign Up
            </button>
          </form>
          {error && (
            <div className="text-red-500 text-center mt-2">{error}</div>
          )}
          <div className="flex justify-center items-center text-sm mt-3">
            <p>
              Already have an account?{" "}
              <Link href="/ownerlogin" className="text-red-600 font-semibold">
                Login
              </Link>
            </p>
          </div>
        
      </div>
    </div>
  );
}
