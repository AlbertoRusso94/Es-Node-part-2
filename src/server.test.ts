import supertest from "supertest";
import app from "./app";
import { prismaMock } from "./lib/prisma/client.mock";

const request = supertest(app);

test("GET /planets", async () => {
  const planets = [{}];
  //@ts-ignore
  prismaMock.planet.findMany.mockResolvedValue(planets);

  const response = await request
    .get("/planets")
    .expect(200)
    .expect("Content-Type", /application\/json/);
  expect(response.body).toEqual(planets);
});
