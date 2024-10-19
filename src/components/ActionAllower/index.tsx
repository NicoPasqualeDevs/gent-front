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
import { languages } from "@/utils/Traslations";

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
