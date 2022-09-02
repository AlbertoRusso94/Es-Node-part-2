import { response, Router } from "express";
import { request } from "http";
import { passport } from "../lib/prisma/middleware/passport";

const router = Router();

router.get("/login", (request, response, next) => {
  if (
    typeof request.query.redirectTo != "string" ||
    !request.query.redirectTo
  ) {
    response.status(400);
    return next("Missing redirectTo query string parameter");
  }
  request.session.redirectTo = request.query.redirectTo;
  response.redirect("/auth/gihub/login");
});

router.get(
  "/auth/github/login",
  passport.authenticate("github", {
    scope: ["user:email"],
  })
);

router.get(
  "/github/callback",
  //@ts-ignore
  passport.authenticate("github", {
    failureRedirect: "/auth/github/login",
    keepSessionInfo: true,
  }),
  (request, response) => {
    if (typeof request.session.redirectTo !== "string") {
      return response.status(500).end();
    }
    response.redirect(request.session.redirectTo);
  }
);

router.get("/logout", (request, response, next) => {
  if (
    typeof request.query.redirectTo != "string" ||
    !request.query.redirectTo
  ) {
    response.status(400);
    return next("Missing redirectTo query string parameter");
  }

  const redirectUrl = request.query.redirectTo;

  request.logout((error) => {
    if (error) {
      return next(error);
    }
    response.redirect(redirectUrl);
  });
});

export default router;
