import { useEffect, useCallback, useState, useRef } from "react";
import { useAppContext } from "@/context/app";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
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
  Typography,
  Box,
  Paper,
  Container,
  IconButton
} from "@mui/material";
import { PageCircularProgress } from "@/components/CircularProgress";
import useCustomersApi from "@/hooks/useCustomers";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import ActionAllower from "@/components/ActionAllower";
import { AiTeamsDetails } from "@/types/AiTeams";
import { Metadata } from "@/types/Api";
import theme from "@/styles/theme";

import { Search, SearchIconWrapper, StyledInputBase } from "@/components/SearchBar";


const AiTeamsList: React.FC = () => {
  const navigate = useNavigate(); const {
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
  const [pageContent, setPageContent] = useState<AiTeamsDetails[]>([]);
  const [paginationData, setPaginationData] = useState<Metadata>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [contentPerPage, setContentPerPage] = useState<string>("5");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const getAiTeamsData = useCallback((filterParams: string) => {
    setIsLoading(true);
    getCustomerList(filterParams)
      .then((response) => {
        const data: AiTeamsDetails[] = response.data;
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
            `${error.status} - ${error.error} ${error.data ? ": " + error.data : ""
            }`
          );
        }
      })
      .finally(() => {
        setIsLoading(false);
        setIsSearching(false);
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      });
  }, [getCustomerList]);

  const handlePagination = (event: React.ChangeEvent<unknown>, value: number) => {
    event.preventDefault();
    setAgentsPage(value);
    setLoaded(false);
    getAiTeamsData(`?page_size=${contentPerPage}&page=${value}`);
  };


  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setIsSearching(true);
    if (value.trim() !== "") {
      getAiTeamsData(`?name__icontains=${value}`);
    } else {
      getAiTeamsData(`?page_size=${contentPerPage}&page=1`);
    }
  }, [contentPerPage, getAiTeamsData]);

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
            `${error.status} - ${error.error} ${error.data ? ": " + error.data : ""
            }`
          );
        }
      });
  };

  useEffect(() => {
    replacePath([
      {
        label: "Mis Equipos",
        current_path: "/builder",
        preview_path: "/builder",
      },
    ]);
    setAgentsPage(1);
    setNavElevation("builder");
    if (!loaded) {
      getAiTeamsData(`?page_size=${contentPerPage}&page=${clientPage}`);
    }
  }, []);

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
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/builder/agents/form')}
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
                  inputRef={searchInputRef}
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
              Tus equipos de IA
            </Typography>
            <Select
              value={contentPerPage}
              onChange={(e: SelectChangeEvent) => {
                setContentPerPage(e.target.value);
                setLoaded(false);
                getAiTeamsData(`?page_size=${e.target.value}`);
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

        {isLoading || isSearching ? (
          <PageCircularProgress />
        ) : (
          <>
            {pageContent.length > 0 ? (
              <Paper elevation={3} sx={{
                p: 2,
                border: `2px solid transparent`,
                backgroundColor: 'background.paper',
                minHeight: '33vh'
              }}>
                <Grid container spacing={3}>
                  {pageContent.map((client, index) => (
                    <Grid item xs={12} sm={6} md={4} key={`client-${index}`}>
                      <Card sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: 'transparent',
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: 'none',
                        width: '100%',
                      }}>
                        <CardContent sx={{
                          flexGrow: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          p: 3,
                          '&:last-child': { pb: 3 },
                        }}>
                          <Box>
                            <Typography sx={{color: theme.palette.secondary.light}} variant="h6" component="div" gutterBottom noWrap>
                              {client.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.primary"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                minHeight: '3.6em',
                                mb: 2,
                              }}
                            >
                              {client.description}
                            </Typography>
                          </Box>
                          <Box sx={{ mt: 2 }}>
                            <Button
                              variant="text"
                              size="small"
                              onClick={() => navigate(`/builder/agents/${client.name}/${client.id}`)}
                              sx={{
                                color: "text.secondary",
                                justifyContent: "flex-start",
                                pl: 0,
                                "&:hover": {
                                  backgroundColor: "transparent",
                                  color: "white",
                                },
                              }}
                              endIcon={<ArrowForwardIcon />}
                            >
                              Administrar Equipo
                            </Button>
                          </Box>
                        </CardContent>
                        <Divider />
                        <CardActions sx={{ pl: 2, pr: 2, pt: 1, pb: 1, justifyContent: 'space-between' }}>
                          <Button
                            size="small"
                            onClick={() => navigate(`/builder/form/${client.name}/${client.id}`)}
                          >
                            Editar
                          </Button>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              setAllowerState(true);
                              setClientToDelete(client.id);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
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
          </>
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

export default AiTeamsList;
