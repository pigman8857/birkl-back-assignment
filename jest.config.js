module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.test.json',
      },
    },
    collectCoverage: true,
    collectCoverageFrom: [
      'services/**/*.ts',
      '!**/node_modules/**',
      '!**/__tests__/**',
      '!**/__mocks__/**',
      '!services/**/schema.ts',
      '!services/**/index.ts',
      '!services/user/**',
    ],
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  };
  