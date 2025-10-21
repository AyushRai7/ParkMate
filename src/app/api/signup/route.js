import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/model/user.js";
import Connection from "@/database/connection";
import { serialize } from "cookie";

Connection();

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password || !phone) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "Email already in use" }),
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    await newUser.save();

    // Generate JWT
    const tokenData = { id: newUser._id, email: newUser.email };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    // Store token in HTTP-only cookie
    const cookie = serialize("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
      path: "/",
    });

    return new Response(
      JSON.stringify({ message: "Signup successful", success: true }),
      {
        status: 201,
        headers: {
          "Set-Cookie": cookie,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
};
