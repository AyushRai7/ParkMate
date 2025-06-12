import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/model/owner.js";
import Connection from "@/database/connection";

Connection(); // Connect to DB

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return new Response(
        JSON.stringify({ message: "Username and password are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const user = await User.findOne({ username });
    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return new Response(
        JSON.stringify({ message: "Invalid password" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Include _id in token so we can use it as ownerId in other APIs
    const tokenData = { id: user._id, username: user.username };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    const cookieOptions = [
      `ownerToken=${token}`,
      "Path=/",
      "HttpOnly",
      "Max-Age=3600",
    ];

    if (process.env.NODE_ENV === "production") {
      cookieOptions.push("Secure", "SameSite=Strict");
    }

    return new Response(
      JSON.stringify({
        message: "Login successful",
        success: true,
        ownerId: user._id,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookieOptions.join("; "),
        },
      }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
