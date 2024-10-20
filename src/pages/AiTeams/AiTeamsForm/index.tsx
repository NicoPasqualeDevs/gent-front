import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Typography, Paper, Container, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useParams } from "react-router-dom";
import { AiTeamsDetails } from "@/types/AiTeams";
import { useNavigate } from "react-router-dom";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import useCustomersApi from "@/hooks/useCustomers";
import useAdmin from "@/hooks/useAdmin"; // Importamos el nuevo hook
import { PageCircularProgress } from "@/components/CircularProgress";
import * as Yup from "yup";
import { useFormik } from "formik";
import { MultilineInput, TextInput } from "@/components/Inputs";
import { useAppContext } from "@/context/app";
import { languages } from "@/utils/Traslations";

const AiTeamsForm: React.FC = () => {
  const navigate = useNavigate();
  const { aiTeamName, aiTeamId } = useParams();
  const { setNavElevation, appNavigation, replacePath, setAgentsPage, language, auth } = useAppContext();
  const { getAiTeamDetails, postAiTeamDetails, putAiTeamDetails } = useCustomersApi();
  const { listNonSuperUsers } = useAdmin(); // Utilizamos el nuevo hook
  const t = languages[language as keyof typeof languages].aiTeamsForm;

  const [loaded, setLoaded] = useState<boolean>(false);
  const [isTeamDataLoaded, setIsTeamDataLoaded] = useState<boolean>(false);
  const [isUsersDataLoaded, setIsUsersDataLoaded] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<AiTeamsDetails>({
    name: "",
    address: "",
    description: "",
    selectedUser: "", // Añade esta línea
  });

  const [inputError, setInputError] = useState<AiTeamsDetails>({
    name: "",
    address: "",
    description: "",
  });

  // Asegúrate de que este tipo coincida con la respuesta de la API
  type NonSuperUser = { username: string; email: string };

  const [nonSuperUsers, setNonSuperUsers] = useState<NonSuperUser[]>([]);

  const validationSchema = Yup.object({
    name: Yup.string().required(t.fieldRequired),
    address: Yup.string().required(t.fieldRequired),
    description: Yup.string().required(t.fieldRequired),
  });

  const onSubmit = (values: AiTeamsDetails) => {
    if (aiTeamId) {
      updateClient(values, aiTeamId);
    } else {
      createNewClient(values);
    }
  };

  const { values, errors, handleSubmit, handleChange, setValues } = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setInputError({
      name: errors.name || " ",
      address: errors.address || " ",
      description: errors.description || " ",
    });
    handleSubmit(e);
  };

  const getAiTeamData = useCallback((aiTeamId: string) => {
    getAiTeamDetails(aiTeamId)
      .then((response) => {
        setValues({
          name: response.name,
          address: response.address,
          description: response.description,
        });
        setInitialValues({
          name: response.name,
          address: response.address,
          description: response.description,
        });
        setIsTeamDataLoaded(true);
      })
      .catch((error) => {
        if (error instanceof Error) {
          ErrorToast(t.errorConnection);
        } else {
          ErrorToast(
            `${error.status} - ${error.error} ${error.data ? ": " + error.data : ""
            }`
          );
        }
        setIsTeamDataLoaded(true); // Asegurarse de que se marque como cargado incluso en caso de error
      });
  }, [getAiTeamDetails, setValues, setInitialValues, t.errorConnection]);

  const updateClient = (values: AiTeamsDetails, aiTeamId: string) => {
    putAiTeamDetails(values, aiTeamId)
      .then(() => SuccessToast(t.successUpdate))
      .catch((error) => {
        if (error instanceof Error) {
          ErrorToast(t.errorConnection);
        } else {
          ErrorToast(
            `${error.status} - ${error.error} ${error.data ? ": " + error.data : ""
            }`
          );
        }
      });
  };

  const createNewClient = (values: AiTeamsDetails) => {
    if (auth?.user?.email) {
      const dataWithEmail = { ...values, email: auth.user.email };
      postAiTeamDetails(dataWithEmail)
        .then(() => {
          SuccessToast(t.successCreate);
          navigate(`/builder`);
        })
        .catch((error) => {
          if (error instanceof Error) {
            ErrorToast(t.errorConnection);
          } else {
            ErrorToast(
              `${error.status} - ${error.error} ${error.data ? ": " + error.data : ""
              }`
            );
          }
        });
    };
  }

  const fetchNonSuperUsers = useCallback(() => {
    listNonSuperUsers()
      .then((response) => {
        setNonSuperUsers(response.data);
        setIsUsersDataLoaded(true);
      })
      .catch((error) => {
        console.error("Error al obtener usuarios no superusuarios:", error);
        setIsUsersDataLoaded(true); // Asegurarse de que se marque como cargado incluso en caso de error
      });
  }, [listNonSuperUsers]);

  useEffect(() => {
    const initializeForm = () => {
      setLoaded(false);
      setIsTeamDataLoaded(false);
      setIsUsersDataLoaded(false);
      setValues({
        name: "",
        address: "",
        description: "",
      });
      setInitialValues({
        name: "",
        address: "",
        description: "",
      });
    };

    initializeForm();

    if (aiTeamId && aiTeamName) {
      replacePath([
        ...appNavigation.slice(0, 2),
        {
          label: aiTeamName,
          current_path: "/builder",
          preview_path: "",
        },
        {
          label: t.edit,
          current_path: `bots/builder/agents/form/${aiTeamId}`,
          preview_path: "",
        },
      ]);
      setNavElevation("builder");
      getAiTeamData(aiTeamId);
    } else {
      setAgentsPage(1);
      replacePath([
        {
          label: t.register,
          current_path: `bots/builder/agents/form`,
          preview_path: "",
        },
      ]);
      setIsTeamDataLoaded(true); // No hay datos de equipo que cargar en este caso
    }

    fetchNonSuperUsers();
  }, [aiTeamId, aiTeamName]);

  useEffect(() => {
    if (isTeamDataLoaded && isUsersDataLoaded) {
      setLoaded(true);
    }
  }, [isTeamDataLoaded, isUsersDataLoaded]);

  return (
    <Container maxWidth="xl" sx={{ py: 2, px: { xs: 1, sm: 2, md: 3 } }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box component={"form"} onSubmit={formSubmit} width={"100%"}>
          {!loaded ? (
            <PageCircularProgress />
          ) : (
            <>
              <Typography variant="h4" gutterBottom>
                {aiTeamId ? t.editTitle : t.createTitle}
              </Typography>
              <Box marginTop={"20px"}>
                <TextInput
                  name="name"
                  label={t.teamName}
                  value={values.name}
                  helperText={inputError.name}
                  onChange={handleChange}
                />
              </Box>
              <Box marginTop={"20px"}>
                <TextInput
                  name="address"
                  label={t.address}
                  value={values.address}
                  helperText={inputError.address}
                  onChange={handleChange}
                />
              </Box>
              <Box marginTop={"30px"} >
                <MultilineInput
                  name="description"
                  label={t.description}
                  value={values.description}
                  rows={6}
                  helperText={inputError.description}
                  onChange={handleChange}
                />
              </Box>
              <Box marginTop={"20px"}>
                <FormControl fullWidth>
                  <InputLabel id="user-select-label">{t.selectUser}</InputLabel>
                  <Select
                    labelId="user-select-label"
                    id="user-select"
                    value={values.selectedUser || ''}
                    label={t.selectUser}
                    onChange={handleChange}
                    name="selectedUser"
                  >
                    {nonSuperUsers && nonSuperUsers.length > 0 ? (
                      nonSuperUsers.map((user) => (
                        <MenuItem key={user.email} value={user.email}>
                          {user.username} - {user.email}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>{t.noUsersAvailable}</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Box>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  marginTop: "20px",
                }}
              >
                {aiTeamId ? t.edit : t.register}
              </Button>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default AiTeamsForm;
