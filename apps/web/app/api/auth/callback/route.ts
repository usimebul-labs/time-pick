import { NextResponse } from 'next/server'
import { createClient } from '@/common/lib/supabase/server'
import { prisma } from "@repo/database";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/app/dashboard'


    if (!code)
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent("No code provided")}`)


    const supabase = await createClient()
    const { error, data: { user } } = await supabase.auth.exchangeCodeForSession(code)

    if (error)
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`)


    if (!user)
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent("User not found")}`)


    const email = user.email;
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name || email?.split("@")[0] || "User";
    const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;

    let profile = await prisma.profile.findFirst({
        where: { email }
    });

    if (!profile) {
        profile = await prisma.profile.create({
            data: {
                email,
                fullName,
                avatarUrl,
            },
        });
    }

    const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
    const isLocalEnv = process.env.NODE_ENV === 'development'

    if (isLocalEnv)
        return NextResponse.redirect(`${origin}${next}`)

    if (forwardedHost)
        return NextResponse.redirect(`https://${forwardedHost}${next}`)

    return NextResponse.redirect(`${origin}${next}`)
}
