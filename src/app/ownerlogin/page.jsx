"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

import logo from "../assets/logo.png";
import logo_name from "../assets/logo_name.png";

export default function OwnerAuth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/ownerlogin" : "/api/ownersignup";

      // Ensure correct body for login/signup
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(isLogin ? "Login successful!" : "Account created successfully!");
        setTimeout(() => router.push("/owner"), 1000);
      } else {
        toast.error(data.message || (isLogin ? "Login failed!" : "Signup failed!"));
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <div className="flex h-screen w-full font-sans bg-gray-50">
      <ToastContainer position="top-right" />

      {/* Left Section - Form */}
      <div className="relative flex w-full md:w-1/2 bg-white shadow-md">
        {/* Logo at top-left */}
        <div className="absolute top-4 left-4 md:top-6 md:left-12 flex items-center">
          <Image
            src={logo}
            alt="Parking System Logo"
            width={35}
            height={20}
            className="object-contain"
            priority
          />
          <Image
            src={logo_name}
            alt="Logo Name"
            width={130}
            height={20}
            className="object-contain ml-2"
            priority
          />
        </div>

        {/* Auth Form */}
        <div className="flex flex-1 justify-center items-center w-full px-6">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4 }}
                className="w-80 sm:w-96"
              >
                <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
                <p className="text-gray-500 mb-6 text-sm">
                  Enter your email and password to continue.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>

                <p className="text-center text-sm mt-5">
                  Don’t have an account?{" "}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="w-80 sm:w-96"
              >
                <h1 className="text-2xl font-bold mb-2">Admin Signup</h1>
                <p className="text-gray-500 mb-6 text-sm">
                  Create an account to start managing your parking spots.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded-md transition"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Sign Up"}
                  </button>
                </form>

                <p className="text-center text-sm mt-5">
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Log in
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Section - Illustration */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-100 via-indigo-100 to-pink-100 justify-center items-center">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">
            Smart Parking Management
          </h2>
          <p className="text-gray-500">
            Simplify your parking experience with automation and control.
          </p>
        </div>
      </div>
    </div>
  );
}
