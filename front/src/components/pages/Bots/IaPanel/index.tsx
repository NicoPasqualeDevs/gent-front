import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
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
} from "@mui/material";
import useBotsApi from "@/hooks/useBots";
import { PageCircularProgress } from "@/components/CircularProgress";
import { BotData } from "@/types/Bots";
import { Metadata } from "@/types/Api";
import ActionAllower from "@/components/ActionAllower";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import useApi from "@/hooks/useApi";
import { useAppContext } from "@/context/app";

const Search = styled('div')(({ theme }) => ({
  position: 'absolute',
  right: -16,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchWrapper = styled(Grid)(() => ({
  position: "relative",
  width: "100%",
  height: "48px",
  marginBottom: 8
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  right: -8,
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(0)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const IaPanel: React.FC = () => {
  const { clientName, clientId } = useParams();
  const navigate = useNavigate();
  const { replacePath, appNavigation } = useAppContext();
  const { apiBase } = useApi();
  const { getBotsList, deleteBot } = useBotsApi();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [allowerState, setAllowerState] = useState<boolean>(false);
  const [botToDelete, setbotToDelete] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageContent, setPageContent] = useState<BotData[]>([]);
  const [paginationData, setPaginationData] = useState<Metadata>();
  const [searchQuery, setSearchQuery] = useState<string>("")

  const handlePagination = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    event.preventDefault();
    setPage(value);
    getBotsData(`?page=${value}`)
  };

  const handleSearch = (
    value: string
  ) => {
    setSearchQuery(value)
    getBotsData(`?name__icontains=${value}`)
  };

  const deleteAction = (botId: string) => {
    if (botId && botId !== "") {
      deleteBot(botId)
        .then(() => {
          let temp = pageContent;
          temp = temp.filter((item) => item.id !== botId);
          setPage(1);
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
    clientId ? getBotsList(clientId, filterParams)
      .then((response) => {
        const data: BotData[] = response.data
        const paginationData: Metadata = response.metadata
        setPaginationData(paginationData);
        setPageContent(data);
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
      }) : ErrorToast("Conflicto en el id del cliente");
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
      getBotsData("");
    } else {
      ErrorToast("Error al cargar clientId en esta vista");
    }
  }, []);

  return (
    <>
      {!loaded ? (
        <PageCircularProgress />
      ) : (
        <>
          <Typography variant="h4">Agentes de {clientName}</Typography>
          <SearchWrapper>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Buscar"
                value={searchQuery}
                inputProps={{ 'aria-label': 'search' }}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Search>
          </SearchWrapper>
          <Button
            variant="contained"
            sx={{
              marginTop: "20px",
              marginBottom: "20px",
            }}
            onClick={() => navigate(`/bots/contextEntry/${clientId}`)}
          >
            Crear Agente
          </Button>
          {pageContent.length > 0 ? (
            pageContent.map((bot, index) => {
              return (
                <Card key={`bot-${index}`}>
                  <CardContent>
                    <Typography variant="subtitle1" marginBottom={"10px"}>
                      {bot.name}
                    </Typography>
                    <Typography
                      sx={{
                        minHeight: "72px",
                        marginBottom: "10px",
                      }}
                    >
                      {bot.description.length > 150
                        ? bot.description.substring(0, 150) + "..."
                        : bot.description}
                    </Typography>
                    <Stack direction={"row"} alignItems={"center"}>
                      <Typography marginRight={"6px"}>
                        Descargar Widget:
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => {
                          window.open(
                            apiBase.slice(0, -1) + bot.widget_url,
                            "_blanck"
                          );
                        }}
                      >
                        click aquí
                      </Button>
                    </Stack>
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <Grid container>
                      <Grid item xs={9}>
                        <Button
                          size="small"
                          onClick={() =>
                            navigate(`/bots/contextEntry/${clientId}/${bot.id}`)
                          }
                        >
                          Detalles
                        </Button>
                        <Button
                          size="small"
                          onClick={() => navigate(`/bots/dataEntry/${bot.id}`)}
                        >
                          Ktags
                        </Button>
                        <Button
                          size="small"
                          onClick={() =>
                            navigate(`/bots/tools/${bot.name}/${bot.id}`)
                          }
                        >
                          Tools
                        </Button>
                        <Button
                          size="small"
                          onClick={() =>
                            navigate(`/bots/widgetCustomizer/${bot.id}`)
                          }
                        >
                          Widget
                        </Button>
                        <Button
                          size="small"
                          onClick={() =>
                            navigate(`/bots/customMessages/${bot.id}`)
                          }
                        >
                          Saludos
                        </Button>
                        <Button
                          size="small"
                          onClick={() => navigate(`/bots/chat/${bot.id}`)}
                        >
                          Probar
                        </Button>
                      </Grid>

                      <Grid item xs={3} textAlign={"end"}>
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
                      </Grid>
                    </Grid>
                  </CardActions>
                </Card>
              );
            })
          ) : (
            <Typography variant="subtitle2" marginTop={"10px"}>
              No hay chatbots para mostrar
            </Typography>
          )}
          <Pagination
            count={paginationData?.total_pages}
            page={page}
            onChange={handlePagination}
            size="large"
            color="primary"
          />
        </>
      )}
      {allowerState && (
        <ActionAllower
          allowerStateCleaner={setAllowerState}
          actionToDo={deleteAction}
          actionParams={botToDelete}
        />
      )}
    </>
  );
};

export default IaPanel;
