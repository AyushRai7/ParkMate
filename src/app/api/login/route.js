import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/model/user.js";
import Connection from "@/database/connection";
import { NextResponse } from "next/server";

Connection();

export const POST = async (NextRequest) => {
  try {
    const body = await NextRequest.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const userfind = await User.findOne({ email });
    if (!userfind) {
      return new Response(
        JSON.stringify({ message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const validPassword = await bcrypt.compare(password, userfind.password);
    if (!validPassword) {
      return new Response(
        JSON.stringify({ message: "Invalid password" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
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
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      sameSite: "Strict",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
