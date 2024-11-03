import theme from "@/styles/theme";
import { CustomGreetingData, NewGreetingData } from "@/types/Widget";
import { StyledTextField } from "@/utils/StyledInputUtils";
import { useState } from "react";

// Definir un tipo unión para los datos aceptados
type InputData = CustomGreetingData | NewGreetingData;

// Actualizar la interfaz de props
interface ShortInputProps {
  propKey: keyof InputData;
  emptyData: InputData;
  data: InputData;
}

// Definir un tipo específico para el evento de cambio
type ShortInputChangeEvent = React.ChangeEvent<HTMLInputElement>;

export const ShortInput: React.FC<ShortInputProps> = ({
  propKey,
  emptyData,
  data,
}) => {
  const [value, setValue] = useState<string>((data[propKey] as string) || '');

  const handleChange = (event: ShortInputChangeEvent) => {
    const newValue = event.target.value;
    setValue(newValue);
    if (typeof emptyData[propKey] === 'string') {
      (emptyData[propKey] as string) = newValue;
    }
  };

  return (
    <StyledTextField
      sx={{
        width: "100%",
        backgroundColor: "white",
      }}
      id={`${propKey}-clientForm-Short`}
      variant="outlined"
      label={`${propKey.charAt(0).toUpperCase()}${propKey.slice(1)}`}
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
      placeholder={`Ingrese ${propKey}...`}
      onChange={handleChange}
      value={value}
    />
  );
};