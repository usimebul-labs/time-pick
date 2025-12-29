import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseAdminInstance: SupabaseClient<any, "public", any> | null = null;

export const getSupabaseAdmin = () => {
    if (supabaseAdminInstance) return supabaseAdminInstance;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        // In development, this might throw if envs are missing. 
        // In build time (prisma generate), this file might be imported but not executed for logic.
        // Using console.warn instead of throw to prevent build crashes if envs aren't loaded yet.
        console.warn("Missing Supabase environment variables in @repo/database");
    }

    supabaseAdminInstance = createClient(
        supabaseUrl || "",
        supabaseServiceRoleKey || "",
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );

    return supabaseAdminInstance;
};
