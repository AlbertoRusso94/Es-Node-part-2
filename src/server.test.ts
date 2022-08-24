import supertest from "supertest";
import app from "./app";
import { prismaMock } from "./lib/prisma/client.mock";

const request = supertest(app);

test("POST /planets", async () => {
  const planet = {
    name: "Mercury",
    description: null,
    diameter: 1234,
    moons: 12,
  };

  const response = await request
    .post("/planets")
    .send(planet)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  expect(response.body).toEqual(planet);
});
