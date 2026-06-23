"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { DEMO_PASSWORD } from "@/lib/mock/seed";
import { CmeLogo } from "@/components/brand/CmeLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const success = login(email, password);
    if (success) {
      router.replace("/dashboard");
      return;
    }

    setError("Invalid email or password, or account is disabled.");
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <Card className="w-full max-w-md border-t-4 border-t-[#ED1C24]">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <CmeLogo className="h-14" />
          </div>
          <CardTitle className="text-xl text-[#1A1A1A]">
            AI Community of Practice
          </CardTitle>
          <CardDescription>
            Secure workbench and recipe library for manufacturers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.ca"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 rounded-lg border bg-neutral-50 p-4 text-xs text-neutral-600">
            <p className="mb-2 font-semibold text-[#1A1A1A]">Demo credentials</p>
            <p>Password for all accounts: <code>{DEMO_PASSWORD}</code></p>
            <ul className="mt-2 space-y-1">
              <li>Admin: <code>admin@cme.ca</code></li>
              <li>Participant: <code>jane@acmemfg.ca</code></li>
              <li>Viewer: <code>viewer@acmemfg.ca</code></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
