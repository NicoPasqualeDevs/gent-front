import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { CenterComponentContainer } from "@/utils/ContainerUtil";
import { ClientDetails } from "@/types/Clients";
import { useAppContext } from "@/context/app";
import { ClientDataForm } from "./Forms";
import { useNavigate } from "react-router-dom";
import { SuccessToast } from "@/components/Toast";
import useCustomersApi from "@/hooks/useCustomers";
import { PageCircularProgress } from "@/components/CircularProgress";
import theme from "@/styles/theme";


let clientDetailsTemplate: ClientDetails = {
  address: "",
  description: "",
  name: "",
};

const Clientform: React.FC = () => {
  const { clientsList, setCustomersList, setNavElevation } = useAppContext();
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { postClientDetails, putClientDetails } = useCustomersApi();
  const [clientDetails, setClientDetails] = useState<ClientDetails>();
  const [sending, setSending] = useState<boolean>(false);

  const emptyClientDetailsTemplate: ClientDetails = {
    address: "",
    description: "",
    name: "",
  };

  useEffect(() => {
    if (clientId) {
      clientsList?.map((client: ClientDetails) => {
        if (client.id === clientId) {
          clientDetailsTemplate = { ...client };
          setClientDetails(client);
        }
      });
    } else {
      setClientDetails(clientDetailsTemplate);
    }
  }, [clientId, clientsList]);

  const getUpdatedClientList = (r: ClientDetails, add: string | null) => {
    const updatedClientList: ClientDetails[] = [];
    clientsList?.map((client) => {
      if (client.id === clientId || add) updatedClientList.push(r);
      else updatedClientList.push(client);
    });
    return updatedClientList;
  };

  const handleClientDetails = () => {
    setSending(true);
    if (clientId) {
      putClientDetails(clientDetailsTemplate, clientId).then(
        (r: ClientDetails) => {
          setCustomersList(getUpdatedClientList(r, null));
          SuccessToast("Información del cliente actualizada");
          navigate("/clients");
          setNavElevation("clients")
        }
      );
    } else {
      postClientDetails(clientDetailsTemplate).then((r: ClientDetails) => {
        setCustomersList(getUpdatedClientList(r, "add"));
        SuccessToast("Registro creado satisfactoriamente");
        navigate("/clients");
        setNavElevation("clients")
      });
    }
  };

  return (
    <CenterComponentContainer
      container
      sx={{
        backgroundColor: theme.palette.info.light,
      }}
    >
      <Grid
        item
        xs={10}
        md={8}
        xl={6}
        textAlign={"center"}
        sx={{ margin: "0 auto" }}
      >
        {!sending && clientId && clientDetails && (
          <ClientDataForm
            clientDetails={clientDetails}
            clientDetailsTemplate={clientDetailsTemplate}
            handleClientDetails={handleClientDetails}
          />
        )}
        {!sending && !clientId && (
          <ClientDataForm
            clientDetails={emptyClientDetailsTemplate}
            clientDetailsTemplate={clientDetailsTemplate}
            handleClientDetails={handleClientDetails}
          />
        )}
        {sending && <PageCircularProgress />}
      </Grid>
    </CenterComponentContainer>
  );
};

export default Clientform;
