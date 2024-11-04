import React from 'react';
import { Box, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const ColorPickerWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: '100%'
});

const ColorPicker = styled('input')({
  width: '32px',
  height: '32px',
  padding: '0',
  border: '1px solid #ccc',
  borderRadius: '4px',
  cursor: 'pointer',
  '&::-webkit-color-swatch-wrapper': {
    padding: 0,
  },
  '&::-webkit-color-swatch': {
    border: 'none',
    borderRadius: '3px',
  }
});

interface ColorInputEvent {
  target: {
    name: string;
    value: string;
  }
}

interface ColorInputProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement> | ColorInputEvent) => void;
  onChangeComplete?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ColorInput: React.FC<ColorInputProps> = ({
  name,
  label,
  value,
  onChange
}) => {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const event = {
      target: {
        name,
        value: e.target.value
      }
    };
    onChange(event);
  };

  return (
    <ColorPickerWrapper>
      <TextField
        fullWidth
        name={name}
        label={label}
        value={value}
        onChange={onChange}
        size="small"
        margin="none"
      />
      <ColorPicker
        type="color"
        value={value}
        onChange={handleColorChange}
      />
    </ColorPickerWrapper>
  );
}; 