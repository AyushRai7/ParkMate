import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/model/user.js";
import Connection from "@/database/connection";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await Connection();

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const userfind = await User.findOne({ email });
    if (!userfind) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const validPassword = await bcrypt.compare(password, userfind.password);
    if (!validPassword) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 400 }
      );
    }

    const tokenData = { id: userfind._id, email: userfind.email };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    response.cookies.set("userToken", token, {
      httpOnly: true,
      maxAge: 3600,
      sameSite: "Strict",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
