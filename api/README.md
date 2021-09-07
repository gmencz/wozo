# Wozo API

## Local Database Setup

1. Connect to the database development branches with `npm run db:up`
2. Update .env with the following:

```
DATABASE_URL="mysql://root@127.0.0.1:3309/wozo"
SHADOW_DATABASE_URL="mysql://root@127.0.0.1:3310/wozo"
```
