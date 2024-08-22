import React, { BaseSyntheticEvent, useState } from "react";
import { StyledTextField } from "@/utils/StyledInputUtils";
import { BotMetaData } from "@/types/Bots";
import { StyledDefaultButton } from "@/components/styledComponents/Buttons";
import useBotsApi from "@/hooks/useBots";
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
  emptyData: BotMetaData;
  data: BotMetaData;
};

export const LongInput: React.FC<LongInputProp> = ({
  propKey,
  emptyData,
  data,
}) => {
  const [value, setValue] = useState(data[propKey]);
  return (
    <LongInputField
      value={value?.toString() || ""}
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
  emptyData: BotMetaData;
  data: BotMetaData;
};

export const ShortInput: React.FC<ShortInputProp> = ({
  propKey,
  emptyData,
  data,
}) => {
  const [value, setValue] = useState(data[propKey]);
  return (
    <ShortInputField
      value={value?.toString() || ""}
      propKey={propKey}
      onChange={(event: BaseSyntheticEvent) => {
        setValue(event.target.value);
        emptyData[propKey] = event.target.value;
      }}
    />
  );
};

// Static Input

interface StaticInputFieldProps {
  value: string;
  onChange: (event: BaseSyntheticEvent) => void;
}

const StaticInputField: React.FC<StaticInputFieldProps> = ({
  value,
  onChange,
}) => (
  <StyledTextField
    sx={{
      width: "100%",
    }}
    size="medium"
    color="secondary"
    id={`static-text-short-id`}
    label="Static Prompt Template"
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
    name={"static"}
    onChange={onChange}
    value={value || ""}
  />
);

type StaticInputProp = {
  data: string;
  botId: string | undefined;
};

export const StaticInput: React.FC<StaticInputProp> = ({ data, botId }) => {
  const [value, setValue] = useState(data);
  const { changePromptTemplateValue } = useBotsApi();
  const handleSavePromptTemplate = () => {
    console.log(value);
    if (botId) changePromptTemplateValue(botId, value);
  };
  return (
    <>
      <StaticInputField
        value={value || ""}
        onChange={(event: BaseSyntheticEvent) => {
          setValue(event.target.value);
        }}
      />
      <StyledDefaultButton
        onClick={() => handleSavePromptTemplate()}
        sx={{ width: "200px" }}
      >
        Guardar Prompt Template
      </StyledDefaultButton>
    </>
  );
};
