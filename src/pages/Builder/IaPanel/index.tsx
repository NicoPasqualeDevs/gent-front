import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Grid, Typography, Pagination, Card, CardActions, Button, Divider,
  Select, MenuItem, Box, Container, Paper, SelectChangeEvent, CardContent, IconButton, CardHeader, Avatar, Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import useBotsApi from "@/hooks/useBots";
import { PageCircularProgress } from "@/components/CircularProgress";
import { AgentData } from "@/types/Bots";
import { Metadata } from "@/types/Api";
import ActionAllower from "@/components/ActionAllower";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import { useAppContext } from "@/context/app";
import theme from "@/styles/theme";
import { Search, SearchIconWrapper, StyledInputBase } from "@/components/SearchBar";
import useApi from "@/hooks/useApi";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import WidgetsIcon from "@mui/icons-material/Widgets";
import { modelAIOptions } from "@/utils/LargeModelsUtils";
import ApiIcon from '@mui/icons-material/Api'; // Añade esta importación
import EditIcon from '@mui/icons-material/Edit';
import { languages } from "@/utils/Traslations";
import { PageProps } from '@/types/Page';
import { IaPanelState } from './types';
import AddIcon from "@mui/icons-material/Add";

const IaPanel: React.FC<PageProps> = () => {
  const navigate = useNavigate();
  const { aiTeamId, aiTeamName } = useParams();
  const { auth, language, replacePath } = useAppContext();
  const { getBotsList, deleteBot } = useBotsApi();
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
  const t = languages[language as keyof typeof languages];
  const { apiBase } = useApi();

  const getBotsData = useCallback(async (filterParams: string) => {
    if (!aiTeamId) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const response = await getBotsList(aiTeamId, filterParams);

      if (response) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isSearching: false,
          currentPage: response.metadata.current_page || 1,
          pageContent: response.data,
          paginationData: response.metadata
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        isError: true,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      }));
      ErrorToast(t.actionAllower.fieldRequired);
    }
  }, [aiTeamId, getBotsList, t]);

  useEffect(() => {
    let isSubscribed = true;

    const initializePage = async () => {
      try {
        if (!auth?.user?.uuid) {
          throw new Error('User not authenticated');
        }

        if (!aiTeamId) {
          throw new Error('AI Team ID is required');
        }

        // Configurar navegación
        replacePath([
          {
            label: t.leftMenu.aiTeams,
            current_path: "/builder",
            preview_path: "/builder",
          },
          {
            label: state.aiTeamName || '',
            current_path: `/builder/agents/${aiTeamName}/${aiTeamId}`,
            preview_path: "",
          },
        ]);

        if (isSubscribed) {
          await getBotsData(`?page_size=${state.contentPerPage}&page=${state.currentPage}`);
        }
      } catch (error) {
        if (isSubscribed) {
          setState(prev => ({ 
            ...prev,
            isLoading: false,
            isError: true,
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
          }));
          ErrorToast(t.actionAllower.fieldRequired);
          navigate('/builder');
        }
      }
    };

    initializePage();

    return () => {
      isSubscribed = false;
    };
  }, [auth?.user?.uuid, aiTeamId, aiTeamName, state.contentPerPage, state.currentPage, state.aiTeamName, getBotsData, navigate, replacePath, t]);

  const handleSearch = useCallback((value: string) => {
    if (state.isSearching) return;
    
    setState(prev => ({ ...prev, searchQuery: value, isSearching: true }));
    
    const params = value.trim() !== "" 
      ? `?name__icontains=${value}&page_size=${state.contentPerPage}`
      : `?page_size=${state.contentPerPage}&page=${state.currentPage}`;
    
    getBotsData(params);
  }, [state.contentPerPage, state.currentPage, state.isSearching, getBotsData]);

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
    } catch (error: any) {
      ErrorToast(error instanceof Error
        ? t.iaPanel.errorConnection
        : `${error.status} - ${error.error}${error.data ? ": " + error.data : ""}`
      );
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
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: '12px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <Box sx={{ 
        position: 'relative', 
        zIndex: 2, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <CardHeader
          avatar={
            <Avatar aria-label="bot">
              {bot.name.charAt(0).toUpperCase()}
            </Avatar>
          }
          title={bot.name}
          subheader={t.iaPanel.created.replace("{date}", "20/10/2024")}
          sx={{
            p: 1.5,
            '& .MuiCardHeader-title': {
              fontSize: '1.1rem',
              fontWeight: 'bold',
            },
            '& .MuiCardHeader-subheader': {
              fontSize: '0.9rem',
            },
            '& .MuiCardHeader-avatar': {
              marginRight: 1,
            },
          }}
          action={
            <Tooltip title={t.iaPanel.edit} arrow placement="top">
              <IconButton
                onClick={() => navigate(`/builder/agents/contextEntry/${aiTeamId}/${bot.id}`)}
                size="small"
                sx={{ 
                  zIndex: 3,
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          }
        />
        
        <CardContent sx={{ flexGrow: 1, p: 0 }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" sx={{
              color: theme.palette.secondary.main,
              backgroundColor: theme.palette.primary.main,
              display: 'inline-block',
              padding: '7px 14px',
              borderRadius: '16px',
              fontSize: '0.95rem',
              fontWeight: 'medium',
              mb: 1,
              mt: 1,
              minWidth: '200px',
              textAlign: 'center',
            }}>
              {modelAIOptions.find(option => option.value === bot.model_ai)?.label || 'No especificado'}
            </Typography>
          </Box>
          
          <Divider />
          
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
              {t.iaPanel.implementation}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between', 
              alignItems: { xs: 'stretch', md: 'center' },
              gap: 0.5,
              mt: 2 
            }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate(`/builder/agents/chat/${bot.id}`)}
                startIcon={<PlayArrowIcon />}
                fullWidth
                sx={{ 
                  flex: 1,
                  padding: '4px 8px',
                  '& .MuiButton-startIcon': {
                    marginRight: 0.5,
                  },
                  '& .MuiButton-label': {
                    marginTop: '2px',
                    lineHeight: 1,
                  }
                }}
              >
                {t.iaPanel.testAgent}
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate(`/builder/agents/tools/${aiTeamId}/${bot.name}/${bot.id}`)}
                startIcon={<ApiIcon />}
                fullWidth
                sx={{ 
                  flex: 1,
                  padding: '4px 8px',
                  '& .MuiButton-startIcon': {
                    marginRight: 0.5,
                  },
                  '& .MuiButton-label': {
                    marginTop: '2px',
                    lineHeight: 1,
                  }
                }}
              >
                {t.iaPanel.useAPI}
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => window.open(apiBase.slice(0, -1) + bot.widget_url, "_blank")}
                startIcon={<WidgetsIcon />}
                fullWidth
                sx={{ 
                  flex: 1,
                  padding: '4px 8px',
                  '& .MuiButton-startIcon': {
                    marginRight: 0.5,
                  },
                  '& .MuiButton-label': {
                    marginTop: '2px',
                    lineHeight: 1,
                  }
                }}
              >
                {t.iaPanel.widget}
              </Button>
            </Box>
          </Box>
          
          <Divider />
          
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
              {t.iaPanel.configuration}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'row',
              justifyContent: 'flex-start',
              gap: 1,
              flexWrap: 'wrap',
              ml: '-4px'
            }}>
              {[t.iaPanel.data, t.iaPanel.customization, t.iaPanel.tools].map((action) => (
                <Button
                  key={action}
                  variant="text"
                  size="small"
                  onClick={() => {
                    const routes: { [key: string]: string } = {
                      [t.iaPanel.data]: `/builder/agents/dataEntry/${bot.id}`,
                      [t.iaPanel.customization]: `/builder/agents/widgetCustomizer/${bot.id}`,
                      [t.iaPanel.tools]: `/builder/agents/tools/${aiTeamId}/${bot.name}/${bot.id}`,
                    };
                    navigate(routes[action]);
                  }}
                  sx={{ 
                    textTransform: 'none',
                    color: theme.palette.primary.main,
                    fontSize: '0.9rem',
                  }}
                >
                  {action}
                </Button>
              ))}
            </Box>
          </Box>
        </CardContent>
        
        <CardActions sx={{ justifyContent: 'flex-end', p: 1 }}>
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
        </CardActions>
      </Box>
    </Card>
  );

  const handleAllowerStateChange = (value: boolean) => {
    setState(prev => ({ 
      ...prev, 
      allowerState: value,
      botToDelete: value ? prev.botToDelete : "" 
    }));
  };

  if (!aiTeamId || !aiTeamName) {
    return null;
  }

  if (state.isLoading) {
    return <PageCircularProgress />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2, px: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Paper elevation={0} sx={{ backgroundColor: 'transparent', p: 0 }}>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}>
            {auth?.user?.is_superuser && (
              <Button
                variant="contained"
                onClick={() => navigate(`/builder/agents/contextEntry/${aiTeamId}`)}
                fullWidth
                sx={{
                  width: '100%',
                  maxWidth: { xs: '100%', sm: '200px' },
                  color: 'white',
                  '&:hover': {
                    color: 'white',
                  },
                }}
              >
                {t.iaPanel.createAgent}
              </Button>
            )}
            <Box sx={{
              width: '100%',
              display: 'flex',
              justifyContent: { xs: 'center', sm: 'flex-end' }
            }}>
              <Search sx={{
                position: 'relative',
                width: '100%',
                maxWidth: { xs: '100%', sm: '300px' },
              }}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder={t.iaPanel.searchPlaceholder}
                  value={state.searchQuery}
                  inputProps={{
                    "aria-label": "search",
                    style: { padding: '8px 40px 8px 16px' }
                  }}
                  onChange={(e) => handleSearch(e.target.value)}
                  fullWidth
                />
              </Search>
            </Box>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 2 }}>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}>
            <Typography variant="h5" sx={{ mr: 2 }}>
              {t.iaPanel.agentsOf.replace("{clientName}", aiTeamName || "")}
            </Typography>
            <Select
              value={state.contentPerPage}
              onChange={handleContentPerPageChange}
              size="small"
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              {[5, 10, 20].map((value) => (
                <MenuItem key={value} value={value.toString()}>
                  {value} {t.iaPanel.perPage}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Paper>

        {state.isLoading ? (
          <PageCircularProgress />
        ) : (
          <>
            {Array.isArray(state.pageContent) && state.pageContent.length > 0 ? (
              <Paper elevation={3} sx={{
                p: 2,
                border: `2px solid transparent`,
                backgroundColor: 'background.paper',
                minHeight: '33vh'
              }}>
                <Grid container spacing={2}>
                  {state.pageContent.map((bot, index) => (
                    <Grid 
                      item 
                      xs={12} 
                      sm={12} 
                      md={6} 
                      lg={6} 
                      xl={6} 
                      key={`bot-${bot.id || index}`}
                    >
                      {renderBotCard(bot)}
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            ) : (
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="subtitle1">
                  {state.searchQuery && state.searchQuery.trim() !== ""
                    ? t.iaPanel.noAgentsFound
                    : t.iaPanel.noAgentsToShow}
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={refreshData}
                  sx={{ mt: 2 }}
                >
                  Recargar datos
                </Button>
              </Paper>
            )}

            {Array.isArray(state.pageContent) && state.pageContent.length > 0 && state.paginationData && (
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
                  {state.paginationData && (
                    <Typography variant="body2" color="text.secondary">
                      {`${(state.currentPage - 1) * (state.paginationData?.page_size ?? 0) + 1} - ${Math.min(
                        state.currentPage * (state.paginationData?.page_size ?? 0),
                        state.paginationData?.total_items ?? 0
                      )} ${t.iaPanel.agentsCount.replace("{total}", state.paginationData?.total_items?.toString() || "0")}`}
                    </Typography>
                  )}
                </Box>
              </Paper>
            )}
          </>
        )}
      </Box>
      {state.allowerState && (
        <ActionAllower
          allowerStateCleaner={handleAllowerStateChange}
          actionToDo={handleDelete}
          actionParams={state.botToDelete}
        />
      )}
    </Container>
  );
};

export default IaPanel;
