import { default as br } from './br';
import { default as en } from './en';
import { default as es } from './es';
import { default as fr } from './fr';
import { default as de } from './de';

export const languages = {
  br,
  en,
  es,
  fr,
  de
};

export type LanguageKey = keyof typeof languages;

export default languages;
