import { useEffect, useCallback, useState } from "react";
import { useAppContext } from "@/context/app";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  Typography,
  Box,
  Paper,
  Container,
} from "@mui/material";
import { PageCircularProgress } from "@/components/CircularProgress";
import useCustomersApi from "@/hooks/useCustomers";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import ActionAllower from "@/components/ActionAllower";
import { AiTeamsDetails } from "@/types/AiTeams";
import { Metadata } from "@/types/Api";
import theme from "@/styles/theme";

import { Search, SearchIconWrapper, StyledInputBase } from "@/components/SearchBar";
import { styled } from "@mui/material/styles";

// Nuevo componente estilizado para las tarjetas
const AiTeamCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  height: 0,
  paddingTop: '150%', // Aspecto 2:3
  overflow: 'hidden',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    zIndex: 1,
    '& .MuiCardContent-root': {
      opacity: 1,
    },
  },
}));

const AiTeamCardContent = styled(CardContent)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
  color: theme.palette.common.white,
}));

const UserPanel: React.FC = () => {
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

  const handlePagination = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    event.preventDefault();
    setClientPage(value);
    setLoaded(false);
    getAiTeamsData(`?page_size=${contentPerPage}&page=${value}`);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.trim() !== "") {
      getAiTeamsData(`?name__icontains=${value}`);
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
            `${error.status} - ${error.error} ${error.data ? ": " + error.data : ""
            }`
          );
        }
      });
  };

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
      });
  }, []);

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
    <Container maxWidth={false} sx={{ py: 2, px: { xs: 1, sm: 2, md: 3 } }}>
      {isLoading ? (
        <PageCircularProgress />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Buscador */}
          <Paper elevation={0} sx={{ backgroundColor: 'transparent', p: 0 }}>
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}>
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
                  <StyledInputBase
                    placeholder="Buscar Equipo IA"
                    value={searchQuery}
                    inputProps={{
                      "aria-label": "search",
                      style: { padding: '8px 8px 8px 16px' }
                    }}
                    onChange={(e) => handleSearch(e.target.value)}
                    fullWidth
                  />
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                </Search>
              </Box>
            </Box>
          </Paper>

          {/* Sección de Equipos de IA */}
          {/* Título y selector de elementos por página */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" sx={{ color: 'common.white' }}>
              Equipos de IA
            </Typography>
          </Box>
          {/* Grid de tarjetas de Equipos IA */}
          {pageContent.length > 0 ? (
            <Grid container spacing={2}>
              {pageContent.map((client, index) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={`client-${index}`}>
                  <AiTeamCard onClick={() => navigate(`/builder/agents/${client.name}/${client.id}`)}>
                    <AiTeamCardContent>
                      <Typography variant="h6" component="div" gutterBottom noWrap>
                        {client.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {client.description}
                      </Typography>
                    </AiTeamCardContent>
                  </AiTeamCard>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <Typography variant="subtitle1" sx={{ color: 'common.white' }}>
                {searchQuery && searchQuery.trim() !== ""
                  ? "No se encontraron Equipos IA con ese nombre"
                  : "No hay Equipos IA para mostrar"}
              </Typography>
            </Paper>
          )}

          {/* Paginación */}
          {pageContent.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination
                count={paginationData?.total_pages}
                page={clientPage}
                onChange={handlePagination}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: 'common.white',
                  },
                }}
              />
            </Box>
          )}

          {/* Título y selector de elementos por página */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" sx={{ color: 'common.white' }}>
              Agentes de IA
            </Typography>
          </Box>

          {/* Grid de tarjetas de Equipos IA */}
          {pageContent.length > 0 ? (
            <Grid container spacing={2}>
              {pageContent.map((client, index) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={`client-${index}`}>
                  <AiTeamCard onClick={() => navigate(`/builder/agents/${client.name}/${client.id}`)}>
                    <AiTeamCardContent>
                      <Typography variant="h6" component="div" gutterBottom noWrap>
                        {client.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {client.description}
                      </Typography>
                    </AiTeamCardContent>
                  </AiTeamCard>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <Typography variant="subtitle1" sx={{ color: 'common.white' }}>
                {searchQuery && searchQuery.trim() !== ""
                  ? "No se encontraron Equipos IA con ese nombre"
                  : "No hay Equipos IA para mostrar"}
              </Typography>
            </Paper>
          )}

          {/* Paginación */}
          {pageContent.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination
                count={paginationData?.total_pages}
                page={clientPage}
                onChange={handlePagination}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: 'common.white',
                  },
                }}
              />
            </Box>
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

export default UserPanel;
