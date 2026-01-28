"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/api/authClient";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorBox } from "@/components/ui/ErrorBox";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data, error: err, status } = await authClient.login(email, password);
      if (status !== 200 || err) {
        setError(err ?? "Login failed");
        return;
      }
      router.push(from);
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md" padding="lg">
        <h1 className="text-xl font-semibold text-parchment-100 mb-1">Log in</h1>
        <p className="text-sm text-ink-500 mb-6">
          No account?{" "}
          <Link href="/register" className="text-accent hover:text-accent-light underline">
            Sign up
          </Link>
        </p>
        {error && (
          <div className="mb-4">
            <ErrorBox message={error} onDismiss={() => setError("")} />
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            autoComplete="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <Input
            type="password"
            autoComplete="current-password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-ink-500 hover:text-parchment-200"
            >
              Forgot password?
            </Link>
          </div>
          <Button type="submit" variant="primary" size="lg" block loading={loading} disabled={loading}>
            Log in
          </Button>
        </form>
      </Card>
      <Link href="/" className="mt-6 text-sm text-ink-500 hover:text-parchment-200">
        ← Back to home
      </Link>
    </div>
  );
}
