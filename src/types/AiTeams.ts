import { PageState } from '@/types/Page';

export interface OwnerData {
  name: string;
  email: string;
  id: string;
}

export interface AiTeamsDetails {
  id: string;
  name: string;
  description?: string;
  address?: string;
  owner_data?: OwnerData;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface AiTeamsFormState extends PageState {
  formData: AiTeamsDetails;
  isSubmitting: boolean;
  isEditing: boolean;
  searchQuery: string;
  contentPerPage: string;
  isSearching: boolean;
  users: User[];
  errorMessage?: string;
} 