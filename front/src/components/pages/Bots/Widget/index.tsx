import { PageCircularProgress } from "@/components/CircularProgress";
import { ErrorToast } from "@/components/Toast";
import useApi from "@/hooks/useApi";
import useBotsApi from "@/hooks/useBots";
import { Box, Grid } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Widget: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [widgetData, setWidgetData] = useState<string>("");
  const [code, setCode] = useState("");
  const { getNoAuthBotData, getBotData } = useBotsApi();
  const { apiBase } = useApi();
  const { botId } = useParams();

  const getData = useCallback((botId: string): void => {
    getNoAuthBotData(botId)
      .then((response) => {
        setWidgetData(response.widget_url);
      })
      .catch(() => {
        ErrorToast("No se pudo cargar la información del Widget");
      });
  }, []);

  useEffect(() => {
    if (botId) {
      getData(botId);
    }
  }, [botId]);

  useEffect(() => {
    if (widgetData.trim() !== "") {
      fetch(apiBase.slice(0, -1) + widgetData)
        .then((res) => res.text())
        .then((codigo) => {
          setCode(codigo);
          setIsLoaded(true);
        })
        .catch(() => ErrorToast("No se pudo cargar la información del Widget"));
    }
  }, [widgetData]);

  return (
    <Grid container sx={{ width: "100%" }}>
      {!isLoaded ? (
        <Grid
          item
          xs={12}
          sx={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <PageCircularProgress />
        </Grid>
      ) : (
        <Grid
          item
          xs={12}
          sx={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Box
            component={"iframe"}
            id="widget-iframe"
            srcDoc={`<script>${code}</script>`}
            sx={{
              border: "none",
              margin: "0 auto",
              width: "380px",
            }}
          ></Box>
        </Grid>
      )}
    </Grid>
  );
};

export default Widget;
