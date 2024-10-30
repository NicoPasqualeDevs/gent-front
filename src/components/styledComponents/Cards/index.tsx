import { Card, CardContent, CardActions, Divider, styled } from "@mui/material";

export const BasicCard = styled(Card)(({ theme }) => ({
  alignItems: "start",
  justifyContent: "start",
  background: theme.palette.divider,
  border: `1px solid ${theme.palette.primary.main}`,
  marginBottom: "24px",
}));

export const BasicCardContent = styled(CardContent)(() => ({
  alignItems: "start",
  justifyContent: "start",
}));

export const BasicCardAction = styled(CardActions)(() => ({
  alignItems: "start",
  justifyContent: "start",
  padding: "16px",
}));

export const BasicCardDivider = () => {
  return (
    <Divider
      sx={{
        backgroundColor: "white",
        width: "95%",
        margin: "0 auto",
      }}
    />
  );
};
