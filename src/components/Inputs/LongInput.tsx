import React, { BaseSyntheticEvent, useState } from "react";
import { StyledTextField } from "@/utils/StyledInputUtils";
import { Ktag } from "@/types/ContextEntry";
import theme from "@/styles/theme";

const getInputNameUtil = (propKey: string) => {
  switch (propKey) {
    case "name":
      return "Palabras claves";
    case "value":
      return "Conocimiento relacionado";
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
    }}
    size="medium"
    color="secondary"
    id={`${propKey}-short-id`}
    label={`${getInputNameUtil(propKey)}`}
    InputProps={{
      style: {
        color: theme.palette.primary.main,
        fontSize: "16px",
        backgroundColor: "transparent",
      },
    }}
    InputLabelProps={{
      style: {
        color: theme.palette.primary.main,
        fontSize: "16px",
      },
    }}
    multiline
    rows={12}
    name={getInputNameUtil(propKey)}
    placeholder={`Ingrese ${getInputNameUtil(propKey)}...`}
    onChange={onChange}
    value={value || ""}
  />
);

type LongInputProp = {
  propKey: string;
  emptyData: Ktag;
  data: Ktag;
};

export const LongInput: React.FC<LongInputProp> = ({
  propKey,
  emptyData,
  data,
}) => {
  const [value, setValue] = useState(data[propKey]);
  return (
    <LongInputField
      value={value || ""}
      propKey={propKey}
      onChange={(event: BaseSyntheticEvent) => {
        setValue(event.target.value);
        emptyData[propKey] = event.target.value;
      }}
    />
  );
};
