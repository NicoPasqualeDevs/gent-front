import React, { BaseSyntheticEvent, useState } from "react";
import { StyledTextField } from "@/utils/StyledInputUtils";
import { Ktag } from "@/types/Bots";
import theme from "@/styles/theme";

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
    label={`${propKey.charAt(0).toUpperCase()}${propKey.slice(1)}`}
    InputProps={{
      style: {
        color: theme.palette.secondary.dark,
        fontSize: "16px",
        backgroundColor: "white",
      },
    }}
    InputLabelProps={{
      style: {
        color: theme.palette.primary.main,
        fontSize: "16px",
      },
    }}
    multiline
    rows={6}
    name={propKey}
    placeholder={`Ingrese ${propKey}...`}
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
    sx={{ width: "100%" }}
    color="secondary"
    id={`${propKey}-short-id`}
    label={`${propKey.charAt(0).toUpperCase()}${propKey.slice(1)}`}
    InputProps={{
      style: {
        color: theme.palette.secondary.dark,
        fontSize: "16px",
        backgroundColor: "white",
      },
    }}
    InputLabelProps={{
      style: {
        color: theme.palette.primary.main,
        fontSize: "16px",
      },
    }}
    name={propKey}
    placeholder={`Ingrese ${propKey}...`}
    onChange={onChange}
    value={value || ""}
  />
);

type ShortInputProp = {
  propKey: string;
  emptyData: Ktag;
  data: Ktag;
};

export const ShortInput: React.FC<ShortInputProp> = ({
  propKey,
  emptyData,
  data,
}) => {
  const [value, setValue] = useState(data[propKey]);
  return (
    <ShortInputField
      value={value || ""}
      propKey={propKey}
      onChange={(event: BaseSyntheticEvent) => {
        setValue(event.target.value);
        emptyData[propKey] = event.target.value;
      }}
    />
  );
};
