import { Grid, Box, Stack } from "@mui/material";
import { LongInput, ShortInput, StaticInput } from "./Inputs";
import { useParams } from "react-router-dom";
import { BotMetaData } from "@/types/Bots";
import { CenterComponentContainer } from "@/utils/ContainerUtil";
import { StyledDefaultButton } from "@/components/styledComponents/Buttons";
import { StyledPageTitle } from "@/components/styledComponents/Typography";
import { useNavigate } from "react-router-dom";
import useBotsApi from "@/hooks/useBots";
import theme from "@/styles/theme";
import { useEffect, useState, useCallback } from "react";
import { PageCircularProgress } from "@/components/CircularProgress";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import PromptSetCheckBox from "./CheckBox";

// INITIAL STATE TEMPLATES

let emptyContextMetaData: BotMetaData = {
  description: "",
  name: "",
};

const emptyStaticPromptValue = "";

const ContextEntryComponent: React.FC = () => {
  const { clientId, botId } = useParams();
  const [staticPrompt, setStaticPrompt] = useState<boolean>(false);
  const [promptChange, setPromptChange] = useState<boolean>(false);
  const [staticPromptValue, setStaticPromptValue] = useState<string>(
    emptyStaticPromptValue
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [botData, setBotData] = useState<BotMetaData>(emptyContextMetaData);

  const { createBot, updateBot, getBotData, changePromptTemplateSetting } =
    useBotsApi();
  const navigate = useNavigate();

  const BotData = useCallback((botId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      getBotData(botId)
        .then((r) => {
          const loadedMetaData: BotMetaData = {
            id: clientId,
            name: r.name,
            description: r.description,
          };
          setStaticPromptValue("");
          setBotData(loadedMetaData);
          emptyContextMetaData = loadedMetaData;
          setLoading(false);
          resolve();
        })
        .catch((err) => reject(err));
    });
  }, []);

  const handlestaticPrompt = () => {
    setStaticPrompt(!staticPrompt);
    if (promptChange === false) {
      setPromptChange(!promptChange);
    }
  };

  const handleSavePromptState = () => {
    if (botId) changePromptTemplateSetting(botId, staticPrompt);
  };

  useEffect(() => {
    if (clientId && botId) {
      BotData(botId);
    } else if (clientId) {
      const newContextMetaData: BotMetaData = {
        description: "",
        name: "",
      };
      emptyContextMetaData = newContextMetaData;
      setBotData(emptyContextMetaData);
      setLoading(false);
    }
  }, [clientId, botId]);

  const handleSaveBot = () => {
    if (clientId) {
      if (
        emptyContextMetaData.description.length !== 0 &&
        emptyContextMetaData.name.length !== 0
      ) {
        setLoading(true);
        createBot(clientId, emptyContextMetaData)
          .then(() => {
            SuccessToast("Nuevo bot creado con exito");
            navigate(`/bots/iaPanel/${clientId}`);
            setLoading(false);
          })
          .catch(() => {
            ErrorToast("Ups algo salio mal intentelo de nuevo");
            navigate(`/bots/iaPanel/${clientId}`);
          });
      }
    }
  };

  const handleUpdateBot = () => {
    setLoading(true);
    if (clientId && botId) {
      emptyContextMetaData.id = clientId;
      updateBot(botId, emptyContextMetaData)
        .then(() => {
          SuccessToast("Bot actualizado con exito");
          setLoading(false);
        })
        .catch(() => {
          ErrorToast("Ups algo salio mal intentelo de nuevo");
          navigate(`/bots/iaPanel/${clientId}`);
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
      <Grid item xs={10} md={8} xl={6} sx={{ margin: "0 auto" }}>
        {!loading && botData && (
          <Box
            sx={{
              padding: "32px",
              marginBottom: "24px",
            }}
          >
            <Stack gap={2} alignContent={"right"}>
              <StyledPageTitle
                fontSize={"24px"}
                color="primary.main"
                variant="h4"
                textAlign="left"
                gap={2}
              >
                Datos de contexto
              </StyledPageTitle>
              <PromptSetCheckBox
                main={staticPrompt}
                handler={handlestaticPrompt}
              />
              {promptChange && (
                <StyledDefaultButton
                  onClick={() => handleSavePromptState()}
                  sx={{ width: "50px" }}
                >
                  Guardar
                </StyledDefaultButton>
              )}

              {!promptChange && (
                <>
                  <ShortInput
                    emptyData={emptyContextMetaData}
                    data={botData}
                    propKey="name"
                  />
                  <LongInput
                    emptyData={emptyContextMetaData}
                    data={botData}
                    propKey="description"
                  />
                </>
              )}

              {promptChange && (
                <>
                  <StaticInput
                    data={staticPromptValue}
                    botId={botId}
                  />
                </>
              )}

              {!promptChange && (
                <Box display="flex">
                  {botId ? (
                    <StyledDefaultButton
                      sx={{ width: "150px" }}
                      onClick={() => handleUpdateBot()}
                    >
                      Actualizar
                    </StyledDefaultButton>
                  ) : (
                    <StyledDefaultButton onClick={() => handleSaveBot()}>
                      Crear Bot
                    </StyledDefaultButton>
                  )}
                </Box>
              )}
            </Stack>
          </Box>
        )}
        {loading && <PageCircularProgress />}
      </Grid>
    </CenterComponentContainer>
  );
};

export default ContextEntryComponent;
