import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    // token will exist if user is logged in
    const token = await getToken({ req, secret: process.env.JWT_SECRET });

    const { pathname } = req.nextUrl
    // allow request if following is true...
    // 1. its a request for next-auth session & provider fetching
    // 2. if token exists then allow through
    if (pathname.includes('/api/auth') || token) {
        return NextResponse.next();
    }

    // redirect them to login if they dont have token AND are requesting a protected route
    if (!token && pathname !== "/login") {
        const url = req.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url);
    }
}