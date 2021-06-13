interface Meta {
  title: string;
  description: string;
  pathname: string;
}

// TODO: Update this
let siteUrl = "https://gabrielmendezc.com";

export function getMetaTags(meta: Meta) {
  return {
    title: meta.title,
    description: meta.description,

    "og:image": siteUrl + "/images/logo_transparent.png",
    "og:image:alt": meta.description,
    "og:site_name": "Fungi",
    "og:type": "website",
    "og:title": meta.title,
    "og:url": siteUrl + meta.pathname,
    "og:description": meta.description,

    "twitter:image:src": siteUrl + "/images/logo_transparent.png",
    "twitter:card": "summary",
    "twitter:title": meta.title,
    "twitter:description": meta.description,
  };
}
