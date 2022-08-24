import supertest from "supertest";
import app from "./app";
import { prismaMock } from "./lib/prisma/client.mock";

const request = supertest(app);

describe("POST /planets", () => {
  test("Valid request", async () => {
    const planet = {
      name: "Mercury",
      diameter: 1234,
      moons: 12,
    };

    //@ts-ignore
    prismaMock.planet.create.mockResolvedValue(planet);

    const response = await request
      .post("/planets")
      .send({
        name: "Mercury",
        diameter: 1234,
        moons: 12,
      })
      .expect(201)
      .expect("Content-Type", /application\/json/);
    expect(response.body).toEqual(planet);
  });
  test("invalid request", async () => {
    const planet = {
      diameter: 1234,
      moons: 12,
    };
    const response = await request
      .post("/planets")
      .send(planet)
      .expect(422)
      .expect("Content-Type", /application\/json/);
    expect(response.body).toEqual({
      errors: {
        body: expect.any(Array),
      },
    });
  });
});
