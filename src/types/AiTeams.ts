export interface AiTeamsDetails {
  id?: string;
  name: string;
  address: string;
  description: string;
  code?: string;
  user_email?: string;
  owner_data?: {
    id: string;
    name: string;
    email: string;
  };
}

