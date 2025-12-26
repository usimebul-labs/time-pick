import { NextResponse } from 'next/server'
import { createClient } from '@/common/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/app/dashboard'

    if (!code)
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=No%20code%20provided`)


    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
        console.error('Auth error:', error)
        let errorMessage = error.message
        if (errorMessage === 'fetch failed') {
            errorMessage = `Fetch failed. Check server logs. URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`
        }
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(errorMessage)}`)
    }

    const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
    const isLocalEnv = process.env.NODE_ENV === 'development'

    if (isLocalEnv)
        return NextResponse.redirect(`${origin}${next}`)

    if (forwardedHost)
        return NextResponse.redirect(`https://${forwardedHost}${next}`)

    return NextResponse.redirect(`${origin}${next}`)
}
