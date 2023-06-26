type Keys = "GOOGLE_CLIENT_ID" | "GOOGLE_CLIENT_SECRET" | "NEXT_AUTH_SECRET";

type GetEnv = () => { [key in Keys]: string };
export const getEnv: GetEnv = () => ({
  GOOGLE_CLIENT_ID: unwrap(process.env.GOOGLE_CLIENT_ID, "GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: unwrap(
    process.env.GOOGLE_CLIENT_SECRET,
    "GOOGLE_CLIENT_SECRET"
  ),
  NEXT_AUTH_SECRET: unwrap(process.env.NEXT_AUTH_SECRET, "NEXT_AUTH_SECRET"),
});

type Unwrap = (value: string | undefined, key: Keys) => string;
const unwrap: Unwrap = (value, key) => {
  if (!value) {
    throw new Error(`環境変数"${key}"が設定されていません`);
  }

  return value;
};
