import SchemaBuilder from "@giraphql/core";
import SimpleObjectsPlugin from "@giraphql/plugin-simple-objects";
import ScopeAuthPlugin from "@giraphql/plugin-scope-auth";
import type { User } from "./auth";

const builder = new SchemaBuilder<{
  Context: {
    user: User | null;
  };
}>({
  plugins: [ScopeAuthPlugin, SimpleObjectsPlugin],
  authScopes: (context) => ({
    public: !!context.user,
  }),
});

export { builder };
