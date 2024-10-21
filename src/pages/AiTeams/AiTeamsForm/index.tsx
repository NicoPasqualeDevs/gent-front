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
    owner_data: undefined,
  });

  const [inputError, setInputError] = useState<AiTeamsDetails>({
    name: "",
    address: "",
    description: "",
  });

  // Modifica la definición del tipo NonSuperUser
  type NonSuperUser = { id: number; username: string; email: string; first_name: string; last_name: string };

  const [nonSuperUsers, setNonSuperUsers] = useState<NonSuperUser[]>([]);

  const validationSchema = Yup.object({
    name: Yup.string().required(t.fieldRequired),
    address: Yup.string().required(t.fieldRequired),
    description: Yup.string().required(t.fieldRequired),
  });

  const onSubmit = (values: AiTeamsDetails) => {
    let submissionValues = { ...values };
    if (auth?.user?.is_superuser && submissionValues.owner_data?.name === "") {
      submissionValues.owner_data.name = "Admin";
    }
    if (aiTeamId) {
      updateClient(submissionValues, aiTeamId);
    } else {
      createNewClient(submissionValues);
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
          owner_data: response.owner_data,
        });
        setInitialValues({
          name: response.name,
          address: response.address,
          description: response.description,
          owner_data: response.owner_data,
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
    }
  }

  const fetchNonSuperUsers = useCallback(() => {
    listNonSuperUsers()
      .then((response) => {
        setNonSuperUsers(prevUsers => {
          const newUsers = response.data.map(user => ({
            ...user,
            id: Number(user.id)
          }));
          
          // Asegurarse de que el usuario actual esté incluido
          let updatedUsers = [...newUsers];
          if (auth?.user) {
            const currentUser : NonSuperUser = {
              id: Number(auth.user.uuid),
              username: auth.user.first_name,
              email: auth.user.email,
              first_name: auth.user.first_name,
              last_name: auth.user.last_name || '' // Usa un string vacío si last_name no está disponible
            };
            updatedUsers = [currentUser, ...updatedUsers];
            
          }
          
          // Filtrar para evitar duplicados con usuarios previamente cargados
          const uniqueUsers = updatedUsers.filter(newUser => 
            !prevUsers.some(prevUser => prevUser.id === newUser.id)
          );
          
          return [...prevUsers, ...uniqueUsers];
        });
        setIsUsersDataLoaded(true);
      })
      .catch((error) => {
        console.error("Error al obtener usuarios no superusuarios:", error);
        // En caso de error, asegurarse de que al menos el usuario actual esté incluido
        if (auth?.user) {
          setNonSuperUsers(prevUsers => {
            const currentUser: NonSuperUser = {
              id: Number(auth.user?.uuid || ''),
              username: auth.user?.first_name || "",
              email: auth?.user?.email || "",
              first_name: auth.user?.first_name || "",
              last_name: auth.user?.last_name || '' // Usa un string vacío si last_name no está disponible
            };
            const currentUserExists = prevUsers.some(user => user.id === currentUser.id);
            if (!currentUserExists) {
              return [currentUser, ...prevUsers];
            }
            return prevUsers;
          });
        }
        setIsUsersDataLoaded(true);
      });
  }, [listNonSuperUsers, auth?.user]);

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
      setIsTeamDataLoaded(true);
    }
    if (auth.user) {
      auth.user.is_superuser ? fetchNonSuperUsers() : setIsUsersDataLoaded(true);
    } else {
      setIsUsersDataLoaded(true);
    }
  }, [aiTeamId, aiTeamName]);

  useEffect(() => {
    if (isTeamDataLoaded && isUsersDataLoaded) {
      setLoaded(true);
      if (auth?.user) {
        const currentUser: NonSuperUser = {
          id: Number(auth.user.uuid),
          username: auth.user.first_name,
          email: auth.user.email,
          first_name: auth.user.first_name,
          last_name: auth.user.last_name || ''
        };
        
        setNonSuperUsers(prevUsers => {
          if (!auth.user?.is_superuser) {
            return [currentUser];
          }
          const userExists = prevUsers.some(user => user.id === currentUser.id);
          if (!userExists) {
            console.log("Agregando usuario actual:", currentUser);
            return [currentUser, ...prevUsers];
          }
          return prevUsers;
        });

        if (!values.owner_data) {
          setValues(prevValues => ({
            ...prevValues,
            owner_data: {
              id: currentUser.id.toString(),
              name: auth?.user?.is_superuser ? "Admin" : currentUser.username,
              email: currentUser.email
            }
          }));
        }
      }
    }
  }, [isTeamDataLoaded, isUsersDataLoaded, auth?.user, values.owner_data, setValues]);

  // Efecto para actualizar el estado de carga
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
              {auth?.user?.is_superuser && (
                <Box marginTop={"20px"}>
                  <FormControl fullWidth>
                    <InputLabel id="user-select-label">{t.selectUser}</InputLabel>
                    <Select
                      labelId="user-select-label"
                      id="user-select"
                      value={values.owner_data?.id || ''}
                      label={t.selectUser}
                      onChange={(e) => {
                        const selectedUser = nonSuperUsers.find(user => user.id.toString() === e.target.value);
                        if (selectedUser) {
                          setValues(prevValues => ({
                            ...prevValues,
                            owner_data: {
                              id: selectedUser.id.toString(),
                              name: selectedUser.username, // Cambiado a username
                              email: selectedUser.email
                            }
                          }));
                        }
                      }}
                      name="owner_data.id"
                    >
                      {nonSuperUsers.map((user) => (
                        <MenuItem key={user.id} value={user.id.toString()}>
                          {user.username} - {user.email}
                          {user.id === Number(auth?.user?.uuid) && ` (${t.currentUser})`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}
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
