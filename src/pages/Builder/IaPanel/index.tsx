import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Grid, Typography, Button,
  Select, MenuItem, Box, Paper, SelectChangeEvent
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import useBotsApi from "@/hooks/useBots";
import { AgentData } from "@/types/Bots";
import ActionAllower from "@/components/ActionAllower";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import { useAppContext } from "@/context";
import { Search, SearchIconWrapper, StyledInputBase } from "@/components/SearchBar";
import useApi from "@/hooks/api/useApi";
import { modelAIOptions } from "@/utils/LargeModelsUtils";
import { languages } from "@/utils/Traslations";
import { PageProps } from '@/types/Page';
import { IaPanelState } from '../../../types/IaPanel';
import AddIcon from "@mui/icons-material/Add";
import {
  DashboardContainer,
  DashboardHeader,
  DashboardContent,
  commonStyles,
  SkeletonCard
} from "@/utils/DashboardsUtils";
import { PaginationFooter } from "@/utils/DashboardsUtils";
import { builderNavigationUtils } from '@/utils/NavigationUtils';
import { buildBreadcrumbs } from '@/utils/NavigationConfig';
import RobotCard from "@/components/RobotCard";
import HelpIcon from '@mui/icons-material/Help';
import { IconButton, Tooltip } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const IaPanel: React.FC<PageProps> = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const { aiTeamId, aiTeamName } = useParams();
  const { auth, language, replacePath, showRobotCardHelp, setShowRobotCardHelp } = useAppContext();
  const { getBotsList, deleteBot } = useBotsApi();
  const { apiBase } = useApi();
  const t = languages[language as keyof typeof languages];
  const location = useLocation();

  const [state, setState] = useState<IaPanelState>({
    isLoading: true,
    isError: false,
    searchQuery: '',
    contentPerPage: isLargeScreen ? '5' : '20',
    currentPage: 1,
    isSearching: false,
    pageContent: [],
    aiTeamName: aiTeamName,
    allowerState: false,
    botToDelete: "",
    isDeleting: false
  });

  useEffect(() => {
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

      if (!aiTeamId || !aiTeamName) {
        console.log('Missing required params:', { aiTeamId, aiTeamName });
        return;
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (aiTeamId && aiTeamName) {
      const breadcrumbs = buildBreadcrumbs('agents', {
        clientName: aiTeamName,
        aiTeamId: aiTeamId,
        label: aiTeamName
      }, {
        aiTeamId,
        aiTeamName
      });
      
      replacePath(breadcrumbs);
    }
  }, [aiTeamId, aiTeamName, replacePath]);

  const getBotsData = useCallback(async (filterParams: string) => {
    if (!aiTeamId || !auth?.uuid) {
      console.log('Missing required data:', { aiTeamId, authUuid: auth?.uuid });
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const params = filterParams.startsWith('?') ? filterParams : `?${filterParams}`;
      const response = await getBotsList(aiTeamId, params);

      if (response?.data) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isSearching: false,
          currentPage: response.metadata?.current_page || 1,
          pageContent: Array.isArray(response.data) ? response.data : [],
          paginationData: response.metadata
        }));
      }
    } catch (error) {
      console.error('Error fetching bots:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        pageContent: []
      }));
      ErrorToast(t.iaPanel.errorConnection);
    }
  }, [aiTeamId, auth?.uuid, getBotsList, t]);

  useEffect(() => {
    const loadData = async () => {
      if (!auth?.uuid || !aiTeamId) {
        console.log('No auth UUID or aiTeamId found, skipping data load');
        return;
      }

      try {
        console.log('Loading bots data...');
        const filterParams = `?page_size=${state.contentPerPage}&page=${state.currentPage}`;
        await getBotsData(filterParams);
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
    } else if (auth?.uuid && aiTeamId) {
      loadData();
    }
  }, [auth?.uuid, aiTeamId, state.contentPerPage, state.currentPage, location.state?.refreshData]);

  const handleSearch = useCallback((value: string) => {
    setState(prev => ({ ...prev, searchQuery: value }));

    if (value.trim() === "") {
      getBotsData(`?page_size=${state.contentPerPage}&page=${state.currentPage}`);
    } else {
      getBotsData(`?name__icontains=${value}&page_size=${state.contentPerPage}`);
    }
  }, [state.contentPerPage, state.currentPage, getBotsData]);

  const handlePagination = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    event.preventDefault();
    if (state.isLoading) return;

    setState(prev => ({ ...prev, currentPage: value }));
    getBotsData(`?page_size=${state.contentPerPage}&page=${value}`);
  }, [state.contentPerPage, state.isLoading, getBotsData]);

  const handleDelete = useCallback(async (botId: string) => {
    if (!botId || state.isLoading || state.isDeleting) return;

    try {
      setState(prev => ({ ...prev, isDeleting: true }));
      await deleteBot(botId);

      setState(prev => ({
        ...prev,
        pageContent: prev.pageContent.filter(item => item.id !== botId),
        allowerState: false,
        botToDelete: "",
        isDeleting: false
      }));
      SuccessToast(t.iaPanel.deleteSuccess);

      await getBotsData(`?page_size=${state.contentPerPage}&page=${state.currentPage}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        ErrorToast(t.iaPanel.errorConnection);
      } else {
        const apiError = error as { status: string; error: string; data?: string };
        ErrorToast(`${apiError.status} - ${apiError.error}${apiError.data ? ": " + apiError.data : ""}`);
      }
    } finally {
      setState(prev => ({ ...prev, isDeleting: false }));
    }
  }, [deleteBot, state.contentPerPage, state.currentPage, getBotsData, t]);

  const refreshData = useCallback(() => {
    getBotsData(`?page_size=${state.contentPerPage}&page=${state.currentPage}`);
  }, [state.contentPerPage, state.currentPage, getBotsData]);

  const handleContentPerPageChange = useCallback((event: SelectChangeEvent) => {
    const newValue = event.target.value;
    setState(prev => ({ ...prev, contentPerPage: newValue }));
    getBotsData(`?page_size=${newValue}&page=1`);
  }, [getBotsData]);

  const renderBotCard = (bot: AgentData) => (
    <RobotCard
      botId={bot.id}
      name={bot.name}
      description={modelAIOptions.find(option => option.value === bot.model_ai)?.label || t.iaPanel.noModelSpecified}
      lastUpdate={/* t.iaPanel?.lastUpdate.replace("{date}", "2 hours ago") || */ "Updates"}
      onWidget={() => window.open(apiBase.slice(0, -1) + bot.widget_url, "_blank")}
      onApi={() => navigate(`/builder/agents/tools/${aiTeamId}/${bot.name}/${bot.id}`)}
      onEdit={() => handleEditClick(bot)}
      onDelete={() => setState(prev => ({
        ...prev,
        allowerState: true,
        botToDelete: bot.id
      }))}
      onChat={() => navigate(`/chat/${bot.id}`)}
      onCustomize={() => navigate(`/builder/agents/widgetCustomizer/${bot.id}`)}
      onTools={() => navigate(`/builder/agents/tools/${aiTeamId}/${bot.name}/${bot.id}`)}
      t={t.robotCard}
      language={language}
      status={bot.status}
    />
  );

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
    if (!aiTeamId || !bot.id) {
      ErrorToast(t.iaPanel.errorMissingParams);
      return;
    }

    builderNavigationUtils.toAgentContext(
      navigate,
      { replacePath },
      {
        aiTeamId,
        botId: bot.id
      },
    );
  };

  const handleCreateBot = () => {
    if (!aiTeamId) {
      ErrorToast(t.iaPanel.errorMissingParams);
      return;
    }
    
    navigate(`/builder/agents/contextEntry/${aiTeamId}`);
  };

  return (
    <DashboardContainer>
      <DashboardHeader
        title={t.iaPanel.agentsOf.replace("{clientName}", aiTeamName || "")}
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
              <Tooltip title={showRobotCardHelp ? t.iaPanel.tooltipsEnabled : t.iaPanel.tooltipsDisabled}>
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
                placeholder={t.iaPanel.searchPlaceholder}
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
                <MenuItem value="5">5 {t.iaPanel.perPage}</MenuItem>
                <MenuItem value="10">10 {t.iaPanel.perPage}</MenuItem>
                <MenuItem value="20">20 {t.iaPanel.perPage}</MenuItem>
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
                  <SkeletonCard variant="agent" />
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
                    ? t.iaPanel.noAgentsFound
                    : t.iaPanel.noAgentsToShow}
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
                    {t.iaPanel.createAgent}
                  </Button>
                )}
                {state.searchQuery && (
                  <Button
                    variant="contained"
                    onClick={refreshData}
                    sx={{ mb: 2 }}
                  >
                    {t.iaPanel.reloadData}
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
            onClick: () => navigate(`/builder/agents/contextEntry/${aiTeamId}`),
            label: t.iaPanel.createAgent,
            show: true
          } : undefined}
          translations={{
            itemsCount: t.iaPanel.agentsCount,
            perPage: t.iaPanel.perPage
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

export default IaPanel;
