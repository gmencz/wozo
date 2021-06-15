import { LoaderFunction, redirect } from "remix";

export let loader: LoaderFunction = ({ request }) => {
  let url = new URL(request.url);
  let params = new URLSearchParams(url.search);
  let token = params.get("token");

  if (!token) {
    return redirect("/auth");
  }

  // Work here

  return redirect("/auth");
};

export default function Magic() {
  return null;
}
