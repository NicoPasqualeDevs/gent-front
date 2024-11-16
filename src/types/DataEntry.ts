import { PageState } from '@/types/Page';

export interface DataEntryFormData {
  context: string;
  documents: File[];
}

export interface DataEntryState extends PageState {
  formData: DataEntryFormData;
  isSubmitting: boolean;
  isEditing: boolean;
  dragActive: boolean;
  uploadProgress?: number;
  uploadError?: string;
} 