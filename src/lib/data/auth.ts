import type { AppState, User } from "@/lib/types";

export function findUserByCredentials(
  state: AppState,
  email: string,
  password: string,
): User | null {
  const user = state.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );
  if (!user || user.status === "disabled") return null;
  return user;
}

export function getUserById(state: AppState, id: string): User | undefined {
  return state.users.find((u) => u.id === id);
}
