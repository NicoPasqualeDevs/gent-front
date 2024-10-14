import { ForbidenContentDetectorResponse, LetterSubstitution } from "../types";

const forbidenContentDetector = (
  contentToReview: string,
  bandList: string[] | undefined,
  letterSubstitutions: LetterSubstitution,
  sqlInjectionTester = true,
  phpInjectionTester = true,
  strangeCharsTester = true
): ForbidenContentDetectorResponse => {
  const re_sql_injections =
    /\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|RENAME|SELECT|TRUNCATE|UPDATE|UPSERT|GRANT|REVOKE|COMMIT|ROLLBACK|SAVEPOINT)\b/i;
  const re_php_injections = /<\?(php)?|<=|<php|php>|<\?php/i;
  const re_strange_chars = /[#%^&()~`”/|\\><]/;
  let sql_injection_alert = false;
  let php_injection_alert = false;
  let strange_chars_alert = false;
  let band_content_alert = false;
  const band_content_match: string[] = [];
  let bad_content_alert = false;
  if (sqlInjectionTester) {
    sql_injection_alert = re_sql_injections.test(contentToReview);
  }

  if (phpInjectionTester) {
    php_injection_alert = re_php_injections.test(contentToReview);
  }

  if (strangeCharsTester) {
    strange_chars_alert = re_strange_chars.test(contentToReview);
  }

  if (bandList && bandList.length > 0) {
    bandList.forEach((bad_content) => {
      const prepareBadContent = bad_content
        .toLowerCase()
        .split("")
        .map((char) => {
          return letterSubstitutions[char] || `[${char}]`;
        })
        .join("[\\s\\+\\-\\.\\,]*");
      const re_band_content = new RegExp(
        `(?:(?:^|\\s)${prepareBadContent}(?:$|\\s))`,
        "gi"
      );
      if (re_band_content.test(contentToReview)) {
        band_content_match.push(bad_content);
        band_content_alert = true;
      }
    });
  }
  if (
    sql_injection_alert ||
    php_injection_alert ||
    strange_chars_alert ||
    band_content_alert
  ) {
    bad_content_alert = true;
  }
  return {
    sql_injection_alert,
    php_injection_alert,
    strange_chars_alert,
    band_content_alert,
    band_content_match,
    bad_content_alert,
  };
};

export default forbidenContentDetector;
