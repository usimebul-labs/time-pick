import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@repo/database";

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

        return NextResponse.json({ success: true, profile });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
