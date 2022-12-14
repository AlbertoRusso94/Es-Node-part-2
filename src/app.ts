import express from "express";
import "express-async-errors";
import { validationErrorMiddleware } from "./lib/prisma/middleware/validation";
import planetsRoutes from "./routes/planets";
import { initCorsMiddleware } from "./lib/prisma/middleware/cors";
import { initSessionMiddleware } from "./lib/prisma/middleware/session";
import { passport } from "./lib/prisma/middleware/passport";
import authRoutes from "./routes/auth";
import {
  notFoundMiddleware,
  initErrorMiddleware,
} from "./lib/prisma/middleware/validation/error";

const app = express();

app.use(initSessionMiddleware(app.get("env")));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use(initCorsMiddleware());
app.use("/planets", planetsRoutes);
app.use("/auth", authRoutes);
app.use(notFoundMiddleware);

app.use(validationErrorMiddleware);
app.use(initErrorMiddleware(app.get("env")));

export default app;
