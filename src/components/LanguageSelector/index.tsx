import React from 'react';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useAppContext } from '@/context/app';
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from 'react-country-flag';

const countryCodeMap: { [key: string]: string } = {
  es: 'ES',
  en: 'GB',
  fr: 'FR',
  de: 'DE',
  br: 'BR',
};

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useAppContext();
  const { i18n } = useTranslation();
  const [open, setOpen] = React.useState(false);


  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleChange = (event: SelectChangeEvent<string>) => {
    const newLang = event.target.value;
    if (language !== newLang) {
      setLanguage(newLang);
      handleClose();
      i18n.changeLanguage(newLang);
    };
  };


  return (
    <Select
      value={language}
      open={open}
      onClose={handleClose}
      onOpen={handleOpen}
      onChange={handleChange}
      sx={{
        minWidth: 80,
        height: '36px',
        '& .MuiSelect-select': {
          display: 'flex',
          alignItems: 'center',
          padding: '6px'
        }
      }}
    >
      {Object.entries(countryCodeMap).map(([lang, countryCode]) => (
        <MenuItem
          key={lang}
          value={lang}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            height: '36px'  // Aseguramos que el MenuItem tenga la misma altura que el Select
          }}
        >
          <ReactCountryFlag
            countryCode={countryCode}
            svg
            style={{
              width: '1.5em',
              height: '1.5em',
              marginRight: '8px'
            }}
          />
          {lang.toUpperCase()}
        </MenuItem>
      ))}
    </Select>
  );
};

export default LanguageSelector;
