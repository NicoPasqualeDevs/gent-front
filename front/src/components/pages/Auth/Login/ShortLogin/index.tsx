import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import { AuthLoginData } from "@/types/Auth";
import useAuth from "@/hooks/useAuth";
import { useAppContext } from "@/context/app";
import { StyledLoginText } from "@/components/styledComponents/Typography";
import { StyledShortLoginButton } from "@/components/styledComponents/Buttons";
import { ShortInput } from "./Inputs";
import theme from "@/styles/theme";

const authLoginDataTemplate: AuthLoginData = {
  email: "",
  code: "",
};

const ShortLogin: React.FC = () => {
  const { setAuthUser } = useAppContext();
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const emptyAuthLoginDataTemplate: AuthLoginData = {
    email: "",
    code: "",
  };

  const handleLoginSubmit = async () => {
    await loginUser(emptyAuthLoginDataTemplate)
      .then((r) => {
        if (r) {
          setAuthUser(r);
          sessionStorage.setItem("user_token", r.token);
          sessionStorage.setItem("user_email", r.email);
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Grid container justifyContent={"center"}>
      <Grid
        container 
        item
        xs = {10}
        sm = {8}
        gap={2}
        marginBottom={{ xs: "90px", sm: "30px" }}
        sx={{
          backgroundColor: theme.palette.primary.light,
          borderRadius: "100px",
          zIndex: "1",
        }}
      >
        <Grid item xs={12}>
          <StyledLoginText>
            Ingrese su email y su código de verificación
          </StyledLoginText>
        </Grid>
        <Grid item xs={12} md={6}>
          <ShortInput
            emptyAuthLoginDataTemplate={emptyAuthLoginDataTemplate}
            authLoginData={authLoginDataTemplate}
            propKey="email"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <ShortInput
            emptyAuthLoginDataTemplate={emptyAuthLoginDataTemplate}
            authLoginData={authLoginDataTemplate}
            propKey="code"
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <StyledShortLoginButton onClick={handleLoginSubmit}>
            Log In
          </StyledShortLoginButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ShortLogin;
