import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { styled, alpha } from "@mui/material/styles";
import {
  Grid,
  CardContent,
  Typography,
  Pagination,
  Card,
  CardActions,
  Stack,
  Button,
  Divider,
  Tooltip,
  Select,
  SelectChangeEvent,
  MenuItem,
  Box,
  Container,
  Paper,
} from "@mui/material";
import useBotsApi from "@/hooks/useBots";
import { PageCircularProgress } from "@/components/CircularProgress";
import { BotData } from "@/types/Bots";
import { Metadata } from "@/types/Api";
import ActionAllower from "@/components/ActionAllower";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import useApi from "@/hooks/useApi";
import { useAppContext } from "@/context/app";
import theme from "@/styles/theme";

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
  const { replacePath, appNavigation, agentsPage, setAgentsPage } =
    useAppContext();
  const { apiBase } = useApi();
  const { getBotsList, deleteBot } = useBotsApi();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [allowerState, setAllowerState] = useState<boolean>(false);
  const [botToDelete, setbotToDelete] = useState<string>("");
  const [pageContent, setPageContent] = useState<BotData[]>([]);
  const [paginationData, setPaginationData] = useState<Metadata>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [contentPerPage, setContentPerPage] = useState<string>("5");

  const handlePagination = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
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
    if (botId && botId !== "") {
      deleteBot(botId)
        .then(() => {
          let temp = pageContent;
          temp = temp.filter((item) => item.id !== botId);
          setPageContent(temp);
          setAllowerState(false);
          setbotToDelete("");
          SuccessToast("chatbot eliminado satisfactoriamente");
        })
        .catch((error) => {
          if (error instanceof Error) {
            ErrorToast("Error: no se pudo establecer conexión con el servidor");
          } else {
            ErrorToast(
              `${error.status} - ${error.error} ${error.data ? ": " + error.data : ""
              }`
            );
          }
        });
    } else {
      ErrorToast("Error al cargar botId al borrar");
    }
  };

  const getBotsData = useCallback((filterParams: string) => {
    clientId
      ? getBotsList(clientId, filterParams)
        .then((response) => {
          const data: BotData[] = response.data;
          const paginationData: Metadata = response.metadata;
          setAgentsPage(paginationData.current_page || 1);
          setPageContent(data);
          setPaginationData(paginationData);
          setLoaded(true);
        })
        .catch((error) => {
          if (error instanceof Error) {
            ErrorToast(
              "Error: no se pudo establecer conexión con el servidor"
            );
          } else {
            ErrorToast(
              `${error.status} - ${error.error} ${error.data ? ": " + error.data : ""
              }`
            );
          }
        })
      : ErrorToast("Conflicto en el id del cliente");
  }, []);

  useEffect(() => {
    if (clientId && clientName) {
      replacePath([
        ...appNavigation.slice(0, 1),
        {
          label: clientName,
          current_path: `/bots/IaPanel/${clientName}/${clientId}`,
          preview_path: "",
        },
      ]);
      if (!loaded) {
        getBotsData(`?page_size=${contentPerPage}&page=${agentsPage}`);
      }
    } else {
      ErrorToast("Error al cargar clientId en esta vista");
    }
  }, []);


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
              <Button
                variant="contained"
                onClick={() => navigate(`/bots/contextEntry/${clientId}`)}
              >
                Crear Agente
              </Button>
              <Search sx={{
                position: 'relative',
                width: 'calc(100% + 16px)',
                maxWidth: 'calc(300px + 16px)',
                marginLeft: 'auto',
                padding: 0,
              }}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Buscar Agente"
                  value={searchQuery}
                  inputProps={{
                    "aria-label": "search",
                    style: { padding: '8px 40px 8px 16px' }
                  }}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </Search>
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
                    <Card sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: 'transparent',
                      border: `1px solid ${theme.palette.divider}`,
                      boxShadow: 'none',
                      width: '100%',
                      minHeight: '500px',
                    }}>
                      <CardContent sx={{ flexGrow: 1, px: 3, display: 'flex', flexDirection: 'column' }}>
                        {/* Sección de Información */}
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                            Información
                          </Typography>
                          <Typography variant="subtitle1" gutterBottom sx={{ color: theme.palette.info.main }}>
                            {bot.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: theme.palette.info.main,
                              height: 60,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {bot.description}
                          </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Sección de Implementación */}
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="h6" gutterBottom>
                            Implementación
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2 }}>
                            <Tooltip title="Descargar Widget" arrow>
                              <Button
                                size="small"
                                onClick={() => {
                                  window.open(
                                    apiBase.slice(0, -1) + bot.widget_url,
                                    "_blank"
                                  );
                                }}
                                sx={{
                                  color: '#4caf50',
                                  '&:hover': {
                                    backgroundColor: 'transparent',
                                  },
                                  pl: 0 // Añadido para eliminar el padding izquierdo
                                }}
                              >
                                Widget
                              </Button>
                            </Tooltip>
                            <Tooltip title="Probar Agente" arrow>
                              <Button
                                size="small"
                                onClick={() => navigate(`/bots/chat/${bot.id}`)}
                                sx={{
                                  color: '#4caf50',
                                  '&:hover': {
                                    backgroundColor: 'transparent',
                                  }
                                }}
                              >
                                Probar
                              </Button>
                            </Tooltip>
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Sección de Configuración */}
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            Configuración
                          </Typography>
                        </Box>
                        <CardActions sx={{ p: 0 }}>
                          <Grid container>
                            <Grid item xs={11}>
                              <Tooltip title="Editar Agente" arrow>
                                <Button
                                  size="small"
                                  onClick={() =>
                                    navigate(
                                      `/bots/contextEntry/${clientId}/${bot.id}`
                                    )
                                  }
                                  sx={{ pl: 0 }}
                                >
                                  Editar
                                </Button>
                              </Tooltip>
                              <Tooltip title="Editar Ktags" arrow>
                                <Button
                                  size="small"
                                  onClick={() =>
                                    navigate(`/bots/dataEntry/${bot.id}`)
                                  }
                                >
                                  Ktags
                                </Button>
                              </Tooltip>
                              <Tooltip title="Tools de Agente" arrow>
                                <Button
                                  size="small"
                                  onClick={() =>
                                    navigate(`/bots/tools/${bot.name}/${bot.id}`)
                                  }
                                >
                                  Tools
                                </Button>
                              </Tooltip>
                              <Tooltip title="Personalizar Widget" arrow>
                                <Button
                                  size="small"
                                  onClick={() =>
                                    navigate(`/bots/widgetCustomizer/${bot.id}`)
                                  }
                                >
                                  Widget
                                </Button>
                              </Tooltip>
                              <Tooltip title="Personalizar Saludos" arrow>
                                <Button
                                  size="small"
                                  onClick={() =>
                                    navigate(`/bots/customMessages/${bot.id}`)
                                  }
                                >
                                  Saludos
                                </Button>
                              </Tooltip>
                              <Tooltip title="Probar Chat" arrow>
                                <Button
                                  size="small"
                                  onClick={() => navigate(`/bots/chat/${bot.id}`)}
                                >
                                  Probar
                                </Button>
                              </Tooltip>
                            </Grid>
                            <Grid item xs={1} textAlign={"end"}>
                              <Tooltip title="Eliminar Agente" arrow>
                                <Button
                                  size="small"
                                  color="error"
                                  onClick={() => {
                                    setAllowerState(true);
                                    setbotToDelete(bot.id);
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </Button>
                              </Tooltip>
                            </Grid>
                          </Grid>
                        </CardActions>
                      </CardContent>

                      {/* Botón de eliminar */}

                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          ) : (
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="subtitle1">
                {searchQuery && searchQuery.trim() !== ""
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
                  <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
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
                  </Stack>
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