import "dotenv/config";
import {
  createCookieSessionStorage,
  LoaderFunction,
  redirect,
  Session,
  Request,
} from "remix";
import { User as PrismaUser } from ".prisma/client";

type User = Pick<PrismaUser, "id" | "email" | "createdAt">;

let { getSession, commitSession, destroySession } = createCookieSessionStorage({
  // This is either a Cookie (or a set of CookieOptions) that
  // describe the session cookie to use.
  cookie: {
    name: "__session",
    secrets: [process.env.SESSION_SECRET_1!],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    maxAge: 31536000, // 1 year
  },
});

function getUserFromSession(session: Session) {
  return session.get("user") as User;
}

export async function requireUser(
  request: Request,
  next: (user: User) => ReturnType<LoaderFunction>
) {
  let session = await getSession(request.headers.get("Cookie"));
  let user = getUserFromSession(session);

  if (!user) {
    return redirect("/auth");
  }

  return next(user);
}

export { getSession, commitSession, destroySession };
