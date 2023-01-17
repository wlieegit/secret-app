/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
import nextJest from 'next/jest'

const createJestConfig = nextJest({ dir: './' })

export default createJestConfig({
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  setupFiles: ["<rootDir>/test/setup-tests.ts"],
  testEnvironment: "node",
  preset: '@shelf/jest-dynamodb',
})
