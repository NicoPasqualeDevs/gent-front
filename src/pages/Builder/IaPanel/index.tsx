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

const IaPanel: React.FC = () => {
  const { clientName, clientId } = useParams();
  const navigate = useNavigate();
  const { replacePath, appNavigation, agentsPage, setAgentsPage } = useAppContext();
  const { getBotsList, deleteBot } = useBotsApi();
  const [loaded, setLoaded] = useState(false);
  const [allowerState, setAllowerState] = useState(false);
  const [botToDelete, setbotToDelete] = useState("");
  const [pageContent, setPageContent] = useState<AgentData[]>([]);
  const [paginationData, setPaginationData] = useState<Metadata>();
  const [searchQuery, setSearchQuery] = useState("");
  const [contentPerPage, setContentPerPage] = useState("5");
  const { apiBase } = useApi()

  const handlePagination = (event: React.ChangeEvent<unknown>, value: number) => {
    event.preventDefault();
    setAgentsPage(value);
    setLoaded(false);
    getBotsData(`?page_size=${contentPerPage}&page=${value}`);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.trim() !== "") {
      getBotsData(`?name__icontains=${value}`);
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

  const getBotsData = useCallback((filterParams: string) => {
    if (!clientId) {
      ErrorToast("Conflicto en el id del cliente");
      return;
    }
    getBotsList(clientId, filterParams)
      .then(response => {
        setAgentsPage(response.metadata.current_page || 1);
        console.log(response.data, "<-- data")
        setPageContent(response.data);
        setPaginationData(response.metadata);
        setLoaded(true);
      })
      .catch(error => {
        ErrorToast(error instanceof Error
          ? "Error: no se pudo establecer conexión con el servidor"
          : `${error.status} - ${error.error}${error.data ? ": " + error.data : ""}`
        );
      });
  }, [clientId, getBotsList]);

  useEffect(() => {
    if (clientId && clientName) {
      replacePath([
        ...appNavigation.slice(0, 1),
        { label: clientName, current_path: `/builder/agents/${clientName}/${clientId}`, preview_path: "" },
      ]);
      if (!loaded) {
        getBotsData(`?page_size=${contentPerPage}&page=${agentsPage}`);
      }
    } else {
      ErrorToast("Error al cargar clientId en esta vista");
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
        borderTop: `2px solid transparent`,
      },
      '&::after': {
        bottom: 0,
        borderBottom: `2px solid transparent`,
      },
      '&:hover::before, &:hover::after': {
        height: '50%',
        backgroundColor: `${theme.palette.secondary.light}10`, // 10% de opacidad
        borderColor: theme.palette.secondary.light, // Sin opacidad
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
          subheader={"Creado: 00:00 - 01/01/2000"}
          /* ${new Date(bot.created_at).toLocaleDateString()} */
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
            <Tooltip title="Editar" arrow placement="top">
              <IconButton
                onClick={() => navigate(`/builder/agents/contextEntry/${clientId}/${bot.id}`)}
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
                Probar
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate(`/builder/agents/tools/${bot.name}/${bot.id}`)}
                startIcon={<ApiIcon />}
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
                Use API
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
                Widget
              </Button>
            </Box>
          </Box>
          
          <Divider />
          
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
              Configuración
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'row',
              justifyContent: 'flex-start',
              gap: 1,
              flexWrap: 'wrap'
            }}>
              {['Datos', 'Personalización', 'Herramientas'].map((action) => (
                <Button
                  key={action}
                  variant="text"
                  size="small"
                  onClick={() => {
                    const routes: { [key: string]: string } = {
                      Datos: `/builder/agents/dataEntry/${bot.id}`,
                      Personalización: `/builder/agents/customMessages/${bot.id}`,
                      Herramientas: `/builder/agents/tools/${bot.id}`,
                    };
                    navigate(routes[action]);
                  }}
                  disabled={action === 'Personalización' || action === 'Herramientas'}
                  sx={{ 
                    textTransform: 'none',
                    color: (action === 'Personalización' || action === 'Herramientas') ? theme.palette.text.disabled : theme.palette.primary.main,
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
      {!loaded ? (
        <PageCircularProgress />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Paper elevation={0} sx={{ backgroundColor: 'transparent', p: 0 }}>
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}>
              <Button
                variant="contained"
                onClick={() => navigate(`/builder/agents/contextEntry/${clientId}`)}
                fullWidth
                sx={{
                  width: '100%',
                  maxWidth: { xs: '100%', sm: '200px' },
                  color: 'white', // Cambiado a blanco
                  '&:hover': {
                    color: 'white', // Asegura que el color se mantenga blanco al pasar el mouse
                  },
                }}
              >
                Crear Agente
              </Button>
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
                    placeholder="Buscar Equipo IA"
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
                Agentes de {clientName}
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
                    {value} por página
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Paper>

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
                {searchQuery.trim() !== ""
                  ? "No se encontraron Equipos IA con ese nombre"
                  : "No hay Equipos IA para mostrar"}
              </Typography>
            </Paper>
          )}

          {loaded && pageContent.length > 0 && (
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
                    )} de ${paginationData?.total_items ?? 0} Equipos IA`}
                  </Typography>
                )}
              </Box>
            </Paper>
          )}
        </Box>
      )}
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
