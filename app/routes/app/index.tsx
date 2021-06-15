import type { MetaFunction } from "@remix-run/react/routeModules";
import { json, LoaderFunction } from "remix";
import { getMetaTags } from "../../utils/seo";
import { requireUser } from "../../utils/sessions";

export let meta: MetaFunction = () => {
  return getMetaTags({
    description:
      "Empowering people to communicate no matter what language they speak by removing language barriers with AI.",
    pathname: "/",
    title: "Wozo",
  });
};

export let loader: LoaderFunction = ({ request }) => {
  return requireUser(request, (user) => {
    return json(null);
  });
};

export default function App() {
  return null;
}
