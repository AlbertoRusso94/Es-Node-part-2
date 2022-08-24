import { Static, Type } from "@sinclair/typebox";

export const planetSchema = Type.Object(
  {
    name: Type.String(),
    description: Type.Optional(Type.String()),
    diameter: Type.Integer(),
    moons: Type.Integer(),
  },
  { additionaProperties: false }
);

export type PlanetData = Static<typeof planetSchema>;
