import { config } from "dotenv";
import { createCookieSessionStorage } from "remix";

config();

let { getSession, commitSession, destroySession } = createCookieSessionStorage({
  // This is either a Cookie (or a set of CookieOptions) that
  // describe the session cookie to use.
  cookie: {
    name: "__session",
    secrets: [process.env.SESSION_SECRET_1!],
    sameSite: "lax",
  },
});

export { getSession, commitSession, destroySession };
