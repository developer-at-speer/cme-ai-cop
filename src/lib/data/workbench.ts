import { generateId } from "@/lib/storage";
import type { AIModel, AppState, User, WorkbenchRun } from "@/lib/types";

export function createWorkbenchRun(
  state: AppState,
  user: User,
  model: AIModel,
  prompt: string,
  result: { response_text: string; token_estimate: number; cost_estimate: number },
): AppState {
  const run: WorkbenchRun = {
    id: generateId("run"),
    user_id: user.id,
    company_id: user.company_id,
    model_provider: model.provider,
    model_name: model.name,
    prompt_text: prompt,
    response_text: result.response_text,
    token_estimate: result.token_estimate,
    cost_estimate: result.cost_estimate,
    created_at: new Date().toISOString(),
  };
  return { ...state, workbenchRuns: [...state.workbenchRuns, run] };
}

export function getRecentRuns(state: AppState, limit = 5): WorkbenchRun[] {
  return [...state.workbenchRuns]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}
