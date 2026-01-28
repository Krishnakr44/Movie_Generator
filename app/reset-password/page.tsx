"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/api/authClient";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorBox } from "@/components/ui/ErrorBox";
import { Card } from "@/components/ui/Card";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromQuery = searchParams.get("token") ?? "";

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setToken(tokenFromQuery);
  }, [tokenFromQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setError("Missing reset token. Use the link from your email.");
      return;
    }
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      const { error: err, status } = await authClient.resetPassword(token, password);
      if (status !== 200 || err) {
        setError(err ?? "Reset failed");
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md" padding="lg">
        <h1 className="text-xl font-semibold text-parchment-100 mb-1">Reset password</h1>
        <p className="text-sm text-ink-500 mb-6">
          Enter your new password. Token is pre-filled from the link if present.
        </p>
        {error && (
          <div className="mb-4">
            <ErrorBox message={error} onDismiss={() => setError("")} />
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-card border border-ink-600 bg-ink-800/50 px-4 py-3 text-sm text-parchment-200">
            Password reset. Redirecting to login…
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!tokenFromQuery && (
            <Input
              type="text"
              autoComplete="off"
              label="Reset token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste token from email link"
            />
          )}
          <Input
            type="password"
            autoComplete="new-password"
            label="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            minLength={8}
            required
          />
          <Button type="submit" variant="primary" size="lg" block loading={loading} disabled={loading}>
            Reset password
          </Button>
        </form>
      </Card>
      <Link href="/login" className="mt-6 text-sm text-ink-500 hover:text-parchment-200">
        ← Back to login
      </Link>
    </div>
  );
}
