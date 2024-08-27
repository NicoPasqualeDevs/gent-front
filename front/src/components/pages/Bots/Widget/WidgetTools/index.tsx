import { PageCircularProgress } from "@/components/CircularProgress";
import useBotsApi from "@/hooks/useBots";
import { Box, Grid } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWidgetContext } from "../WidgetContext";
import WidgetView from "./WidgetView";

const WidgetTools: React.FC = () => {
  const { botId } = useParams();
  const { getWidget } = useBotsApi();
  const { setWidgetData } = useWidgetContext();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const getWidgetData = useCallback((botId: string): void => {
    getWidget(botId)
      .then((response) => {
        console.log(response, "<-- getWiget");
        setIsLoaded(true);
        setWidgetData(response);
      })
      .catch((error) => {
        console.log(error, "<-- getWidget");
        setIsLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (botId) {
      getWidgetData(botId);
    }
  }, [botId]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
      }}
    >
      {!isLoaded ? (
        <PageCircularProgress />
      ) : (
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{
              height: "100vh",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              paddingRight: "2%",
            }}
          >
            <WidgetView />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default WidgetTools;
