import { generateId } from "@/lib/storage";
import type { AppState, Company, CompanyStatus } from "@/lib/types";

export interface CompanyInput {
  name: string;
  industry: string;
  province: string;
  status: CompanyStatus;
}

export function createCompany(
  state: AppState,
  input: CompanyInput,
  actorId: string,
): AppState {
  const now = new Date().toISOString();
  const company: Company = {
    id: generateId("co"),
    ...input,
    created_at: now,
    updated_at: now,
  };
  return {
    ...state,
    companies: [...state.companies, company],
    auditLogs: [
      ...state.auditLogs,
      {
        id: generateId("audit"),
        actor_user_id: actorId,
        action: "company.created",
        entity_type: "company",
        entity_id: company.id,
        metadata: { name: company.name },
        created_at: now,
      },
    ],
  };
}

export function updateCompany(
  state: AppState,
  id: string,
  updates: Partial<CompanyInput>,
  actorId: string,
): AppState {
  const now = new Date().toISOString();
  return {
    ...state,
    companies: state.companies.map((c) =>
      c.id === id ? { ...c, ...updates, updated_at: now } : c,
    ),
    auditLogs: [
      ...state.auditLogs,
      {
        id: generateId("audit"),
        actor_user_id: actorId,
        action: "company.updated",
        entity_type: "company",
        entity_id: id,
        metadata: { changes: Object.keys(updates) },
        created_at: now,
      },
    ],
  };
}

export function getCompanyStats(state: AppState, companyId: string) {
  const users = state.users.filter((u) => u.company_id === companyId);
  const recipes = state.recipes.filter((r) => r.company_id === companyId);
  return {
    userCount: users.length,
    recipesSubmitted: recipes.filter(
      (r) => r.status === "submitted" || r.status === "approved" || r.status === "rejected",
    ).length,
    recipesApproved: recipes.filter((r) => r.status === "approved").length,
  };
}
