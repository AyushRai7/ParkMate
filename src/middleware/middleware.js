import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'; // Assuming you are using JWT for authentication

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Extract the token from cookies
  const token = request.cookies.get('token');

  // Decode the token to get the userId (assuming token is a JWT)
  let userId = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace JWT_SECRET with your secret key
      userId = decoded._id; // Assuming the token contains the _id of the user
    } catch (error) {
      // Handle the case where the token is invalid or expired
      console.error('Token verification failed:', error.message);
    }
  }

  // If user is authenticated (i.e., has a valid token)
  if (userId) {
    if (pathname === '/login' || pathname === '/signup') {
      // If the user is already logged in, redirect to homepage
      return NextResponse.redirect(new URL('/homepage', request.url));
    }
  } else {
    // If user is not authenticated and trying to access homepage or protected routes
    if (pathname === '/homepage') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If no issues, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matches: ['/', '/login', '/signup', '/homepage']
};
