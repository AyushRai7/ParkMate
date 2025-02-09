import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@/model/user"; // Import your User model
import Connection from "@/database/connection"; // Import your database connection

// Establish database connection
Connection();

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Check if the user already exists in the database
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          // Create a new user if not found
          const newUser = new User({
            name: user.name,
            email: user.email,
            username: user.email.split("@")[0], // Generate a username from the email
            password: null, // Google users won't have a password
            phone: null, // Optional, since Google Auth does not provide phone
          });

          await newUser.save();
        }
        return true; // Allow sign-in
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false; // Deny sign-in
      }
    },
    async session({ session, token, user }) {
      // Attach the user ID from the database to the session
      const dbUser = await User.findOne({ email: session.user.email });
      session.user.id = dbUser._id;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.JWT_SECRET_KEY,
});

export { handler as GET, handler as POST };
