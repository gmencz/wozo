import { MetaFunction } from "@remix-run/react/routeModules";
import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  redirect,
  usePendingFormSubmit,
  useRouteData,
} from "remix";
import { sendMagicLink, createMagicLink } from "../../utils/auth";
import { prisma } from "../../utils/prisma";
import { getMetaTags } from "../../utils/seo";
import { commitSession, getSession } from "../../utils/sessions";

type RouteData = {
  authError?: string;
};

export let meta: MetaFunction = () => {
  return getMetaTags({
    description:
      "Empowering people to communicate no matter what language they speak by removing language barriers with AI.",
    pathname: "/",
    title: "Wozo - Log in or Sign up",
  });
};

export let loader: LoaderFunction = async ({ request }) => {
  let session = await getSession(request.headers.get("Cookie"));

  let isLoggedIn = session.has("user");

  if (isLoggedIn) {
    return redirect("/app");
  }

  let data = { authError: session.get("authError") };

  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export let action: ActionFunction = async ({ request }) => {
  let session = await getSession(request.headers.get("Cookie"));
  let body = new URLSearchParams(await request.text());

  let email = body.get("email");

  if (!email?.includes("@")) {
    session.flash("authError", "That's not a valid email!");

    return redirect("/auth", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  let magicLink = await createMagicLink(email);

  let user = await prisma.user.findUnique({
    where: {
      email,
    },
    // We don't really care about the user itself so to avoid fetching unnecessary
    // fields, we select only the id.
    select: {
      id: true,
    },
  });

  await sendMagicLink({
    email,
    magicLink,
    userExists: !!user,
  });

  return redirect("/auth", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function Auth() {
  let { authError } = useRouteData<RouteData>();
  let pendingForm = usePendingFormSubmit();

  return (
    <div className="bg-gray-50">
      <div className="flex flex-col items-center pt-20 pb-5 px-5 min-h-screen w-full max-w-[22rem] mx-auto">
        <img src="/logo_transparent.png" className="w-36 h-36 object-contain" />

        <div className="mt-3 text-center w-full">
          <h1 className="text-4xl font-semibold">Hello there!</h1>
          <p className="mt-3 text-gray-500">We're so excited to see you!</p>

          <Form replace method="post" className="mt-8 w-full">
            <input
              name="email"
              id="email"
              type="email"
              required
              className="focus:ring-brand focus:border-brand block w-full border-gray-300 rounded-md p-3 placeholder-gray-400"
              placeholder="you@example.com"
            />

            {authError && (
              <p className="mt-4 text-red-500 text-sm">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full mt-6 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
            >
              {pendingForm ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              Next
            </button>

            <p className="text-left mt-4 text-gray-500 text-sm">
              Don't have an account? Type your email and we'll sign you up.
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
}
