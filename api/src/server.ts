import { ApolloServer } from "apollo-server";
import { getUserFromToken, extractTokenFromHeader } from "./auth";
import { schema } from "./schema";

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) {
      return { user: null };
    }

    try {
      const user = getUserFromToken(token);
      return { user };
    } catch (error) {
      return { user: null };
    }
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
