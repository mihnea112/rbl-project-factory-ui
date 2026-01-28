import { NextResponse, type NextRequest } from "next/server";
import { supabaseMiddleware } from "@/lib/supabase/middleware";
import { roleRedirect, type RoleKey } from "@/lib/auth/role-redirect";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = supabaseMiddleware(req, res);

  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;
  const isAuthed = !!user;

  const path = req.nextUrl.pathname;

  // Protect /app/*
  if (path.startsWith("/app") && !isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  // If authed, compute role-based dashboard
  let dashboard = "/app";
  if (isAuthed) {
    const { data: rows } = await supabase
      .from("user_roles")
      .select("roles(key)")
      .eq("user_id", user!.id);

    const roles: RoleKey[] = (rows ?? [])
      .map((r: any) => r.roles?.key)
      .filter(Boolean);

    dashboard = roleRedirect(roles);
  }

  // Keep authed users out of /login and /register
  if ((path === "/login" || path === "/register") && isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = dashboard;
    return NextResponse.redirect(url);
  }

  // If someone hits /app root, send them to their dashboard
  if (path === "/app" && isAuthed && dashboard !== "/app") {
    const url = req.nextUrl.clone();
    url.pathname = dashboard;
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ["/app/:path*", "/app", "/login", "/register"],
};