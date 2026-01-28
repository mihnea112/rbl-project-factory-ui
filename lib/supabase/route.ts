import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function supabaseRouteClient() {
  const cookieStore = await cookies();
  const cookiesToSet: Array<{ name: string; value: string; options?: any }> = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (c) => {
          // collect cookies, we'll attach them to the response
          cookiesToSet.splice(0, cookiesToSet.length, ...c);
        },
      },
    }
  );

  return { supabase, cookiesToSet };
}