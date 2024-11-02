import { PageState } from '@/types/Page';

export interface ContextEntryFormData {
  name: string;
  description: string;
  model_ai: string;
}

export interface ContextEntryState extends PageState {
  formData: ContextEntryFormData;
  isSubmitting: boolean;
  isEditing: boolean;
} 