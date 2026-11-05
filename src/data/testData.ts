export const ERROR_MESSAGES = {
  emailRequired: 'Please enter your email address',
  emailInvalid: 'Enter a valid email.',
  invalidCredentials:
    /^(Your email or password is incorrect\. Try again\.|Incorrect username or password\.)$/,
} as const;

export const INVALID_EMAILS = ['abc', 'abc@', '@hudl.com', 'abc@@hudl.com'] as const;

export const WRONG_PASSWORD = 'not-the-password-123!';

export function uniqueUnregisteredEmail(): string {
  return `qa-no-account-${Date.now()}@example.com`;
}

export const XSS_MARKER = 'data-xss-probe';

export const XSS_PAYLOADS = [
  { name: 'script tag', value: `<script ${XSS_MARKER}>window.xssExecuted = true</script>` },
  { name: 'image onerror', value: `<img src="x" ${XSS_MARKER} onerror="window.xssExecuted = true">` },
  { name: 'attribute breakout', value: `"><svg ${XSS_MARKER} onload="window.xssExecuted = true">` },
] as const;

export const SQL_INJECTION_PASSWORD = `' OR '1'='1' --`;