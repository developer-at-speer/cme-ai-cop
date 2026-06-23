import type { AppState } from "@/lib/types";

export function getActivitySummary(state: AppState) {
  const activeUsers = state.users.filter((u) => u.status === "active").length;
  const workbenchRuns = state.workbenchRuns.length;
  const recipesSubmitted = state.recipes.filter(
    (r) => r.status === "submitted" || r.status === "approved" || r.status === "rejected",
  ).length;
  const recipesApproved = state.recipes.filter((r) => r.status === "approved").length;
  const pendingApprovals = state.recipes.filter((r) => r.status === "submitted").length;

  return {
    activeUsers,
    workbenchRuns,
    recipesSubmitted,
    recipesApproved,
    pendingApprovals,
  };
}

export function getUsageByCompany(state: AppState) {
  const map = new Map<string, { companyName: string; runs: number }>();

  for (const run of state.workbenchRuns) {
    const companyId = run.company_id ?? "cme";
    const company = state.companies.find((c) => c.id === companyId);
    const companyName = company?.name ?? "CME";
    const existing = map.get(companyId) ?? { companyName, runs: 0 };
    existing.runs += 1;
    map.set(companyId, existing);
  }

  return Array.from(map.values()).sort((a, b) => b.runs - a.runs);
}

export function getUsageByModel(state: AppState) {
  const map = new Map<string, number>();

  for (const run of state.workbenchRuns) {
    const key = run.model_name;
    map.set(key, (map.get(key) ?? 0) + 1);
  }

  return Array.from(map.entries())
    .map(([model, runs]) => ({ model, runs }))
    .sort((a, b) => b.runs - a.runs);
}

export function getRecipeFunnel(state: AppState) {
  return {
    draft: state.recipes.filter((r) => r.status === "draft").length,
    submitted: state.recipes.filter((r) => r.status === "submitted").length,
    approved: state.recipes.filter((r) => r.status === "approved").length,
    rejected: state.recipes.filter((r) => r.status === "rejected").length,
  };
}
