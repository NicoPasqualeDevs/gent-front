import React, { BaseSyntheticEvent, useState } from "react";
import { StyledTextField } from "@/utils/StyledInputUtils";
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
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.main,
      "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
      },
    }}
    id={`${propKey}-clientForm-Short`}
    label={`${getInputNameUtil(propKey)
      .charAt(0)
      .toUpperCase()}${getInputNameUtil(propKey).slice(1)}`}
    InputProps={{
      style: { color: theme.palette.primary.main, fontSize: "16px" },
    }}
    InputLabelProps={{
      style: {
        color: theme.palette.primary.main,
        fontSize: "16px",
      },
    }}
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
    label={`${getInputNameUtil(propKey)
      .charAt(0)
      .toUpperCase()}${getInputNameUtil(propKey).slice(1)}`}
    InputProps={{
      style: { color: theme.palette.primary.main, fontSize: "16px" },
    }}
    InputLabelProps={{
      style: {
        color: theme.palette.primary.main,
        fontSize: "16px",
      },
    }}
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
