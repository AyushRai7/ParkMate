import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/model/user.js";
import Connection from "@/database/connection";
import { NextResponse } from "next/server";

// Initialize the database connection
Connection();

export const POST = async (NextRequest) => {
    try {
        // Parse the request body
        const body = await NextRequest.json();
        const { username, password } = body;

        // Validate input
        if (!username || !password) {
            return new Response(
                JSON.stringify({ message: "Username and password are required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Check if the user exists
        const userfind = await User.findOne({ username });
        if (!userfind) {
            return new Response(
                JSON.stringify({ message: "User not found" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, userfind.password);
        if (!validPassword) {
            return new Response(
                JSON.stringify({ message: "Invalid password" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Generate JWT token
        const tokenData = {
            username: userfind.username,
            id: userfind._id,
        };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

        // Set the token as an HTTP-only cookie properly
        const response = NextResponse.json({ message: "Login successful", success: true });
        response.cookies.set("userToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure in production
            maxAge: 3600, // 1 hour in seconds
            sameSite: "Strict", // Prevent CSRF attacks
            path: "/", // Make it available across the entire site
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
