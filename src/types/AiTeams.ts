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

export interface AiTeamsFormData {
  name: string;
  description: string;
  owner?: string;
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
} 