import { PageCircularProgress } from "@/components/CircularProgress";
import { ErrorToast, SuccessToast } from "@/components/Toast";
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
  InputBase,
  Link,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ActionAllower from "@/components/ActionAllower";
import { useAppContext } from "@/context/app";
import { Metadata } from "@/types/Api";
import { styled, alpha } from "@mui/material/styles";

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

const Tools: React.FC = () => {
  const navigate = useNavigate();
  const { botName, botId } = useParams();
  const {
    replacePath,
    appNavigation,
    setAgentsPage,
    toolsPage,
    setToolsPage,
    botToolsPage,
    setBotToolsPage,
  } = useAppContext();
  const { getAllTools, getBotTools, deleteTool } = useBotsApi();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [allowerState, setAllowerState] = useState<boolean>(false);
  const [toolToDelete, setToolToDelete] = useState<string>("");
  const [pageContent, setPageContent] = useState<ToolData[]>([]);
  const [paginationData, setPaginationData] = useState<Metadata>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [contentPerPage, setContentPerPage] = useState<string>("5");

  const handlePagination = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    event.preventDefault();
    setLoaded(false);
    if (!botId) {
      setToolsPage(value);
      getToolsData(`?page_size=${contentPerPage}&page=${value}`);
    } else {
      setBotToolsPage(value);
      getBotToolsData(botId, `?page_size=${contentPerPage}&page=${value}`);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.trim() !== "") {
      if (!botId) {
        getToolsData(`?tool_name__icontains=${value}`);
      } else {
        getBotToolsData(botId, `?tool_name__icontains=${value}`);
      }
    }
  };

  const deleteAction = (toolId: string) => {
    if (toolId && toolId !== "") {
      deleteTool(toolId)
        .then(() => {
          let temp = pageContent;
          temp = temp.filter((item) => item.id !== toolId);
          setPageContent(temp);
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

  const getToolsData = useCallback((filterParams: string) => {
    getAllTools(filterParams)
      .then((response) => {
        const data: ToolData[] = response.data;
        const paginationData: Metadata = response.metadata;
        setToolsPage(paginationData.current_page || 1);
        setPageContent(data);
        setPaginationData(paginationData);
        setLoaded(true);
      })
      .catch((error) => {
        if (error instanceof Error) {
          ErrorToast("Error: no se pudo establecer conexión con el servidor");
        } else {
          ErrorToast(error.message);
        }
      });
  }, []);

  const getBotToolsData = useCallback((botId: string, filterParams: string) => {
    getBotTools(botId, filterParams)
      .then((response) => {
        const data: ToolData[] = response.data;
        const paginationData: Metadata = response.metadata;
        setBotToolsPage(paginationData.current_page || 1);
        setPageContent(data);
        setPaginationData(paginationData);
        setLoaded(true);
      })
      .catch((error) => {
        if (error instanceof Error) {
          ErrorToast("Error: no se pudo establecer conexión con el servidor");
        } else {
          ErrorToast(error.message);
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
      if (!loaded) {
        getBotToolsData(
          botId,
          `?page_size=${contentPerPage}&page=${toolsPage}`
        );
      }
    } else {
      replacePath([
        {
          label: "tools",
          current_path: `/bots/tools`,
          preview_path: "",
        },
      ]);
      setAgentsPage(1);
      if (!loaded) {
        getToolsData(`?page_size=${contentPerPage}&page=${toolsPage}`);
      }
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
          {botId ? (
            <Button
              variant="contained"
              sx={{
                marginBottom: "20px",
              }}
              onClick={() =>
                console.log("asiganar tools")
                //navigate(`/bots/tools-relationship/${botName}/${botId}`)
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
          <SearchWrapper>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Buscar"
                value={searchQuery}
                inputProps={{ "aria-label": "search" }}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Search>
          </SearchWrapper>
          {pageContent.length > 0 ? (
            pageContent.map((tool, index) => {
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
              {searchQuery && searchQuery.trim() !== ""
                ? "No se encontraron tools con ese nombre"
                : "No hay tools para mostrar"}
              No hay Tools para mostrar
            </Typography>
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
      {loaded && pageContent.length > 0 && (
        <Grid container marginBottom={"20px"}>
          <Grid
            item
            xs={6}
            sm={4}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Pagination
              count={paginationData?.total_pages}
              page={botId ? botToolsPage : toolsPage}
              onChange={handlePagination}
              size="small"
              color="primary"
            />
          </Grid>
          <Grid
            item
            xs={6}
            sm={3}
            justifyContent={{ xs: "flex-end", sm: "center" }}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {paginationData &&
            paginationData.page_size &&
            paginationData.total_items ? (
              <Typography
                sx={{
                  fontSize: "80%",
                  padding: "5px 0px",
                }}
              >
                {`${
                  ((botId ? botToolsPage : toolsPage) - 1) *
                    paginationData.page_size +
                  1
                } - ${Math.min(
                  (botId ? botToolsPage : toolsPage) * paginationData.page_size,
                  paginationData.total_items
                )} de ${paginationData.total_items} Agentes`}
              </Typography>
            ) : null}
          </Grid>
          <Grid
            item
            xs={12}
            sm={5}
            justifyContent={{ xs: "flex-start", sm: "flex-end" }}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "80%",
                marginRight: "5px",
              }}
            >
              Elementos por página
            </Typography>
            <Select
              value={contentPerPage}
              label="Elementos por página"
              onChange={(e: SelectChangeEvent) => {
                setContentPerPage(e.target.value);
                setLoaded(false);
                if (botId) {
                  getBotToolsData(botId, `?page_size=${e.target.value}`);
                } else {
                  getToolsData(`?page_size=${e.target.value}`);
                }
              }}
              sx={{
                "& .MuiSelect-select": {
                  color: "white",
                  padding: "5px 5px 5px 5px",
                },
                "& .MuiSelect-icon": {
                  color: "white",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "transparent",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <MenuItem value="5">5</MenuItem>
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="20">20</MenuItem>
            </Select>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Tools;
