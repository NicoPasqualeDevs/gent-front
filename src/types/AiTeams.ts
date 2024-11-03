import { PageState } from '@/types/Page';

export interface AiTeamsDetails {
  id: string;
  name: string;
  description?: string;
  owner?: string;
  address?: string;
  owner_data?: {
    name: string;
    email: string;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface AiTeamsFormData {
  name: string;
  description: string;
  address: string;
  owner?: string;
}

export interface AiTeamsFormState extends PageState {
  formData: AiTeamsFormData;
  isSubmitting: boolean;
  isEditing: boolean;
  searchQuery: string;
  contentPerPage: string;
  isSearching: boolean;
  users: User[];
  errorMessage?: string;
} 