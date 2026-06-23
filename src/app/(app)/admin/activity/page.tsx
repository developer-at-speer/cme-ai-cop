"use client";

import { useAppData } from "@/context/AppDataContext";
import {
  getActivitySummary,
  getRecipeFunnel,
  getUsageByCompany,
  getUsageByModel,
} from "@/lib/data/activity";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminActivityPage() {
  const { state } = useAppData();
  const summary = getActivitySummary(state);
  const funnel = getRecipeFunnel(state);
  const byCompany = getUsageByCompany(state);
  const byModel = getUsageByModel(state);

  return (
    <AdminGuard>
      <AppHeader title="Usage & activity" />
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: "Active users", value: summary.activeUsers },
            { label: "Workbench runs", value: summary.workbenchRuns },
            { label: "Recipes submitted", value: summary.recipesSubmitted },
            { label: "Recipes approved", value: summary.recipesApproved },
            { label: "Pending approvals", value: summary.pendingApprovals },
          ].map((item) => (
            <Card key={item.label}>
              <CardHeader className="pb-2">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <CardTitle className="text-3xl">{item.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recipe funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(funnel).map(([status, count]) => (
                  <div
                    key={status}
                    className="rounded-lg border p-4 text-center"
                  >
                    <p className="text-2xl font-semibold">{count}</p>
                    <p className="text-sm capitalize text-muted-foreground">
                      {status}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Usage by model</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead className="text-right">Runs</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {byModel.map((row) => (
                    <TableRow key={row.model}>
                      <TableCell>{row.model}</TableCell>
                      <TableCell className="text-right">{row.runs}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Usage by company</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead className="text-right">Workbench runs</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {byCompany.map((row) => (
                  <TableRow key={row.companyName}>
                    <TableCell>{row.companyName}</TableCell>
                    <TableCell className="text-right">{row.runs}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminGuard>
  );
}
