import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseRouteClient } from "@/lib/supabase/route";
import { roleRedirect, type RoleKey } from "@/lib/auth/role-redirect";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  const body = schema.parse(await req.json());
  const { supabase, cookiesToSet } = await supabaseRouteClient();

  const { data: signIn, error: signErr } =
    await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

  if (signErr || !signIn.user) {
    return NextResponse.json(
      { ok: false, error: signErr?.message ?? "Login failed" },
      { status: 401 },
    );
  }

  // RLS allows reading own user_roles
  const { data: rows, error: rolesErr } = await supabase
    .from("user_roles")
    .select("roles(key)")
    .eq("user_id", signIn.user.id);

  if (rolesErr) {
    return NextResponse.json(
      { ok: false, error: rolesErr.message },
      { status: 400 },
    );
  }

  const roles: RoleKey[] = (rows ?? [])
    .map((r: any) => r.roles?.key)
    .filter(Boolean);

  const redirectTo = roleRedirect(roles);

  const res = NextResponse.json({
    ok: true,
    roles,
    redirectTo,
    access_token: signIn.session?.access_token,
    refresh_token: signIn.session?.refresh_token,
  });

  // attach auth cookies to response
  cookiesToSet.forEach(({ name, value, options }) => {
    res.cookies.set(name, value, options);
  });

  return res;
}
