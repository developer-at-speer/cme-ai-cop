"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { canAccessAdmin } from "@/lib/rbac";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button-link";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !canAccessAdmin(user)) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  if (!user || !canAccessAdmin(user)) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Card className="max-w-md">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Admin access required.
            </p>
            <ButtonLink href="/dashboard" className="mt-4">
              Back to dashboard
            </ButtonLink>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
