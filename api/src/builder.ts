import SchemaBuilder from "@giraphql/core";
import SimpleObjectsPlugin from "@giraphql/plugin-simple-objects";
import ScopeAuthPlugin from "@giraphql/plugin-scope-auth";
import ValidationPlugin from "@giraphql/plugin-validation";
import type { TokenAccount } from "./modules/accounts/auth";

const builder = new SchemaBuilder<{
  Context: {
    account: TokenAccount | null;
  };
}>({
  plugins: [ScopeAuthPlugin, SimpleObjectsPlugin, ValidationPlugin],
  authScopes: (context) => ({
    public: !!context.account,
  }),
});

export { builder };
