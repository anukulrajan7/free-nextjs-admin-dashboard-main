// src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token'); // Access the token from cookies

    // If the token is not present, redirect to the sign-in page
    if (!token) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    // If the token is present, allow the request to continue
    return NextResponse.next();
}

// Specify the routes where the middleware should run
export const config = {
    matcher: '/((?!sign-in|api|_next|static|favicon.ico).*)',
};
