import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const session = request.cookies.get('session')
    const guestMode = request.cookies.get('guest-mode')

    // If user is logged in or in guest mode, allow access
    if (session || guestMode) {
        return NextResponse.next()
    }

    // Otherwise, redirect to login page
    return NextResponse.redirect(new URL('/auth', request.url))
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - auth (authentication page)
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!auth|api|_next/static|_next/image|favicon.ico).*)',
    ],
}
