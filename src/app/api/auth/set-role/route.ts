import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { role } = await request.json();

    if (role !== "USER" && role !== "OWNER") {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, isUser: true, isOwner: true, email: true },
    });

    if (!currentUser) {
      console.error("❌ [set-role] User not found in database");
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const hasExistingRole = currentUser.isUser || currentUser.isOwner;

    if (hasExistingRole) {
      const existingRole = currentUser.isOwner ? "OWNER" : "USER";
      
      if (existingRole === role) {
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

      console.error(`[set-role] Role switching denied: ${existingRole} → ${role}`);
      return NextResponse.json(
        { error: `This email is already registered as ${existingRole}` },
        { status: 403 }
      );
    }
    
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        isUser: role === "USER",  
        isOwner: role === "OWNER",
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