import { LinksFunction, LoaderFunction, useRouteData } from "remix";
import { Meta, Links, Scripts, LiveReload, json } from "remix";
import { Outlet } from "react-router-dom";
import { getEnv } from "./utils/env.server";
import stylesUrl from "./styles/app.css";

type ENV = ReturnType<typeof getEnv>;

type LoaderData = {
  ENV: ENV;
};

declare global {
  let ENV: ENV;

  namespace NodeJS {
    interface Global {
      ENV: ENV;
    }
  }

  interface Window {
    ENV: ENV;
  }
}

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export let loader: LoaderFunction = () => {
  let data = {
    ENV: getEnv(),
  };

  return json(data);
};

function Env({ env }: { env: ENV }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.ENV = ${JSON.stringify(env)}`,
      }}
    />
  );
}

function Document({ children }: { children: React.ReactNode }) {
  let data = useRouteData<LoaderData>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}

        <Scripts />
        <Env env={data.ENV} />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document>
      <h1>App Error</h1>
      <pre>{error.message}</pre>
      <p>Oops! Something went wrong :(</p>
    </Document>
  );
}
