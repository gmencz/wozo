import type { LinksFunction, LoaderFunction } from "remix";
import type { PrismaClient } from ".prisma/client";
import { Meta, Links, Scripts, LiveReload, json, useRouteData } from "remix";
import { Outlet } from "react-router-dom";
import { getEnv } from "./utils/env";
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
      prisma?: PrismaClient;
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
