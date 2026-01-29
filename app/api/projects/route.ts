import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anon || !service) {
    return NextResponse.json(
      { error: "Missing Supabase env vars (URL/ANON/SERVICE_ROLE)." },
      { status: 500 }
    );
  }

  // Next 15/16: cookies() is async in your setup
  const cookieStore = await cookies();

  // 1) Verify user session via cookie-based server client (RLS-safe check)
  const supabaseAuth = createServerClient(url, anon, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (all) => {
        all.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
      },
    },
  });

  const { data: userData } = await supabaseAuth.auth.getUser();
  if (!userData?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2) Admin client bypasses RLS → no recursion
  const supabaseAdmin = createClient(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabaseAdmin.from("projects").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ projects: data ?? [] }, { status: 200 });
}