import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/model/user.js";
import Connection from "@/database/connection";
import { serialize } from "cookie";

Connection();

export const POST = async (req) => {
    try {
        const body = await req.json();
        const { username, password } = body;

        if (!username || !password) {
            return new Response(
                JSON.stringify({ message: "Username and password are required" }),
                { status: 400 }
            );
        }

        const userfind = await User.findOne({ username });
        if (!userfind) {
            return new Response(
                JSON.stringify({ message: "User not found" }),
                { status: 404 }
            );
        }

        const validPassword = await bcrypt.compare(password, userfind.password);
        if (!validPassword) {
            return new Response(
                JSON.stringify({ message: "Invalid password" }),
                { status: 400 }
            );
        }

        const tokenData = {
            username: userfind.username,
            id: userfind._id,
        };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

        // **Set cookie manually using headers**
        const cookie = serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600, // 1 hour
            path: "/",
        });

        return new Response(
            JSON.stringify({ message: "Login successful" }),
            {
                status: 200,
                headers: {
                    "Set-Cookie": cookie,
                    "Content-Type": "application/json",
                },
            }
        );

    } catch (error) {
        console.error("Login Error:", error);
        return new Response(
            JSON.stringify({ message: "Internal Server Error" }),
            { status: 500 }
        );
    }
};
