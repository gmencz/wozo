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
    <div className="relative bg-gray-50 min-h-screen flex items-center justify-center">
      <h1 className="text-red-800">TODO</h1>
    </div>
  );
}
