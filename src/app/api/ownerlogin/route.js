import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Owner from "@/model/owner.js";
import Connection from "@/database/connection";
import { serialize } from "cookie";

Connection(); // Connect to DB

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const owner = await Owner.findOne({ email });
    if (!owner) {
      return new Response(
        JSON.stringify({ message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const validPassword = await bcrypt.compare(password, owner.password);
    if (!validPassword) {
      return new Response(
        JSON.stringify({ message: "Invalid password" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create JWT token
    const tokenData = { id: owner._id, email: owner.email };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    const cookie = serialize("ownerToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
      path: "/",
    });

    return new Response(
      JSON.stringify({
        message: "Login successful",
        success: true,
        ownerId: owner._id,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookie,
        },
      }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
