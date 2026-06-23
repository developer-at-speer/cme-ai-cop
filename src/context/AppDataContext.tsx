"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  approveRecipe,
  createRecipe,
  rejectRecipe,
  updateRecipe,
  type RecipeDraft,
} from "@/lib/data/recipes";
import {
  createCompany,
  updateCompany,
  type CompanyInput,
} from "@/lib/data/companies";
import {
  createUser,
  toggleUserStatus,
  updateUser,
  type UserInput,
} from "@/lib/data/users";
import { createWorkbenchRun } from "@/lib/data/workbench";
import { runMockAI } from "@/lib/mock/ai";
import {
  loadAppState,
  resetAppState,
  saveAppState,
} from "@/lib/storage";
import type {
  AIModel,
  AppState,
  RecipeStatus,
  User,
} from "@/lib/types";

interface AppDataContextValue {
  state: AppState;
  refreshUser: (userId: string) => User | null;
  resetDemo: () => void;
  saveRecipe: (
    user: User,
    draft: RecipeDraft,
    status: RecipeStatus,
    existingId?: string,
  ) => string;
  approveRecipeById: (
    admin: User,
    recipeId: string,
    metadata?: { category?: string; department?: string },
  ) => void;
  rejectRecipeById: (admin: User, recipeId: string, reason: string) => void;
  runWorkbench: (
    user: User,
    model: AIModel,
    prompt: string,
  ) => Promise<{ response_text: string; token_estimate: number; cost_estimate: number }>;
  createUserAccount: (actor: User, input: UserInput) => void;
  updateUserAccount: (
    actor: User,
    id: string,
    input: Partial<UserInput>,
  ) => void;
  toggleUserActive: (actor: User, id: string) => void;
  createCompanyRecord: (actor: User, input: CompanyInput) => void;
  updateCompanyRecord: (
    actor: User,
    id: string,
    input: Partial<CompanyInput>,
  ) => void;
  workbenchDraft: RecipeDraft | null;
  setWorkbenchDraft: (draft: RecipeDraft | null) => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState | null>(null);
  const [workbenchDraft, setWorkbenchDraft] = useState<RecipeDraft | null>(
    null,
  );

  useEffect(() => {
    setState(loadAppState());
  }, []);

  const persist = useCallback((newState: AppState) => {
    setState(newState);
    saveAppState(newState);
  }, []);

  const refreshUser = useCallback(
    (userId: string): User | null => {
      if (!state) return null;
      return state.users.find((u) => u.id === userId) ?? null;
    },
    [state],
  );

  const resetDemo = useCallback(() => {
    const fresh = resetAppState();
    setState(fresh);
    setWorkbenchDraft(null);
  }, []);

  const saveRecipe = useCallback(
    (
      user: User,
      draft: RecipeDraft,
      status: RecipeStatus,
      existingId?: string,
    ): string => {
      if (!state) return "";
      let newState = state;
      if (existingId) {
        newState = updateRecipe(newState, existingId, { ...draft, status });
        persist(newState);
        return existingId;
      }
      newState = createRecipe(newState, user, draft, status);
      persist(newState);
      return newState.recipes[newState.recipes.length - 1].id;
    },
    [state, persist],
  );

  const approveRecipeById = useCallback(
    (
      admin: User,
      recipeId: string,
      metadata?: { category?: string; department?: string },
    ) => {
      if (!state) return;
      persist(approveRecipe(state, recipeId, admin.id, metadata));
    },
    [state, persist],
  );

  const rejectRecipeById = useCallback(
    (admin: User, recipeId: string, reason: string) => {
      if (!state) return;
      persist(rejectRecipe(state, recipeId, admin.id, reason));
    },
    [state, persist],
  );

  const runWorkbench = useCallback(
    async (user: User, model: AIModel, prompt: string) => {
      if (!state) throw new Error("App state not loaded");
      const result = await runMockAI(model, prompt);
      const newState = createWorkbenchRun(state, user, model, prompt, result);
      persist(newState);
      return result;
    },
    [state, persist],
  );

  const createUserAccount = useCallback(
    (actor: User, input: UserInput) => {
      if (!state) return;
      persist(createUser(state, input, actor.id));
    },
    [state, persist],
  );

  const updateUserAccount = useCallback(
    (actor: User, id: string, input: Partial<UserInput>) => {
      if (!state) return;
      persist(updateUser(state, id, input, actor.id));
    },
    [state, persist],
  );

  const toggleUserActive = useCallback(
    (actor: User, id: string) => {
      if (!state) return;
      persist(toggleUserStatus(state, id, actor.id));
    },
    [state, persist],
  );

  const createCompanyRecord = useCallback(
    (actor: User, input: CompanyInput) => {
      if (!state) return;
      persist(createCompany(state, input, actor.id));
    },
    [state, persist],
  );

  const updateCompanyRecord = useCallback(
    (actor: User, id: string, input: Partial<CompanyInput>) => {
      if (!state) return;
      persist(updateCompany(state, id, input, actor.id));
    },
    [state, persist],
  );

  if (!state) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <AppDataContext.Provider
      value={{
        state,
        refreshUser,
        resetDemo,
        saveRecipe,
        approveRecipeById,
        rejectRecipeById,
        runWorkbench,
        createUserAccount,
        updateUserAccount,
        toggleUserActive,
        createCompanyRecord,
        updateCompanyRecord,
        workbenchDraft,
        setWorkbenchDraft,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
