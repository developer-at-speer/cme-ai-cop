import { generateId } from "@/lib/storage";
import type { AppState, User, UserRole, UserStatus } from "@/lib/types";

export interface UserInput {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  company_id: string | null;
  workbench_enabled: boolean;
  status: UserStatus;
}

export function createUser(
  state: AppState,
  input: UserInput,
  actorId: string,
): AppState {
  const now = new Date().toISOString();
  const user: User = {
    id: generateId("user"),
    name: input.name,
    email: input.email,
    password: input.password ?? "demo1234",
    role: input.role,
    company_id: input.company_id,
    workbench_enabled: input.workbench_enabled,
    status: input.status,
    created_at: now,
    updated_at: now,
  };
  return {
    ...state,
    users: [...state.users, user],
    auditLogs: [
      ...state.auditLogs,
      {
        id: generateId("audit"),
        actor_user_id: actorId,
        action: "user.created",
        entity_type: "user",
        entity_id: user.id,
        metadata: { name: user.name, email: user.email },
        created_at: now,
      },
    ],
  };
}

export function updateUser(
  state: AppState,
  id: string,
  updates: Partial<UserInput>,
  actorId: string,
): AppState {
  const now = new Date().toISOString();
  const existing = state.users.find((u) => u.id === id);
  return {
    ...state,
    users: state.users.map((u) =>
      u.id === id
        ? {
            ...u,
            ...updates,
            password: updates.password ?? u.password,
            updated_at: now,
          }
        : u,
    ),
    auditLogs: [
      ...state.auditLogs,
      {
        id: generateId("audit"),
        actor_user_id: actorId,
        action: "user.updated",
        entity_type: "user",
        entity_id: id,
        metadata: { name: existing?.name, changes: Object.keys(updates) },
        created_at: now,
      },
    ],
  };
}

export function toggleUserStatus(
  state: AppState,
  id: string,
  actorId: string,
): AppState {
  const user = state.users.find((u) => u.id === id);
  if (!user) return state;
  const newStatus = user.status === "active" ? "disabled" : "active";
  return updateUser(state, id, { status: newStatus }, actorId);
}

export function getActiveUserCount(state: AppState): number {
  return state.users.filter((u) => u.status === "active").length;
}

export function getUsersByCompany(state: AppState, companyId: string): User[] {
  return state.users.filter((u) => u.company_id === companyId);
}
