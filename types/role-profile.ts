export interface RoleProfile {
  id: string;
  name: string; // e.g. "Full Stack Developer"
  jobTitle?: string;
  color: string; // Hex color for UI
  isDefault?: boolean;
  createdAt: number;
  updatedAt: number;
}
