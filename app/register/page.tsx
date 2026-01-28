"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Role = "applicant" | "supporter";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<Role>("applicant");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") ?? "";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password, fullName, role }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data?.error || "Register failed");
      return;
    }

    // If caller provided ?next=, honor it; otherwise use role-based redirect from API
    const redirectTo = typeof next === "string" && next.startsWith("/")
      ? next
      : (data?.redirectTo || "/app");

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-foreground mb-1">
          Create account
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Join Project Factory OS.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-foreground">Full name</label>
            <input
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-foreground">Role</label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <option value="applicant">Applicant (submit a project)</option>
              <option value="supporter">Supporter (mentor / fund / network)</option>
            </select>
            <p className="text-xs text-muted-foreground">
              Reviewer/Admin roles are assigned by RBL internally.
            </p>
          </div>

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
              autoComplete="new-password"
              required
              minLength={8}
            />
          </div>

          {error && <div className="text-sm text-destructive">{error}</div>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </Button>
        </form>

        <div className="mt-6 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link className="text-accent underline" href="/login">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}