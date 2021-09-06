import jwt from "jsonwebtoken";

interface TokenAccount {
  id: string;
}

function extractTokenFromHeader(authorizationHeader?: string) {
  if (!authorizationHeader) {
    return null;
  }

  // Header format:
  // Authorization: Bearer token
  const token = authorizationHeader.substr(7) || null;
  return token;
}

function getAccountFromToken(token: string) {
  return jwt.verify(token, process.env.AUTH_SECRET_KEY!) as TokenAccount;
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
