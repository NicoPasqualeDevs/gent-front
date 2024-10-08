import { useEffect, useCallback, useState } from "react";
import { useAppContext } from "@/context/app";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
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
import { Search, SearchIconWrapper, StyledInputBase } from "@/components/SearchBar";

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
    <Container maxWidth="xl" sx={{ py: 2, px: { xs: 1, sm: 2, md: 3 } }}>
      {isLoading ? (
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
                startIcon={<AddIcon />}
                onClick={() => navigate('/clients/form')}
                fullWidth
                sx={{ 
                  width: '100%',
                  maxWidth: { xs: '100%', sm: '200px' }
                }}
              >
                Nuevo Equipo IA
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
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                <MenuItem value="5">5 por página</MenuItem>
                <MenuItem value="10">10 por página</MenuItem>
                <MenuItem value="20">20 por página</MenuItem>
              </Select>
            </Box>
          </Paper>

          {pageContent.length > 0 ? (
            <Paper elevation={3} sx={{ 
              p: 2, 
              border: `2px solid transparent`,
              backgroundColor: 'background.paper',
              minHeight: '33vh'
            }}>
              <Grid container spacing={2} justifyContent="flex-start">
                {pageContent.map((client, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={`client-${index}`}>
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
                          <Grid item xs={10}>
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
                          <Grid item xs={2} sx={{ 
                            display: 'flex', 
                            justifyContent: 'flex-end', 
                            alignItems: 'center' 
                          }}>
                            <Tooltip title="Eliminar Cliente" arrow>
                              <Button
                                size="small"
                                color="error"
                                onClick={() => {
                                  setAllowerState(true);
                                  setClientToDelete(client.id);
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
                  page={clientPage}
                  onChange={handlePagination}
                  color="primary"
                  size="small"
                />
                {paginationData && (
                  <Typography variant="body2" color="text.secondary">
                    {`${(clientPage - 1) * (paginationData?.page_size ?? 0) + 1} - ${Math.min(
                      clientPage * (paginationData?.page_size ?? 0),
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
          actionParams={clientToDelete}
        />
      )}
    </Container>
  );
};

export default ClientList;