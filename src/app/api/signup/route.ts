import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/model/user";
import Connection from "@/database/connection";
import { serialize } from "cookie";
import { NextResponse, NextRequest } from "next/server";

Connection();

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
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

    return NextResponse.json(
      { message: "Signup successful", success: true },
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
    return NextResponse.json(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
};
