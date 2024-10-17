import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextInput } from "../Inputs";
import { useState } from "react";
import { ActionAllowerProps, ConfirmData } from "@/types/ActionAllower";
import { ActionAllowerContainer } from "@/utils/ContainerUtil";
import { useAppContext } from "@/context/app";
import { languages } from "@/utils/Traslations/languages";

/* 
  ActionAllower
  es un componente creado para proteger acciones con confirmaciones lucidas por
  parte del usuario.
  Para su funcionamiento se necesita que el componente padre maneje el estado
  de si está activo o no, por convencion llamaremos a esa variable de estado
  "allowerState", donde true significa que el componente ActionAllower será 
  visible, y false que significa que no lo será.
  Parámetros:
  - allowerStateCleaner: es la funcion setState para la variable de estado,
   "allowerState", que maneja el componente padre. Para que ActionAllower pueda
   limpiar su propio estado y cerrarse al confirmarse satisfactoriamente la acción
   o cancelar la acción.
   - actionToDo: es una función la cual será protegida por el ActionAllower, si
   se confirma la acción, se ejecutará esta función.
   - actionParams: son los argumentos necesarios para que la función "actionToDo"
   funcione correctamente.
  - alertText(opcional): es el texto de encabezado que alerta al usuario sobre
  la confirmación. El valor por defecto es "Confirme la Acción".
  - confirmWord(opcional): es la palabra clave necesario para confirmar la acción que debe 
  ser introducida en el input del ActionAllower. Su valor por defecto es "confirmar".   
*/

const ActionAllower = <T, U>(props: ActionAllowerProps<T, U>) => {
  const {
    allowerStateCleaner,
    actionToDo,
    actionParams,
    alertText,
    confirmWord,
  } = props;
  const [inputError, setInputError] = useState<ConfirmData>({ confirm: "" });
  const initialValues: ConfirmData = { confirm: "" };
  const { language } = useAppContext();
  const t = languages[language as keyof typeof languages];

  const validationSchema = Yup.object({
    confirm: Yup.string().required(t.actionAllower.fieldRequired),
  });

  const onSubmit = () => {
    actionToDo(actionParams);
  };

  const { handleSubmit, handleChange, errors, values } = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setInputError({ confirm: errors.confirm || " " });
    handleSubmit(e);
  };

  const formCancel = () => {
    allowerStateCleaner(false);
  };

  return (
    <ActionAllowerContainer>
      <Card
        component={"form"}
        sx={{
          width: "90%",
          maxWidth: "600px",
        }}
        onSubmit={formSubmit}
      >
        <CardContent>
          <Typography
            variant="subtitle1"
            marginBottom={"10px"}
            marginTop={"10px"}
          >
            {alertText || t.actionAllower.confirmAction}
          </Typography>
          <TextInput
            name="confirm"
            label={t.actionAllower.confirmation}
            value={values.confirm}
            helperText={inputError.confirm}
            placeholder={`${t.actionAllower.write} ${confirmWord || t.actionAllower.confirm}`}
            onChange={handleChange}
          />
        </CardContent>
        <CardActions>
          <Grid container marginBottom={"10px"}>
            <Grid item xs={12} sm={6} textAlign={{ xs: "center", sm: "start" }}>
              <Button size="small" type="submit">
                {t.actionAllower.confirm}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} textAlign={{ xs: "center", sm: "end" }}>
              <Button size="small" onClick={formCancel}>
                {t.actionAllower.cancel}
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </ActionAllowerContainer>
  );
};

export default ActionAllower;
