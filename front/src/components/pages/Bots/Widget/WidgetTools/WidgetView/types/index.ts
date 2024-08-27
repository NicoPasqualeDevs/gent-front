export interface InputData {
  input: string;
}

export interface MessagesData {
  content: string;
  role: string | "client" | "bot";
  timestamp?: string;
}

export interface MessageResponse {
  customer_bot: string;
  conversation: string;
  response: MessagesData;
  reserve_link?: Location;
}

export interface ForbidenContentDetectorResponse {
  sql_injection_alert: boolean;
  php_injection_alert: boolean;
  strange_chars_alert: boolean;
  band_content_alert: boolean;
  band_content_match: string[];
  bad_content_alert: boolean;
}

export interface LetterSubstitution {
  [propKey: string]: string;
}
