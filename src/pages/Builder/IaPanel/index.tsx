import React, { useEffect, useState, useCallback, useRef } from "react";
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

const IaPanel: React.FC = () => {
  const { clientName, aiTeamId } = useParams();
  const navigate = useNavigate();
  const { replacePath, appNavigation, agentsPage, setAgentsPage, language, auth } = useAppContext();
  const { getBotsList, deleteBot } = useBotsApi();
  const [loaded, setLoaded] = useState(false);
  const [allowerState, setAllowerState] = useState(false);
  const [botToDelete, setbotToDelete] = useState("");
  const [pageContent, setPageContent] = useState<AgentData[]>([]);
  const [paginationData, setPaginationData] = useState<Metadata>();
  const [searchQuery, setSearchQuery] = useState("");
  const [contentPerPage, setContentPerPage] = useState("5");
  const { apiBase } = useApi()
  const t = languages[language as keyof typeof languages];
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const getBotsData = useCallback((filterParams: string = '') => {
    if (!aiTeamId) {
      ErrorToast("Conflicto en el id del cliente");
      return;
    }
    setIsLoading(true);
    getBotsList(aiTeamId, filterParams)
      .then(response => {
        setAgentsPage(response.metadata.current_page || 1);
        setPageContent(response.data);
        setPaginationData(response.metadata);
        setLoaded(true);
      })
      .catch(error => {
        ErrorToast(error instanceof Error
          ? "Error: no se pudo establecer conexión con el servidor"
          : `${error.status} - ${error.error}${error.data ? ": " + error.data : ""}`
        );
      })
      .finally(() => {
        setIsLoading(false);
        setIsSearching(false);
      });
  }, [aiTeamId, getBotsList]);

  const handlePagination = (event: React.ChangeEvent<unknown>, value: number) => {
    event.preventDefault();
    setAgentsPage(value);
    setLoaded(false);
    getBotsData(`?page_size=${contentPerPage}&page=${value}`);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setIsSearching(true);
    if (value.trim() !== "") {
      getBotsData(`?name__icontains=${value}&page_size=${contentPerPage}`);
    } else {
      getBotsData(`?page_size=${contentPerPage}&page=${agentsPage}`);
    }
  };

  const deleteAction = (botId: string) => {
    if (botId) {
      deleteBot(botId)
        .then(() => {
          setPageContent(prev => prev.filter(item => item.id !== botId));
          setAllowerState(false);
          setbotToDelete("");
          SuccessToast("Chatbot eliminado satisfactoriamente");
        })
        .catch(error => {
          ErrorToast(error instanceof Error
            ? "Error: no se pudo establecer conexión con el servidor"
            : `${error.status} - ${error.error}${error.data ? ": " + error.data : ""}`
          );
        });
    } else {
      ErrorToast("Error al cargar botId al borrar");
    }
  };

  useEffect(() => {
    if (aiTeamId && clientName) {
      replacePath([
        ...appNavigation.slice(0, 1),
        { label: clientName, current_path: `/builder/agents/${clientName}/${aiTeamId}`, preview_path: "" },
      ]);
      if (!loaded) {
        getBotsData(`?page_size=${contentPerPage}&page=${agentsPage}`);
      }
    } else {
      ErrorToast("Error al cargar aiTeamId en esta vista");
    }
  }, []);

  const renderBotCard = (bot: AgentData) => (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: '12px',
      overflow: 'hidden',
      position: 'relative',
      '&::before, &::after': {
        content: '""',
        position: 'absolute',
        left: 0,
        right: 0,
        height: '0%',
        backgroundColor: 'transparent',
        transition: 'height 0.3s ease-in-out',
        zIndex: 1,
      },
      '&::before': {
        top: 0,
        borderTop: `1px solid transparent`, // Cambiado de 2px a 1px
      },
      '&::after': {
        bottom: 0,
        borderBottom: `1px solid transparent`, // Cambiado de 2px a 1px
      },
      '&:hover::before, &:hover::after': {
        height: '50%',
        backgroundColor: `${theme.palette.secondary.light}05`,
        borderColor: theme.palette.secondary.light,
      },
    }}>
      <Box sx={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
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
              fontSize: '1.1rem', // Aumentado de 1rem
              fontWeight: 'bold',
            },
            '& .MuiCardHeader-subheader': {
              fontSize: '0.9rem', // Aumentado de 0.8rem
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
              mb: 1, // Reducido de 2 a 1
              mt: 1, // Añadido margen superior de 1
              minWidth: '200px',
              textAlign: 'center',
            }}>
              {modelAIOptions.find(option => option.value === bot.model_ai)?.label || 'No especificado'}
            </Typography>
          </Box>
          
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" sx={{
              color: theme.palette.text.secondary,
              mb: 2,
              height: '3em',
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              fontSize: '0.95rem', // Aumentado de 0.875rem
            }}>
              {bot.description}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between', 
              alignItems: { xs: 'stretch', md: 'center' },
              gap: 0.5, // Reducido de 1 a 0.5
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
                    marginRight: 0.5, // Reducido de 1 a 0.5
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
                    marginRight: 0.5, // Reducido de 1 a 0.5
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
              flexWrap: 'wrap'
            }}>
              {[t.iaPanel.data, t.iaPanel.customization, t.iaPanel.tools].map((action) => (
                <Button
                  key={action}
                  variant="text"
                  size="small"
                  onClick={() => {
                    const routes: { [key: string]: string } = {
                      [t.iaPanel.data]: `/builder/agents/dataEntry/${bot.id}`,
                      [t.iaPanel.customization]: `/builder/agents/customMessages/${bot.id}`,
                      [t.iaPanel.tools]: `/builder/agents/tools/${aiTeamId}/${bot.name}/${bot.id}`,
                    };
                    navigate(routes[action]);
                  }}
                  disabled={action === t.iaPanel.customization}
                  sx={{ 
                    textTransform: 'none',
                    color: action === t.iaPanel.customization ? theme.palette.text.disabled : theme.palette.primary.main,
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
              setAllowerState(true);
              setbotToDelete(bot.id);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </CardActions>
      </Box>
    </Card>
  );

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
                  value={searchQuery}
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
              {t.iaPanel.agentsOf.replace("{clientName}", clientName || "")}
            </Typography>
            <Select
              value={contentPerPage}
              onChange={(e: SelectChangeEvent) => {
                setContentPerPage(e.target.value);
                setLoaded(false);
                getBotsData(`?page_size=${e.target.value}`);
              }}
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

        {isLoading || isSearching ? (
          <PageCircularProgress />
        ) : (
          <>
            {pageContent.length > 0 ? (
              <Paper elevation={3} sx={{
                p: 2,
                border: `2px solid transparent`,
                minHeight: '33vh'
              }}>
                <Grid container spacing={2} justifyContent="flex-start">
                  {pageContent.map((bot, index) => (
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6} key={`bot-${index}`}>
                      {renderBotCard(bot)}
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            ) : (
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="subtitle1">
                  {searchQuery && searchQuery.trim() !== ""
                    ? t.iaPanel.noAgentsFound
                    : t.iaPanel.noAgentsToShow}
                </Typography>
              </Paper>
            )}

            {pageContent.length > 0 && (
              <Paper elevation={3} sx={{ p: 2 }}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 2,
                }}>
                  <Pagination
                    count={paginationData?.total_pages}
                    page={agentsPage}
                    onChange={handlePagination}
                    color="primary"
                    size="small"
                  />
                  {paginationData && (
                    <Typography variant="body2" color="text.secondary">
                      {`${(agentsPage - 1) * (paginationData?.page_size ?? 0) + 1} - ${Math.min(
                        agentsPage * (paginationData?.page_size ?? 0),
                        paginationData?.total_items ?? 0
                      )} ${t.iaPanel.agentsCount.replace("{total}", paginationData?.total_items?.toString() || "0")}`}
                    </Typography>
                  )}
                </Box>
              </Paper>
            )}
          </>
        )}
      </Box>
      {allowerState && (
        <ActionAllower
          allowerStateCleaner={setAllowerState}
          actionToDo={deleteAction}
          actionParams={botToDelete}
        />
      )}
    </Container>
  );
};

export default IaPanel;
