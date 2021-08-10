import jwt from "jsonwebtoken";

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

async function sendEmail({ to, from, subject, text }: MailgunMessage) {
  let auth = `${Buffer.from(`api:${mailgunApiKey}`).toString("base64")}`;

  let body = new URLSearchParams({
    to,
    from,
    subject,
    text,
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
  let sender = "Wozo Team <wozo.team@gmail.com>";
  let body = `
Here's your magic link for Wozo:

${magicLink}

${
  userExists
    ? `Welcome back ${email}!`
    : `
Clicking the link above will create a *new* account on Wozo with the email ${email}. Welcome!
      `.trim()
}

Thanks!

&ndash; The Wozo Team

P.S. If you did not sign up for an account on Wozo you can ignore this email.
  `.trim();

  let message = {
    from: sender,
    to: email,
    subject: `Here's your Magic ✨ link for Wozo`,
    text: body,
  };

  await sendEmail(message);
}

export async function decodeMagicLinkToken(token: string) {
  let decoded = await new Promise<MagicLinkToken>((resolve, reject) => {
    jwt.verify(token, signingSecret!, (err, decoded) => {
      if (err) {
        reject(err);
      }

      resolve(decoded as MagicLinkToken);
    });
  });

  return decoded;
}
