export const ERROR_MESSAGES = {
  emailRequired: 'Please enter your email address',
  emailInvalid: 'Enter a valid email.',
  invalidCredentials: 'Your email or password is incorrect. Try again.',
} as const;

export const INVALID_EMAILS = ['abc', 'abc@', '@hudl.com', 'abc@@hudl.com'] as const;

export const WRONG_PASSWORD = 'not-the-password-123!';

export function uniqueUnregisteredEmail(): string {
  return `qa-no-account-${Date.now()}@example.com`;
}