import { builder } from "../../builder";

const AccountType = builder.simpleObject("Account", {
  fields: (t) => ({
    id: t.string({ nullable: false }),
  }),
});

builder.queryType({
  fields: (t) => ({
    me: t.field({
      type: AccountType,
      nullable: true,
      resolve: (_parent, _args) => {
        return null;
      },
    }),
  }),
});
