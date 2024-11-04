import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams} from "react-router-dom";
import {
  Grid, Typography, Card, Button, Divider,
  Select, MenuItem, Box, Paper, SelectChangeEvent, CardContent, IconButton, Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import useBotsApi from "@/hooks/useBots";
import { AgentData } from "@/types/Bots";
import ActionAllower from "@/components/ActionAllower";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import { useAppContext } from "@/context/app";
import theme from "@/styles/theme";
import { Search, SearchIconWrapper, StyledInputBase } from "@/components/SearchBar";
import useApi from "@/hooks/api/useApi";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import WidgetsIcon from "@mui/icons-material/Widgets";
import { modelAIOptions } from "@/utils/LargeModelsUtils";
import ApiIcon from '@mui/icons-material/Api'; // Añade esta importación
import EditIcon from '@mui/icons-material/Edit';
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
import { alpha } from '@mui/material/styles';
import { PaginationFooter } from "@/utils/DashboardsUtils";
import { builderNavigationUtils } from '@/utils/NavigationUtils';

const IaPanel: React.FC<PageProps> = () => {
  const navigate = useNavigate();
  const { aiTeamId, aiTeamName } = useParams();
  const { auth, language, replacePath } = useAppContext();
  const { getBotsList, deleteBot } = useBotsApi();
  const { apiBase } = useApi();
  const t = languages[language as keyof typeof languages];

  const [state, setState] = useState<IaPanelState>({
    isLoading: true,
    isError: false,
    searchQuery: '',
    contentPerPage: '5',
    currentPage: 1,
    isSearching: false,
    pageContent: [],
    aiTeamName: aiTeamName,
    allowerState: false,
    botToDelete: "",
    isDeleting: false
  });

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
      replacePath([
        {
          label: t.leftMenu.aiTeams,
          current_path: "/builder",
          preview_path: "/builder",
          translationKey: "leftMenu.aiTeams"
        },
        {
          label: aiTeamName,
          current_path: `/builder/agents/${aiTeamName}/${aiTeamId}`,
          preview_path: "",
          translationKey: "aiTeamName",
          extraData: {
            aiTeamId,
            aiTeamName
          }
        }
      ]);
    }
  }, [aiTeamId, aiTeamName, replacePath, t]);

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

    if (auth?.uuid && aiTeamId) {
      loadData();
    }
  }, [auth?.uuid, aiTeamId, state.contentPerPage, state.currentPage]);

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
    <Card sx={commonStyles.card}>
      <CardContent sx={{
        ...commonStyles.cardContent,
        py: 1,
        position: 'relative',
      }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header con título y avatar */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2
          }}>
            {/*             <Avatar sx={{
              pt: "2px",
              mr: 1,
              color: theme.palette.secondary.contrastText,
              backgroundColor: theme.palette.secondary.light
            }}>
              {bot.name.charAt(0).toUpperCase()}
            </Avatar> */}
            <Box>
              <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                {bot.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t.iaPanel.created.replace("{date}", "20/10/2024")}
              </Typography>
            </Box>
          </Box>

          {/* Badge del modelo AI */}
          <Typography variant="body2" sx={{
            color: theme.palette.secondary.contrastText,
            backgroundColor: theme.palette.secondary.light,
            display: 'inline-block',
            padding: '7px 14px',
            borderRadius: '16px',
            fontSize: '0.95rem',
            fontWeight: 'medium',
            mb: 2,
            pt: "9px",
            lineHeight: '0.95rem',
            minWidth: '200px',
            textAlign: 'center',
          }}>
            {modelAIOptions.find(option => option.value === bot.model_ai)?.label || 'No especificado'}
          </Typography>

          <Divider sx={{
            mb: 2,
            mt: 2,
            width: "100%",
            borderColor: theme.palette.divider
          }} />

          {/* Sección de implementación */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{
              fontWeight: 'bold',
              fontSize: '1rem',
              mb: 1.5
            }}>
              {t.iaPanel.implementation}
            </Typography>
            <Box sx={{
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap'
            }}>
              <Tooltip title={t.iaPanel.testAgent}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate(`/builder/agents/chat/${bot.id}`)}
                  startIcon={<PlayArrowIcon />}
                  sx={{
                    flex: '1 1 auto',
                    minWidth: '40px',
                    '& .MuiButton-startIcon': {
                      margin: { xl: '0' }
                    },
                    '& .MuiButton-endIcon': {
                      margin: { xl: '0' }
                    },
                    '& .MuiButton-startIcon>*:nth-of-type(1)': {
                      fontSize: '20px'
                    },
                    px: { xl: 1 }
                  }}
                >
                  <Box sx={{ display: { xs: 'block', xl: 'none' } }}>
                    {t.iaPanel.testAgent}
                  </Box>
                </Button>
              </Tooltip>

              <Tooltip title={t.iaPanel.useAPI}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate(`/builder/agents/tools/${aiTeamId}/${bot.name}/${bot.id}`)}
                  startIcon={<ApiIcon />}
                  sx={{
                    flex: '1 1 auto',
                    minWidth: '40px',
                    '& .MuiButton-startIcon': {
                      margin: { xl: '0' }
                    },
                    '& .MuiButton-endIcon': {
                      margin: { xl: '0' }
                    },
                    '& .MuiButton-startIcon>*:nth-of-type(1)': {
                      fontSize: '20px'
                    },
                    px: { xl: 1 }
                  }}
                >
                  <Box sx={{ display: { xs: 'block', xl: 'none' } }}>
                    {t.iaPanel.useAPI}
                  </Box>
                </Button>
              </Tooltip>

              <Tooltip title={t.iaPanel.widget}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => window.open(apiBase.slice(0, -1) + bot.widget_url, "_blank")}
                  startIcon={<WidgetsIcon />}
                  sx={{
                    flex: '1 1 auto',
                    minWidth: '40px',
                    '& .MuiButton-startIcon': {
                      margin: { xl: '0' }
                    },
                    '& .MuiButton-endIcon': {
                      margin: { xl: '0' }
                    },
                    '& .MuiButton-startIcon>*:nth-of-type(1)': {
                      fontSize: '20px'
                    },
                    px: { xl: 1 }
                  }}
                >
                  <Box sx={{ display: { xs: 'block', xl: 'none' } }}>
                    {t.iaPanel.widget}
                  </Box>
                </Button>
              </Tooltip>
            </Box>
          </Box>

          <Divider sx={{
            mb: 2,
            mt: 2,
            width: "100%",
            borderColor: theme.palette.divider
          }} />

          {/* Sección de configuración */}
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{
              fontWeight: 'bold',
              fontSize: '1rem',
              mb: 1.5
            }}>
              {t.iaPanel.configuration}
            </Typography>
            <Box sx={{
              display: 'flex',
              flexWrap: 'nowrap',
            }}>
              <Box sx={{
                width: 140, // Ancho fijo para el primer botón
                flexShrink: 0 // Evita que el botón se encoja
              }}>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => navigate(`/builder/agents/widgetCustomizer/${bot.id}`)}
                  sx={{
                    color: theme.palette.primary.main,
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    p: 0,
                    minWidth: 0,
                    justifyContent: 'flex-start',
                    width: '100%',
                    '& span': {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'block',
                      textAlign: 'left'
                    },
                    '&:hover': {
                      backgroundColor: 'transparent'
                    }
                  }}
                >
                  <span>{t.iaPanel.customization}</span>
                </Button>
              </Box>
              <Box sx={{ width: 16, flexShrink: 0 }} /> {/* Espaciador fijo */}
              <Box sx={{
                width: 140, // Ancho fijo para el segundo botn
                flexShrink: 0 // Evita que el botón se encoja
              }}>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => navigate(`/builder/agents/tools/${aiTeamId}/${bot.name}/${bot.id}`)}
                  sx={{
                    color: theme.palette.primary.main,
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    p: 0,
                    minWidth: 0,
                    justifyContent: 'flex-start',
                    width: '100%',
                    '& span': {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'block',
                      textAlign: 'left'
                    },
                    '&:hover': {
                      backgroundColor: 'transparent'
                    }
                  }}
                >
                  <span>{t.iaPanel.tools}</span>
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Footer con acciones */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            position: 'absolute',
            top: 8,
            right: 8,
            gap: 0.5,
            zIndex: 1,
            '& .MuiIconButton-root': {
              padding: '4px',
              backgroundColor: alpha(theme.palette.background.paper, 0.2),
              '&:hover': {
                backgroundColor: alpha(theme.palette.background.paper, 0.2)
              }
            }
          }}>
            <Tooltip title={t.iaPanel.edit} arrow placement="top">
              <IconButton
                size="small"
                onClick={() => handleEditClick(bot)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <IconButton
              size="small"
              color="error"
              onClick={() => {
                setState(prev => ({
                  ...prev,
                  allowerState: true,
                  botToDelete: bot.id
                }));
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
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

    builderNavigationUtils.toAgentContext(navigate, {
      aiTeamId,
      botId: bot.id
    });
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
              <Paper elevation={3} sx={{
                p: 2,
                flexGrow: 1,
                overflow: 'auto',
                scrollbarColor: "auto",
                ...commonStyles.scrollableContent
              }}>
                <Grid container spacing={3}>
                  {state.pageContent.map((bot, index) => (
                    <Grid item xs={12} md={6} xl={4} sx={{ p: 0 }} key={`bot-${bot.id || index}`}>
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
