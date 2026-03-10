export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter and one number"
    ),
  role: z.enum(["USER", "OWNER"]).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validatedData = signupSchema.parse(body);
    const requestedRole = validatedData.role || "USER";

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      const alreadyHasRole =
        (requestedRole === "USER" && existingUser.isUser) ||
        (requestedRole === "OWNER" && existingUser.isOwner);

      if (alreadyHasRole) {
        return NextResponse.json(
          {
            success: false,
            message: `This email is already registered as ${requestedRole}`,
          },
          { status: 400 }
        );
      }

      if (!existingUser.password) {
        return NextResponse.json(
          {
            success: false,
            message:
              "This email is registered via Google. Please use Google sign-in.",
          },
          { status: 400 }
        );
      }

      const passwordMatches = await bcrypt.compare(
        validatedData.password,
        existingUser.password
      );

      if (!passwordMatches) {
        return NextResponse.json(
          {
            success: false,
            message:
              "This email already exists. To add a new role, use the same password as your existing account.",
          },
          { status: 400 }
        );
      }

      const updatedUser = await prisma.user.update({
        where: { email: validatedData.email },
        data: {
          isUser: requestedRole === "USER" ? true : existingUser.isUser,
          isOwner: requestedRole === "OWNER" ? true : existingUser.isOwner,
        },
        select: {
          id: true,
          name: true,
          email: true,
          isUser: true,
          isOwner: true,
          createdAt: true,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: `${requestedRole} role added to your existing account`,
          user: updatedUser,
        },
        { status: 200 }
      );
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 12);
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        isUser: requestedRole === "USER",
        isOwner: requestedRole === "OWNER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        isUser: true,
        isOwner: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("User signup error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create user" },
      { status: 500 }
    );
  }
}