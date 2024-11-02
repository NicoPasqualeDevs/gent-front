import { PageState } from '@/types/Page';

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