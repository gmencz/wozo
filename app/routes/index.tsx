import type { MetaFunction } from "remix";
import { getMetaTags } from "../utils/seo";

export let meta: MetaFunction = () => {
  return getMetaTags({
    description:
      "Empowering people to communicate no matter what language they speak by removing language barriers with AI.",
    pathname: "/",
    title: "Wozo",
  });
};

export default function Index() {
  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2>Welcome to Remix!</h2>
      <p>
        <a href="https://remix.run/dashboard/docs">Check out the docs</a> to get
        started.
      </p>
    </div>
  );
}
