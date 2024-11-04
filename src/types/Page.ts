import { ModuleState } from './Module';

export interface PageProps {
  className?: string;
}

export interface PageState extends ModuleState {
  searchQuery: string;
  contentPerPage: string;
  isSearching: boolean;
}

export interface PaginatedPageState extends PageState {
  currentPage: number;
} 