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

    const { data: { user } } = await supabase.auth.getUser()


    if (user) {
        try {
            const email = user.email!
            const fullName = user.user_metadata?.full_name || user.user_metadata?.name || email?.split("@")[0] || "User"
            const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture

            // Initialize admin client to bypass RLS
            const { getSupabaseAdmin } = await import('@repo/database')
            const supabaseAdmin = getSupabaseAdmin()

            // Check if profile exists
            const { data: existingProfile, error: searchError } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .eq('email', email)
                .maybeSingle()


            console.log(existingProfile)

            if (!existingProfile) {
                // Create profile
                const { error: insertError } = await supabaseAdmin
                    .from('profiles')
                    .insert({
                        id: user.id, // Ensure profile ID matches Auth User ID
                        email,
                        full_name: fullName,
                        avatar_url: avatarUrl,
                    })

                if (insertError) throw insertError;
            }
        } catch (e: any) {
            return NextResponse.redirect(`${origin}/app/auth/auth-code-error?error=${encodeURIComponent(e.message)}`)
        }
    }

    const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
    const isLocalEnv = process.env.NODE_ENV === 'development'

    if (isLocalEnv)
        return NextResponse.redirect(`${origin}${next}`)

    if (forwardedHost)
        return NextResponse.redirect(`https://${forwardedHost}${next}`)

    return NextResponse.redirect(`${origin}${next}`)
}
