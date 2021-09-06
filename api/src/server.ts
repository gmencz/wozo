import { ApolloServer } from "apollo-server";
import { schema } from "./schema";
import {
  getAccountFromToken,
  extractTokenFromHeader,
} from "./modules/accounts/auth";

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
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
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
