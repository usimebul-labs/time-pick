import { createMiddlewareClient } from '@repo/database'
import { type NextRequest, NextResponse } from 'next/server';

export async function updateSession(request: NextRequest) {
    console.log('Middleware request URL:', request.url);

    // Bypass SSL verification for corporate proxy (SELF_SIGNED_CERT_IN_CHAIN)
    if (process.env.NODE_ENV === 'development') {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    }

    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createMiddlewareClient(request, supabaseResponse)

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const protectedPatterns = [
        /^\/app\/dashboard/,
        /^\/app\/calendar\/new/,
        /^\/app\/calendar\/[^/]+\/confirm$/,
        /^\/app\/calendar\/[^/]+\/modify$/,
    ];
    const isProtectedRoute = protectedPatterns.some(pattern => pattern.test(request.nextUrl.pathname));
    const isLoginPage = request.nextUrl.pathname.startsWith('/app/login')

    if (!user && isProtectedRoute) {
        // no user, potentially respond by redirecting the user to the login page
        const url = request.nextUrl.clone()
        url.pathname = '/app/login'
        return NextResponse.redirect(url)
    }

    if (user && isLoginPage) {
        // user is logged in, redirect to dashboard
        const url = request.nextUrl.clone()
        url.pathname = '/app/dashboard'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
