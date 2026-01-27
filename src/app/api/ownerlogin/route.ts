import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Owner from "@/model/owner";
import Connection from "@/database/connection";
import { serialize } from "cookie";
import { NextResponse, NextRequest } from "next/server";

Connection(); // Connect to DB

export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required", success: false },
        { status: 400 }
      );
    }

    const owner = await Owner.findOne({ email });
    if (!owner) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    const validPassword = await bcrypt.compare(password, owner.password);
    if (!validPassword) {
      return NextResponse.json(
        { message: "Invalid password", success: false },
        { status: 400 }
      );
    }

    const token = jwt.sign(
      { id: owner._id, email: owner.email },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "1h" }
    );

    const cookie = serialize("ownerToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
      path: "/",
    });

    return NextResponse.json(
      {
        message: "Login successful",
        success: true,
        ownerId: owner._id,
      },
      {
        status: 200,
        headers: { "Set-Cookie": cookie },
      }
    );
  } catch (err) {
    console.error("Login Error:", err);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
};

