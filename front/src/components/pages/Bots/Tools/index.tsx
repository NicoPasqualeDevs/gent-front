import { PageCircularProgress } from "@/components/CircularProgress";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import chuckArray from "@/helpers/chunkArray";
import useBotsApi from "@/hooks/useBots";
import theme from "@/styles/theme";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToolData } from "@/types/Bots";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Link,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import concatArrays from "@/helpers/concatArrays";
import ActionAllower from "@/components/ActionAllower";
import { useAppContext } from "@/context/app";

const Tools: React.FC = () => {
  const navigate = useNavigate();
  const { botName, botId } = useParams();
  const { replacePath, appNavigation, setAgentsPage } = useAppContext();
  const { getAllTools, getBotTools, deleteTool } = useBotsApi();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [allowerState, setAllowerState] = useState<boolean>(false);
  const [toolToDelete, setToolToDelete] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageContent, setPageContent] = useState<Array<ToolData[]>>([]);

  const handlePagination = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    event.preventDefault();
    setPage(value);
  };

  const deleteAction = (toolId: string) => {
    if (toolId && toolId !== "") {
      deleteTool(toolId)
        .then(() => {
          let temp = concatArrays(pageContent);
          temp = temp.filter((item) => item.id !== toolId);
          setPage(1);
          setPageContent(chuckArray(temp));
          setAllowerState(false);
          setToolToDelete("");
          SuccessToast("Tool eliminada satisfactoriamente");
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
      ErrorToast("Error al cargar toolId al borrar");
    }
  };

  const getToolsData = useCallback(() => {
    getAllTools()
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

  const getBotToolsData = useCallback((botId: string) => {
    getBotTools(botId)
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
    setLoaded(false);
    if (botId) {
      replacePath([
        ...appNavigation.slice(0, 2),
        {
          label: "Tools",
          current_path: `/bots/tools/${botName}/${botId}`,
          preview_path: "",
        },
      ]);
      getBotToolsData(botId);
    } else {
      replacePath([
        {
          label: "Tools",
          current_path: `/bots/tools`,
          preview_path: "",
        },
      ]);
      setAgentsPage(1);
      getToolsData();
    }
  }, [botId]);

  return (
    <>
      {!loaded ? (
        <PageCircularProgress />
      ) : (
        <>
          <Typography variant="h4">
            {botName ? " Tools de " + botName : "Listado de Tools"}
          </Typography>
          <Pagination
            count={pageContent.length}
            page={page}
            onChange={handlePagination}
            size="large"
            color="primary"
          />
          {pageContent.length > 0 ? (
            pageContent[page - 1].map((tool, index) => {
              return (
                <Card key={`bot-${index}`}>
                  <CardContent>
                    <Typography variant="subtitle1" marginBottom={"10px"}>
                      {tool.tool_name}
                    </Typography>
                    <Stack direction={"row"} marginBottom={"10px"}>
                      <Typography
                        sx={{
                          color: theme.palette.primary.main,
                        }}
                      >
                        ID:
                      </Typography>
                      <Typography
                        sx={{
                          color: "white",
                          marginLeft: "10px",
                        }}
                      >
                        {tool.id}
                      </Typography>
                    </Stack>
                    <Stack direction={"row"} marginBottom={"10px"}>
                      <Typography
                        sx={{
                          color: theme.palette.primary.main,
                        }}
                      >
                        Tipo:
                      </Typography>
                      <Typography
                        sx={{
                          color: "white",
                          marginLeft: "10px",
                        }}
                      >
                        {tool.type}
                      </Typography>
                    </Stack>
                    <Stack direction={"row"} marginBottom={"10px"}>
                      <Typography
                        sx={{
                          color: theme.palette.primary.main,
                        }}
                      >
                        Archivo:
                      </Typography>
                      <Link
                        onClick={(e) => {
                          e.preventDefault();
                          if (tool.tool_code) {
                            const xhr = new XMLHttpRequest();
                            xhr.open(
                              "GET",
                              tool.tool_code !== null
                                ? tool.tool_code.toString()
                                : "",
                              true
                            );
                            xhr.responseType = "blob";
                            xhr.onload = () => {
                              if (xhr.status === 200) {
                                const blob = new Blob([xhr.response], {
                                  type: "application/octet-stream",
                                });
                                const link = document.createElement("a");
                                link.href = URL.createObjectURL(blob);
                                link.download = `${tool.tool_name}.py`;
                                link.target = "_blank";
                                link.click();
                              }
                            };
                            xhr.send();
                          }
                        }}
                        sx={{
                          color: "white",
                          marginLeft: "10px",
                        }}
                      >
                        descargar
                      </Link>
                    </Stack>
                    <Stack marginBottom={"10px"}>
                      <Typography
                        sx={{
                          color: theme.palette.primary.main,
                        }}
                      >
                        Instrucciones:
                      </Typography>
                      <Typography
                        sx={{
                          color: "white",
                        }}
                      >
                        {tool.instruction}
                      </Typography>
                    </Stack>
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <Grid container>
                      <Grid item xs={9}>
                        <Button
                          size="small"
                          sx={{
                            marginRight: "5%",
                          }}
                          onClick={() =>
                            navigate(
                              `/bots/tools-form/${tool.tool_name}/${tool.id}`
                            )
                          }
                        >
                          Editar
                        </Button>
                      </Grid>
                      <Grid item xs={3} textAlign={"end"}>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => {
                            setAllowerState(true);
                            if (tool.id) {
                              setToolToDelete(tool.id);
                            }
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
            <Typography
              variant="subtitle2"
              marginTop={"10px"}
              marginBottom={"20px"}
            >
              No hay Tools para mostrar
            </Typography>
          )}
          {botId ? (
            <Button
              variant="contained"
              sx={{
                marginBottom: "20px",
              }}
              onClick={() =>
                navigate(`/bots/tools-relationship/${botName}/${botId}`)
              }
            >
              Asignar Tools
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{ marginBottom: "20px" }}
              onClick={() => navigate("/bots/tools-form/")}
            >
              Crear Tool
            </Button>
          )}
        </>
      )}
      {allowerState && (
        <ActionAllower
          allowerStateCleaner={setAllowerState}
          actionToDo={deleteAction}
          actionParams={toolToDelete}
        />
      )}
    </>
  );
};

export default Tools;
