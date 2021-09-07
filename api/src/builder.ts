import SchemaBuilder from "@giraphql/core";
import SimpleObjectsPlugin from "@giraphql/plugin-simple-objects";
import ScopeAuthPlugin from "@giraphql/plugin-scope-auth";
import ValidationPlugin from "@giraphql/plugin-validation";
import type { TokenAccount } from "./auth";

const builder = new SchemaBuilder<{
  Context: {
    account: TokenAccount | null;
  };

  AuthScopes: {
    loggedIn: boolean;
  };
}>({
  plugins: [ScopeAuthPlugin, SimpleObjectsPlugin, ValidationPlugin],
  authScopes: (context) => ({
    loggedIn: !!context.account,
  }),
});

export { builder };
