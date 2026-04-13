// Role types
export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  description?: string;
  permissions?: string[];
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
