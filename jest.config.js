/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["jest-fetch-mock"],
  automock: false,
  resetMocks: false,
  setupFiles: ["./src/tests/setupJest.js"],
};
