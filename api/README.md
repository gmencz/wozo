# Wozo API

## Local Database Setup

1. On two separate terminals, connect to each of these database branches:

```
pscale connect wozo dev --port 3309
```

```
pscale connect wozo shadow --port 3310
```

2. Update .env with the following:

```
DATABASE_URL="mysql://root@127.0.0.1:3309/wozo"
SHADOW_DATABASE_URL="mysql://root@127.0.0.1:3310/wozo"
```
