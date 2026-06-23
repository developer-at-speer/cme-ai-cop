import type { Recipe, RecipeStatus, User } from "@/lib/types";

export function canAccessAdmin(user: User | null): boolean {
  return user?.role === "admin" && user.status === "active";
}

export function canAccessWorkbench(user: User | null): boolean {
  if (!user || user.status !== "active") return false;
  if (user.role === "viewer") return false;
  return user.workbench_enabled;
}

export function canSubmitRecipe(user: User | null): boolean {
  if (!user || user.status !== "active") return false;
  return user.role === "admin" || user.role === "participant";
}

export function canViewRecipe(
  user: User | null,
  recipe: Recipe,
): boolean {
  if (!user || user.status !== "active") return false;
  if (user.role === "admin") return true;
  if (recipe.status === "approved") return true;
  if (user.role === "participant" && recipe.author_user_id === user.id) {
    return true;
  }
  return false;
}

export function getVisibleRecipeStatuses(user: User | null): RecipeStatus[] | "all" {
  if (!user) return [];
  if (user.role === "admin") return "all";
  if (user.role === "participant") {
    return ["approved", "draft", "submitted", "rejected"];
  }
  return ["approved"];
}

export function canEditRecipe(user: User | null, recipe: Recipe): boolean {
  if (!user || user.status !== "active") return false;
  if (user.role === "admin") return true;
  if (user.role === "participant" && recipe.author_user_id === user.id) {
    return recipe.status === "draft" || recipe.status === "rejected";
  }
  return false;
}

export function canApproveRecipe(user: User | null): boolean {
  return canAccessAdmin(user);
}
