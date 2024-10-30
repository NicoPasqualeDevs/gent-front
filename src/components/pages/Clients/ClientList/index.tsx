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
} from "@mui/material";
import { PageCircularProgress } from "@/components/CircularProgress";
import useCustomersApi from "@/hooks/useCustomers";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import ActionAllower from "@/components/ActionAllower";
import { ClientDetails } from "@/types/Clients";
import { Metadata } from "@/types/Api";
import theme from "@/styles/theme";

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
      });
  }, []);

  useEffect(() => {
    replacePath([
      {
        label: "Clientes",
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
    <>
      {!loaded ? (
        <PageCircularProgress />
      ) : (
        <>
          <Typography variant="h2" marginBottom={"20px"}>
            Clientes
          </Typography>
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
            pageContent.map((client, index) => {
              return (
                <Card key={`client-${index}`}>
                  <CardContent>
                    <Typography variant="subtitle1" marginBottom={"10px"}>
                      {client.name}
                    </Typography>
                    <Typography
                      sx={{
                        minHeight: "72px",
                      }}
                    >
                      {client.description.length > 150
                        ? client.description.substring(0, 150) + "..."
                        : client.description}
                    </Typography>
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <Grid container>
                      <Grid item xs={11}>
                        <Tooltip title="Acceder a Agentes" arrow>
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
                            Agentes
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
              );
            })
          ) : (
            <Typography variant="subtitle2" marginTop={"10px"}>
              {searchQuery && searchQuery.trim() !== ""
                ? "No se encontraron clientes con ese nombre"
                : "No hay clientes para mostrar"}
            </Typography>
          )}
        </>
      )}
      {allowerState && (
        <ActionAllower
          allowerStateCleaner={setAllowerState}
          actionToDo={deleteAction}
          actionParams={clientToDelete}
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
              page={clientPage}
              onChange={handlePagination}
              size="small"
              color="primary"
            />
          </Grid>
          <Grid
            item
            xs={5}
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
                  (clientPage - 1) * paginationData.page_size + 1
                } - ${Math.min(
                  clientPage * paginationData.page_size,
                  paginationData.total_items
                )} de ${paginationData.total_items} Clientes`}
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
              onChange={(e: SelectChangeEvent) => {
                setContentPerPage(e.target.value);
                setLoaded(false);
                getClientsData(`?page_size=${e.target.value}`);
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

export default ClientList;
