import { builder } from "./builder";
import "./modules/accounts/resolvers";

const schema = builder.toSchema({});

export { schema };
