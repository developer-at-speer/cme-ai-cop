export type UserRole = "admin" | "participant" | "viewer";
export type UserStatus = "active" | "disabled";
export type CompanyStatus = "active" | "inactive";
export type RecipeStatus = "draft" | "submitted" | "approved" | "rejected";
export type AttributionPreference = "company" | "author" | "anonymous";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  company_id: string | null;
  workbench_enabled: boolean;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  province: string;
  status: CompanyStatus;
  created_at: string;
  updated_at: string;
}

export interface Recipe {
  id: string;
  title: string;
  problem_solved: string;
  manufacturing_use_case: string;
  category: string;
  department: string;
  workflow_steps: string;
  prompt_text: string;
  tools_used: string;
  models_used: string;
  expected_output: string;
  notes: string;
  safety_considerations: string;
  attribution_preference: AttributionPreference;
  author_user_id: string;
  company_id: string;
  status: RecipeStatus;
  rejection_reason: string | null;
  approved_by_user_id: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkbenchRun {
  id: string;
  user_id: string;
  company_id: string | null;
  model_provider: string;
  model_name: string;
  prompt_text: string;
  response_text: string;
  token_estimate: number;
  cost_estimate: number;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface AppState {
  users: User[];
  companies: Company[];
  recipes: Recipe[];
  workbenchRuns: WorkbenchRun[];
  auditLogs: AuditLog[];
}

export interface RecipeDraft {
  title: string;
  problem_solved: string;
  manufacturing_use_case: string;
  category: string;
  department: string;
  workflow_steps: string;
  prompt_text: string;
  tools_used: string;
  models_used: string;
  expected_output: string;
  notes: string;
  safety_considerations: string;
  attribution_preference: AttributionPreference;
}

export const RECIPE_CATEGORIES = [
  "Quality Assurance",
  "Production Planning",
  "Maintenance",
  "Supply Chain",
  "Safety & Compliance",
  "Engineering",
] as const;

export const RECIPE_DEPARTMENTS = [
  "Operations",
  "Quality",
  "Maintenance",
  "Procurement",
  "Engineering",
  "Health & Safety",
] as const;

export const AI_MODELS = [
  { provider: "openai", name: "GPT-4o mini", label: "GPT-4o mini" },
  { provider: "anthropic", name: "Claude 3.5 Haiku", label: "Claude 3.5 Haiku" },
] as const;

export type AIModel = (typeof AI_MODELS)[number];
