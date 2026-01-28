"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { authClient, type AuthUser } from "@/lib/api/authClient";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    authClient.me().then(({ data, status }) => {
      if (status === 200 && data?.user) setUser(data.user);
      else router.push("/login?from=/dashboard");
      setLoading(false);
    });
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await authClient.logout();
    router.push("/");
    router.refresh();
    setLoggingOut(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-ink-500">Loading…</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen px-4 py-12 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-parchment-100">Dashboard</h1>
      <p className="text-ink-500 mt-1">Protected page. Only visible when logged in.</p>
      <div className="mt-6 rounded-card bg-ink-900 border border-ink-700 p-4">
        <p className="text-sm text-ink-500">Logged in as</p>
        <p className="font-medium text-parchment-100">{user.email}</p>
        <p className="text-xs text-ink-600 mt-1">ID: {user.id}</p>
      </div>
      <div className="mt-6 flex gap-3">
        <Button variant="secondary" onClick={handleLogout} disabled={loggingOut}>
          Log out
        </Button>
        <Link href="/">
          <Button variant="ghost">← Home</Button>
        </Link>
      </div>
    </div>
  );
}
