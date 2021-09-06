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

export { TokenAccount, extractTokenFromHeader, getAccountFromToken };
