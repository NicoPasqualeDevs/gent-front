import { PageState } from './Page';
import { AgentData } from './Agents';

interface PaginationMetadata {
  current_page: number;
  total_pages: number;
  total_items: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface AgentsListState extends PageState {
  isLoading: boolean;
  isError: boolean;
  searchQuery: string;
  contentPerPage: string;
  currentPage: number;
  isSearching: boolean;
  pageContent: AgentData[];
  aiTeamName?: string;
  allowerState: boolean;
  botToDelete: string;
  isDeleting: boolean;
  paginationData?: PaginationMetadata;
  errorMessage?: string;
} 