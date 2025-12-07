import express, { Application, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import client from "prom-client";
import ServerError from "./utils/api.errors.utils";

const register = new client.Registry();
client.collectDefaultMetrics({ register });

// metrics
const httpRequestsTotal = new client.Counter({
     name: "http_requests_total",
     help: "Total HTTP requests",
     labelNames: ["method", "route", "status"],
});
register.registerMetric(httpRequestsTotal);

// Histogram: HTTP request duration
const httpRequestDuration = new client.Histogram({
     name: "http_request_duration_seconds",
     help: "Duration of HTTP requests in seconds",
     labelNames: ["method", "route", "status"],
     buckets: [0.1, 0.5, 1, 1.5, 2, 5],
});
register.registerMetric(httpRequestDuration);

// Gauge: active requests count
const activeRequests = new client.Gauge({
     name: "active_requests",
     help: "Number of active HTTP requests",
});

register.registerMetric(activeRequests);

export default (app: Application) => {
     const allowedOrgins: string[] = [
          process.env.SITE_URL_TEST as string,
          process.env.SITE_URL_LIVE as string,
          process.env.APS_SANDBOX_LINK as string,
          process.env.APS_LIVE_LINK as string,
     ]
     const corsOptions = {
          origin: (origin: any, callback: any) => {
               if (!origin || origin === "null" || allowedOrgins.includes(origin)) {
                    callback(null, true);
               } else {
                    callback(new Error("Not allowed by CORS"));
               }
          },
          credentials: true,
          optionsSuccessState: 200,
     };

     app.use(helmet());
     app.use(express.json({
          limit: "75mb"
     }));
     app.use(
          express.urlencoded({
               extended: true,
          })
     );

     app.use("/v0/public", express.static("cdn"));
     app.use(cors(corsOptions));
     app.set("trust proxy", true);
     app.use(cookieParser());
     app.use(morgan("dev"));
     app.use(async (req: Request | any, res: Response, next: NextFunction) => {
          // get langouage of headers
          req.lang = (req.headers['accept-language'] === 'ar' || req.headers['accept-language'] === 'en') ? req.headers['accept-language'] : 'en';
          req.mobileApp = req.headers["app"] === "app" ? "app" : req.headers["app"]
          req.clientIP = req.headers["cf-connecting-ip"] || req.headers["x-real-ip"] || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
          req.currency = req.headers["x-currency"] ? req.headers["x-currency"] : "EGP"

          if (req.path === "/metrics") {
               return next();
          }
          activeRequests.inc();
          const end = httpRequestDuration.startTimer();

          res.on("finish", () => {
               activeRequests.dec();
               httpRequestsTotal.labels(req.method, req.path, res.statusCode.toString()).inc();
               end({ method: req.method, route: req.originalUrl, status: res.statusCode.toString() });
          });
          if (process.env.API_SECRET_KEY == undefined) {
               if (req.useragent?.isBot) {
                    next(new ServerError("System block your device", 500))
                    return
               }
          }
          next();
     });
}
