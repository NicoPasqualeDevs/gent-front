import { PageCircularProgress } from "@/components/CircularProgress";
import {
  StyledDangerButton,
  StyledDefaultButton,
} from "@/components/styledComponents/Buttons";
import {
  StyledPageSubTitle,
  StyledPageTitle,
} from "@/components/styledComponents/Typography";
import useBotsApi from "@/hooks/useBots";
import { CustomGreetingData, NewGreetingData } from "@/types/Bots";
import { MainComponentContainer } from "@/utils/ContainerUtil";
import { Box, Grid } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShortInput } from "./Inputs";
import { ErrorToast, SuccessToast } from "@/components/Toast";

type MessagesData = CustomGreetingData[];
let emptyMessagesTemplate: MessagesData = [];

export const CustomMessages = () => {
  const {
    getCustomMessages,
    postCustomMessages,
    putCustomMessage,
    deleteCustomMessage,
  } = useBotsApi();
  const { botId } = useParams();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessagesData>(emptyMessagesTemplate);
  const [newMessage, setNewMessage] = useState<NewGreetingData>({
    bot: "",
    text: "",
  });

  const getCustomMessagesData = useCallback((botId: string): void => {
    getCustomMessages(botId)
      .then((response) => {
        emptyMessagesTemplate = [...response.data];
        setMessages([...response.data]);
        setIsLoaded(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (botId) {
      getCustomMessagesData(botId);
      setNewMessage({ ...newMessage, bot: botId });
    }
  }, [botId]);

  const handleUpdate = (index: number) => {
    if (emptyMessagesTemplate[index] && emptyMessagesTemplate[index].id) {
      if (emptyMessagesTemplate[index].text.trim() !== "") {
        let testEquality = 0;
        messages.forEach((msg) => {
          if (emptyMessagesTemplate[index].text === msg.text) {
            testEquality += 1;
          }
        });
        console.log(testEquality);
        if (testEquality < 2) {
          putCustomMessage(
            emptyMessagesTemplate[index].id,
            emptyMessagesTemplate[index]
          )
            .then(() => {
              SuccessToast("Saludo guardado correctamente");
            })
            .catch((error) => {
              console.log(error);
              ErrorToast("Ups something went wrong!");
            });
        } else {
          ErrorToast("No se puede actualizar si ya existe un saludo igual");
        }
      } else {
        ErrorToast("Error: No se puede guardar un saludo vacio");
      }
    } else {
      ErrorToast("Ups something went wrong");
    }
  };

  const handleDelete = (index: number) => {
    if (messages[index].id) {
      deleteCustomMessage(messages[index].id)
        .then(() => {
          setMessages((prevItems) => prevItems.filter((_, i) => i !== index));
          SuccessToast("Saludo borrado correctamente");
        })
        .catch((error) => {
          console.log(error);
          ErrorToast("No se pudo borrar el saludo");
        });
    }
  };

  const handleNew = () => {
    if (newMessage.text.trim() !== "") {
      let testEquality = false;
      messages.forEach((msg) => {
        if (msg.text === newMessage.text) {
          testEquality = true;
        }
      });
      if (!testEquality) {
        postCustomMessages(newMessage)
          .then((response) => {
            console.log(response);
            setMessages([...messages, response]);
            emptyMessagesTemplate = [...messages, response];
            SuccessToast("Saludo creado correctamente");
          })
          .catch((error) => {
            console.log(error);
            ErrorToast("Ups something went wrong!");
          });
      } else {
        ErrorToast("No se puede crear un salduo si ya existe");
      }
    } else {
      ErrorToast("No se puede crear un saludo vacio");
    }
  };

  return (
    <MainComponentContainer container marginTop={{ xs: "100px", lg: "40px" }}>
      <Grid
        item
        xs={10}
        md={8}
        xl={6}
        textAlign={"center"}
        sx={{
          marginLeft: "auto",
          marginRight: "auto",
          paddingTop: "13%",
          paddingBottom: "5%",
        }}
      >
        {isLoaded ? (
          <Box sx={{}}>
            <StyledPageTitle>Saludos Personalizados</StyledPageTitle>
            <StyledPageSubTitle marginTop={"20px"}>
              Saludos Existentes
            </StyledPageSubTitle>
            {messages.map((item, index) => {
              return (
                <Box
                  display={"flex"}
                  gap={1}
                  marginTop={"10px"}
                  key={`greeting-${index}`}
                >
                  <ShortInput
                    propKey="text"
                    emptyTemplate={emptyMessagesTemplate[index]}
                    baseDetails={item}
                  />
                  <StyledDefaultButton onClick={() => handleUpdate(index)}>
                    Actualizar
                  </StyledDefaultButton>
                  <StyledDangerButton onClick={() => handleDelete(index)}>
                    Borrar
                  </StyledDangerButton>
                </Box>
              );
            })}
            <StyledPageSubTitle marginTop={"20px"}>
              Crear nuevo mensaje
            </StyledPageSubTitle>
            <Box display={"flex"} gap={1} marginTop={"10px"}>
              <ShortInput
                propKey="text"
                emptyTemplate={newMessage}
                baseDetails={newMessage}
              />
              <StyledDefaultButton onClick={handleNew}>
                Crear
              </StyledDefaultButton>
            </Box>
          </Box>
        ) : (
          <PageCircularProgress />
        )}
      </Grid>
    </MainComponentContainer>
  );
};

export default CustomMessages;
