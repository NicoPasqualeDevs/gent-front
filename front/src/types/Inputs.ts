import { BaseSyntheticEvent } from "react";

export interface InputProps {
  name: string;
  label: string;
  onChange: (event: BaseSyntheticEvent) => void;
}

export interface TextInputProps extends InputProps {
  helperText?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
}

export interface MultilineInputProps extends TextInputProps {
  rows?: number;
  maxRows?: number;
  value?: string;
}

export interface PasswordInputProps extends TextInputProps {
  adornmentPosition?: "start" | "end";
}

export interface ImageInputProps {
  name: string;
  label: string;
  onChange: (event: { target: { name: string; value: string } }) => void;
  value?: boolean;
}

export interface FileInputProps {
  name: string;
  label: string;
  onChange: (event: { target: { name: string; value: File } }) => void;
  value?: string | File;
  helperText?: string | File;
}

export interface CheckboxInputProps extends InputProps {
  value?: boolean;
}
