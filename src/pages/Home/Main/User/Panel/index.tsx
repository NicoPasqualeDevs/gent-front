import { useEffect, useCallback, useState, useRef } from "react";
import { useAppContext } from "@/context/app";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Paper,
  Container,
} from "@mui/material";
import { PageCircularProgress } from "@/components/CircularProgress";
import useCustomersApi from "@/hooks/useCustomers";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { ErrorToast, SuccessToast } from "@/components/Toast";
import ActionAllower from "@/components/ActionAllower";
import { AiTeamsDetails } from "@/types/AiTeams";
import { Metadata } from "@/types/Api";
import agent from '@/assets/agents/1.png';
import agronomia from '@/assets/categories/agronomia.png';
import musica from '@/assets/categories/musica.png';
import comercio from '@/assets/categories/comercio.png';
import salud from '@/assets/categories/salud.png';
import costureria from '@/assets/categories/costureria.png';
import filosofia from '@/assets/categories/filosofia.png';
import { Search, SearchIconWrapper, StyledInputBase } from "@/components/SearchBar";
import { styled } from "@mui/material/styles";
import { alpha } from '@mui/material/styles';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { CSSObject } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

// Componente estilizado actualizado para las tarjetas
const AiTeamCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  flexGrow: 1,
  flexBasis: '280px',
  maxWidth: 'calc(20% - 24px)', // 5 tarjetas por fila como máximo
  margin: theme.spacing(1.5),
  aspectRatio: '3 / 4',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
  transition: 'transform 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.05)',
    zIndex: 1,
  },
}));

const AiTeamCardContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  background: `linear-gradient(to bottom, 
    rgba(0,0,0,0) 0%, 
    rgba(0,0,0,0) 60%, 
    rgba(0,0,0,0.4) 80%, 
    ${theme.palette.background.default} 100%)`,
  color: theme.palette.common.white,
  padding: theme.spacing(2),
}));

const AiTeamCardImage = styled('img')({
  position: 'absolute',
  top: '-45%',
  left: 0,
  width: '100%',
  height: '140%',
  objectFit: 'cover',
  maskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 85%)',
  WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 85%)',
});

const CardsContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  margin: '-12px', // Compensa el margen de las tarjetas
});

const PaginationArrow = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: theme.palette.common.white,
  padding: theme.spacing(1),
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
}));

// Añade estos estilos personalizados para el scrollbar
const scrollbarStyles: CSSObject = {
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '10px',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.5)',
    },
  },
};

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

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
        // Restaurar el foco al campo de búsqueda
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      });
  }, [getCustomerList]);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setIsSearching(true);
    if (value.trim() !== "") {
      getAiTeamsData(`?name__icontains=${value}`);
    } else {
      getAiTeamsData(`?page_size=5&page=1`);
    }
  }, [getAiTeamsData]);

  const deleteAction = (aiTeamId: string) => {
    deleteClientDetails(aiTeamId)
      .then(() => {
        let temp = pageContent;
        temp = temp.filter((item) => item.id !== aiTeamId);
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

  const handlePrevPage = () => {
    if (clientPage > 1) {
      setClientPage(clientPage - 1);
      setLoaded(false);
      getAiTeamsData(`?page_size=5&page=${clientPage - 1}`);
    }
  };

  const handleNextPage = () => {
    if (clientPage < (paginationData?.total_pages || 0)) {
      setClientPage(clientPage + 1);
      setLoaded(false);
      getAiTeamsData(`?page_size=5&page=${clientPage + 1}`);
    }
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
      getAiTeamsData(`?page_size=5&page=${clientPage}`);
    }
  }, []);

  const getImageForCategory = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'agronomía':
      return agronomia;
      case 'música': return musica;
      case 'comercio': return comercio;
      case 'salud': return salud;
      case 'costurería - blanquería': return costureria;
      case 'filosofia': return filosofia;
      case 'estudio':
      case 'derechos':
      case 'turismo':
      case 'mecánicos':
      case 'gastronomía':
        return comercio;
      default:
        return comercio; // Imagen por defecto
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      pb: { xs: '56px', lg: 0 }, // Padding en la parte inferior para dispositivos móviles
    }}>
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        p: { xs: 2, sm: 3 }, 
        ...scrollbarStyles,
      }}>
        <Container 
          maxWidth={false} // Cambiado a false para que ocupe todo el ancho disponible
          disableGutters 
          sx={{ 
            py: 2, 
            px: { xs: 1, sm: 2, md: 3 },
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2, 
            position: 'relative',
            flexGrow: 1,
          }}>
            {/* Sección actualizada con título más pequeño y recomendación */}
            <Paper
              elevation={3}
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.9),
                borderRadius: '64px', // Aumentado de '32px' a '64px'
                padding: '16px',
                mb: 3,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: 'common.white',
                  width: { xs: '100%', md: '66%' },
                  textAlign: { xs: 'center', md: 'left' },
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                  fontWeight: 'bold',
                }}
              >
                Busque sus agentes de IA
              </Typography>

              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                width: { xs: '100%', md: '33%' },
                justifyContent: { xs: 'center', md: 'flex-end' },
              }}>
                <Box sx={{
                  position: 'relative',
                  width: 48,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <CardGiftcardIcon sx={{ color: 'common.white', fontSize: 32, position: 'relative', zIndex: 1 }} />
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'common.white',
                    textAlign: { xs: 'center', md: 'right' },
                  }}
                >
                  Recomendación: Pruebe nuestro nuevo agente de IA para marketing
                </Typography>
              </Box>
            </Paper>

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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" sx={{ color: 'common.white' }}>
                Categorias
              </Typography>
            </Box>

            {/* Grid de tarjetas de Equipos IA */}
            {isLoading || isSearching ? (
              <PageCircularProgress />
            ) : (
              pageContent.length > 0 ? (
                <Box sx={{ position: 'relative' }}>
                  <CardsContainer>
                    {pageContent.map((client, index) => (
                      <AiTeamCard
                        key={`client-${index}`}
                        onClick={() => navigate(`/builder/agents/${client.name}/${client.id}`)}
                      >
                        <AiTeamCardImage
                          src={getImageForCategory(client.name)}
                          alt={client.name}
                        />
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
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {client.description}
                          </Typography>
                        </AiTeamCardContent>
                      </AiTeamCard>
                    ))}
                  </CardsContainer>

                  {/* Flechas de paginación */}
                  {clientPage > 1 && (
                    <PaginationArrow sx={{ left: 0 }} onClick={handlePrevPage}>
                      <ArrowBackIosNewIcon />
                    </PaginationArrow>
                  )}
                  {clientPage < (paginationData?.total_pages || 0) && (
                    <PaginationArrow sx={{ right: 0 }} onClick={handleNextPage}>
                      <ArrowForwardIosIcon />
                    </PaginationArrow>
                  )}
                </Box>
              ) : (
                <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                  <Typography variant="subtitle1" sx={{ color: 'common.white' }}>
                    {searchQuery && searchQuery.trim() !== ""
                      ? "No se encontraron Equipos IA con ese nombre"
                      : "No hay Equipos IA para mostrar"}
                  </Typography>
                </Paper>
              )
            )}

            {/* Sección de Equipos de IA */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" sx={{ color: 'common.white' }}>
                Agentes populares
              </Typography>
            </Box>
            {/* Grid de tarjetas de Equipos IA */}
            {isLoading || isSearching ? (
              <PageCircularProgress />
            ) : (
              pageContent.length > 0 ? (
                <Box sx={{ position: 'relative' }}>
                  <CardsContainer>
                    {pageContent.map((client, index) => (
                      <AiTeamCard
                        key={`client-${index}`}
                        onClick={() => navigate(`/builder/agents/${client.name}/${client.id}`)}
                      >
                        <AiTeamCardImage
                          src={agent}
                          alt={client.name}
                        />
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
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {client.description}
                          </Typography>
                        </AiTeamCardContent>
                      </AiTeamCard>
                    ))}
                  </CardsContainer>

                  {/* Flechas de paginación */}
                  {clientPage > 1 && (
                    <PaginationArrow sx={{ left: 0 }} onClick={handlePrevPage}>
                      <ArrowBackIosNewIcon />
                    </PaginationArrow>
                  )}
                  {clientPage < (paginationData?.total_pages || 0) && (
                    <PaginationArrow sx={{ right: 0 }} onClick={handleNextPage}>
                      <ArrowForwardIosIcon />
                    </PaginationArrow>
                  )}
                </Box>
              ) : (
                <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                  <Typography variant="subtitle1" sx={{ color: 'common.white' }}>
                    {searchQuery && searchQuery.trim() !== ""
                      ? "No se encontraron Equipos IA con ese nombre"
                      : "No hay Equipos IA para mostrar"}
                  </Typography>
                </Paper>
              )
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
      </Box>
    </Box>
  );
};

export default UserPanel;