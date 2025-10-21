import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Owner from "@/model/owner.js";
import Connection from "@/database/connection";
import { serialize } from "cookie";

Connection();

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { name, email, password, phone } = body;

    // Validate required fields
    if (!name || !email || !password || !phone) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingOwner = await Owner.findOne({ email });

    if (existingOwner) {
      return new Response(
        JSON.stringify({ message: "Email already in use" }),
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new owner
    const newOwner = new Owner({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    await newOwner.save();

    // Create JWT token
    const tokenData = {
      id: newOwner._id,
      email: newOwner.email,
    };

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
      JSON.stringify({ message: "Signup successful" }),
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
