import { Box } from "@mui/material";
import { LoginComponentContainer } from "@/utils/ContainerUtil";
import LargeLogin from "./LargeLogin";
import CircleDecorator from "@/components/svgs/Circle";
import theme from "@/styles/theme";

const Login = () => {
  return (
    <LoginComponentContainer sx={{ backgroundColor: "white" }}>
      <Box
        sx={{
          position: "fixed",
          top: '450px', //60
          left: '-400px', //-25
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
          width: "800px",
          height: "800px",
          zIndex: 0,
        }}
      >
        <CircleDecorator 
        radius={400} 
        outerColor={theme.palette.primary.main}
        centerX={400}
        centerY={400} />
      </Box>
      <Box
        sx={{
          position: "fixed",
          top: '-650px',
          right: '-500px',
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
          width: "800px",
          height: "800px",
          zIndex: 0,
        }}
      >
        <CircleDecorator 
        radius={400} 
        outerColor={theme.palette.primary.main}
        centerX={400}
        centerY={400} />
      </Box>
     
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LargeLogin/>
      </Box>      
    </LoginComponentContainer>
  );
};

export default Login;