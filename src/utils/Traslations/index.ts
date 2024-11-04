import { TranslationType } from './types';
import { default as br } from './languages/br';
import { default as en } from './languages/en';
import { default as es } from './languages/es';
import { default as fr } from './languages/fr';
import { default as de } from './languages/de';
import { default as hi } from './languages/hi';

export const languages: Record<string, TranslationType> = {
  br,
  en,
  es,
  fr,
  de,
  hi
} as const;

export type LanguageKey = keyof typeof languages;

export default languages;
