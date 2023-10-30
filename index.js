require("dotenv").config();
const express = require("express");
const { Client } = require("@scoby/analytics-ts");
const { getClientIp } = require("request-ip");
const Sentry = require("@sentry/node");

const {
  SCOBY_ANALYTICS_API_KEY,
  SCOBY_ANALYTICS_SALT,
  PORT,
  SCOBY_ANALYTICS_PATH,
  SCOBY_ANALYTICS_DEBUG,
} = process.env;

const client = new Client(SCOBY_ANALYTICS_API_KEY, SCOBY_ANALYTICS_SALT);
const path = SCOBY_ANALYTICS_PATH || "/count";
const debugEnabled = !!SCOBY_ANALYTICS_DEBUG || false;

const app = express();

if (debugEnabled) {
  Sentry.init({
    dsn: "https://f154d5c1e83d41bc80e793d3567790d0@sentry.cult2.s3y.io/7",
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Sentry.Integrations.Express({ app }),
      // Automatically instrument Node.js libraries and frameworks
      ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.05,
  });

  // RequestHandler creates a separate execution context, so that all
  // transactions/spans/breadcrumbs are isolated across requests
  app.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());
}

// All controllers should live here
app.get("/", function rootHandler(req, res) {
  res.end("Hello from Scoby Analytics!");
});

app.get(path, async (request, response) => {
  const ipAddress = getClientIp(request);
  const userAgent = request.headers["user-agent"];

  const requestedUrl = request.query["url"];
  const referringUrl = request.query["ref"];
  const segments = request.query["sg"]?.split(",");

  await client.logPageView({
    ipAddress,
    userAgent,
    requestedUrl,
    referringUrl,
    segments,
  });

  return response
    .header("Cache-Control", "no-cache, no-store, must-revalidate")
    .header("Pragma", "no-cache")
    .header("Expires", 0)
    .type("image/gif")
    .status(204)
    .send();
});

if (debugEnabled) {
  // The error handler must be before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler());

  // Optional fallthrough error handler
  app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "\n");
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
