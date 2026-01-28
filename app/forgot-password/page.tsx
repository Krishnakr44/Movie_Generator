"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/api/authClient";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorBox } from "@/components/ui/ErrorBox";
import { Card } from "@/components/ui/Card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      const { error: err, status } = await authClient.forgotPassword(email);
      if (status >= 500) {
        setError(err ?? "Request failed");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md" padding="lg">
        <h1 className="text-xl font-semibold text-parchment-100 mb-1">Forgot password</h1>
        <p className="text-sm text-ink-500 mb-6">
          Enter your email and we’ll send a reset link (check console in dev).
        </p>
        {error && (
          <div className="mb-4">
            <ErrorBox message={error} onDismiss={() => setError("")} />
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-card border border-ink-600 bg-ink-800/50 px-4 py-3 text-sm text-parchment-200">
            If an account exists for that email, you’ll receive a reset link. In dev, check the
            server console for the link.
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
          <Button type="submit" variant="primary" size="lg" block loading={loading} disabled={loading}>
            Send reset link
          </Button>
        </form>
      </Card>
      <Link href="/login" className="mt-6 text-sm text-ink-500 hover:text-parchment-200">
        ← Back to login
      </Link>
    </div>
  );
}
