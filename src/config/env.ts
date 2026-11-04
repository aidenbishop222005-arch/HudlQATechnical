import 'dotenv/config'

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing environment variable "${name}". ` +
        `Copy .env.example to .env and fill in your test account details.`,
    );
  }
  return value;
}

export const credentials = {
    get email(): string{
        return requireEnv('HUDL_EMAIL')
    },
    get password(): string {
      return requireEnv('HUDL_PASSWORD')
    }, 
};