export interface AiTeamsDetails {
  id: string;
  name: string;
  description?: string;
  owner?: string;
  owner_data?: {
    name: string;
    email: string;
  };
}

export interface AiTeamsFormData {
  name: string;
  description: string;
  owner?: string;
}

