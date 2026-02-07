import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

async function getAuthToken(req: NextRequest) {
  return await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
}

export async function requireUser(req: NextRequest) {
  const token = await getAuthToken(req);

  if (!token) {
    return {
      response: NextResponse.json(
        { error: "Unauthorized - Login required" },
        { status: 401 }
      ),
      user: null,
    };
  }

  return {
    response: null,
    user: {
      id: token.id as string,
      email: token.email as string,
      isUser: token.isUser as boolean,
      isOwner: token.isOwner as boolean,
      currentRole: token.currentRole as string,
    },
  };
}

export async function requireOwner(req: NextRequest) {
  const token = await getAuthToken(req);

  if (!token) {
    return {
      response: NextResponse.json(
        { error: "Unauthorized - Login required" },
        { status: 401 }
      ),
      owner: null,
    };
  }

  if (!token.isOwner) {
    return {
      response: NextResponse.json(
        { error: "Forbidden - Owner access required" },
        { status: 403 }
      ),
      owner: null,
    };
  }

  return {
    response: null,
    owner: {
      id: token.id as string,
      email: token.email as string,
      currentRole: token.currentRole as string,
    },
  };
}
