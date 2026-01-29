"use client";

export const dynamic = "force-dynamic";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { supabaseBrowser } from "@/lib/supabase/browser";

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const next = searchParams.get("next") ?? "/app";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || "Login failed");
        return;
      }

      // Store session in browser for client guards
      if (data?.access_token && data?.refresh_token) {
        const supabase = supabaseBrowser();
        await supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });
      }

      const redirectTo =
        typeof next === "string" && next.startsWith("/")
          ? next
          : data?.redirectTo || "/app";

      router.replace(redirectTo);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-foreground mb-1">Log in</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Access Project Factory OS.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-foreground">Email</label>
            <input
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-foreground">Password</label>
            <input
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <div className="text-sm text-destructive">{error}</div>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="mt-6 text-sm text-muted-foreground">
          No account?{" "}
          <Link className="text-accent underline" href="/register">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
          <div className="text-sm text-muted-foreground">Loading…</div>
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
