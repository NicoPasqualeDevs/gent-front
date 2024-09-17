import theme from "@/styles/theme";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Input,
  InputAdornment,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { ErrorToast } from "../Toast";
import {
  CheckboxInputProps,
  FileInputProps,
  ImageInputProps,
  MultilineInputProps,
  PasswordInputProps,
  TextInputProps,
} from "@/types/Inputs";

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& label": {
    color: theme.palette.primary.main,
    fontSize: "100%",
    paddingRight: "1%",
    backgroundColor: "transparent",
  },
  "& label.Mui-focused": {
    color: theme.palette.primary.main,
    fontSize: "100%",
  },
  "& label.Mui-error": {
    color: theme.palette.error.main,
  },
  "& .MuiInputBase-root": {
    color: "white",
    padding: "0% 0%",
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.MuiInput-placeholder": {
      color: "white",
    },
  },
  "& .MuiFormHelperText-root": {
    color: theme.palette.error.main,
  },
}));

const StyledMultilineTextField = styled(TextField)(({ theme }) => ({
  "& label": {
    color: theme.palette.primary.main,
    fontSize: "100%",
    paddingRight: "1%",
    backgroundColor: "#0c0c22",
  },
  "& label.Mui-focused": {
    color: theme.palette.primary.main,
    fontSize: "100%",
  },
  "& label.Mui-error": {
    color: theme.palette.error.main,
  },
  "& .MuiInputBase-root": {
    color: "white",
    padding: "1% 1%",
    overflow: "hidden",
    scrollBehavior: "smooth",
    scrollbarGutter: "none",
    scrollbarWidth: "thin",
    scrollbarColor: `${theme.palette.primary.main} transparent`,
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.MuiInput-placeholder": {
      color: "white",
    },
  },
  "& .MuiFormHelperText-root": {
    color: theme.palette.error.main,
  },
}));

const StyledPasswordField = styled(TextField)(({ theme }) => ({
  "& label": {
    color: theme.palette.primary.main,
    fontSize: "100%",
    paddingRight: "2%",
  },
  "& label.Mui-focused": {
    color: theme.palette.primary.main,
    fontSize: "100%",
  },
  "& label.Mui-error": {
    color: theme.palette.error.main,
  },
  "& .MuiInputBase-root": {
    color: "white",
    padding: "0% 0%",
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.MuiInput-placeholder": {
      color: "white",
    },
    "& .MuiInputAdornment-root": {
      margin: "0px 1%",
      height: "100%",
    },
  },
  "& .MuiFormHelperText-root": {
    color: theme.palette.error.main,
  },
}));

const StyledPasswordIconButton = styled(Button)(({ theme }) => ({
  color: "white",
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export const TextInput: React.FC<TextInputProps> = ({
  name,
  label,
  helperText,
  placeholder,
  value,
  onChange,
  disabled,
  error,
}) => {
  return (
    <StyledTextField
      onChange={onChange}
      name={name}
      label={label}
      helperText={helperText ? helperText : " "}
      placeholder={placeholder ? placeholder : ""}
      fullWidth
      value={value || ""}
      disabled={disabled || false}
      error={error || false}
    />
  );
};

export const MultilineInput: React.FC<MultilineInputProps> = ({
  name,
  label,
  helperText,
  placeholder,
  value,
  rows,
  maxRows,
  onChange,
}) => {
  return (
    <StyledMultilineTextField
      onChange={onChange}
      name={name}
      label={label}
      helperText={helperText ? helperText : " "}
      placeholder={placeholder ? placeholder : " "}
      fullWidth
      multiline
      rows={rows ? rows : 6}
      maxRows={maxRows ? maxRows : undefined}
      value={value || ""}
      autoComplete="off"
    />
  );
};

export const PasswordInput: React.FC<PasswordInputProps> = ({
  name,
  label,
  helperText,
  onChange,
  adornmentPosition,
  error,
}) => {
  const [visibility, setVisibility] = useState<boolean>(false);
  return (
    <StyledPasswordField
      name={name}
      onChange={onChange}
      label={label}
      helperText={helperText ? helperText : " "}
      fullWidth
      type={visibility ? "text" : "password"}
      error={error || false}
      InputProps={{
        endAdornment: (
          <InputAdornment
            position={adornmentPosition ? adornmentPosition : "end"}
          >
            <StyledPasswordIconButton
              onClick={() => setVisibility(!visibility)}
            >
              {visibility ? <VisibilityOff /> : <Visibility />}
            </StyledPasswordIconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export const ImageInput: React.FC<ImageInputProps> = ({
  name,
  label,
  onChange,
  value,
}) => {
  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/tiff",
    ];
    const files = (e.target as HTMLInputElement).files;
    if (files && files?.length > 0) {
      if (allowedImageTypes.includes(files[0].type)) {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            onChange({
              target: {
                name,
                value: reader.result
                  .toString()
                  .replace("data", "")
                  .replace(/^.+,/, ""),
              },
            });
          }
        };
        reader.readAsDataURL(files[0]);
      } else {
        ErrorToast("El archivo es de un formato no compatible!");
      }
    } else {
      ErrorToast("Hubo problemas al cargar el archivo");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        padding: "2.2%",
        backgroundColor: "#0C0C22",
        borderRadius: "5px",
        border: "1px solid #DDDDDD",
        "&:hover": {
          borderColor: theme.palette.primary.main,
        },
      }}
    >
      <Box textAlign={"left"} width={"50%"}>
        <Typography
          sx={{
            fontSize: "100%",
            color: theme.palette.primary.main,
          }}
        >
          {label}
        </Typography>
      </Box>
      <Box textAlign={"center"} width={"50%"}>
        <Button
          onClick={() => {
            document.getElementById(`${name}-image-input-file`)?.click();
          }}
          sx={{
            backgroundColor: theme.palette.secondary.dark,
            color: theme.palette.primary.main,
            "&:hover": {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.secondary.dark,
            },
          }}
        >
          <Input
            id={`${name}-image-input-file`}
            name={name}
            type="file"
            sx={{ display: "none" }}
            onChange={handleImageInputChange}
          />
          {value ? "cambiar archivo" : "seleccionar archivo"}
        </Button>
      </Box>
    </Box>
  );
};

export const FileInput: React.FC<FileInputProps> = ({
  name,
  label,
  onChange,
  value,
}) => {
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const allowedFileTypes = ["text/x-python"];
    const files = (e.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      if (allowedFileTypes.includes(files[0].type)) {
        onChange({
          target: {
            name,
            value: files[0],
          },
        });
      } else {
        ErrorToast("El archivo es de un formato no compatible!");
      }
    } else {
      ErrorToast("Hubo problemas al cargar el archivo");
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          padding: "2.2%",
          backgroundColor: "#0C0C22",
          borderRadius: "5px",
          border: "1px solid #DDDDDD",
          "&:hover": {
            borderColor: theme.palette.primary.main,
          },
        }}
      >
        <Box textAlign={"left"} width={"50%"}>
          <Typography
            sx={{
              fontSize: "100%",
              color: theme.palette.primary.main,
            }}
          >
            {label}
          </Typography>
        </Box>
        <Box textAlign={"center"} width={"50%"}>
          <Button
            onClick={() => {
              document.getElementById(`${name}-input-file`)?.click();
            }}
            sx={{
              backgroundColor: theme.palette.secondary.dark,
              color: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.secondary.dark,
              },
            }}
          >
            <Input
              id={`${name}-input-file`}
              name={name}
              type="file"
              sx={{ display: "none" }}
              onChange={handleFileInputChange}
            />
            {value ? "cambiar archivo" : "seleccionar archivo"}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export const CheckboxInput: React.FC<CheckboxInputProps> = ({
  name,
  label,
  value,
  onChange,
}) => {
  return (
    <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
      <Typography
        sx={{
          color: theme.palette.primary.main,
          marginRight: "1%",
          fontSize: "90%",
          textAlign: "center",
        }}
      >
        {label}
      </Typography>
      {value ? (
        <StyledCheckbox name={name} onChange={onChange} defaultChecked />
      ) : (
        <StyledCheckbox name={name} onChange={onChange} />
      )}
    </Box>
  );
};
