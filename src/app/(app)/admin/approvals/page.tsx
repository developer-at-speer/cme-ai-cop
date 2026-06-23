"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useAppData } from "@/context/AppDataContext";
import { getAttributionLabel } from "@/lib/data/recipes";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { AppHeader } from "@/components/layout/AppHeader";
import { formatDate } from "@/lib/format";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminApprovalsPage() {
  const { state } = useAppData();
  const pending = state.recipes.filter((r) => r.status === "submitted");

  return (
    <AdminGuard>
      <AppHeader title="Recipe approvals" />
      <div className="flex-1 p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending approvals</CardTitle>
            <CardDescription>
              {pending.length} recipe{pending.length !== 1 ? "s" : ""} awaiting
              review
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pending.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No recipes pending approval.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author / Company</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pending.map((recipe) => (
                      <TableRow key={recipe.id}>
                        <TableCell className="font-medium">
                          {recipe.title}
                        </TableCell>
                        <TableCell>
                          {getAttributionLabel(recipe, state)}
                        </TableCell>
                        <TableCell>{recipe.category}</TableCell>
                        <TableCell>{formatDate(recipe.updated_at)}</TableCell>
                        <TableCell>
                          <ButtonLink variant="outline" size="sm" href={`/recipes/${recipe.id}`}>
                            Review
                          </ButtonLink>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminGuard>
  );
}
