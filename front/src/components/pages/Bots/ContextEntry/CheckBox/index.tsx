import React, { useState, BaseSyntheticEvent } from "react";
import {
  Grid,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from "@mui/material";

interface PromptSetProps {
  main: boolean;
  handler: () => void;
}

const PromptSetCheckBox: React.FC<PromptSetProps> = ({ main, handler }) => {
  const [mainValue, setMainValue] = useState<boolean>(main);

  const handleChange = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setMainValue(!mainValue);
    handler();
  };

  return (
    <Grid>
      <FormControl sx={{ mt: 1, mb: 1 }} component="fieldset">
        <FormLabel component="legend">Prompt Template</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={mainValue}
                onClick={handleChange}
                name="mainValue"
              />
            }
            label="Activar / Desactivar"
          />
        </FormGroup>
        <FormHelperText>
          Habilite o deshabilite el prompt template estatico
        </FormHelperText>
      </FormControl>
    </Grid>
  );
};

export default PromptSetCheckBox;
