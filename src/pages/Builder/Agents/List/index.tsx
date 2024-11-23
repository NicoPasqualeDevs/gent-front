import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Grid, Typography, Button,
  Select, MenuItem, Box, Paper, SelectChangeEvent
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import useAgentsApi from "@/hooks/apps/agents";
import { AgentData } from "@/types/Agents";
import ActionAllower from "@/components/ActionAllower";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import { useAppContext } from "@/context";
import { Search, SearchIconWrapper, StyledInputBase } from "@/components/SearchBar";
import useApi from "@/hooks/api/useApi";
import { languages } from "@/utils/Traslations";
import { PageProps } from '@/types/Page';
import { AgentsListState } from '@/types/AgentsList';
import AddIcon from "@mui/icons-material/Add";
import {
  DashboardContainer,
  DashboardHeader,
  DashboardContent,
  commonStyles
} from "@/utils/DashboardsUtils";
import { PaginationFooter } from "@/utils/DashboardsUtils";
import { builderNavigationUtils } from '@/utils/NavigationUtils';
import { buildBreadcrumbs } from '@/utils/NavigationConfig';
import RobotCard from "@/components/RobotCard";
import HelpIcon from '@mui/icons-material/Help';
import { IconButton, Tooltip } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';
import { modelAIOptions } from '@/utils/Constants';
import { PathData } from "@/types/Pathbar";

const AgentsList: React.FC<PageProps> = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const { teamId, teamName } = useParams();
  const { auth, language, replacePath, showRobotCardHelp, setShowRobotCardHelp } = useAppContext();
  const { getAgentsList, deleteAgent } = useAgentsApi();
  const { apiBase } = useApi();
  const t = languages[language as keyof typeof languages];
  const location = useLocation();

  const [state, setState] = useState<AgentsListState>({
    isLoading: true,
    isError: false,
    searchQuery: '',
    contentPerPage: isLargeScreen ? '5' : '20',
    currentPage: 1,
    isSearching: false,
    pageContent: [],
    teamName: teamName,
    allowerState: false,
    botToDelete: "",
    isDeleting: false
  });

  useEffect(() => {
    console.log(teamName);
    setState(prev => ({
      ...prev,
      contentPerPage: isLargeScreen ? prev.contentPerPage : "20"
    }));
  }, [isLargeScreen]);

  useEffect(() => {
    const initializeAuth = () => {
      if (!auth) {
        console.log('No auth found, redirecting to login');
        navigate('/auth/login');
        return;
      }

      if (!teamId || !teamName) {
        console.log('Missing required params:', { teamId, teamName });
        return;
      }
    };

    initializeAuth();
  }, []);

  const updateBreadcrumbs = useCallback((breadcrumbs: PathData[]) => {
    replacePath(breadcrumbs);
  }, []);

  useEffect(() => {
    if (teamId && teamName) {
      const breadcrumbs = buildBreadcrumbs('agents', {
        clientName: teamName,
        teamId: teamId,
        label: teamName
      }, {
        teamId,
        teamName
      });
      updateBreadcrumbs(breadcrumbs);
    }
  }, [teamId, teamName, updateBreadcrumbs]);

  const getAgentsData = useCallback(async (filterParams: string) => {
    if (!teamId || !auth?.uuid) {
      console.log('Missing required data:', { teamId, authUuid: auth?.uuid });
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const params = filterParams.startsWith('?') ? filterParams : `?${filterParams}`;
      const response = await getAgentsList(teamId, params);

      if (response?.data) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isSearching: false,
          currentPage: response.metadata?.current_page || 1,
          pageContent: Array.isArray(response.data) ? response.data : [],
          paginationData: response.metadata ? {
            current_page: response.metadata.current_page || 1,
            total_pages: response.metadata.total_pages || 1,
            total_items: response.metadata.total_items || 0,
            page_size: response.metadata.page_size || 10,
            has_next: response.metadata.has_next || false,
            has_previous: response.metadata.has_previous || false
          } : undefined
        }));
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        pageContent: []
      }));
      ErrorToast(t.agentsList.errorConnection);
    }
  }, [teamId, auth?.uuid, getAgentsList, t]);

  useEffect(() => {
    const loadData = async () => {
      if (!auth?.uuid || !teamId) {
        console.log('No auth UUID or teamId found, skipping data load');
        return;
      }

      try {
        console.log('Loading agents data...');
        const filterParams = `?page_size=${state.contentPerPage}&page=${state.currentPage}`;
        await getAgentsData(filterParams);
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

    if (location.state?.refreshData) {
      loadData();
      navigate(location.pathname, { replace: true, state: {} });
    } else if (auth?.uuid && teamId) {
      loadData();
    }
  }, [auth?.uuid, teamId, state.contentPerPage, state.currentPage, location.state?.refreshData]);

  const handleSearch = useCallback((value: string) => {
    setState(prev => ({ ...prev, searchQuery: value }));

    if (value.trim() === "") {
      getAgentsData(`?page_size=${state.contentPerPage}&page=${state.currentPage}`);
    } else {
      getAgentsData(`?name__icontains=${value}&page_size=${state.contentPerPage}`);
    }
  }, [state.contentPerPage, state.currentPage, getAgentsData]);

  const handlePagination = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    event.preventDefault();
    if (state.isLoading) return;

    setState(prev => ({ ...prev, currentPage: value }));
    getAgentsData(`?page_size=${state.contentPerPage}&page=${value}`);
  }, [state.contentPerPage, state.isLoading, getAgentsData]);

  const handleDelete = useCallback(async (botId: string) => {
    if (!botId || state.isLoading || state.isDeleting) return;

    try {
      setState(prev => ({ ...prev, isDeleting: true }));
      await deleteAgent(botId);

      setState(prev => ({
        ...prev,
        pageContent: prev.pageContent.filter(item => item.id !== botId),
        allowerState: false,
        botToDelete: "",
        isDeleting: false
      }));
      SuccessToast(t.agentsList.deleteSuccess);

      await getAgentsData(`?page_size=${state.contentPerPage}&page=${state.currentPage}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        ErrorToast(t.agentsList.errorConnection);
      } else {
        const apiError = error as { status: string; error: string; data?: string };
        ErrorToast(`${apiError.status} - ${apiError.error}${apiError.data ? ": " + apiError.data : ""}`);
      }
    } finally {
      setState(prev => ({ ...prev, isDeleting: false }));
    }
  }, [deleteAgent, state.contentPerPage, state.currentPage, getAgentsData, t]);

  const refreshData = useCallback(() => {
    getAgentsData(`?page_size=${state.contentPerPage}&page=${state.currentPage}`);
  }, [state.contentPerPage, state.currentPage, getAgentsData]);

  const handleContentPerPageChange = useCallback((event: SelectChangeEvent) => {
    const newValue = event.target.value;
    setState(prev => ({ ...prev, contentPerPage: newValue }));
    getAgentsData(`?page_size=${newValue}&page=1`);
  }, [getAgentsData]);

  const renderBotCard = (agent: AgentData) => {
    const validStatus = (agent.status as "online" | "offline" | "busy" | "error" | "updating") || "offline";
    
    return (
      <RobotCard
        agentId={agent.id}
        name={agent.name}
        description={modelAIOptions.find(option => option.value === agent.model_ai)?.label || t.agentsList.noModelSpecified}
        lastUpdate={/* t.iaPanel?.lastUpdate.replace("{date}", "2 hours ago") || */ "Updates"}
        onWidget={() => window.open(apiBase.slice(0, -1) + agent.widget_url, "_blank")}
        onApi={() => navigate(`/builder/agents/tools/${teamId}/${agent.name}/${agent.id}`)}
        onEdit={() => handleEditClick(agent)}
        onDelete={() => setState(prev => ({
          ...prev,
          allowerState: true,
          botToDelete: agent.id
        }))}
        onChat={() => navigate(`/chat/${agent.id}`)}
        onCustomize={() => navigate(`/builder/agents/widgetCustomizer/${agent.id}`)}
        onTools={() => navigate(`/builder/agents/tools/${teamId}/${agent.name}/${agent.id}`)}
        t={t.robotCard}
        language={language}
        status={validStatus}
        selectedApiKey={agent.selected_api_key?.toString() || null}
        modelAi={agent.model_ai || undefined}
        onConfigureLLM={(apiKeyId) => {
          console.log(`API Key ${apiKeyId} configurada para el bot ${agent.id}`);
        }}
      />
    );
  };

  const handleAllowerStateChange = (value: boolean) => {
    if (!value) {
      setState(prev => ({
        ...prev,
        allowerState: false,
        botToDelete: ""
      }));
    }
  };

  const handleEditClick = (bot: AgentData) => {
    if (!teamId || !bot.id) {
      ErrorToast(t.agentsList.errorMissingParams);
      return;
    }

    builderNavigationUtils.toAgentContext(
      navigate,
      { replacePath: replacePath as (path: PathData[]) => void },
      {
        teamId,
        agentId: bot.id
      },
    );
  };

  const handleCreateBot = () => {
    if (!teamId) {
      ErrorToast(t.agentsList.errorMissingParams);
      return;
    }
    
    navigate(`/builder/agents/contextEntry/${teamId}`);
  };

  return (
    <DashboardContainer>
      <DashboardHeader
        title={t.agentsList.agentsOf.replace("{clientName}", teamName || "")}
        actions={
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            gap: 2,
            width: { xs: '100%', sm: 'auto' }
          }}>
            <Box sx={{ 
              display: { xs: 'none', md: 'block' }
            }}>
              <Tooltip title={showRobotCardHelp ? t.agentsList.tooltipsEnabled : t.agentsList.tooltipsDisabled}>
                <IconButton
                  onClick={() => setShowRobotCardHelp(prev => !prev)}
                  sx={{ 
                    color: showRobotCardHelp ? 'white' : 'rgba(255, 255, 255, 0.3)',
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: showRobotCardHelp ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)'
                    },
                    mr: 1
                  }}
                >
                  <HelpIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Search sx={commonStyles.searchContainer}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder={t.agentsList.searchPlaceholder}
                value={state.searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Search>
            {isLargeScreen && (
              <Select
                value={state.contentPerPage}
                onChange={handleContentPerPageChange}
                size="small"
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                <MenuItem value="5">5 {t.agentsList.perPage}</MenuItem>
                <MenuItem value="10">10 {t.agentsList.perPage}</MenuItem>
                <MenuItem value="20">20 {t.agentsList.perPage}</MenuItem>
              </Select>
            )}
          </Box>
        }
      />

      <DashboardContent>
        {state.isLoading ? (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px'
            }}
          >
            <CircularProgress />
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
                  spacing={2}
                  justifyContent={{ xs: 'center', lg: 'flex-start' }}
                >
                  {state.pageContent.map((bot, index) => (
                    <Grid 
                      item 
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={4}
                      sx={{ 
                        display: 'flex',
                        justifyContent: 'center',
                        maxWidth: { xs: '500px', lg: 'none' },
                        width: '100%'
                      }} 
                      key={`bot-${bot.id || index}`}
                    >
                      {renderBotCard(bot)}
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            ) : (
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  {state.searchQuery
                    ? t.agentsList.noAgentsFound
                    : t.agentsList.noAgentsToShow}
                </Typography>
                {auth?.is_superuser && !state.searchQuery && (
                  <Button
                    variant="contained"
                    onClick={handleCreateBot}
                    startIcon={<AddIcon />}
                    sx={{
                      color: 'white',
                      '&:hover': {
                        color: 'white',
                      },
                      mb: 2
                    }}
                  >
                    {t.agentsList.createAgent}
                  </Button>
                )}
                {state.searchQuery && (
                  <Button
                    variant="contained"
                    onClick={refreshData}
                    sx={{ mb: 2 }}
                  >
                    {t.agentsList.reloadData}
                  </Button>
                )}
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
          createButton={auth?.is_superuser ? {
            onClick: () => navigate(`/builder/agents/contextEntry/${teamId}`),
            label: t.agentsList.createAgent,
            show: true
          } : undefined}
          translations={{
            itemsCount: t.agentsList.agentsCount,
            perPage: t.agentsList.perPage
          }}
        />
      )}

      {state.allowerState && (
        <ActionAllower
          allowerStateCleaner={handleAllowerStateChange}
          actionToDo={handleDelete}
          actionParams={state.botToDelete}
        />
      )}
    </DashboardContainer>
  );
};

export default AgentsList;