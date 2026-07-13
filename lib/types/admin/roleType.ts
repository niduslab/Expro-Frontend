// Role types
export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at?: string;
  updated_at?: string;
  description?: string;
  permissions?: string[];
  users_count?: number;
  is_protected?: boolean;
}

export interface RolesResponse {
  success: boolean;
  message: string;
  roles: Role[];
}

export interface AssignRoleRequest {
  user_id: number;
  roles: string[];
}

export interface AssignRoleResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Permission types
export interface Permission {
  id: number;
  name: string;
  guard_name: string;
}

export interface PermissionsResponse {
  success: boolean;
  message: string;
  permissions: Permission[];
}

export interface CreatePermissionRequest {
  name: string;
}

export interface CreateRoleRequest {
  name: string;
  permissions?: string[];
}

export interface UpdateRoleRequest {
  id: number;
  name?: string;
  permissions?: string[];
}

export interface MutationResponse {
  success: boolean;
  message: string;
}
