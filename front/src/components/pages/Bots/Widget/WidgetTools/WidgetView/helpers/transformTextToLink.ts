import { default_theme } from "../styles/default_theme";

const transformTextToLink = (text: string, textColor?: string): string => {
  const linkRE = /(https?:\/\/[^\s]+)/g;
  const emailRE = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g;
  return text
    .replace(linkRE, (match) => {
      return `<a href="${match}" target="_blank" style="color: ${
        textColor ? textColor : default_theme.palette.secondary.main
      }">${match}</a>`;
    })
    .replace(emailRE, (match) => {
      return `<a href="mailto:${match}" style="color: ${
        textColor ? textColor : default_theme.palette.secondary.main
      }">${match}</a>`;
    });
};

export default transformTextToLink;
