module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  clearMocks: true,
  setUpFilesAfterEnv: [
    "./src/lib/prisma/client.mock.ts",
    "./src/lib/prisma/middleware/multer.mock.ts",
  ],
};
