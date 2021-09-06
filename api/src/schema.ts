import { builder } from "./builder";
import "./modules/users/resolvers";

const schema = builder.toSchema({});

export { schema };
