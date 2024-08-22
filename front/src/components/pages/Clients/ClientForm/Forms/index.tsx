import { Box, Grid, styled } from "@mui/material";
import { LongInput, ShortInput } from "../Inputs";
import { StyledDefaultButton } from "@/components/styledComponents/Buttons";
import { StyledPageTitle } from "@/components/styledComponents/Typography";
import { ClientDetails } from "@/types/Clients";

import {
  /*   Phone as PhoneIcon,
  Email as EmailIcon, */
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Notes as NotesIcon,
} from "@mui/icons-material";

const StyledIconBox = styled(Box)(({ theme }) => ({
  justifyContent: "center",
  alignItems: "center",
  color: theme.palette.secondary.dark,
  "&.MuiBox-root": {
    margin: "8px",
    marginBottom: "4px !important",
    paddingTop: "3px",
  },
}));

type ClientDataProps = {
  clientDetailsTemplate: ClientDetails;
  clientDetails: ClientDetails;
  handleClientDetails: () => void;
};

export const ClientDataForm: React.FC<ClientDataProps> = ({
  clientDetailsTemplate,
  clientDetails,
  handleClientDetails,
}) => {
  return (
    <Grid container gap={2} sx={{ padding: "32px", marginBottom: "24px" }}>
      <Grid item xs={12} display={"flex"}>
        <StyledPageTitle sx={{ marginLeft: "37px" }}>
          {clientDetails.email ? "Actualizar datos" : "Registro de cliente"}
        </StyledPageTitle>
      </Grid>
      <Grid item xs={12} display={"flex"}>
        <StyledIconBox>
          <PersonIcon />
        </StyledIconBox>
        <ShortInput
          emptyClientDetailsTemplate={clientDetailsTemplate}
          clientDetails={clientDetails}
          propKey="name"
        />
      </Grid>
      {/*       <Grid container item xs={12} display={"flex"}>
        <Grid item xs={12} md={6} display={"flex"}>
          <StyledIconBox>
            <PhoneIcon />
          </StyledIconBox>
          <ShortInput
            emptyClientDetailsTemplate={clientDetailsTemplate}
            clientDetails={clientDetails}
            propKey="phone"
          />
        </Grid>
        <Grid item xs={12} md={6} display={"flex"} marginTop={{ xs: "15px", md: "0px" }}>
          <StyledIconBox>
            <EmailIcon />
          </StyledIconBox>
          <ShortInput
            emptyClientDetailsTemplate={clientDetailsTemplate}
            clientDetails={clientDetails}
            propKey="email"
          />
        </Grid>
      </Grid> */}
      <Grid item xs={12} display={"flex"}>
        <StyledIconBox>
          <LocationIcon />
        </StyledIconBox>
        <ShortInput
          emptyClientDetailsTemplate={clientDetailsTemplate}
          clientDetails={clientDetails}
          propKey="address"
        />
      </Grid>
      <Grid item xs={12} display={"flex"}>
        <StyledIconBox>
          <NotesIcon />
        </StyledIconBox>
        <LongInput
          emptyClientDetailsTemplate={clientDetailsTemplate}
          clientDetails={clientDetails}
          propKey="description"
        />
      </Grid>
      <Box textAlign={"left"} marginLeft={"38px"}>
        <StyledDefaultButton
          sx={{ fontSize: "16px", maxWidth: "150px" }}
          onClick={handleClientDetails}
        >
          Enviar formulario
        </StyledDefaultButton>
      </Box>
    </Grid>
  );
};
