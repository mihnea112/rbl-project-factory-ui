import { NextResponse } from "next/server";
import { supabaseRouteClient } from "@/lib/supabase/route";
import { roleRedirect, type RoleKey } from "@/lib/auth/role-redirect";

export const dynamic = "force-dynamic";

export async function GET() {
  const { supabase } = await supabaseRouteClient();

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ user: null, roles: [], redirectTo: "/login" });

  // Step 1: read role_id(s) for this user (RLS: user_roles_read_own)
  const { data: urRows, error: urErr } = await supabase
    .from("user_roles")
    .select("role_id")
    .eq("user_id", auth.user.id);

  if (urErr) {
    return NextResponse.json(
      { user: { id: auth.user.id, email: auth.user.email }, roles: [], error: urErr.message },
      { status: 400 }
    );
  }

  const roleIds: number[] = (urRows ?? [])
    .map((r: any) => r.role_id)
    .filter((v: any) => typeof v === "number");

  // Step 2: fetch role keys (RLS: roles_read_auth)
  let roles: RoleKey[] = [];
  if (roleIds.length > 0) {
    const { data: roleRows, error: roleErr } = await supabase
      .from("roles")
      .select("key")
      .in("id", roleIds);

    if (roleErr) {
      return NextResponse.json(
        { user: { id: auth.user.id, email: auth.user.email }, roles: [], error: roleErr.message },
        { status: 400 }
      );
    }

    roles = (roleRows ?? [])
      .map((r: any) => r.key)
      .filter(Boolean);
  }

  return NextResponse.json({
    user: { id: auth.user.id, email: auth.user.email },
    roles,
    redirectTo: roleRedirect(roles),
  });
}