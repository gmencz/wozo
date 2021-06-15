import { LoaderFunction, redirect } from "remix";
import { decodeMagicLinkToken } from "../../utils/auth";
import { prisma } from "../../utils/prisma";
import { commitSession, getSession } from "../../utils/sessions";

export let loader: LoaderFunction = async ({ request }) => {
  let session = await getSession(request.headers.get("Cookie"));
  let url = new URL(request.url);
  let params = new URLSearchParams(url.search);
  let token = params.get("token");

  if (!token) {
    return redirect("/auth");
  }

  let email: string;

  try {
    ({ email } = await decodeMagicLinkToken(token));
  } catch (error) {
    return redirect("/auth");
  }

  let user = await prisma.user.upsert({
    where: {
      email,
    },
    create: {
      email,
    },
    update: {},
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });

  if (!user) {
    return redirect("/auth");
  }

  session.set("user", user);

  return redirect("/app", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function Magic() {
  return (
    <div className="p-4">
      <p>
        Congrats! You're seeing something you shouldn't ever be able to see
        because you should have been redirected. Good job!
      </p>
    </div>
  );
}
