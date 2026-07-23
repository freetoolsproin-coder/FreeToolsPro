---
title: "Express.js Guide: Routes, Middleware, and Clean APIs"
description: "Build REST APIs with Express—routing, middleware, validation, errors, and security basics—plus FreeToolsPro JSON and JWT tools for request debugging."
slug: express-js-guide
category: programming
date: 2026-06-20
updated: 2026-07-22
tags:
  - express
  - nodejs
  - api
relatedTools:
  - /developer-tools/json-formatter
  - /developer-tools/jwt-decoder
  - /developer-tools/regex-tester
---

Express is the most common **Node.js web framework** for HTTP APIs and traditional server-rendered apps. Learn routing and middleware well, and most Express codebases become readable quickly.

## Minimal server

```js
import express from "express";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(3000, () => {
  console.log("listening on :3000");
});
```

`express.json()` parses JSON bodies—confirm sample payloads with the [JSON Formatter](/developer-tools/json-formatter) while designing contracts.

## Routing patterns

- Group by resource: `/users`, `/users/:id`, `/orders`
- Keep handlers thin: validate → call service → map response
- Use routers (`express.Router()`) per feature area

```js
import { Router } from "express";

const users = Router();

users.get("/", listUsers);
users.get("/:id", getUser);
users.post("/", createUser);

export default users;
```

Mount with `app.use("/api/users", users)`.

## Middleware: the Express superpower

Middleware is a function `(req, res, next)` that can:

- Log requests
- Authenticate
- Validate input
- Attach context (`req.user`)
- Handle errors (four-arg signature)

Order matters. Place body parsers early, auth before protected routes, and error handlers last.

## Validation and errors

Never trust client input. Validate shape and types; return consistent error bodies:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "email is required"
  }
}
```

Regex constraints for strings can be prototyped in the [Regex Tester](/developer-tools/regex-tester) before locking server rules.

Centralize errors:

```js
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: { message: err.message || "Internal Server Error" },
  });
});
```

## Auth sketch with JWT

Issue tokens on login; verify on protected routes. While designing claims (`sub`, `role`, `exp`), inspect sample tokens with the [JWT Decoder](/developer-tools/jwt-decoder). Always verify signatures in code—decoders alone are not authentication.

## Security basics

- Helmet for safe headers
- Rate limiting on auth and write endpoints
- CORS configured intentionally (not `*` with credentials)
- Sanitize logs (no passwords, no full cards)

## Project layout that scales

```text
src/
  app.js          # express app + middleware
  server.js       # listen
  routes/
  middleware/
  services/
  utils/
```

Keep business logic in services so routes stay boring.

## Related reading

Prerequisites: [Node.js beginners guide](/blog/nodejs-beginners-guide). Persist data with [MongoDB basics](/blog/mongodb-basics-guide). Frontends often consume these APIs from [React](/blog/react-beginners-guide).
