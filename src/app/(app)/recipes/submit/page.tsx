"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useAppData } from "@/context/AppDataContext";
import { getRecipeById } from "@/lib/data/recipes";
import { canSubmitRecipe } from "@/lib/rbac";
import { AppHeader } from "@/components/layout/AppHeader";
import {
  RecipeForm,
  emptyRecipeDraft,
} from "@/components/recipes/RecipeForm";
import type { RecipeDraft } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

function SubmitRecipeContent() {
  const { user } = useAuth();
  const { state, saveRecipe, workbenchDraft, setWorkbenchDraft } = useAppData();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [draft, setDraft] = useState<RecipeDraft>(emptyRecipeDraft());
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (editId && user) {
      const existing = getRecipeById(state, editId, user);
      if (existing) {
        setDraft({
          title: existing.title,
          problem_solved: existing.problem_solved,
          manufacturing_use_case: existing.manufacturing_use_case,
          category: existing.category,
          department: existing.department,
          workflow_steps: existing.workflow_steps,
          prompt_text: existing.prompt_text,
          tools_used: existing.tools_used,
          models_used: existing.models_used,
          expected_output: existing.expected_output,
          notes: existing.notes,
          safety_considerations: existing.safety_considerations,
          attribution_preference: existing.attribution_preference,
        });
      }
    } else if (workbenchDraft) {
      setDraft(workbenchDraft);
      setWorkbenchDraft(null);
    }
  }, [editId, user, state, workbenchDraft, setWorkbenchDraft]);

  if (!user || !canSubmitRecipe(user)) {
    return (
      <>
        <AppHeader title="Access denied" />
        <div className="p-6">
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                You do not have permission to submit recipes.
              </p>
              <ButtonLink href="/dashboard" className="mt-4">
                Back to dashboard
              </ButtonLink>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const handleSave = (status: "draft" | "submitted") => {
    if (!draft.title.trim() || !draft.prompt_text.trim()) {
      setMessage("Title and prompt text are required.");
      return;
    }
    const id = saveRecipe(user, draft, status, editId ?? undefined);
    setMessage(
      status === "draft"
        ? "Recipe saved as draft."
        : "Recipe submitted for approval.",
    );
    if (status === "submitted") {
      router.push(`/recipes/${id}`);
    }
  };

  return (
    <>
      <AppHeader title={editId ? "Edit recipe" : "Submit recipe"} />
      <div className="flex-1 p-4 md:p-6">
        <Card className="mx-auto max-w-3xl">
          <CardHeader>
            <CardTitle>
              {editId ? "Edit recipe" : "Submit a new recipe"}
            </CardTitle>
            <CardDescription>
              Document a successful AI workflow for the community. Recipes are
              reviewed by CME admins before being shared.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {message && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            <RecipeForm value={draft} onChange={setDraft} />
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => handleSave("draft")}>
                Save draft
              </Button>
              <Button onClick={() => handleSave("submitted")}>
                Submit for approval
              </Button>
              <ButtonLink variant="ghost" href="/recipes">
                Cancel
              </ButtonLink>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default function SubmitRecipePage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <SubmitRecipeContent />
    </Suspense>
  );
}
