import { useEffect, useCallback, useState } from "react";
import { useAppContext } from "@/context/app";
import { MainGridContainer } from "@/utils/ContainerUtil";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Pagination,
  Typography,
} from "@mui/material";
import { PageCircularProgress } from "@/components/CircularProgress";
import useCustomersApi from "@/hooks/useCustomers";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import ActionAllower from "@/components/ActionAllower";
import { ClientDetails } from "@/types/Clients";
import chuckArray from "@/helpers/chunkArray";
import concatArrays from "@/helpers/concatArrays";

const ClientList: React.FC = () => {
  const navigate = useNavigate();
  const { setNavElevation } = useAppContext();
  const { getCustomerList, deleteClientDetails } = useCustomersApi();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [allowerState, setAllowerState] = useState<boolean>(false);
  const [clientToDelete, setClientToDelete] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageContent, setPageContent] = useState<Array<ClientDetails[]>>([]);

  const handlePagination = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    event.preventDefault();
    setPage(value);
  };

  const deleteAction = (clientId: string) => {
    deleteClientDetails(clientId)
      .then(() => {
        let temp = concatArrays(pageContent);
        temp = temp.filter((item) => item.id !== clientId);
        setPage(1);
        setPageContent(chuckArray(temp));
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

  const getClientsData = useCallback(() => {
    getCustomerList()
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
    setNavElevation("clients");
    getClientsData();
  }, []);

  return (
    <>
      <MainGridContainer container>
        <Grid item xs={10} md={7} lg={5}>
          {!loaded ? (
            <PageCircularProgress />
          ) : (
            <>
              <Typography variant="h2" paddingTop={"70px"}>
                Clientes
              </Typography>
              <Pagination
                count={pageContent.length}
                page={page}
                onChange={handlePagination}
                size="large"
                color="primary"
              />
              {pageContent.length > 0 ? (
                pageContent[page - 1].map((client, index) => {
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
                            <Button
                              size="small"
                              sx={{
                                marginRight: "5%",
                              }}
                              onClick={() =>
                                navigate(
                                  `/bots/IaPanel/${client.name}/${client.id}`
                                )
                              }
                            >
                              Bots
                            </Button>
                            <Button
                              size="small"
                              onClick={() =>
                                navigate(`/clients/form/${client.id}`)
                              }
                            >
                              Editar
                            </Button>
                          </Grid>
                          <Grid item xs={1} textAlign={"end"}>
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
                          </Grid>
                        </Grid>
                      </CardActions>
                    </Card>
                  );
                })
              ) : (
                <Typography variant="subtitle2" marginTop={"10px"}>
                  No hay clientes registrados
                </Typography>
              )}
            </>
          )}
        </Grid>
      </MainGridContainer>
      {allowerState && (
        <ActionAllower
          allowerStateCleaner={setAllowerState}
          actionToDo={deleteAction}
          actionParams={clientToDelete}
        />
      )}
    </>
  );
};

export default ClientList;
