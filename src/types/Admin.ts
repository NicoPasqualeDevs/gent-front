export interface AdminUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  last_login: string;
  last_login_info?: {
    ip_address: string;
    user_agent: string;
    timestamp: string;
  };
  registration_info?: {
    ip_address: string;
    user_agent: string;
    timestamp: string;
  };
}

export interface UserStats {
  total_users: number;
  active_users: number;
  superusers: number;
  staff_users: number;
}

export interface NonSuperUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}
