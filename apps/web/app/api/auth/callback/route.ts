import { createServerClient } from "@repo/database"
import { NextResponse } from 'next/server'


export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/app/dashboard'

    if (!code)
        return NextResponse.redirect(`${origin}/app/auth/auth-code-error?error=${encodeURIComponent("No code provided")}`)

    const supabase = await createServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error)
        return NextResponse.redirect(`${origin}/app/auth/auth-code-error?error=${encodeURIComponent(error.message)}`)

    const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
    const isLocalEnv = process.env.NODE_ENV === 'development'

    if (isLocalEnv)
        return NextResponse.redirect(`${origin}${next}`)

    if (forwardedHost)
        return NextResponse.redirect(`https://${forwardedHost}${next}`)

    return NextResponse.redirect(`${origin}${next}`)
}
