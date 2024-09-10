import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
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
import ActionAllower from "@/components/ActionAllower";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import chuckArray from "@/helpers/chunkArray";
import useApi from "@/hooks/useApi";
import concatArrays from "@/helpers/concatArrays";
import { useAppContext } from "@/context/app";

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
  const [pageContent, setPageContent] = useState<Array<BotData[]>>([]);

  const handlePagination = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    event.preventDefault();
    setPage(value);
  };

  const deleteAction = (botId: string) => {
    if (botId && botId !== "") {
      deleteBot(botId)
        .then(() => {
          let temp = concatArrays(pageContent);
          temp = temp.filter((item) => item.id !== botId);
          setPage(1);
          setPageContent(chuckArray(temp));
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

  const getBotsData = useCallback((clientId: string) => {
    getBotsList(clientId)
      .then((response) => {
        setPageContent(chuckArray(response));
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
      });
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
      getBotsData(clientId);
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
          <Pagination
            count={pageContent.length}
            page={page}
            onChange={handlePagination}
            size="large"
            color="primary"
          />
          {pageContent.length > 0 ? (
            pageContent[page - 1].map((bot, index) => {
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
