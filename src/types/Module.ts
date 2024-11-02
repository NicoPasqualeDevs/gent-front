import { ReactNode } from 'react';

export interface ModuleProps {
  children?: ReactNode;
}

export interface ModuleState {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
} 