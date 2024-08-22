import { useEffect, useCallback, useState } from "react";
import { useAppContext } from "@/context/app";
import { MainComponentContainer } from "@/utils/ContainerUtil";
import { useNavigate } from "react-router-dom";
import { StyledLinkButton } from "@/components/styledComponents/Buttons";
import {
  Grid,
  Card,
  CardActions,
  CardContent,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { PageCircularProgress } from "@/components/CircularProgress";
import theme from "@/styles/theme";
import useCustomersApi from "@/hooks/useCustomers";

const ClientList: React.FC = () => {
  const { setCustomersList, clientsList, loaded } = useAppContext();
  const [loading, setLoading] = useState<boolean>(true);
  const { getCustomerList } = useCustomersApi();

  const ClientList = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      getCustomerList()
        .then((r) => {
          setCustomersList(r);
          setLoading(false);
          resolve();
        })
        .catch((err) => reject(err));
    });
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loaded) {
      ClientList();
    }
  }, [loading]);

  return (
    <MainComponentContainer
      container
      sx={{ backgroundColor: "white", paddingTop: "120px" }}
    >
      <Grid
        item
        xs={10}
        md={8}
        xl={6}
        textAlign={"center"}
        sx={{ margin: "40px auto" }}
      >
        {!loading && clientsList && (
          <>
            <Box textAlign={"left"} marginBottom={"20px"}>
              <Typography
                color={"secondary.dark"}
                component={"p"}
                fontSize={"30px"}
                gutterBottom
                variant="h3"
              >
                Clientes
              </Typography>
            </Box>
            {clientsList?.map((client, i) => (
              <Card
                key={`botList-card-${i}`}
                sx={{
                  minHeight: "200px",
                  minWidth: "280px",
                  marginBottom: "24px",
                  backgroundColor: theme.palette.info.light,
                  borderRadius: "10px",
                }}
              >
                <CardContent sx={{ minHeight: "100px" }}>
                  <Typography
                    textAlign={"left"}
                    gutterBottom
                    variant="h4"
                    component="div"
                    fontSize={"28px !important"}
                    color={theme.palette.secondary.dark}
                  >
                    {client.name}
                  </Typography>
                  <Typography
                    fontSize={14}
                    padding={"10px 0px"}
                    textAlign={"left"}
                  >
                    {client.description.length > 150
                      ? client.description.substring(0, 150) + "..."
                      : client.description}
                  </Typography>
                  <Box marginTop={"20px"}>
                    <Divider />
                  </Box>
                </CardContent>
                <CardActions sx={{ float: "left", marginBottom: "10px" }}>
                  <StyledLinkButton
                    sx={{ minHeight: "32px", fontSize: "17px !important" }}
                    onClick={() => navigate(`/bots/IaPanel/${client.id}`)}
                  >
                    Bots
                  </StyledLinkButton>
                  <StyledLinkButton
                    sx={{ minHeight: "32px", fontSize: "17px !important" }}
                    onClick={() => navigate(`/clients/form/${client.id}`)}
                  >
                    Editar
                  </StyledLinkButton>
                </CardActions>
              </Card>
            ))}
          </>
        )}
        {loading && <PageCircularProgress />}
      </Grid>
    </MainComponentContainer>
  );
};

export default ClientList;
