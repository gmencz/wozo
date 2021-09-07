import jwt from "jsonwebtoken";

interface TokenAccount {
  id: string;
}

type TokenPayload = Record<string, unknown> & TokenAccount;

function extractTokenFromHeader(authorizationHeader?: string) {
  if (!authorizationHeader) {
    return null;
  }

  // Header format:
  // Authorization: Bearer token
  const token = authorizationHeader.substr(7) || null;
  return token;
}

function getAccountFromToken(token: string): TokenAccount {
  const tokenPayload = jwt.verify(
    token,
    process.env.AUTH_SECRET_KEY!
  ) as TokenPayload;

  return {
    id: tokenPayload.id,
  };
}

function createToken(account: { id: string; email: string }) {
  const tokenAccount: TokenAccount = {
    id: account.id,
  };

  return jwt.sign(tokenAccount, process.env.AUTH_SECRET_KEY!);
}

export {
  TokenAccount,
  extractTokenFromHeader,
  getAccountFromToken,
  createToken,
};
