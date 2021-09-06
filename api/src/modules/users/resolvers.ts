import { builder } from "../../builder";

const UserType = builder.simpleObject("User", {
  fields: (t) => ({
    id: t.string({ nullable: false }),
  }),
});

builder.queryType({
  fields: (t) => ({
    me: t.field({
      type: UserType,
      nullable: true,
      resolve: (_parent, _args) => {
        return null;
      },
    }),
  }),
});
