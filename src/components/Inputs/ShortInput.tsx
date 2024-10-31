import theme from "@/styles/theme";
import { CustomGreetingData, NewGreetingData } from "@/types/Bots";
import { StyledTextField } from "@/utils/StyledInputUtils";
import { BaseSyntheticEvent, useState } from "react";
import { Ktag } from "@/types/Bots";
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
    emptyData: CustomGreetingData | NewGreetingData | Ktag;
    data: CustomGreetingData | NewGreetingData | Ktag;
};
  
export const ShortInput: React.FC<ShortInputProp> = ({
    propKey,
    emptyData,
    data,
}) => {
    const [value, setValue] = useState(data[propKey]);
    return (
      <ShortInputField
        value={value}
        propKey={propKey}
        onChange={(event: BaseSyntheticEvent) => {
          setValue(event.target.value);
          emptyData[propKey] = event.target.value;
        }}
      />
    );
};