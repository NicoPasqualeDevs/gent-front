import React, { BaseSyntheticEvent, useState } from "react";
import { TextField, styled, Typography } from "@mui/material";
import theme from "@/styles/theme";
import { AuthLoginData } from "@/types/Auth";

const getInputNameUtil = (propKey: string) => {
  switch (propKey) {
    case "email":
      return "email";
    case "code":
      return "code";
    default:
      return propKey;
  }
};

const StyledLabel = styled(Typography)(() => ({
  "&.MuiTypography-root": {
    fontSize: "13px",
    margin: "0 auto",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& label.Mui-focused": {
    color: "red",
    
  },
  "& label.Mui": {
    color: "red",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "red",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white",
      borderRadius: "10px"
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "& .MuiInputBase-input": {
      color: "white",
    },
  },
}));

// SHORT INPUT

interface ShortInputFieldProps {
  value: string;
  propKey: string;
  onChange: (event: BaseSyntheticEvent) => void;
}

const ShortInputField: React.FC<ShortInputFieldProps> = ({
  value,
  propKey,
  onChange,
}) => (
  <StyledTextField
    sx={{
      width: "100%",
      backgroundColor: theme.palette.secondary.dark,
      color: "white"
    }}
    id={`${propKey}-clientForm-Short`}
    label={
      <StyledLabel>{`${getInputNameUtil(propKey)
        .charAt(0)
        .toUpperCase()}${getInputNameUtil(propKey).slice(1)}`}</StyledLabel>
    }
    inputProps={{ style: { fontSize: 14 } }}
    InputLabelProps={{ style: { color: theme.palette.primary.main } }}
    name={propKey}
    placeholder={`Ingrese ${getInputNameUtil(propKey)}...`}
    onChange={onChange}
    value={value || ""}
  />
);

type ShortInputProp = {
  propKey: string;
  emptyAuthLoginDataTemplate: AuthLoginData;
  authLoginData: AuthLoginData;
};

export const ShortInput: React.FC<ShortInputProp> = ({
  propKey,
  emptyAuthLoginDataTemplate,
  authLoginData,
}) => {
  const [value, setValue] = useState(authLoginData[propKey]);
  return (
    <ShortInputField
      value={value}
      propKey={propKey}
      onChange={(event: BaseSyntheticEvent) => {
        setValue(event.target.value);
        emptyAuthLoginDataTemplate[propKey] = event.target.value;
      }}
    />
  );
};

// LONG INPUT

interface LongInputFieldProps {
  value: string;
  propKey: string;
  onChange: (event: BaseSyntheticEvent) => void;
}

const LongInputField: React.FC<LongInputFieldProps> = ({
  value,
  propKey,
  onChange,
}) => (
  <StyledTextField
    sx={{
      width: "100%",
    }}
    id={`${propKey}-clientForm-Long`}
    label={
      <StyledLabel>{`${getInputNameUtil(propKey)
        .charAt(0)
        .toUpperCase()}${getInputNameUtil(propKey).slice(1)}`}</StyledLabel>
    }
    inputProps={{ style: { fontSize: 14 } }}
    InputLabelProps={{ style: { color: "red" } }}
    name={propKey}
    multiline
    rows={6}
    placeholder={`Ingrese ${getInputNameUtil(propKey)}...`}
    onChange={onChange}
    value={value || ""}
  />
);

type LongInputProp = {
  propKey: string;
  emptyAuthLoginDataTemplate: AuthLoginData;
  authLoginData: AuthLoginData;
};

export const LongInput: React.FC<LongInputProp> = ({
  propKey,
  emptyAuthLoginDataTemplate,
  authLoginData,
}) => {
  const [value, setValue] = useState(authLoginData[propKey]);
  return (
    <LongInputField
      value={value}
      propKey={propKey}
      onChange={(event: BaseSyntheticEvent) => {
        setValue(event.target.value);
        emptyAuthLoginDataTemplate[propKey] = event.target.value;
      }}
    />
  );
};