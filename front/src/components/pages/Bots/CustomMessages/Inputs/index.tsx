import theme from "@/styles/theme";
import { CustomGreetingData, NewGreetingData } from "@/types/Bots";
import { StyledTextField } from "@/utils/StyledInputUtils";
import { BaseSyntheticEvent, useState } from "react";

const getInputNameUtil = (propKey: string) => {
    switch (propKey) {
      case "text":
        return "Custom Greeting";
      default:
        return propKey;
    }
  };
  
// SHORT INPUT
interface ShortInputFieldProps {
    value: string | undefined;
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
    emptyTemplate: CustomGreetingData | NewGreetingData;
    baseDetails: CustomGreetingData | NewGreetingData;
};
  
export const ShortInput: React.FC<ShortInputProp> = ({
    propKey,
    emptyTemplate,
    baseDetails,
}) => {
    const [value, setValue] = useState(baseDetails[propKey]);
    return (
      <ShortInputField
        value={value}
        propKey={propKey}
        onChange={(event: BaseSyntheticEvent) => {
          setValue(event.target.value);
          emptyTemplate[propKey] = event.target.value;
        }}
      />
    );
};
