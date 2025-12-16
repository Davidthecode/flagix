export type Project = {
  id: string;
  name: string;
  subtitle: string;
  flags: number;
  environments: number;
  lastUpdated: string;
  isFavorite: boolean;
  isOwner: boolean;
  userRole: ProjectRole;
};

export type ProjectRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

export type ProjectDetail = {
  id: string;
  name: string;
  description: string | null;
};

export type ProjectMemberDetail = {
  id: string;
  user: { id: string; name: string; email: string };
  role: ProjectRole;
  status: "ACTIVE" | "PENDING";
  project: { id: string; name: string };
};

export type ProjectSettingsResponse = {
  project: ProjectDetail;
  members: ProjectMemberDetail[];
  userRole: ProjectRole | undefined;
  isAuthorizedToEdit: boolean;
};

export type ProjectMetricsData = {
  flags: number;
  environments: number;
  evaluations: number;
};
