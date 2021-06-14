import { json, LoaderFunction, MetaFunction, useRouteData } from "remix";
import { getMetaTags } from "../utils/seo";
import { commitSession, getSession } from "../utils/sessions";

type RouteData = {
  isLoggedIn: boolean;
};

export let meta: MetaFunction = () => {
  return getMetaTags({
    description:
      "Empowering people to communicate no matter what language they speak by removing language barriers with AI.",
    pathname: "/",
    title: "Wozo - Talk to anyone in any language",
  });
};

export let loader: LoaderFunction = async ({ request }) => {
  let session = await getSession(request.headers.get("Cookie"));

  let isLoggedIn = session.has("user");

  let data = { isLoggedIn };

  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function Index() {
  let { isLoggedIn } = useRouteData<RouteData>();

  return (
    <div className="relative bg-gray-50">
      <main className="min-h-screen lg:relative">
        <div className="mx-auto max-w-7xl w-full pt-16 pb-20 text-center lg:py-48 lg:text-left">
          <div className="px-4 lg:w-1/2 sm:px-8 xl:pr-16">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
              <span className="block xl:inline">Talk to anyone</span>{" "}
              <span className="block text-brand xl:inline">
                in any language
              </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
              No matter what language you speak, with Wozo you'll be able to
              talk to anyone from anywhere using AI and modern technologies.
            </p>
            <div className="mt-10 md:flex md:justify-center lg:justify-start">
              <div className="rounded-md shadow">
                <a
                  href={isLoggedIn ? "/app" : "/auth"}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand hover:bg-yellow-500 md:py-4 md:text-lg md:px-10"
                >
                  {isLoggedIn ? "Open Wozo in your browser" : "Get started"}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-full h-64 sm:h-72 md:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 lg:h-full">
          <img
            className="absolute inset-0 w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1520333789090-1afc82db536a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2102&q=80"
            alt=""
          />
        </div>
      </main>
    </div>
  );
}
