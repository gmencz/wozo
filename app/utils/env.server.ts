import { config } from "dotenv";
config();

export function getEnv() {
  return {
    NODE_ENV: process.env.NODE_ENV,
  };
}
