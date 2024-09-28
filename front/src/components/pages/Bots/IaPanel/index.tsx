import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Grid, Typography, Pagination, Card, CardActions, Button, Divider, Tooltip,
  Select, MenuItem, Box, Container, Paper, SelectChangeEvent, IconButton, CardContent
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import useBotsApi from "@/hooks/useBots";
import { PageCircularProgress } from "@/components/CircularProgress";
import { BotData } from "@/types/Bots";
import { Metadata } from "@/types/Api";
import ActionAllower from "@/components/ActionAllower";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import useApi from "@/hooks/useApi";
import { useAppContext } from "@/context/app";
import theme from "@/styles/theme";
import { InputBase } from '@mui/material';

const SearchWrapper = styled(Grid)(() => ({
  position: "relative",
  width: "100%",
  height: "48px",
  marginBottom: 8,
}));


const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  right: '16px',
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const IaPanel: React.FC = () => {
  const { clientName, clientId } = useParams();
  const navigate = useNavigate();
  const { replacePath, appNavigation, agentsPage, setAgentsPage } = useAppContext();
  const { apiBase } = useApi();
  const { getBotsList, deleteBot } = useBotsApi();
  const [loaded, setLoaded] = useState(false);
  const [allowerState, setAllowerState] = useState(false);
  const [botToDelete, setbotToDelete] = useState("");
  const [pageContent, setPageContent] = useState<BotData[]>([]);
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

  const renderBotCard = (bot: BotData) => (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'transparent',
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: 'none',
      width: '100%',
      minHeight: '280px',
    }}>
      <CardContent sx={{ flexGrow: 1, px: 2, py: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="subtitle1" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
            {bot.name}
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
            {bot.description}
          </Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box>
          <Typography variant="subtitle2" gutterBottom>Implementación</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1 }}>
            {['Widget', 'Probar'].map(action => (
              <Tooltip key={action} title={`${action === 'Widget' ? 'Descargar' : ''} ${action} Agente`} arrow>
                <Button
                  size="small"
                  onClick={() => action === 'Widget'
                    ? window.open(apiBase.slice(0, -1) + bot.widget_url, "_blank")
                    : navigate(`/bots/chat/${bot.id}`)
                  }
                  sx={{ color: '#4caf50', '&:hover': { backgroundColor: 'transparent' }, p: 0 }}
                >
                  {action}
                </Button>
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
                  {['Editar', 'Ktags', 'Tools', 'Widget', 'Saludos', 'Probar'].map((action) => (
                    <Tooltip key={action} title={`${action} Agente`} arrow>
                      <Button
                        size="small"
                        onClick={() => {
                          const routes: { [key: string]: string } = {
                            Editar: `/bots/contextEntry/${clientId}/${bot.id}`,
                            Ktags: `/bots/dataEntry/${bot.id}`,
                            Tools: `/bots/tools/${bot.name}/${bot.id}`,
                            Widget: `/bots/widgetCustomizer/${bot.id}`,
                            Saludos: `/bots/customMessages/${bot.id}`,
                            Probar: `/bots/chat/${bot.id}`
                          };
                          navigate(routes[action]);
                        }}
                        sx={{ p: 0, minWidth: 'auto' }}
                      >
                        {action}
                      </Button>
                    </Tooltip>
                  ))}
                </Box>
              </Grid>
              <Grid item xs={1} textAlign="end">
                <Tooltip title="Eliminar Agente" arrow>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => {
                      setAllowerState(true);
                      setbotToDelete(bot.id);
                    }}
                    sx={{ p: 0, minWidth: 'auto' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>
          </CardActions>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {!loaded ? (
        <PageCircularProgress />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Paper elevation={0} sx={{ backgroundColor: 'transparent', p: 0 }}>
            <Box sx={{
              height: 'auto',
              minHeight: '48px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>

              <SearchWrapper sx={{
                height: 'auto',
                minHeight: '48px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <Button
                  variant="contained"
                  onClick={() => navigate(`/bots/contextEntry/${clientId}`)}
                >
                  Crear Agente
                </Button>
                <Search sx={{
                  position: 'relative',
                  right: '-16px',
                  width: 'calc(100% + 16px)',
                  maxWidth: 'calc(300px + 16px)',
                  marginLeft: 'auto',
                  padding: 0,
                }}>
                  <SearchIconWrapper sx={{
                    padding: 0,
                    right: '16px', // Cambiado de 8px a 16px
                  }}>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Buscar Equipo IA"
                    value={searchQuery}
                    inputProps={{
                      "aria-label": "search",
                      style: { padding: '8px 40px 8px 16px' } // Aumentado el padding derecho de 24px a 40px
                    }}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </Search>
              </SearchWrapper>
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: '64px',
              maxWidth: '100%'
            }}>
              <Typography variant="h4" sx={{ mr: 2 }}>
                Equipos IA de {clientName}
              </Typography>
              <Select
                value={contentPerPage}
                onChange={(e: SelectChangeEvent) => {
                  setContentPerPage(e.target.value);
                  setLoaded(false);
                  getBotsData(`?page_size=${e.target.value}`);
                }}
                size="small"
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
              p: 3,
              border: `2px solid transparent`,
              backgroundColor: 'transparent',
              minHeight: '33vh'
            }}>
              <Grid container spacing={3} justifyContent="flex-start">
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
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <Pagination
                    count={paginationData?.total_pages}
                    page={agentsPage}
                    onChange={handlePagination}
                    size="small"
                    color="primary"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" textAlign="center">
                    {paginationData &&
                      `${(agentsPage - 1) * (paginationData?.page_size ?? 1) + 1} - ${Math.min(
                        agentsPage * (paginationData?.page_size ?? 1),
                        paginationData?.total_items ?? 0
                      )} de ${paginationData?.total_items ?? 0} Equipos IA`}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">Elementos por página</Typography>
                    <Select
                      value={contentPerPage}
                      onChange={(e: SelectChangeEvent) => {
                        setContentPerPage(e.target.value);
                        setLoaded(false);
                        getBotsData(`?page_size=${e.target.value}`);
                      }}
                      size="small"
                    >
                      {[5, 10, 20].map((value) => (
                        <MenuItem key={value} value={value.toString()}>
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </Grid>
              </Grid>
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