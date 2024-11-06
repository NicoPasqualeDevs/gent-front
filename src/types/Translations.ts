import { TranslationType } from '../utils/Traslations/types';

export type TranslationFunction = {
  [K in keyof TranslationType]: TranslationType[K];
}; 