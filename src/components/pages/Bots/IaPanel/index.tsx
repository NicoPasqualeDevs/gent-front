import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams} from "react-router-dom";
import {
  Grid, Typography, Pagination, Card, CardActions, Button, Divider, Tooltip,
  Select, MenuItem, Box, Container, Paper, SelectChangeEvent, CardContent, IconButton
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
        { label: clientName, current_path: `/bots/IaPanel/${clientName}/${clientId}`, preview_path: "" },
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
      backgroundColor: theme.palette.background.paper, // Cambiado a usar el color de fondo del Paper
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: 'none',
      width: '100%',
      minHeight: '280px',
    }}>
      <CardContent sx={{ flexGrow: 1, px: 2, py: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="subtitle1" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
            Información
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'white' }}>
              <strong>Nombre:</strong> <span style={{ color: theme.palette.secondary.light }}>{bot.name}</span>
            </Typography>
            <Typography variant="body2" sx={{
              color: 'white',
              maxHeight: '3em',
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}>
              <strong>Descripción:</strong> <span style={{ color: theme.palette.secondary.light }}>{bot.description}</span>
            </Typography>
            <Typography variant="body2" sx={{ color: 'white' }}>
              <strong>LLM:</strong> <span style={{ color: theme.palette.secondary.light }}>{bot.model_ai || 'No especificado'}</span>
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box>
          <Typography variant="subtitle2" gutterBottom>Implementación</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1 }}>
            {['Probar', 'Widget', 'API'].map(action => (
              <Tooltip key={action} title={`${action === 'Probar' ? 'Probar' : 'Función no disponible'}`} arrow>
                <span>
                  <Button
                    size="small"
                    onClick={() => action === 'Probar' ? navigate(`/bots/chat/${bot.id}`) : null}
                    sx={{ p: 0, minWidth: 'auto' }}
                    disabled={action === 'Widget' || action === 'API'}
                  >
                    {action}
                  </Button>
                </span>
              </Tooltip>
            ))}
          </Box>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box>
          <Typography variant="subtitle2" gutterBottom>Configuración</Typography>
          <CardActions sx={{ p: 0 }}>
            <Grid container spacing={1}>
              <Grid item xs={11}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {['Editar', 'Ktags', 'Tools', 'Widget', 'Saludos'].map((action) => (
                    <Tooltip key={action} title={
                      ['Tools', 'Widget', 'Saludos'].includes(action)
                        ? 'Función no disponible'
                        : `${action} Agente`
                    } arrow>
                      <span> {/* Envolvemos en un span para que el Tooltip funcione con botones deshabilitados */}
                        <Button
                          size="small"
                          onClick={() => {
                            const routes: { [key: string]: string } = {
                              Editar: `/bots/contextEntry/${clientId}/${bot.id}`,
                              Ktags: `/bots/dataEntry/${bot.id}`,
                              Tools: `/bots/tools/${bot.name}/${bot.id}`,
                              Widget: `/bots/widgetCustomizer/${bot.id}`,
                              Saludos: `/bots/customMessages/${bot.id}`,
                            };
                            navigate(routes[action]);
                          }}
                          sx={{ p: 0, minWidth: 'auto' }}
                          disabled={['Tools', 'Widget', 'Saludos'].includes(action)}
                        >
                          {action}
                        </Button>
                      </span>
                    </Tooltip>
                  ))}
                </Box>
              </Grid>
              <Grid item xs={1} textAlign="end">
                <Tooltip title="Eliminar Agente" arrow>
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
                </Tooltip>
              </Grid>
            </Grid>
          </CardActions>
        </Box>
      </CardContent>
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
                onClick={() => navigate(`/bots/contextEntry/${clientId}`)}
                fullWidth
                sx={{
                  width: '100%',
                  maxWidth: { xs: '100%', sm: '200px' }
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