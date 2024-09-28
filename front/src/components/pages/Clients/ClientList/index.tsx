import { useEffect, useCallback, useState } from "react";
import { useAppContext } from "@/context/app";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  Tooltip,
  Typography,
  Box,
  Paper,
  Container,
} from "@mui/material";
import { PageCircularProgress } from "@/components/CircularProgress";
import useCustomersApi from "@/hooks/useCustomers";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import ActionAllower from "@/components/ActionAllower";
import { ClientDetails } from "@/types/Clients";
import { Metadata } from "@/types/Api";
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
  right: '8px', // Posicionamos el icono a 8px del margen derecho
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

const ClientList: React.FC = () => {
  const navigate = useNavigate();
  const {
    setNavElevation,
    replacePath,
    clientPage,
    setClientPage,
    setAgentsPage,
  } = useAppContext();
  const { getCustomerList, deleteClientDetails } = useCustomersApi();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [allowerState, setAllowerState] = useState<boolean>(false);
  const [clientToDelete, setClientToDelete] = useState<string>("");
  const [pageContent, setPageContent] = useState<ClientDetails[]>([]);
  const [paginationData, setPaginationData] = useState<Metadata>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [contentPerPage, setContentPerPage] = useState<string>("5");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handlePagination = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    event.preventDefault();
    setClientPage(value);
    setLoaded(false);
    getClientsData(`?page_size=${contentPerPage}&page=${value}`);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.trim() !== "") {
      getClientsData(`?name__icontains=${value}`);
    }
  };

  const deleteAction = (clientId: string) => {
    deleteClientDetails(clientId)
      .then(() => {
        let temp = pageContent;
        temp = temp.filter((item) => item.id !== clientId);
        setPageContent(temp);
        setAllowerState(false);
        setClientToDelete("");
        SuccessToast("Cliente eliminado satisfactoriamente");
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
  };

  const getClientsData = useCallback((filterParams: string) => {
    setIsLoading(true);
    getCustomerList(filterParams)
      .then((response) => {
        const data: ClientDetails[] = response.data;
        const paginationData: Metadata = response.metadata;
        setClientPage(paginationData.current_page || 1);
        setPageContent(data);
        setPaginationData(paginationData);
        setLoaded(true);
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
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    replacePath([
      {
        label: "Equipos IA",
        current_path: "/clients",
        preview_path: "/clients",
      },
    ]);
    setAgentsPage(1);
    setNavElevation("clients");
    if (!loaded) {
      getClientsData(`?page_size=${contentPerPage}&page=${clientPage}`);
    }
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {isLoading ? (
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
                onClick={() => navigate('/clients/form')}
              >
                Nuevo Equipo IA
              </Button>
              <Search sx={{ 
                position: 'relative',
                right: '-16px', // Mantenemos el desplazamiento hacia la derecha
                width: 'calc(100% + 16px)', // Aumentamos el ancho en 16px
                maxWidth: 'calc(300px + 16px)', // Ajustamos el maxWidth también
                marginLeft: 'auto',
                padding: 0,
              }}>
                <SearchIconWrapper sx={{
                  padding: 0,
                  right: '8px', // Posicionamos el icono a 8px del margen derecho
                }}>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Buscar Equipo IA"
                  value={searchQuery}
                  inputProps={{ 
                    "aria-label": "search",
                    style: { padding: '8px 24px 8px 16px' } // Ajustamos el padding derecho para dar espacio al icono
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
                Equipos IA
              </Typography>
              <Select
                value={contentPerPage}
                onChange={(e: SelectChangeEvent) => {
                  setContentPerPage(e.target.value);
                  setLoaded(false);
                  getClientsData(`?page_size=${e.target.value}`);
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
                {pageContent.map((client, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={`client-${index}`}>
                    <Card sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      backgroundColor: 'transparent',
                      border: `1px solid ${theme.palette.divider}`,
                      boxShadow: 'none',
                      width: '100%', // Asegura que la tarjeta ocupe todo el ancho del Grid item
                    }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="div" gutterBottom>
                          {client.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {client.description.length > 200
                            ? client.description.substring(0, 200) + "..."
                            : client.description}
                        </Typography>
                      </CardContent>
                      <Divider />
                      <CardActions>
                        <Grid container>
                          <Grid item xs={11}>
                            <Tooltip title="Acceder a Equipos IA" arrow>
                              <Button
                                size="small"
                                sx={{
                                  marginRight: "5%",
                                }}
                                onClick={() => {
                                  navigate(
                                    `/bots/IaPanel/${client.name}/${client.id}`
                                  );
                                }}
                              >
                                Equipos IA
                              </Button>
                            </Tooltip>
                            <Tooltip title="Editar Cliente" arrow>
                              <Button
                                size="small"
                                onClick={() =>
                                  navigate(
                                    `/clients/form/${client.name}/${client.id}`
                                  )
                                }
                              >
                                Editar
                              </Button>
                            </Tooltip>
                          </Grid>
                          <Grid item xs={1} textAlign={"end"}>
                            <Tooltip title="Eliminar Cliente" arrow>
                              <Button
                                size="small"
                                color="error"
                                onClick={() => {
                                  setAllowerState(true);
                                  setClientToDelete(client.id);
                                }}
                              >
                                <DeleteIcon fontSize="small" />
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

          {pageContent.length > 0 && (
            <Paper elevation={3} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Pagination
                count={paginationData?.total_pages}
                page={clientPage}
                onChange={handlePagination}
                color="primary"
              />
              {paginationData && (
                <Typography variant="body2" color="text.secondary">
                  {`${(clientPage - 1) * (paginationData?.page_size ?? 0) + 1} - ${Math.min(
                    clientPage * (paginationData?.page_size ?? 0),
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
          actionParams={clientToDelete}
        />
      )}
    </Container>
  );
};

export default ClientList;