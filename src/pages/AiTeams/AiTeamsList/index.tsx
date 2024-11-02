import { useEffect, useState, useCallback, lazy, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/app";
import { PageCircularProgress } from "@/components/CircularProgress";
import { PageProps, PaginatedPageState } from "@/types/Page";
import { ErrorToast } from "@/components/Toast";
import { languages } from "@/utils/Traslations";
import useAiTeamsApi from "@/hooks/useAiTeams";
import { AiTeamsDetails } from "@/types/AiTeams";
import { Metadata } from "@/types/Api";
import { 
  Container, 
  Box, 
  Paper, 
  Grid, 
  Typography, 
  Button, 
  Select, 
  MenuItem, 
  Pagination,
  SelectChangeEvent,
  useTheme,
  InputBase,
  styled,
  alpha,
  Card,
  CardContent,
  Tooltip,
  Skeleton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

import ActionAllower from "@/components/ActionAllower";
import { SuccessToast } from "@/components/Toast";
import { 
  DashboardContainer, 
  DashboardHeader, 
  DashboardContent, 
  DashboardFooter,
  commonStyles,
  SkeletonCard
} from "@/utils/DashboardsUtils";
import { Search, SearchIconWrapper, StyledInputBase } from "@/components/SearchBar";

// Componente AiTeamCard
const AiTeamCard = lazy(() => import("@/components/AiTeamCard"));

interface AiTeamsListState extends PaginatedPageState {
  pageContent: AiTeamsDetails[];
  paginationData?: Metadata;
  allowerState: boolean;
  clientToDelete: string;
}

const AiTeamsList: React.FC<PageProps> = () => {
  const navigate = useNavigate();
  const { auth, language, setClientPage } = useAppContext();
  const { getMyAiTeams, getAiTeamsByOwner, deleteAiTeamDetails } = useAiTeamsApi();
  const [state, setState] = useState<AiTeamsListState>({
    isLoading: true,
    isError: false,
    searchQuery: "",
    contentPerPage: "5",
    currentPage: 1,
    isSearching: false,
    pageContent: [],
    allowerState: false,
    clientToDelete: ""
  });
  const t = languages[language as keyof typeof languages];
  const theme = useTheme();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initializeAuth = () => {
      if (!auth) {
        console.log('No auth found, redirecting to login');
        navigate('/auth/login');
        return;
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    console.log('Auth state changed:', auth);
    
    const loadData = async () => {
      if (!auth?.uuid) {
        console.log('No auth UUID found, skipping data load');
        return;
      }

      try {
        console.log('Loading AI teams data...');
        const filterParams = `?page_size=${state.contentPerPage}&page=${state.currentPage}`;
        await getAiTeamsData(filterParams);
      } catch (error) {
        console.error('Error loading data:', error);
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

  const getAiTeamsData = useCallback(async (filterParams: string) => {
    if (!auth?.uuid) {
      console.log('No auth UUID in getAiTeamsData, aborting');
      return;
    }

    console.log('Fetching AI teams with params:', filterParams);
    console.log('Auth state:', auth);

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

      console.log('API response:', response);

      if (response?.data) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isSearching: false,
          currentPage: response.metadata?.current_page || 1,
          pageContent: Array.isArray(response.data) ? response.data : [],
          paginationData: response.metadata
        }));
        setClientPage(response.metadata?.current_page || 1);
      }
    } catch (error) {
      console.error('Error fetching AI teams:', error);
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

  const handlePagination = (event: React.ChangeEvent<unknown>, value: number) => {
    setState(prev => ({ ...prev, currentPage: value }));
    getAiTeamsData(`?page_size=${state.contentPerPage}&page=${value}`);
  };

  const handleDelete = async (aiTeamId: string) => {
    if (!aiTeamId) return;

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      await deleteAiTeamDetails(aiTeamId);
      
      setState(prev => ({
        ...prev,
        pageContent: prev.pageContent.filter(item => item.id !== aiTeamId),
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
          </Box>
        }
      />

      <DashboardContent>
        {state.isLoading ? (
          <Paper elevation={3} sx={{ p: 2, flexGrow: 1}}>
            <Grid container spacing={3}>
              {[...Array(parseInt(state.contentPerPage))].map((_, index) => (
                <Grid item xs={12} md={6} xl={4} key={`skeleton-${index}`}>
                  <SkeletonCard />
                </Grid>
              ))}
            </Grid>
          </Paper>
        ) : (
          <>
            {state.pageContent.length > 0 ? (
              <Paper elevation={3} sx={{ p: 2, flexGrow: 1, overflow: 'auto', scrollbarColor: "auto", ...commonStyles.scrollableContent }}>
                <Grid container spacing={3}>
                  {state.pageContent.map((aiTeam, index) => (
                    <Grid item xs={12} md={6} xl={4} key={`aiTeam-${index}`}>
                      <Card sx={commonStyles.card}>
                        <CardContent sx={{
                          ...commonStyles.cardContent,
                          pb: 2,
                          py: 1,
                        }}>
                          <AiTeamCard 
                            aiTeam={aiTeam}
                            onDelete={() => handleDelete(aiTeam.id)}
                            onEdit={() => navigate(`/builder/form/${aiTeam.name}/${aiTeam.id}`)}
                            onManage={() => navigate(`/builder/agents/${aiTeam.name}/${aiTeam.id}`)}
                          />
                        </CardContent>
                        

                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            ) : (
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="subtitle1">
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
        <DashboardFooter>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            width: '100%'
          }}>
            {/* Paginación a la izquierda */}
            <Box sx={{ width: { xs: '83.33%', sm: 'auto' } }}>
              <Pagination
                count={state.paginationData.total_pages}
                page={state.currentPage}
                onChange={handlePagination}
                color="primary"
                size="small"
              />
            </Box>

            {/* Contador de páginas a la derecha */}
            {state.paginationData?.total_items !== undefined && (
              <Box sx={{ 
                textAlign: { xs: 'center', sm: 'right' },
                width: { xs: '83.33%', sm: 'auto' }
              }}>
                <Typography variant="body2" color="text.secondary">
                  {`${(state.currentPage - 1) * parseInt(state.contentPerPage) + 1} - ${Math.min(
                    state.currentPage * parseInt(state.contentPerPage),
                    state.paginationData.total_items
                  )} ${t.aiTeamsList.teamsCount.replace("{total}", state.paginationData.total_items.toString())}`}
                </Typography>
              </Box>
            )}
          </Box>
        </DashboardFooter>
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
