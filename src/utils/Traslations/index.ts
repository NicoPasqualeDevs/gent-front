import { default as br } from './languages/br';
import { default as en } from './languages/en';
import { default as es } from './languages/es';
import { default as fr } from './languages/fr';
import { default as de } from './languages/de';

export const languages = {
  br,
  en,
  es,
  fr,
  de
} as const;

export type LanguageKey = keyof typeof languages;

export default languages;
