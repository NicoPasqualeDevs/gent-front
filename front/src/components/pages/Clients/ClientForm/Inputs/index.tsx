import React, { BaseSyntheticEvent, useState } from "react";
import { StyledTextField } from "@/utils/StyledInputUtils";
import { ClientDetails } from "@/types/Clients";
import theme from "@/styles/theme";


const getInputNameUtil = (propKey: string) => {
  switch (propKey) {
    case "name":
      return "nombre";
    case "description":
      return "descripción";
    case "email":
      return "mail";
    case "phone":
      return "teléfono";
    case "address":
      return "dirección";
    default:
      return propKey;
  }
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
      backgroundColor: "white",
    }}
    id={`${propKey}-clientForm-Long`}
    label={`${getInputNameUtil(propKey)
      .charAt(0)
      .toUpperCase()}${getInputNameUtil(propKey).slice(1)}`}
    variant="outlined"
    InputProps={{
      style: { color: theme.palette.secondary.dark, fontSize: "16px" },
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
  emptyClientDetailsTemplate: ClientDetails;
  clientDetails: ClientDetails;
};

export const LongInput: React.FC<LongInputProp> = ({
  propKey,
  emptyClientDetailsTemplate,
  clientDetails,
}) => {
  const [value, setValue] = useState(clientDetails[propKey]);
  return (
    <LongInputField
      value={value}
      propKey={propKey}
      onChange={(event: BaseSyntheticEvent) => {
        setValue(event.target.value);
        emptyClientDetailsTemplate[propKey] = event.target.value;
      }}
    />
  );
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
      backgroundColor: "white",
    }}
    id={`${propKey}-clientForm-Short`}
    variant="outlined"
    label={`${getInputNameUtil(propKey)
      .charAt(0)
      .toUpperCase()}${getInputNameUtil(propKey).slice(1)}`}
    InputProps={{
      style: { color: theme.palette.secondary.dark, fontSize: "16px" },
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
  emptyClientDetailsTemplate: ClientDetails;
  clientDetails: ClientDetails;
};

export const ShortInput: React.FC<ShortInputProp> = ({
  propKey,
  emptyClientDetailsTemplate,
  clientDetails,
}) => {
  const [value, setValue] = useState(clientDetails[propKey]);
  return (
    <ShortInputField
      value={value}
      propKey={propKey}
      onChange={(event: BaseSyntheticEvent) => {
        setValue(event.target.value);
        emptyClientDetailsTemplate[propKey] = event.target.value;
      }}
    />
  );
};
