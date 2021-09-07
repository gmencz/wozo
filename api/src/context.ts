import { ContextFunction } from "apollo-server-core";
import { ExpressContext } from "apollo-server-express";
import {
  extractTokenFromHeader,
  getAccountFromToken,
  TokenAccount,
} from "./auth";

interface Context {
  account: TokenAccount | null;
}

const context: ContextFunction<ExpressContext, Context> = async ({ req }) => {
  const token = extractTokenFromHeader(req.headers.authorization);
  if (!token) {
    return { account: null };
  }

  try {
    const account = getAccountFromToken(token);
    return { account };
  } catch (error) {
    return { account: null };
  }
};

export { context };
