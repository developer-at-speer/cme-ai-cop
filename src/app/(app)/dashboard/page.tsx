"use client";

import Link from "next/link";
import {
  FlaskConical,
  BookOpen,
  FilePlus,
  Users,
  CheckSquare,
  Activity,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAppData } from "@/context/AppDataContext";
import { getActivitySummary } from "@/lib/data/activity";
import { getRecentRuns } from "@/lib/data/workbench";
import {
  canAccessAdmin,
  canAccessWorkbench,
  canSubmitRecipe,
} from "@/lib/rbac";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button-link";
import { formatDate } from "@/lib/format";

export default function DashboardPage() {
  const { user } = useAuth();
  const { state } = useAppData();

  if (!user) return null;

  const company = state.companies.find((c) => c.id === user.company_id);
  const summary = getActivitySummary(state);
  const recentRuns = getRecentRuns(state, 5);
  const isAdmin = canAccessAdmin(user);

  const quickLinks = [
    {
      href: "/workbench",
      label: "AI Workbench",
      description: "Test prompts and workflows",
      icon: FlaskConical,
      show: canAccessWorkbench(user),
    },
    {
      href: "/recipes",
      label: "Recipe Library",
      description: "Browse approved community recipes",
      icon: BookOpen,
      show: true,
    },
    {
      href: "/recipes/submit",
      label: "Submit Recipe",
      description: "Share a workflow with the community",
      icon: FilePlus,
      show: canSubmitRecipe(user),
    },
  ].filter((l) => l.show);

  return (
    <>
      <AppHeader title="Dashboard" />
      <div className="flex-1 p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-900">
            Welcome back, {user.name}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {company?.name ?? "CME Administration"} ·{" "}
            <span className="capitalize">{user.role}</span>
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Card key={link.href} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <Icon className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-base">{link.label}</CardTitle>
                  <CardDescription>{link.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ButtonLink href={link.href}>Open</ButtonLink>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {isAdmin && (
          <div className="mt-8 space-y-6">
            <h3 className="text-lg font-semibold">Admin summary</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckSquare className="h-4 w-4" />
                    <CardDescription>Pending approvals</CardDescription>
                  </div>
                  <CardTitle className="text-3xl">
                    {summary.pendingApprovals}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ButtonLink variant="outline" size="sm" href="/admin/approvals">
                    Review queue
                  </ButtonLink>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <CardDescription>Active users</CardDescription>
                  </div>
                  <CardTitle className="text-3xl">
                    {summary.activeUsers}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ButtonLink variant="outline" size="sm" href="/admin/users">
                    Manage users
                  </ButtonLink>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Activity className="h-4 w-4" />
                    <CardDescription>Workbench runs</CardDescription>
                  </div>
                  <CardTitle className="text-3xl">
                    {summary.workbenchRuns}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ButtonLink variant="outline" size="sm" href="/admin/activity">
                    View activity
                  </ButtonLink>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Approved recipes</CardDescription>
                  <CardTitle className="text-3xl">
                    {summary.recipesApproved}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent workbench activity</CardTitle>
              </CardHeader>
              <CardContent>
                {recentRuns.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No runs yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {recentRuns.map((run) => {
                      const runUser = state.users.find(
                        (u) => u.id === run.user_id,
                      );
                      return (
                        <li
                          key={run.id}
                          className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 last:border-0 last:pb-0"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {runUser?.name ?? "Unknown"} · {run.model_name}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {run.prompt_text}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(run.created_at)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
