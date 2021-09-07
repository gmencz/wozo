import argon2 from "argon2";
import { ApolloError } from "apollo-server-errors";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { PrismaSelect } from "@paljs/plugins";
import { nanoid } from "nanoid";
import { prisma } from "~/db";
import { builder } from "~/builder";
import { createToken } from "~/auth";
import { emailSchema, passwordSchema } from "./validation";

const AccountType = builder.simpleObject("Account", {
  fields: (t) => ({
    id: t.string({ nullable: false }),
    email: t.string({ nullable: false }),
  }),
});

const AuthPayloadType = builder.simpleObject("AuthPayload", {
  fields: (t) => ({
    account: t.field({
      type: AccountType,
      nullable: false,
    }),
    token: t.string({ nullable: false }),
  }),
});

builder.queryType({
  fields: (t) => ({
    me: t.field({
      type: AccountType,
      nullable: true,
      authScopes: {
        loggedIn: true,
      },
      resolve: async (_parent, _args, { account }, info) => {
        const { select } = new PrismaSelect(info).value;
        const accountDetails = await prisma.account.findUnique({
          where: {
            id: account?.id,
          },
          select: {
            id: !!select.id,
            email: !!select.email,
          },
        });

        if (!accountDetails) {
          return null;
        }

        return {
          id: accountDetails.id,
          email: accountDetails.email,
        };
      },
    }),
  }),
});

builder.mutationType({
  fields: (t) => ({
    loginWithPassword: t.field({
      type: AuthPayloadType,
      nullable: false,
      args: {
        email: t.arg({
          type: "String",
          description: "The account's email.",
          required: true,
          validate: {
            schema: emailSchema,
          },
        }),
        password: t.arg({
          type: "String",
          description: "The account's password.",
          required: true,
          validate: {
            schema: passwordSchema,
          },
        }),
      },
      resolve: async (_parent, { email, password }, _context, info) => {
        const { select } = new PrismaSelect(info).valueOf("account");
        const account = await prisma.account.findUnique({
          where: {
            email,
          },
          select: {
            id: !!select.id,
            email: !!select.email,
            password_hash: true,
          },
        });

        if (!account || !account.password_hash) {
          throw new ApolloError("Invalid email or password");
        }

        const isValid = await argon2.verify(account.password_hash, password);
        if (!isValid) {
          throw new ApolloError("Invalid email or password");
        }

        return {
          token: createToken(account),
          account,
        };
      },
    }),

    registerWithPassword: t.field({
      type: AuthPayloadType,
      nullable: false,
      args: {
        email: t.arg({
          type: "String",
          description: "The new account's email.",
          required: true,
          validate: {
            schema: emailSchema,
          },
        }),
        password: t.arg({
          type: "String",
          description: "The new account's password.",
          required: true,
          validate: {
            schema: passwordSchema,
          },
        }),
      },
      resolve: async (_parent, { email, password }, _context, info) => {
        const passwordHash = await argon2.hash(password);
        const { select } = new PrismaSelect(info).valueOf("account");

        let account;
        try {
          account = await prisma.account.create({
            data: {
              id: `u-${nanoid()}`,
              email,
              password_hash: passwordHash,
            },
            select: {
              id: !!select.id,
              email: !!select.email,
            },
          });
        } catch (error) {
          if (
            error instanceof PrismaClientKnownRequestError &&
            error.code === "P2002"
          ) {
            throw new ApolloError("That email is already in use");
          }

          throw error;
        }

        return {
          token: createToken(account),
          account,
        };
      },
    }),
  }),
});
