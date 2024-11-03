import { PaginatedPageState } from '@/types/Page';
import { AgentData } from '@/types/Bots';
import { Metadata } from '@/types/Api';

export interface IaPanelState extends PaginatedPageState {
  pageContent: AgentData[];
  paginationData?: Metadata;
  aiTeamName?: string;
  allowerState: boolean;
  botToDelete: string;
  isDeleting: boolean;
} 