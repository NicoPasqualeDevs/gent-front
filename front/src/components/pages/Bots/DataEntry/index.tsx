import { Grid, Box, Stack, Divider, Typography, styled } from "@mui/material";
import { LongInput, ShortInput } from "./Inputs";
import { PageCircularProgress } from "@/components/CircularProgress";
import { useParams, useNavigate } from "react-router-dom";
import { Ktag } from "@/types/Bots";
import { MainComponentContainer } from "@/utils/ContainerUtil";
import {
  StyledDefaultButton,
  StyledLinkButton,
} from "@/components/styledComponents/Buttons";
import { SuccessToast, ErrorToast } from "@/components/Toast";
import {
  StyledPageTitle,
  CardSubTitle,
} from "@/components/styledComponents/Typography";
import useBotsApi from "@/hooks/useBots";
import {
  BasicCard,
  BasicCardContent,
  BasicCardAction,
  BasicCardDivider,
} from "@/components/styledComponents/Cards";
import { useEffect, useState, useCallback } from "react";

const KTagContent = styled(Typography)(({ theme }) => ({
  "&.MuiTypography-root": {
    color: theme.palette.primary.main,
    fontSize: "14px",
    textAlign: "left",
    lineHeight: "32px",
  },
}));

// INITIAL STATE TEMPLATES

let emptyKtagsList: Ktag[] = [];

const DataEntryComponent: React.FC = () => {
  const { botId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [customTags, setCustomTags] = useState<Ktag[]>(emptyKtagsList);
  const [enableAdd, setEnableAdd] = useState<boolean>(false);
  const [KTagToEdit, setKTagToEdit] = useState<string>("");
  const { saveKtag, editKtag, getKtags, deleteKtag } = useBotsApi();

  const Ktags = useCallback((botId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      getKtags(botId)
        .then((r) => {
          setCustomTags(r);
          emptyKtagsList = r;
          resolve();
          setLoading(true);
        })
        .catch((err) => reject(err));
    });
  }, []);

  useEffect(() => {
    if (botId) Ktags(botId);
  }, [botId]);

  const handleAddKTag = () => {
    if (customTags.length === emptyKtagsList.length) {
      if (botId) {
        const newTag: Ktag = {
          name: `Nueva etiqueta ${customTags.length + 1}`,
          description: " ",
          value: "",
          customer_bot: botId,
        };
        emptyKtagsList.push(newTag);
        setCustomTags([...emptyKtagsList]);
        setEnableAdd(true);
      }
    }
  };

  const handleSaveKTag = () => {
    const lastKtag: Ktag = emptyKtagsList[emptyKtagsList.length - 1];
    if (lastKtag.description && lastKtag.name && lastKtag.value) {
      setLoading(false);
      if (botId) {
        saveKtag(botId, lastKtag)
          .then((r) => {
            lastKtag.id = r.id;
            setCustomTags(emptyKtagsList);
            setLoading(true);
            setEnableAdd(false);
            SuccessToast("Etiqueta de conocimiento agregada");
          })
          .catch(() => {
            setCustomTags(emptyKtagsList);
            setLoading(true);
            setEnableAdd(false);
            ErrorToast("Algo salio mal intente de nuevo..");
          });
      }
      KTagToEdit !== "" ? setKTagToEdit("") : "";
    }
  };

  const handleEditKtag = (item: Ktag) => {
    setEnableAdd(true);
    setKTagToEdit(item.id ? item.id : "");
  };
  const handleDeleteKtag = (KtagId: string | undefined, index: number) => {
    if (confirm(`Estas seguro que desea eliminar la KTag N°: ${index}`))
      if (KtagId)
        deleteKtag(KtagId)
          .then(() => {
            navigate(-1);
            SuccessToast("KTag eliminado exitosamente");
          })
          .catch(() => {
            ErrorToast(
              "Ups algo salio mal actualice la pagina e intente nuevamente"
            );
          });
  };

  const handleSaveEditKtag = (tagId: string | undefined, index: number) => {
    const KtagToEdit: Ktag = emptyKtagsList[index];
    if (tagId) {
      setLoading(false);
      editKtag(tagId, KtagToEdit)
        .then(() => {
          setCustomTags(emptyKtagsList);
          setLoading(true);
          setEnableAdd(false);
          setKTagToEdit("");
          SuccessToast("Etiqueta de conocimiento editada");
        })
        .catch(() => {
          setCustomTags(emptyKtagsList);
          setLoading(true);
          setEnableAdd(false);
          setKTagToEdit("");
          ErrorToast("Algo salio mal intente de nuevo..");
        });
    }
  };

  const closeTag = () => {
    emptyKtagsList.pop();
    setCustomTags(emptyKtagsList);
    setEnableAdd(false);
  };

  return (
    <MainComponentContainer container paddingTop={"70px"}>
      <Grid item xs={10} md={7} xl={5}>
        {loading ? (
          <>
            <StyledPageTitle
              fontSize={"24px"}
              color="primary.main"
              variant="h4"
              textAlign="left"
              gap={2}
            >
              Actualizar etiquetas de conocimientos {"(KTags)"}
            </StyledPageTitle>
            <Stack id="ktag-wrapper">
              {customTags &&
                customTags.map((item, index) =>
                  item.id ? (
                    //KTAG TO EDIT
                    item.id === KTagToEdit ? (
                      <Grid
                        container
                        gap={2}
                        sx={{ marginBottom: "24px" }}
                        key={`${item.field_name}-${index}-tagBox`}
                      >
                        <Grid xs={12} item display={"flex"}>
                          <ShortInput
                            emptyData={emptyKtagsList[index]}
                            data={item}
                            propKey="name"
                          />
                        </Grid>
                        {/*                         <Grid xs={12} item display={"flex"}>
                          <ShortInput
                            emptyData={emptyKtagsList[index]}
                            data={item}
                            propKey="description"
                          />
                        </Grid> */}
                        <Grid xs={12} item display={"flex"}>
                          <LongInput
                            emptyData={emptyKtagsList[index]}
                            data={item}
                            propKey="value"
                          />
                        </Grid>
                        <Grid container justifyContent={"right"}>
                          <Box display={"flex"}>
                            <StyledDefaultButton
                              onClick={() => handleSaveEditKtag(item.id, index)}
                            >
                              Save Edit
                            </StyledDefaultButton>
                          </Box>
                        </Grid>
                        <Divider
                          sx={{
                            border: "1px solid rgba(50,50,50, 0.1)",
                            width: "100%",
                          }}
                        />
                      </Grid>
                    ) : (
                      // KTAG VIEW
                      <BasicCard key={`${item.field_name}-${index}-tagBox`}>
                        <BasicCardContent>
                          <Box display={"flex"} justifyContent={"right"}>
                            <Typography
                              position={"absolute"}
                              fontSize={10}
                              color="primary.main"
                              textAlign={"center"}
                              maxWidth={"72px"}
                            >{`N° : ${index + 1}`}</Typography>
                          </Box>
                          <CardSubTitle>Palabras Clave :</CardSubTitle>
                          <KTagContent>{`${item.name}`}</KTagContent>

                          {/* <CardSubTitle>{`Instrucción: ${item.description}`}</CardSubTitle> */}
                          <CardSubTitle>Conocimiento Agregado :</CardSubTitle>
                          <KTagContent>{`${item.value}`}</KTagContent>
                        </BasicCardContent>
                        <BasicCardDivider />
                        <BasicCardAction>
                          <Box display={"flex"}>
                            <StyledLinkButton
                              onClick={() => handleEditKtag(item)}
                            >
                              Edit
                            </StyledLinkButton>
                            <StyledLinkButton
                              style={{ marginLeft: "12px" }}
                              onClick={() =>
                                handleDeleteKtag(item.id, index + 1)
                              }
                            >
                              Delete
                            </StyledLinkButton>
                          </Box>
                        </BasicCardAction>
                      </BasicCard>
                    )
                  ) : (
                    // KTAG INPUT
                    <Grid
                      container
                      gap={2}
                      sx={{ marginBottom: "24px" }}
                      key={`${item.field_name}-${index}-tagBox`}
                    >
                      <Grid xs={12} item display={"flex"}>
                        <ShortInput
                          emptyData={emptyKtagsList[index]}
                          data={item}
                          propKey="name"
                        />
                      </Grid>
                      <Grid xs={12} item display={"flex"}>
                        <LongInput
                          emptyData={emptyKtagsList[index]}
                          data={item}
                          propKey="value"
                        />
                      </Grid>
                      <Grid container justifyContent={"right"}>
                        <Box display={"flex"}>
                          <StyledDefaultButton onClick={() => handleSaveKTag()}>
                            Save Tag
                          </StyledDefaultButton>
                          <StyledDefaultButton
                            sx={{ marginLeft: "15px" }}
                            onClick={() => closeTag()}
                          >
                            Close Tag
                          </StyledDefaultButton>
                        </Box>
                      </Grid>
                      <Divider
                        sx={{
                          border: "1px solid rgba(50,50,50, 0.1)",
                          width: "100%",
                        }}
                      />
                    </Grid>
                  )
                )}
            </Stack>

            <Box textAlign={"right"}>
              <>
                {customTags.length !== 300 ? (
                  <StyledDefaultButton
                    disabled={enableAdd}
                    sx={{
                      background: enableAdd
                        ? "rgb(155,155,155) !important"
                        : "",
                      width: "150px",
                    }}
                    onClick={() => handleAddKTag()}
                  >
                    Nueva etiqueta
                  </StyledDefaultButton>
                ) : (
                  <></>
                )}

                <StyledDefaultButton
                  sx={{
                    marginLeft: "16px",
                    width: "150px",
                  }}
                  onClick={() => navigate(`/bots/chat/${botId}`)}
                >
                  Probar Bot
                </StyledDefaultButton>
              </>
            </Box>
          </>
        ) : (
          <PageCircularProgress />
        )}
      </Grid>
    </MainComponentContainer>
  );
};

export default DataEntryComponent;
