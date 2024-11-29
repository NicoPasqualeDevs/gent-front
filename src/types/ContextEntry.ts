import { PageState } from '@/types/Page';

export interface ContextEntryFormData {
  name: string;
  description: string;
  model_ai: string;
  [key: string]: string;
}

export interface ContextEntryState extends PageState {
  formData: ContextEntryFormData;
  isSubmitting: boolean;
  isEditing: boolean;
} 

// Tipo para KTags
export interface Ktag {
  [propKey: string]: string | undefined;
  id: string;
  agent: string;
  name: string;
  value: string;
}