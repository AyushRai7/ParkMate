"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/logo.png";
import logo_name from "../assets/logo_name.png";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  interface FormData {
    name: string;
    email: string;
    password: string;
    phone: string;
  }

  interface ApiResponse {
    success: boolean;
    message?: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/login" : "/api/signup";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data: ApiResponse = await res.json();
      if (res.ok && data.success) {
        toast.success(isLogin ? "Login successful!" : "Account created successfully!");
        setTimeout(() => router.push("/homepage"), 1000);
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
    <div className="flex justify-center items-center min-h-screen bg-gray-50 relative font-sans">
      <ToastContainer position="top-right" />

      <div className="absolute top-4 left-4 flex items-center">
        <Image
          src={logo}
          alt="Parking System Logo"
          width={30}
          height={20}
          style={{ objectFit: "contain", maxHeight: "50px" }}
          priority
        />
        <div className="ml-2">
          <Image
            src={logo_name}
            alt="Logo Name"
            width={120}
            height={15}
            style={{ objectFit: "contain", maxHeight: "20px" }}
            priority
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLogin ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-md rounded-lg p-8 w-80 sm:w-96"
          >
            <h1 className="text-2xl font-bold mb-2 text-center">Login</h1>
            <p className="text-gray-500 mb-6 text-sm text-center">
              Enter your email and password to continue.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  placeholder="m@example.com"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-md rounded-lg p-8 w-80 sm:w-96"
          >
            <h1 className="text-2xl font-bold mb-2 text-center">Sign Up</h1>
            <p className="text-gray-500 mb-6 text-sm text-center">
              Create your account to start booking parking spots.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  placeholder="m@example.com"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

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
  );
}
