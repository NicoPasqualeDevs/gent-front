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
  Paper,
  Container,
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
import AddIcon from '@mui/icons-material/Add';

const Search = styled("div")(({ theme }) => ({
  position: "absolute",
  right: -16,
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

const SearchWrapper = styled(Grid)(() => ({
  position: "relative",
  width: "100%",
  height: "48px",
  marginBottom: 8,
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  right: -8,
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(0)})`,
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
              `${error.status} - ${error.error} ${
                error.data ? ": " + error.data : ""
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
                `${error.status} - ${error.error} ${
                  error.data ? ": " + error.data : ""
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
            <SearchWrapper sx={{ 
              height: 'auto', 
              minHeight: '48px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
            }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
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
                  right: '16px',
                }}>
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
            </SearchWrapper>
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
                <MenuItem value="5">5 por página</MenuItem>
                <MenuItem value="10">10 por página</MenuItem>
                <MenuItem value="20">20 por página</MenuItem>
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
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={`bot-${index}`}>
                    <Card sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      backgroundColor: 'transparent',
                      border: `1px solid ${theme.palette.divider}`,
                      boxShadow: 'none',
                      width: '100%',
                    }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="div" gutterBottom>
                          {bot.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {bot.description.length > 150
                            ? bot.description.substring(0, 150) + "..."
                            : bot.description}
                        </Typography>
                        <Button
                          size="small"
                          onClick={() => {
                            window.open(
                              apiBase.slice(0, -1) + bot.widget_url,
                              "_blank"
                            );
                          }}
                          sx={{ mt: 2 }}
                        >
                          Descargar Widget
                        </Button>
                      </CardContent>
                      <Divider />
                      <CardActions>
                        <Grid container>
                          <Grid item xs={10}>
                            {['Editar', 'Ktags', 'Tools', 'Widget', 'Saludos', 'Probar'].map((action) => (
                              <Tooltip key={action} title={`${action} Agente`} arrow>
                                <Button
                                  size="small"
                                  onClick={() => {
                                    // ... lógica de navegación existente ...
                                  }}
                                >
                                  {action}
                                </Button>
                              </Tooltip>
                            ))}
                          </Grid>
                          <Grid item xs={2} sx={{ 
                            display: 'flex', 
                            justifyContent: 'flex-end', 
                            alignItems: 'center' 
                          }}>
                            <Tooltip title="Eliminar Agente" arrow>
                              <Button
                                size="small"
                                color="error"
                                onClick={() => {
                                  setAllowerState(true);
                                  setbotToDelete(bot.id);
                                }}
                                sx={{ 
                                  width: '20px',
                                  height: '20px',
                                  padding: 0,
                                  margin: 0,
                                  justifyContent: 'center',
                                  alignItems: 'center'
                                }}
                              >
                                <DeleteIcon sx={{ fontSize: '16px' }} />
                              </Button>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </CardActions>
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
            <Paper elevation={3} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Pagination
                count={paginationData?.total_pages}
                page={agentsPage}
                onChange={handlePagination}
                color="primary"
              />
              {paginationData && (
                <Typography variant="body2" color="text.secondary">
                  {`${(agentsPage - 1) * (paginationData?.page_size ?? 0) + 1} - ${Math.min(
                    agentsPage * (paginationData?.page_size ?? 0),
                    paginationData?.total_items ?? 0
                  )} de ${paginationData?.total_items ?? 0} Equipos IA`}
                </Typography>
              )}
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