export type RoleKey =
  | "admin"
  | "reviewer"
  | "project_lead"
  | "supporter"
  | "applicant";

export function roleRedirect(roles: RoleKey[]) {
  // precedence matters
  if (roles.includes("admin")) return "/app/admin";
  if (roles.includes("reviewer")) return "/app/review";
  if (roles.includes("project_lead")) return "/app/projects";
  if (roles.includes("supporter")) return "/app/supporter";
  return "/app/applicant";
}