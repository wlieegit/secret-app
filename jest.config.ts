/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
import nextJest from 'next/jest'
const requireJSON5 = require('require-json5') // ts-config contains comments, import json does not work, need to use this package to import indirectly.
const tsconfig = requireJSON5('./tsconfig.json')
const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig) // Use this to support '@' import for jest.

const createJestConfig = nextJest({dir: './'})

export default createJestConfig({
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  setupFiles: ['<rootDir>/test/setup-tests.ts'],
  testEnvironment: 'node',
  moduleNameMapper,
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '<rootDir>/test/**/*.test.[jt]s?(x)',
  ],
})
