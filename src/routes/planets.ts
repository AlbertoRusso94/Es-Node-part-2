import express, { Router } from "express";
import prisma from "../lib/prisma/client";
import {
  validate,
  planetSchema,
  PlanetData,
  validationErrorMiddleware,
} from "../lib/prisma/middleware/validation";

import { checkAuthorization } from "../lib/prisma/middleware/passport";

import { initMultierMiddleware } from "../lib/prisma/middleware/multer";
const upload = initMultierMiddleware();

const router = Router();

router.get("/", async (request, response) => {
  const planets = await prisma.planet.findMany();

  response.json(planets);
});

router.get("/:id(\\d+)", async (request, response) => {
  const planetId = Number(request.params.id);
  const planet = await prisma.planet.findUnique({
    where: { id: planetId },
  });

  response.json(planet);
});

router.post(
  "/",
  checkAuthorization,
  validate({ body: planetSchema }),
  async (request, response) => {
    const planetData: PlanetData = request.body;
    const username = request.user?.username as string;
    const planet = await prisma.planet.create({
      data: {
        ...planetData,
        createdBy: username,
        updatedBy: username,
      },
    });
    response.status(201).json(planet);
  }
);

router.put(
  "/:id(\\d+)",
  checkAuthorization,
  validate({ body: planetSchema }),
  async (request, response) => {
    const planetId = Number(request.params.id);
    const planetData: PlanetData = request.body;
    const username = request.user?.username as string;
    const planet = await prisma.planet.update({
      where: { id: planetId },
      data: {
        ...planetData,
        updatedBy: username,
      },
    });
    response.status(200).json(planet);
  }
);

router.delete("/:id(\\d+)", checkAuthorization, async (request, response) => {
  const planetId = Number(request.params.id);
  await prisma.planet.delete({
    where: { id: planetId },
  });
  response.status(204).end();
});

router.post(
  "/:id(\\d+)/photo",
  checkAuthorization,
  upload.single("photo"),
  async (request, response, next) => {
    if (!request.file) {
      response.status(400);
      return next("No photo file uploaded.");
    }

    const planetId = Number(request.params.id);
    const photoFilename = request.file.filename;
    try {
      await prisma.planet.update({
        where: { id: planetId },
        data: { photoFilename },
      });
    } catch (error) {
      response.status(404);
      next(`Cannot POST /planets/${planetId}/photo`);
    }
  }
);

router.use("/photos", express.static("uploads"));

export default router;
