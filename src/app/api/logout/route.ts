import Connection from "@/database/connection";
import { NextResponse } from "next/server";

Connection();

export const GET = async () => {
    try {
        const response = NextResponse.json({ message: "Logout successful", success: true });

        response.cookies.set("userToken", "", {
            httpOnly: true,
            expires: new Date(0), 
        });

        return response;
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Invalid request" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};
