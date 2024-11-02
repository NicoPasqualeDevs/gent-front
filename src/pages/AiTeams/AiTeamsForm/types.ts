import { PageState } from '@/types/Page';
import { AiTeamsDetails } from '@/types/AiTeams';

export interface AiTeamsFormData {
  name: string;
  description: string;
  owner?: string;
}

export interface AiTeamsFormState extends PageState {
  formData: AiTeamsFormData;
  isSubmitting: boolean;
  isEditing: boolean;
} 