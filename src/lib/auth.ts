import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account", 
        },
      },
    }),

    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const role = credentials.role?.toUpperCase() || "USER";
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        if (role === "OWNER" && !user.isOwner) {
          throw new Error("This email is registered as USER, not OWNER");
        }

        if (role === "USER" && !user.isUser) {
          throw new Error("This email is registered as OWNER, not USER");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          isUser: user.isUser,
          isOwner: user.isOwner,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            select: { id: true, isUser: true, isOwner: true, email: true },
          });

          if (existingUser) {            
            return true;
          }
          return true;
          
        } catch (error) {
          console.error("Error checking user:", error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email || undefined;
        token.name = user.name || undefined;
        token.picture = user.image || undefined;
      }

      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: { 
            id: true, 
            email: true, 
            isUser: true, 
            isOwner: true, 
            name: true, 
            image: true 
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.email = dbUser.email || undefined;
          token.name = dbUser.name || undefined;
          token.picture = dbUser.image || undefined;
          token.isUser = dbUser.isUser;
          token.isOwner = dbUser.isOwner;
        } else {
          console.error("User not found in DB");
          return {
            id: token.id,
            email: token.email,
            isUser: false,
            isOwner: false,
          };
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.email = token.email || "";
        session.user.name = token.name || null;
        session.user.image = token.picture || null;
        session.user.isUser = token.isUser as boolean;
        session.user.isOwner = token.isOwner as boolean;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};