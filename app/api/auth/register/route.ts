import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseRouteClient } from "@/lib/supabase/route";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { roleRedirect, type RoleKey } from "@/lib/auth/role-redirect";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2).max(80).optional(),
  role: z.enum(["applicant", "supporter"]),
});

export async function POST(req: Request) {
  const body = schema.parse(await req.json());
  const { supabase, cookiesToSet } = await supabaseRouteClient();

  // Create user (anon client creates session cookies if confirmations are OFF)
  const { data: signUp, error: signErr } = await supabase.auth.signUp({
    email: body.email,
    password: body.password,
  });

  if (signErr) {
    return NextResponse.json(
      { ok: false, error: signErr.message },
      { status: 400 },
    );
  }

  const userId = signUp.user?.id;

  if (!userId) {
    // likely email confirmation ON → user exists but no session
    return NextResponse.json(
      { ok: true, note: "Confirm email then login." },
      { status: 200 },
    );
  }

  // Profile is created by trigger; still safe to upsert name
  if (body.fullName) {
    await supabaseAdmin
      .from("profiles")
      .upsert(
        { id: userId, email: body.email, full_name: body.fullName },
        { onConflict: "id" },
      );
  }

  // Ensure the role exists (seed should already have it)
  const { data: roleRow, error: roleErr } = await supabaseAdmin
    .from("roles")
    .select("id,key")
    .eq("key", body.role)
    .single();

  if (roleErr) {
    return NextResponse.json(
      { ok: false, error: roleErr.message },
      { status: 400 },
    );
  }

  // Replace default role assignment (trigger sets applicant by default)
  // We enforce ONE base role for the user (applicant OR supporter)
  const { error: delErr } = await supabaseAdmin
    .from("user_roles")
    .delete()
    .eq("user_id", userId);

  if (delErr) {
    return NextResponse.json(
      { ok: false, error: delErr.message },
      { status: 400 },
    );
  }

  const { error: insErr } = await supabaseAdmin
    .from("user_roles")
    .insert({ user_id: userId, role_id: roleRow.id });

  if (insErr) {
    return NextResponse.json(
      { ok: false, error: insErr.message },
      { status: 400 },
    );
  }

  const res = NextResponse.json({ ok: true, roles: [body.role as RoleKey] });

  // attach auth cookies (if session exists)
  cookiesToSet.forEach(({ name, value, options }) => {
    res.cookies.set(name, value, options);
  });

  return res;
}
