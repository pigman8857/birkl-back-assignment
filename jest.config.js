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
      // '!services/config.ts',
      // '!services/create-server.ts',
      // '!services/server.ts',
      // '!services/version.ts',
      '!**/node_modules/**',
      '!**/__tests__/**',
      '!**/__mocks__/**',
    ],
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
    // setupFiles: ['<rootDir>/test-setup.js'],
  };
  