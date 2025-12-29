import { createBrowserClient, User } from "@repo/database";
import { useEffect, useState } from "react";

export const useLoginedUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const supabase = createBrowserClient();

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return { user };
};
