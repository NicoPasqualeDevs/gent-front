import { StyledLoginText } from "@/components/styledComponents/Typography";
import { Grid, Paper } from "@mui/material";
import { ShortInput } from "./Inputs";
import { StyledLoginButton } from "@/components/styledComponents/Buttons";
import { useAppContext } from "@/context/app";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { AuthLoginData } from "@/types/Auth";
import theme from "@/styles/theme";

// INITIAL STATE TEMPLATES
const authLoginDataTemplate: AuthLoginData = {
  email: "",
  code: "",
};

const LargeLogin: React.FC = () => {
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
    <Grid container justifyContent={"center"} zIndex={1}>
      <Grid
        item
        xs={10}
        sm={8}
        md={6}
        lg={5}
      >
        <Paper
          sx={{
            backgroundColor: theme.palette.secondary.dark,
            borderRadius: "30px",
            padding: "60px 25px"
          }}
        >
          <Grid container gap={1} paddingLeft={"5px"}>
            <Grid item xs={12}>
              <StyledLoginText>
                Ingrese su email y su código de verificación
              </StyledLoginText>
            </Grid>
            <Grid item xs={12} md={5}>
              <ShortInput
                emptyAuthLoginDataTemplate={emptyAuthLoginDataTemplate}
                authLoginData={authLoginDataTemplate}
                propKey="email"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ShortInput
                emptyAuthLoginDataTemplate={emptyAuthLoginDataTemplate}
                authLoginData={authLoginDataTemplate}
                propKey="code"
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <StyledLoginButton onClick={handleLoginSubmit}>
                Log In
              </StyledLoginButton>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LargeLogin;