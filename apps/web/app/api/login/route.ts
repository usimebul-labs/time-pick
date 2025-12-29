import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
    try {
        const { accessToken } = await req.json();

        if (!accessToken)
            return NextResponse.json({ error: "Missing access token" }, { status: 400 });


        const { data: { user }, error } = await supabase.auth.getUser(accessToken);
        if (error || !user)
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });


        const email = user.email;
        const fullName = user.user_metadata?.full_name || user.user_metadata?.name || email?.split("@")[0] || "User";
        const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;

        // Use Supabase JS directly instead of Prisma
        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        let profile = existingProfile;

        if (!profile) {
            const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert({
                    email,
                    full_name: fullName,
                    avatar_url: avatarUrl,
                    // created_at is default now()
                })
                .select()
                .single();

            if (createError) {
                console.error("Error creating profile:", createError);
                return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
            }
            profile = newProfile;
        }

        // Return profile formatted as expected by client (Prisma style camelCase if needed? 
        // The client likely expects camelCase if it was using Prisma types. 
        // Let's check schema mapping: fullName @map("full_name"). 
        // Supabase returns snake_case by default. We should map it back to camelCase to maintain compatibility.)

        const mappedProfile = {
            id: profile.id,
            email: profile.email,
            fullName: profile.full_name,
            avatarUrl: profile.avatar_url,
            createdAt: profile.created_at
        };

        return NextResponse.json({ success: true, profile: mappedProfile });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
