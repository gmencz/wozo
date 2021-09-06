import { ApolloServer } from "apollo-server";
import SchemaBuilder from "@giraphql/core";

const builder = new SchemaBuilder({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: (parent, { name }) => `hello, ${name || "World"}`,
    }),
  }),
});

new ApolloServer({ schema: builder.toSchema({}) }).listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
