import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MainComponentContainer } from "@/utils/ContainerUtil";
import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import useBotsApi from "@/hooks/useBots";
import {
  StyledDefaultButton,
  StyledLinkButton,
} from "@/components/styledComponents/Buttons";
import { StyledPageTitle } from "@/components/styledComponents/Typography";
import { PageCircularProgress } from "@/components/CircularProgress";
import ButtonOpenURL from "@/components/ButtonOpenURL";
import theme from "@/styles/theme";
import { BotData } from "@/types/Bots";

const IaPanel: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { clientId } = useParams();
  const [botsList, setBotsList] = useState<BotData[]>();
  const { getBotsList, deleteBot } = useBotsApi();
  const navigate = useNavigate();

  const BotList = useCallback((clientId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      getBotsList(clientId)
        .then((r) => {
          setBotsList(r);
          setLoading(false);
          resolve();
        })
        .catch((err) => reject(err));
    });
  }, []);

  useEffect(() => {
    if (clientId && loading) {
      BotList(clientId);
    }
  }, [clientId, loading]);

  const handleEditBase = (botId: string | undefined) => {
    if (botId) navigate(`/bots/dataEntry/${botId}`);
  };

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
        {!loading && botsList && (
          <>
            <Box textAlign={"left"} marginBottom={"20px"}>
              <Typography
                color={"secondary.dark"}
                component={"p"}
                fontSize={"30px"}
                gutterBottom
                variant="h3"
              >
                Listado de chatbots
              </Typography>
            </Box>
            {botsList &&
              botsList.map((botData, i) => {
                return (
                  <Paper
                    key={`bot-paper-${i}`}
                    sx={{
                      position: "relative",
                      padding: 2,
                      backgroundColor: theme.palette.info.light,
                      borderRadius: "10px",
                      marginBottom: "16px",
                    }}
                  >
                    <Box marginBottom={"10px"}>
                      <StyledPageTitle>{botData?.name}</StyledPageTitle>
                    </Box>
                    <Grid container spacing={2} textAlign={"justify"}>
                      <Grid item xs={12}>
                        <Typography variant="h6" component={"p"}>
                          Descripción General
                        </Typography>
                        <Typography>{botData?.description}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        {botData.iframe_code || botData.widget_url ? (
                          <Typography variant="h6" component={"p"}>
                            Extras
                          </Typography>
                        ) : null}
                        {botData.widget_url && (
                          <Box display={"flex"}>
                            <Typography marginTop={"5px"}>
                              Descargue nuestro widget
                            </Typography>
                            <ButtonOpenURL
                              url={botData.widget_url}
                              text="click aquí"
                            />
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                    <Divider sx={{ marginTop: "40px", marginBottom: "20px" }} />
                    <Box textAlign={"left"} marginTop={"10px"}>
                      <Box
                        display={{ sm: "inline" }}
                        marginRight={"10px"}
                        marginBottom={"10px"}
                      >
                        <StyledLinkButton
                          onClick={() =>
                            navigate(
                              `/bots/contextEntry/${clientId}/${botData.id}`
                            )
                          }
                        >
                          Metadatos
                        </StyledLinkButton>
                      </Box>
                      <Box display={"inline"} marginTop={"10px"}>
                        <StyledLinkButton
                          onClick={() => handleEditBase(botData.id)}
                        >
                          Base de Conocimientos
                        </StyledLinkButton>
                        <StyledLinkButton>
                          Personalizar Web-Chat
                        </StyledLinkButton>
                        <StyledLinkButton
                          sx={{
                            minHeight: "32px",
                            fontSize: "17px !important",
                          }}
                          onClick={() => navigate(`/bots/chat/${botData.id}`)}
                        >
                          Probar
                        </StyledLinkButton>
                        <StyledLinkButton
                          sx={{
                            minHeight: "32px",
                            fontSize: "17px !important",
                          }}
                          onClick={() =>
                            confirm(
                              `¿Esta seguro que desea eliminar el bot llamado ${botData.name}?`
                            )
                              ? deleteBot(botData.id)
                              : ""
                          }
                        >
                          Eliminar
                        </StyledLinkButton>
                      </Box>
                    </Box>
                  </Paper>
                );
              })}
            <Grid item xs={12}>
              <Box textAlign={"right"} marginBottom={"20px"}>
                <StyledDefaultButton
                  sx={{ width: "135px", height: "55px", marginBottom: "24px" }}
                  onClick={() => navigate(`/bots/contextEntry/${clientId}`)}
                >
                  Crear nueva IA
                </StyledDefaultButton>
              </Box>
            </Grid>
          </>
        )}
        {loading && <PageCircularProgress />}
      </Grid>
    </MainComponentContainer>
  );
};

export default IaPanel;
