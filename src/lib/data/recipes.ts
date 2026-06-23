import { generateId } from "@/lib/storage";
import type {
  AppState,
  AttributionPreference,
  Recipe,
  RecipeDraft,
  RecipeStatus,
  User,
} from "@/lib/types";
import { canViewRecipe, getVisibleRecipeStatuses } from "@/lib/rbac";

export function getRecipesForUser(state: AppState, user: User): Recipe[] {
  const statuses = getVisibleRecipeStatuses(user);
  return state.recipes.filter((recipe) => {
    if (!canViewRecipe(user, recipe)) return false;
    if (statuses === "all") return true;
    if (statuses.includes(recipe.status)) {
      if (recipe.status === "approved") return true;
      return recipe.author_user_id === user.id;
    }
    return false;
  });
}

export function getRecipeById(
  state: AppState,
  id: string,
  user: User,
): Recipe | undefined {
  const recipe = state.recipes.find((r) => r.id === id);
  if (!recipe || !canViewRecipe(user, recipe)) return undefined;
  return recipe;
}

export function createRecipe(
  state: AppState,
  user: User,
  draft: RecipeDraft,
  status: RecipeStatus,
): AppState {
  const now = new Date().toISOString();
  const recipe: Recipe = {
    id: generateId("recipe"),
    ...draft,
    author_user_id: user.id,
    company_id: user.company_id ?? "",
    status,
    rejection_reason: null,
    approved_by_user_id: null,
    approved_at: null,
    created_at: now,
    updated_at: now,
  };
  return { ...state, recipes: [...state.recipes, recipe] };
}

export function updateRecipe(
  state: AppState,
  id: string,
  updates: Partial<Recipe>,
): AppState {
  const now = new Date().toISOString();
  return {
    ...state,
    recipes: state.recipes.map((r) =>
      r.id === id ? { ...r, ...updates, updated_at: now } : r,
    ),
  };
}

export function approveRecipe(
  state: AppState,
  recipeId: string,
  adminId: string,
  metadata?: { category?: string; department?: string },
): AppState {
  const now = new Date().toISOString();
  let newState = updateRecipe(state, recipeId, {
    status: "approved",
    approved_by_user_id: adminId,
    approved_at: now,
    rejection_reason: null,
    ...metadata,
  });
  newState = appendAuditLog(newState, {
    actor_user_id: adminId,
    action: "recipe.approved",
    entity_type: "recipe",
    entity_id: recipeId,
    metadata: { title: state.recipes.find((r) => r.id === recipeId)?.title },
  });
  return newState;
}

export function rejectRecipe(
  state: AppState,
  recipeId: string,
  adminId: string,
  reason: string,
): AppState {
  let newState = updateRecipe(state, recipeId, {
    status: "rejected",
    rejection_reason: reason,
    approved_by_user_id: null,
    approved_at: null,
  });
  newState = appendAuditLog(newState, {
    actor_user_id: adminId,
    action: "recipe.rejected",
    entity_type: "recipe",
    entity_id: recipeId,
    metadata: {
      title: state.recipes.find((r) => r.id === recipeId)?.title,
      reason,
    },
  });
  return newState;
}

function appendAuditLog(
  state: AppState,
  log: Omit<import("@/lib/types").AuditLog, "id" | "created_at">,
): AppState {
  return {
    ...state,
    auditLogs: [
      ...state.auditLogs,
      {
        ...log,
        id: generateId("audit"),
        created_at: new Date().toISOString(),
      },
    ],
  };
}

export function getAttributionLabel(
  recipe: Recipe,
  state: AppState,
): string {
  if (recipe.attribution_preference === "anonymous") return "Anonymous";
  if (recipe.attribution_preference === "company") {
    const company = state.companies.find((c) => c.id === recipe.company_id);
    return company?.name ?? "Unknown company";
  }
  const author = state.users.find((u) => u.id === recipe.author_user_id);
  return author?.name ?? "Unknown author";
}

export type { RecipeDraft, AttributionPreference };
