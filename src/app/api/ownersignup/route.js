import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Owner from "@/model/owner.js";
import Connection from "@/database/connection";
import { serialize } from "cookie";

Connection();

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { name, username, email, password, phone } = body;

    if (!name || !username || !email || !password || !phone) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 }
      );
    }

    const existingOwner = await Owner.findOne({
      $or: [{ username }, { email }],
    });

    if (existingOwner) {
      return new Response(
        JSON.stringify({ message: "Username or Email already in use" }),
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newOwner = new Owner({
      name,
      username,
      email,
      password: hashedPassword,
      phone,
    });

    await newOwner.save();

    const tokenData = {
      username: newOwner.username,
      id: newOwner._id,
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
