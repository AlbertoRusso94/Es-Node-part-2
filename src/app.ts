import express from "express";
import "express-async-errors";
import prisma from "./lib/prisma/client";
import {
  validate,
  planetSchema,
  PlanetData,
  validationErrorMiddleware,
} from "./lib/prisma/validation";
import cors from "cors";

import { initMultierMiddleware } from "./lib/prisma/middleware/multer";
const upload = initMultierMiddleware();

const corsOptions = {
  origin: "http://localhost:8080",
};

const app = express();
app.use(express.json());

app.use(cors(corsOptions));

app.get("/planets", async (request, response) => {
  const planets = await prisma.planet.findMany();

  response.json(planets);
});

app.get("/planets/:id", async (request, response) => {
  const planetId = Number(request.params.id);
  const planet = await prisma.planet.findUnique({
    where: { id: planetId },
  });

  response.json(planet);
});

app.post(
  "/planets",
  validate({ body: planetSchema }),
  async (request, response) => {
    const planetData: PlanetData = request.body;
    const planet = await prisma.planet.create({
      data: planetData,
    });
    response.status(201).json(planet);
  }
);

app.put(
  "/planets/:id(\\d+)",
  validate({ body: planetSchema }),
  async (request, response) => {
    const planetId = Number(request.params.id);
    const planetData: PlanetData = request.body;
    const planet = await prisma.planet.update({
      where: { id: planetId },
      data: planetData,
    });
    response.status(200).json(planet);
  }
);

app.delete("/planets/:id(\\d+)", async (request, response) => {
  const planetId = Number(request.params.id);
  await prisma.planet.delete({
    where: { id: planetId },
  });
  response.status(204).end();
});

app.post(
  "/planets/:id(\\d+)/photo",
  upload.single("photo"),
  async (request, response, next) => {
    console.log("request.file", request.file);
    if (!request.file) {
      response.status(400);
      return next("No photo file uploaded.");
    }
    const photoFilename = request.file.filename;
    response.status(201).json({ photoFilename });
  }
);

app.use(validationErrorMiddleware);

export default app;
