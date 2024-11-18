import { useFormik } from "formik";
import * as Yup from "yup";
import { AuthRegisterData } from "@/types/Auth";
import useAuth from "@/hooks/useAuth";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import { useNavigate } from "react-router-dom";
import { 
  FormLayout, 
  FormHeader, 
  FormContent, 
  FormInputGroup,
  FormButton,
  FormActions,
  FormCancelButton,
  FormTextField
} from "@/utils/FormsViewUtils";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/context";
import { authNavigationUtils } from '@/utils/NavigationUtils';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { replacePath } = useAppContext();

  const initialValues: AuthRegisterData = {
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirm_password: "",
    is_superuser: false,
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Correo electrónico no válido")
      .required("El correo electrónico es requerido"),
    first_name: Yup.string()
      .required("El nombre es requerido")
      .min(2, "El nombre debe tener al menos 2 caracteres"),
    last_name: Yup.string()
      .required("El apellido es requerido")
      .min(2, "El apellido debe tener al menos 2 caracteres"),
    password: Yup.string()
      .required("La contraseña es requerida")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .matches(/[a-zA-Z]/, "La contraseña debe contener al menos una letra")
      .matches(/[0-9]/, "La contraseña debe contener al menos un número"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password'), undefined], "Las contraseñas deben coincidir")
      .required("Confirmar la contraseña es requerido"),
  });

  const onSubmit = async (values: AuthRegisterData) => {
    setIsLoading(true);
    try {
      const response = await registerUser(values);
      SuccessToast(response.message);
      authNavigationUtils.postRegisterRedirect(navigate);
    } catch (err) {
      if (err instanceof Error) {
        ErrorToast(err.message || "Error en el registro");
      } else {
        ErrorToast("Error en el registro");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { handleSubmit, handleChange, values, touched, errors } = formik;

  useEffect(() => {
    const timer = setTimeout(() => {
      replacePath([
        {
          label: t('registerUser'),
          current_path: "/auth/register",
          preview_path: "",
          translationKey: "registerUser"
        }
      ]);
    }, 0);

    return () => clearTimeout(timer);
  }, [replacePath, t]);

  return (
    <FormLayout>
      <FormHeader title="Registro de Usuario" />
      
      <FormContent 
        onSubmit={handleSubmit}
        isLoading={isLoading}
        skeletonFields={[
          { type: 'text' },    // email
          { type: 'text' },    // first_name
          { type: 'text' },    // last_name
          { type: 'text' },    // password
          { type: 'text' }     // confirm_password
        ]}
      >
        <FormInputGroup>
          <FormTextField
            name="email"
            label="Correo electrónico"
            value={values.email}
            onChange={handleChange}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email ? errors.email : undefined}
          />
        </FormInputGroup>

        <FormInputGroup>
          <FormTextField
            name="first_name"
            label="Nombre"
            value={values.first_name}
            onChange={handleChange}
            error={touched.first_name && Boolean(errors.first_name)}
            helperText={touched.first_name && errors.first_name ? errors.first_name : undefined}
          />
        </FormInputGroup>

        <FormInputGroup>
          <FormTextField
            name="last_name"
            label="Apellido"
            value={values.last_name}
            onChange={handleChange}
            error={touched.last_name && Boolean(errors.last_name)}
            helperText={touched.last_name && errors.last_name ? errors.last_name : undefined}
          />
        </FormInputGroup>

        <FormInputGroup>
          <FormTextField
            name="password"
            label="Contraseña"
            value={values.password}
            onChange={handleChange}
            error={touched.password && Boolean(errors.password)}
            helperText={touched.password && errors.password ? errors.password : undefined}
            type="password"
          />
        </FormInputGroup>

        <FormInputGroup>
          <FormTextField
            name="confirm_password"
            label="Confirmar contraseña"
            value={values.confirm_password}
            onChange={handleChange}
            error={touched.confirm_password && Boolean(errors.confirm_password)}
            helperText={touched.confirm_password && errors.confirm_password ? errors.confirm_password : undefined}
            type="password"
          />
        </FormInputGroup>

        <FormActions>
          <FormCancelButton
            onClick={() => navigate('/auth/login')}
          >
            Cancelar
          </FormCancelButton>
          <FormButton
            type="submit"
            variant="contained"
          >
            Registrarse
          </FormButton>
        </FormActions>
      </FormContent>
    </FormLayout>
  );
};

export default Register;
