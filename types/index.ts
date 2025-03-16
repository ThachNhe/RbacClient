// Project related types
export interface ProjectOptions {
  enableAuth: boolean;
  enableSwagger: boolean;
}

export interface ProjectFormData {
  projectName: string;
  description?: string;
  enableAuth: boolean;
  enableSwagger: boolean;
}

// Database connection related types
export interface DatabaseConnection {
  ipAddress: string;
  username: string;
  password: string;
  database: string;
  port?: number;
}

export interface ConnectionStatus {
  isConnected: boolean;
  message: string;
}

// User-Role related types
export interface UserRole {
  userId: string;
  roleId: string;
  username?: string;
  roleName?: string;
}

export interface ConflictResult {
  missing: UserRole[];
  extra: UserRole[];
  valid: UserRole[];
}

// Role-Permission related types
export interface RolePermission {
  roleId: string;
  permissionId: string;
  roleName?: string;
  permissionName?: string;
}

export interface RolePermissionCheckResult {
  missingPermissions: RolePermission[];
  extraPermissions: RolePermission[];
  validPermissions: RolePermission[];
}

export interface PermissionRule {
  role: string;
  action: string;
  resource: string;
  condition: string;
}

export interface RolePermissionCheckResult {
  redundantRule: PermissionRule[];
  lackRule: PermissionRule[];
}
