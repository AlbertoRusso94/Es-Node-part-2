import config from "../../../config";
import session from "express-session";

export function initSessionMiddleware() {
  return session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  });
}
