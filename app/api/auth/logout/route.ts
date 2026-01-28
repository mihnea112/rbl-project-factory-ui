import { NextResponse } from "next/server";
import { supabaseRouteClient } from "@/lib/supabase/route";

export const dynamic = "force-dynamic";

export async function POST() {
  const { supabase, cookiesToSet } = await supabaseRouteClient();

  // This clears the auth cookies managed by @supabase/ssr
  const { error } = await supabase.auth.signOut();

  const res = NextResponse.json({ ok: !error, error: error?.message ?? null });

  cookiesToSet.forEach(({ name, value, options }) => {
    res.cookies.set(name, value, options);
  });

  return res;
}