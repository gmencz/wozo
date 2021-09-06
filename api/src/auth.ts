import jwt from "jsonwebtoken";

interface User {
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

function getUserFromToken(token: string) {
  return jwt.verify(token, process.env.AUTH_SECRET_KEY!) as User;
}

export { User, extractTokenFromHeader, getUserFromToken };
