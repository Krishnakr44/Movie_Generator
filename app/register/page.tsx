"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/api/authClient";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorBox } from "@/components/ui/ErrorBox";
import { Card } from "@/components/ui/Card";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data, error: err, status } = await authClient.register(email, password);
      if (status !== 201 || err) {
        setError(err ?? "Registration failed");
        return;
      }
      router.push("/");
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
        <h1 className="text-xl font-semibold text-parchment-100 mb-1">Create account</h1>
        <p className="text-sm text-ink-500 mb-6">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:text-accent-light underline">
            Log in
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
            autoComplete="new-password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            minLength={8}
            required
          />
          <Button type="submit" variant="primary" size="lg" block loading={loading} disabled={loading}>
            Sign up
          </Button>
        </form>
      </Card>
      <Link href="/" className="mt-6 text-sm text-ink-500 hover:text-parchment-200">
        ← Back to home
      </Link>
    </div>
  );
}
