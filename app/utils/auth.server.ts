import "dotenv/config";
import jwt from "jsonwebtoken";
import unified from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import doc from "rehype-document";
import format from "rehype-format";
import rehypStringify from "rehype-stringify";

type MailgunMessage = {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string | null;
};

type MagicLinkToken = {
  email: string;
};

type SendMagicLinkOptions = {
  magicLink: string;
  email: string;
  userExists: boolean;
};

const domain = "wozo.app";
const mailgunApiKey = process.env.MAILGUN_API_KEY;
const mailgunDomain = process.env.MAILGUN_DOMAIN;
const signingSecret = process.env.MAGIC_LINK_SIGNING_SECRET;
const magicLinkDuration = "10m";
const verifyMagicLinkBaseUrl =
  process.env.NODE_ENV === "production"
    ? "..."
    : "http://localhost:3000/auth/magic";

if (!mailgunApiKey) {
  throw new Error("MAILGUN_API_KEY is required");
}

if (!mailgunDomain) {
  throw new Error("MAILGUN_DOMAIN is required");
}

if (!signingSecret) {
  throw new Error("MAGIC_LINK_SIGNING_SECRET is required");
}

export async function createMagicLink(email: string) {
  let data: MagicLinkToken = {
    email,
  };

  let token = await new Promise<string>((resolve, reject) => {
    jwt.sign(
      data,
      signingSecret!,
      { expiresIn: magicLinkDuration },
      (err, token) => {
        if (err) {
          reject(err);
        }

        resolve(token!);
      }
    );
  });

  return verifyMagicLinkBaseUrl + `?token=${token}`;
}

async function markdownToHtml(markdownString: string) {
  const { contents } = await unified()
    .use(markdown)
    .use(remark2rehype)
    .use(doc)
    .use(format)
    .use(rehypStringify)
    .process(markdownString);

  return contents.toString();
}

async function sendEmail({ to, from, subject, text, html }: MailgunMessage) {
  let auth = `${Buffer.from(`api:${mailgunApiKey}`).toString("base64")}`;

  // if they didn't specify it and it's not
  if (html === undefined) {
    html = await markdownToHtml(text);
  } else if (html === null) {
    html = text;
  }

  let body = new URLSearchParams({
    to,
    from,
    subject,
    text,
    html,
  });

  await fetch(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, {
    method: "post",
    body,
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
}

export async function sendMagicLink({
  email,
  magicLink,
  userExists,
}: SendMagicLinkOptions) {
  let sender = "Wozo Team <yo@gabrielmendezc.com>";
  let body = `
Here's your magic link for ${domain}:

${magicLink}

${
  userExists
    ? `Welcome back ${email}!`
    : `
Clicking the link above will create a *new* account on ${domain} with the email ${email}. Welcome!
      `.trim()
}

Thanks!

- The Wozo Team

P.S. If you did not sign up for an account on ${domain} you can ignore this email.
  `.trim();

  let message = {
    from: sender,
    to: email,
    subject: `Here's your Magic ✨ link for ${domain}`,
    text: body,
    html: await markdownToHtml(body),
  };

  await sendEmail(message);
}