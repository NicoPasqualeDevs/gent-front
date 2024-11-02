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
  Tooltip
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from '@mui/icons-material/Person';
import ActionAllower from "@/components/ActionAllower";
import { SuccessToast } from "@/components/Toast";

// Componentes de búsqueda estilizados
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

// Componente AiTeamCard
const AiTeamCard = lazy(() => import("@/components/AiTeams/AiTeamCard"));

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
    <Container maxWidth="xl" sx={{ py: 2, px: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Header con búsqueda y botón de nuevo equipo */}
        <Paper elevation={0} sx={{ backgroundColor: 'transparent', p: 0 }}>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}>
            {auth?.is_superuser && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/builder/form')}
                fullWidth
                sx={{
                  color: theme.palette.secondary.main,
                  width: '100%',
                  maxWidth: { xs: '100%', sm: '200px' }
                }}
              >
                {t.aiTeamsList.newAiTeam}
              </Button>
            )}
            <Box sx={{
              width: '100%',
              display: 'flex',
              justifyContent: { xs: 'center', sm: 'flex-end' }
            }}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder={t.aiTeamsList.searchPlaceholder}
                  value={state.searchQuery}
                  onChange={handleSearch}
                  fullWidth
                />
              </Search>
            </Box>
          </Box>
        </Paper>

        {/* Título y selector de items por página */}
        <Paper elevation={3} sx={{ p: 2 }}>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}>
            <Typography variant="h5" sx={{ mr: 2 }}>
              {t.aiTeamsList.yourAiTeams}
            </Typography>
            <Select
              value={state.contentPerPage}
              onChange={handleContentPerPageChange}
              size="small"
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              <MenuItem value="5">5 {t.aiTeamsList.perPage}</MenuItem>
              <MenuItem value="10">10 {t.aiTeamsList.perPage}</MenuItem>
              <MenuItem value="20">20 {t.aiTeamsList.perPage}</MenuItem>
            </Select>
          </Box>
        </Paper>

        {/* Lista de equipos */}
        {state.isLoading ? (
          <PageCircularProgress />
        ) : (
          <>
            {state.pageContent.length > 0 ? (
              <Paper elevation={3} sx={{ p: 2, minHeight: '33vh' }}>
                <Grid container spacing={3}>
                  {state.pageContent.map((aiTeam, index) => (
                    <Grid item xs={12} sm={6} md={4} key={`aiTeam-${index}`}>
                      <Card sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: 'transparent',
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: 'none',
                        width: '100%',
                      }}>
                        <CardContent sx={{
                          flexGrow: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          p: 3,
                          '&:last-child': { pb: 3 },
                        }}>
                          <AiTeamCard 
                            aiTeam={aiTeam}
                            onDelete={() => handleDelete(aiTeam.id)}
                            onEdit={() => navigate(`/builder/form/${aiTeam.name}/${aiTeam.id}`)}
                            onManage={() => navigate(`/builder/agents/${aiTeam.name}/${aiTeam.id}`)}
                          />
                          
                          {aiTeam.owner_data && (
                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                              <Tooltip title={t.aiTeamsList.owner}>
                                <PersonIcon sx={{ mr: 1, fontSize: 'small', color: theme.palette.text.secondary }} />
                              </Tooltip>
                              <Typography variant="body2" color="text.secondary">
                                {aiTeam.owner_data.name} ({aiTeam.owner_data.email})
                              </Typography>
                            </Box>
                          )}
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

        {/* Paginación */}
        {state.pageContent.length > 0 && state.paginationData && (
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}>
              <Pagination
                count={state.paginationData.total_pages}
                page={state.currentPage}
                onChange={handlePagination}
                color="primary"
                size="small"
              />
              {state.paginationData?.total_items !== undefined && (
                <Typography variant="body2" color="text.secondary">
                  {`${(state.currentPage - 1) * parseInt(state.contentPerPage) + 1} - ${Math.min(
                    state.currentPage * parseInt(state.contentPerPage),
                    state.paginationData.total_items
                  )} ${t.aiTeamsList.teamsCount.replace("{total}", state.paginationData.total_items.toString())}`}
                </Typography>
              )}
            </Box>
          </Paper>
        )}
      </Box>

      {state.allowerState && (
        <ActionAllower
          allowerStateCleaner={(value: boolean) => setState(prev => ({ ...prev, allowerState: value }))}
          actionToDo={handleDelete}
          actionParams={state.clientToDelete}
        />
      )}
    </Container>
  );
};

export default AiTeamsList;
