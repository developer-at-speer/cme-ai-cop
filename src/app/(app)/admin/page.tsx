"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useAppData } from "@/context/AppDataContext";
import { getActivitySummary } from "@/lib/data/activity";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Users, Building2, CheckSquare, Activity } from "lucide-react";

export default function AdminOverviewPage() {
  const { user } = useAuth();
  const { state, resetDemo } = useAppData();
  const summary = getActivitySummary(state);

  return (
    <AdminGuard>
      <AppHeader title="Admin Console" />
      <div className="flex-1 p-4 md:p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Welcome, {user?.name}. Manage users, companies, and recipe approvals.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={resetDemo}>
            Reset demo data
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active users</CardDescription>
              <CardTitle className="text-3xl">{summary.activeUsers}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending approvals</CardDescription>
              <CardTitle className="text-3xl">{summary.pendingApprovals}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Workbench runs</CardDescription>
              <CardTitle className="text-3xl">{summary.workbenchRuns}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Approved recipes</CardDescription>
              <CardTitle className="text-3xl">{summary.recipesApproved}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/admin/users", label: "Users", icon: Users, desc: "Create and manage accounts" },
            { href: "/admin/companies", label: "Companies", icon: Building2, desc: "Manage manufacturer orgs" },
            { href: "/admin/approvals", label: "Approvals", icon: CheckSquare, desc: "Review submitted recipes" },
            { href: "/admin/activity", label: "Activity", icon: Activity, desc: "Usage and engagement" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.href} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <Icon className="h-5 w-5 text-cme-red" />
                  <CardTitle className="text-base">{item.label}</CardTitle>
                  <CardDescription>{item.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ButtonLink variant="outline" size="sm" href={item.href}>
                    Open
                  </ButtonLink>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AdminGuard>
  );
}
