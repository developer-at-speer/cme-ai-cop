"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useAppData } from "@/context/AppDataContext";
import { getRecipesForUser, getAttributionLabel } from "@/lib/data/recipes";
import { AppHeader } from "@/components/layout/AppHeader";
import { RecipeFilters } from "@/components/recipes/RecipeFilters";
import { StatusBadge } from "@/components/recipes/StatusBadge";
import { formatDate } from "@/lib/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecipesPage() {
  const { user } = useAuth();
  const { state } = useAppData();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [department, setDepartment] = useState("all");
  const [status, setStatus] = useState("all");

  const recipes = useMemo(() => {
    if (!user) return [];
    let list = getRecipesForUser(state, user);

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.problem_solved.toLowerCase().includes(q) ||
          r.manufacturing_use_case.toLowerCase().includes(q),
      );
    }
    if (category !== "all") list = list.filter((r) => r.category === category);
    if (department !== "all")
      list = list.filter((r) => r.department === department);
    if (status !== "all")
      list = list.filter((r) => r.status === status);

    return list.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );
  }, [user, state, search, category, department, status]);

  if (!user) return null;

  return (
    <>
      <AppHeader title="Recipe Library" />
      <div className="flex-1 p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Approved AI recipes</CardTitle>
            <CardDescription>
              Browse community recipes shared by participating manufacturers.
              {user.role === "participant" &&
                " You can also see your own drafts and submitted recipes."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RecipeFilters
              search={search}
              onSearchChange={setSearch}
              category={category}
              onCategoryChange={setCategory}
              department={department}
              onDepartmentChange={setDepartment}
              status={status}
              onStatusChange={setStatus}
              showStatusFilter={user.role === "admin"}
            />

            {recipes.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No recipes match your filters.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author / Company</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Approved</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recipes.map((recipe) => (
                      <TableRow key={recipe.id}>
                        <TableCell>
                          <Link
                            href={`/recipes/${recipe.id}`}
                            className="font-medium text-cme-red hover:underline"
                          >
                            {recipe.title}
                          </Link>
                        </TableCell>
                        <TableCell className="text-sm">
                          {getAttributionLabel(recipe, state)}
                        </TableCell>
                        <TableCell className="text-sm">{recipe.category}</TableCell>
                        <TableCell className="text-sm">{recipe.department}</TableCell>
                        <TableCell className="text-sm">{recipe.models_used}</TableCell>
                        <TableCell>
                          <StatusBadge status={recipe.status} />
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(recipe.created_at)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(recipe.approved_at)}
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
    </>
  );
}
