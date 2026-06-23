"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useAppData } from "@/context/AppDataContext";
import {
  getRecipeById,
  getAttributionLabel,
} from "@/lib/data/recipes";
import {
  canApproveRecipe,
  canEditRecipe,
} from "@/lib/rbac";
import { AppHeader } from "@/components/layout/AppHeader";
import { StatusBadge } from "@/components/recipes/StatusBadge";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700">{label}</h3>
      <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{value || "—"}</p>
    </div>
  );
}

export default function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const { state, approveRecipeById, rejectRecipeById } = useAppData();
  const router = useRouter();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDepartment, setEditDepartment] = useState("");

  if (!user) return null;

  const recipe = getRecipeById(state, id, user);

  if (!recipe) {
    return (
      <>
        <AppHeader title="Recipe not found" />
        <div className="p-6">
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                This recipe does not exist or you do not have permission to view it.
              </p>
              <ButtonLink href="/recipes" className="mt-4">
                Back to library
              </ButtonLink>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const isAdmin = canApproveRecipe(user);
  const canEdit = canEditRecipe(user, recipe);
  const showAdminMeta = isAdmin && recipe.status === "submitted";

  const handleApprove = () => {
    approveRecipeById(user, recipe.id, {
      category: editCategory || recipe.category,
      department: editDepartment || recipe.department,
    });
    router.refresh();
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    rejectRecipeById(user, recipe.id, rejectReason);
    setRejectOpen(false);
    setRejectReason("");
  };

  return (
    <>
      <AppHeader title={recipe.title} />
      <div className="flex-1 p-4 md:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <StatusBadge status={recipe.status} />
          <span className="text-sm text-muted-foreground">
            {getAttributionLabel(recipe, state)}
          </span>
          {canEdit && (
            <ButtonLink variant="outline" size="sm" href={`/recipes/submit?edit=${recipe.id}`}>
              Edit
            </ButtonLink>
          )}
        </div>

        {recipe.status === "rejected" && recipe.rejection_reason && (
          <Card className="mb-4 border-red-200 bg-red-50">
            <CardContent className="py-4">
              <p className="text-sm font-medium text-red-800">Rejection reason</p>
              <p className="mt-1 text-sm text-red-700">{recipe.rejection_reason}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recipe details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <DetailField label="Problem solved" value={recipe.problem_solved} />
                <DetailField
                  label="Manufacturing use case"
                  value={recipe.manufacturing_use_case}
                />
                <DetailField label="Workflow steps" value={recipe.workflow_steps} />
                <DetailField label="Prompt text" value={recipe.prompt_text} />
                <DetailField label="Tools used" value={recipe.tools_used} />
                <DetailField label="Models used" value={recipe.models_used} />
                <DetailField label="Expected output" value={recipe.expected_output} />
                <DetailField label="Notes / limitations" value={recipe.notes} />
                <DetailField
                  label="Safety considerations"
                  value={recipe.safety_considerations}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span>{recipe.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Department</span>
                  <span>{recipe.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Attribution</span>
                  <span className="capitalize">{recipe.attribution_preference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{formatDate(recipe.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Approved</span>
                  <span>{formatDate(recipe.approved_at)}</span>
                </div>
              </CardContent>
            </Card>

            {showAdminMeta && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Admin actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-cat">Category (optional edit)</Label>
                    <Input
                      id="edit-cat"
                      defaultValue={recipe.category}
                      onChange={(e) => setEditCategory(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-dept">Department (optional edit)</Label>
                    <Input
                      id="edit-dept"
                      defaultValue={recipe.department}
                      onChange={(e) => setEditDepartment(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleApprove} className="flex-1">
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => setRejectOpen(true)}
                    >
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject recipe</DialogTitle>
            <DialogDescription>
              Provide a reason so the author can revise and resubmit.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Reason for rejection..."
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject recipe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
