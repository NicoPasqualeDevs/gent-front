import { useEffect, useState, useCallback, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context";
import { PageProps, PaginatedPageState } from "@/types/Page";
import { ErrorToast } from "@/components/Toast";
import { languages } from "@/utils/Traslations";
import useAiTeamsApi from "@/hooks/apps/teams";
import { AiTeamsDetails } from "@/types/Teams";

import { 
  Box, 
  Paper, 
  Grid, 
  Typography, 
  Select, 
  MenuItem, 
  SelectChangeEvent,
  Card,
  CardContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import ActionAllower from "@/components/ActionAllower";
import { SuccessToast } from "@/components/Toast";
import { 
  DashboardContainer, 
  DashboardHeader, 
  DashboardContent, 
  commonStyles,
  SkeletonCard
} from "@/utils/DashboardsUtils";
import { Search, SearchIconWrapper, StyledInputBase } from "@/components/SearchBar";
import { PaginationFooter } from "@/utils/DashboardsUtils";

// Componente AiTeamCard
const AiTeamCard = lazy(() => import("@/components/TeamCard"));

interface AiTeamsListState extends PaginatedPageState {
  pageContent: AiTeamsDetails[];
  paginationData?: {
    current_page: number;
    total_pages: number;
    total_items: number;
    page_size: number;
  };
  allowerState: boolean;
  clientToDelete: string;
}

const AiTeamsList: React.FC<PageProps> = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const { auth, language, setClientPage } = useAppContext();
  const { getMyAiTeams, getAiTeamsByOwner, deleteAiTeamDetails } = useAiTeamsApi();
  const [state, setState] = useState<AiTeamsListState>({
    isLoading: true,
    isError: false,
    searchQuery: "",
    contentPerPage: isLargeScreen ? "5" : "20",
    currentPage: 1,
    isSearching: false,
    pageContent: [],
    allowerState: false,
    clientToDelete: ""
  });
  const t = languages[language as keyof typeof languages];

  useEffect(() => {    
    const loadData = async () => {
      if (!auth?.uuid) {
        return;
      }
      try {
        const filterParams = `?page_size=${state.contentPerPage}&page=${state.currentPage}`;
        await getAiTeamsData(filterParams);
      } catch (error) {
        setState(prev => ({ 
          ...prev,
          isLoading: false,
          isError: true,
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        }));
        ErrorToast(t.actionAllower.fieldRequired);
      }
    };

    if (auth?.uuid) {
      loadData();
    }
  }, [auth, state.contentPerPage, state.currentPage]);

  useEffect(() => {
    setState(prev => ({
      ...prev,
      contentPerPage: isLargeScreen ? prev.contentPerPage : "20"
    }));
  }, [isLargeScreen]);

  const getAiTeamsData = useCallback(async (filterParams: string) => {
    if (!auth?.uuid) {
      console.log('No auth UUID in getAiTeamsData, aborting');
      return;
    }
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      let response;
      if (auth.is_superuser) {
        console.log('Fetching as superuser');
        response = await getMyAiTeams(filterParams);
      } else {
        console.log('Fetching as regular user');
        response = await getAiTeamsByOwner(auth.uuid, filterParams);
      }
      if (response?.data) {
        const paginationData = response.metadata ? {
          current_page: response.metadata.current_page || 1,
          total_pages: response.metadata.total_pages || 1,
          total_items: response.metadata.total_items || 0,
          page_size: response.metadata.page_size || 5
        } : undefined;

        setState(prev => ({
          ...prev,
          isLoading: false,
          isSearching: false,
          currentPage: response.metadata?.current_page || 1,
          pageContent: Array.isArray(response.data) ? response.data : [],
          paginationData
        }));
        setClientPage(response.metadata?.current_page || 1);
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        isError: true,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        pageContent: []
      }));
      ErrorToast(t.aiTeamsForm.errorConnection);
    }
  }, [auth, getMyAiTeams, getAiTeamsByOwner, setClientPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setState(prev => ({ ...prev, searchQuery: e.target.value }));
    if (e.target.value.trim() === "") {
      getAiTeamsData(`?page_size=${state.contentPerPage}&page=${state.currentPage}`);
    } else {
      getAiTeamsData(`?name__icontains=${e.target.value}&page_size=${state.contentPerPage}`);
    }
  };

  const handleContentPerPageChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value;
    setState(prev => ({ ...prev, contentPerPage: newValue }));
    getAiTeamsData(`?page_size=${newValue}&page=1`);
  };

  const handlePagination = (_event: React.ChangeEvent<unknown>, value: number) => {
    setState(prev => ({ ...prev, currentPage: value }));
    getAiTeamsData(`?page_size=${state.contentPerPage}&page=${value}`);
  };

  const handleDelete = async (teamId: string) => {
    if (!teamId) return;

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      await deleteAiTeamDetails(teamId);
      
      setState(prev => ({
        ...prev,
        pageContent: prev.pageContent.filter(item => item.id !== teamId),
        allowerState: false,
        clientToDelete: "",
        isLoading: false
      }));
      
      SuccessToast(t.aiTeamsList.successDelete);
      await getAiTeamsData(`?page_size=${state.contentPerPage}&page=${state.currentPage}`);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        isError: true,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      }));
      ErrorToast(t.aiTeamsForm.errorConnection);
    }
  };

  return (
    <DashboardContainer>
      <DashboardHeader
        title={t.aiTeamsList.yourAiTeams}
        actions={
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            gap: 2,
            width: { xs: '100%', sm: 'auto' }
          }}>
            <Search sx={{
              ...commonStyles.searchContainer,
              width: { xs: '83.33%', sm: '200px' }
            }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder={t.aiTeamsList.searchPlaceholder}
                value={state.searchQuery}
                onChange={handleSearch}
              />
            </Search>
            {isLargeScreen && (
              <Select
                value={state.contentPerPage}
                onChange={handleContentPerPageChange}
                size="small"
                sx={{ width: { xs: '83.33%', sm: 'auto' } }}
              >
                <MenuItem value="5">5 {t.aiTeamsList.perPage}</MenuItem>
                <MenuItem value="10">10 {t.aiTeamsList.perPage}</MenuItem>
                <MenuItem value="20">20 {t.aiTeamsList.perPage}</MenuItem>
              </Select>
            )}
          </Box>
        }
      />

      <DashboardContent>
        {state.isLoading ? (
          <Paper elevation={3} sx={{ p: 2, flexGrow: 1 }}>
            <Grid container spacing={3}>
              {[...Array(parseInt(state.contentPerPage))].map((_, index) => (
                <Grid item xs={12} md={6} xl={4} key={`skeleton-${index}`}>
                  <SkeletonCard variant="aiTeam" />
                </Grid>
              ))}
            </Grid>
          </Paper>
        ) : (
          <>
            {state.pageContent.length > 0 ? (
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 2, 
                  flexGrow: 1,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  scrollbarColor: "auto",
                  ...commonStyles.scrollableContent 
                }}
              >
                <Grid 
                  container 
                  spacing={3}
                  justifyContent={{ xs: 'center', lg: 'flex-start' }}
                >
                  {state.pageContent.map((team, index) => (
                    <Grid 
                      item 
                      xs={12} 
                      sm={6} 
                      md={6} 
                      lg={4} 
                      key={`aiTeam-${index}`}
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        maxWidth: { xs: '500px', lg: 'none' }
                      }}
                    >
                      <Card sx={{
                        ...commonStyles.card,
                        width: '100%',
                        maxWidth: '460px'
                      }}>
                        <CardContent sx={{
                          ...commonStyles.cardContent,
                          pb: 2,
                          py: 1,
                        }}>
                          <AiTeamCard 
                            aiTeam={team}
                            onDelete={() => handleDelete(team.id)}
                            onEdit={() => navigate(`/builder/form/${team.name}/${team.id}`)}
                            onManage={() => navigate(`/builder/agents/${team.name}/${team.id}`)}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            ) : (
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                <Typography color={theme.palette.secondary.light}>
                  {state.searchQuery
                    ? t.aiTeamsList.noTeamsFound
                    : t.aiTeamsList.noTeamsToShow}
                </Typography>
              </Paper>
            )}
          </>
        )}
      </DashboardContent>

      {state.pageContent.length > 0 && state.paginationData && (
        <PaginationFooter
          currentPage={state.currentPage}
          totalPages={state.paginationData.total_pages}
          totalItems={state.paginationData.total_items}
          itemsPerPage={state.contentPerPage}
          onPageChange={handlePagination}
          onItemsPerPageChange={handleContentPerPageChange}
          translations={{
            itemsCount: t.aiTeamsList.teamsCount,
            perPage: t.aiTeamsList.perPage
          }}
        />
      )}

      {state.allowerState && (
        <ActionAllower
          allowerStateCleaner={(value: boolean) => setState(prev => ({ ...prev, allowerState: value }))}
          actionToDo={handleDelete}
          actionParams={state.clientToDelete}
        />
      )}
    </DashboardContainer>
  );
};

export default AiTeamsList;
