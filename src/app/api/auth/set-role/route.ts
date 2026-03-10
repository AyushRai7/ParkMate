import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role } = await request.json();

    if (role !== "USER" && role !== "OWNER") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, isUser: true, isOwner: true, email: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const alreadyHasRole =
      (role === "USER" && currentUser.isUser) ||
      (role === "OWNER" && currentUser.isOwner);

    if (alreadyHasRole) {
      return NextResponse.json({
        success: true,
        message: "Role already set",
        user: {
          email: currentUser.email,
          isUser: currentUser.isUser,
          isOwner: currentUser.isOwner,
        },
      });
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        isUser: role === "USER" ? true : currentUser.isUser,
        isOwner: role === "OWNER" ? true : currentUser.isOwner,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        email: updatedUser.email,
        isUser: updatedUser.isUser,
        isOwner: updatedUser.isOwner,
      },
    });
  } catch (error) {
    console.error("[set-role] Error:", error);
    return NextResponse.json(
      { error: "Failed to set role" },
      { status: 500 }
    );
  }
}