import { z } from "zod";

const emailSchema = z.string().email("Invalid email address");
const passwordSchema = z
  .string()
  .min(6, "Your password must be longer than 6 characters")
  .max(128, "Your password must be shorter than 128 characters");

export { emailSchema, passwordSchema };
