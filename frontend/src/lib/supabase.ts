import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
    if (client) return client;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const key =
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || "";
    client = createClient(url, key);
    return client;
}

// Lazy proxy: the real client is created on first use (in the browser),
// not at module import. This keeps Next.js prerendering from crashing
// when NEXT_PUBLIC_SUPABASE_URL isn't inlined yet during the build.
export const supabase = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        const c = getClient();
        const value = c[prop as keyof SupabaseClient];
        return typeof value === "function" ? value.bind(c) : value;
    },
});
