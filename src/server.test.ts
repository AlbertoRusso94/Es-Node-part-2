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
      .get("/planets")
      .send({
        name: "Mercury",
        diameter: 1234,
        moons: 12,
      })
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .expect("Access-Controll-Allow-Origin", "http://localhost:8080");
    expect(response.body).toEqual(planet);
  });
});

describe("POST /planets/:id", () => {
  test("Valid request", async () => {
    const planet = {
      name: "Mercury",
      diameter: 1234,
      moons: 12,
    };

    //@ts-ignore
    prismaMock.planet.findUnique.mockResolvedValue(planet);

    const response = await request
      .post("/planets/1")
      .send({
        name: "Mercury",
        diameter: 1234,
        moons: 12,
      })
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .expect("Access-Controll-Allow-Origin", "http://localhost:8080");
    expect(response.body).toEqual(planet);
  });
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

describe("PUT /planets/:id", () => {
  test("Valid request", async () => {
    const planet = {
      id: 1,
      name: "Mercury",
      description: "Lovely planet",
      diameter: 1234,
      moons: 12,
    };

    //@ts-ignore
    prismaMock.planet.update.mockResolvedValue(planet);

    const response = await request
      .put("/planets/1")
      .send({
        name: "Mercury",
        description: "Lovely planet",
        diameter: 1234,
        moons: 12,
      })
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .expect("Access-Controll-Allow-Origin", "http://localhost:8080");
    expect(response.body).toEqual(planet);
  });
});

test("invalid request", async () => {
  const planet = {
    diameter: 1234,
    moons: 12,
  };
  const response = await request
    .put("/planets/23")
    .send(planet)
    .expect(422)
    .expect("Content-Type", /application\/json/);
  expect(response.body).toEqual({
    errors: {
      body: expect.any(Array),
    },
  });
});

describe("DELETE /planets/:id", () => {
  test("Valid request", async () => {
    const response = await request
      .delete("/planets/1")
      .expect(204)
      .expect("Access-Controll-Allow-Origin", "http://localhost:8080");
    expect(response.text).toEqual("");
  });
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

describe("POST/planets/:id/photo", () => {
  test("Valid request with PNG file upload", async () => {
    await request
      .post("/planets/23/photo")
      .attach("photo", "test-fixtures/photos/file.png")
      .expect(201)
      .expect("Access-Controll-Allow-Origin", "http://localhost:8080");
  });
  test("invalid planet ID", async () => {
    const response = await request
      .post("/planets/asdf/photo")
      .expect(404)
      .expect("Content-Type", /text\/html/);
    expect(response.text).toContain("Cannot POST /planets/asdf/photo");
  });
  test("invalid request with no file upload", async () => {
    const response = await request
      .post("/planets/23/photo")
      .expect(400)
      .expect("Content-Type", /text\/html/);
    expect(response.text).toContain("No photo file uploaded.");
  });
});
