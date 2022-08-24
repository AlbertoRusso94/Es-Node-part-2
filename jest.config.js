module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  clearMocks: true,
  setUpFilesAfterEnv: ["./src/lib/prisma/client.mock.ts"],
};
